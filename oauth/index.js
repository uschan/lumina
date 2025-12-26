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
    // Decap CMS looks for "netlify-cms-user" or "decap-cms-user" containing { token: ... }
    const userStorageValue = JSON.stringify({
      token: accessToken,
      backendName: 'github' 
    });

    const script = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        (function() {
          const origin = window.location.origin;
          
          console.log("[Auth Popup] Authenticated successfully.");
          
          // 1. DIRECT WRITE (The "Nuclear" Option)
          // Since popup and opener are same-domain, we can write directly to storage.
          try {
             // Write to both legacy and new keys to be 100% sure
             localStorage.setItem("netlify-cms-user", '${userStorageValue}');
             localStorage.setItem("decap-cms-user", '${userStorageValue}');
             console.log("[Auth Popup] Token written to LocalStorage directly.");
          } catch(e) {
             console.error("[Auth Popup] LS Write failed:", e);
          }

          // 2. STANDARD POST MESSAGE
          if (window.opener) {
            console.log("[Auth Popup] Sending message to opener at: " + origin);
            // We use 'origin' to ensure exact match, no trailing slashes
            window.opener.postMessage('${messageStr}', origin);
            
            // Also send '*' just in case the origin check is failing due to http/https mismatch in dev
            window.opener.postMessage('${messageStr}', '*');
          }
          
          // 3. CLOSE
          document.write("Authentication successful. Closing...");
          setTimeout(() => { window.close(); }, 100);
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