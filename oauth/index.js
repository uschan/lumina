
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Hardcoded Configuration based on your provided inputs
const CLIENT_ID = process.env.OAUTH_CLIENT_ID || 'Iv23li5ruvGgBnvl0J3c';
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '4718d7dd8dfabc4d745539368039d495077c591b';

// GitHub Endpoints
const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

// --- ROUTE HANDLERS ---

const authHandler = (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: 'repo,user',
    state: state
  });
  res.redirect(`${AUTHORIZATION_URL}?${params.toString()}`);
};

const callbackHandler = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: No code received from GitHub.');
  }

  try {
    const response = await axios.post(TOKEN_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const data = response.data;
    const accessToken = data.access_token;

    if (!accessToken) {
      return res.status(500).send(`GitHub Login Failed: ${JSON.stringify(data)}`);
    }

    // Prepare the payload strictly for Decap CMS
    const content = {
      token: accessToken,
      provider: 'github'
    };
    
    // The message string Decap expects
    const messageStr = "authorization:github:success:" + JSON.stringify(content);
    
    // The user object to store in LocalStorage (stringified JSON)
    const userStorageValue = JSON.stringify({
      token: accessToken,
      backendName: 'github' 
    });

    const script = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            background: #09090b; 
            color: #fff; 
            display: flex; 
            height: 100vh; 
            justify-content: center; 
            align-items: center; 
            font-family: monospace; 
            margin: 0;
            overflow: hidden;
          }
          .loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            animation: fadeOut 0.5s ease-in-out 1s forwards;
          }
          .spinner {
            width: 24px;
            height: 24px;
            border: 2px solid rgba(255,255,255,0.1);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeOut { to { opacity: 0; } }
        </style>
      </head>
      <body>
      <div class="loader">
        <div class="spinner"></div>
        <div>AUTHENTICATING...</div>
      </div>
      <script>
        (function() {
          const origin = window.location.origin;
          
          try {
             // 1. Direct Write
             localStorage.setItem("netlify-cms-user", '${userStorageValue}');
             localStorage.setItem("decap-cms-user", '${userStorageValue}');
          } catch(e) {}

          // 2. Post Message
          if (window.opener) {
            window.opener.postMessage('${messageStr}', origin);
            window.opener.postMessage('${messageStr}', '*');
          }
          
          // 3. Close rapidly
          setTimeout(() => { window.close(); }, 500);
        })();
      </script>
      </body>
      </html>
    `;

    res.send(script);

  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
};

app.get('/auth', authHandler);
app.get('/callback', callbackHandler);
app.get('/oauth/auth', authHandler);
app.get('/oauth/callback', callbackHandler);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));
