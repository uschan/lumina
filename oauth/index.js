const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Environment variables
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

// Helper function to handle auth redirect
const handleAuth = (req, res) => {
  console.log('Received auth request');
  res.redirect(`${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&scope=repo,user`);
};

// Helper function to handle callback
const handleCallback = async (req, res) => {
  console.log('Received callback request');
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code received');
  }

  try {
    // Exchange code for access token
    const response = await axios.post(TOKEN_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const { access_token } = response.data;
    
    if (!access_token) {
      console.error('GitHub response error:', response.data);
      return res.status(500).send('Failed to obtain access token from GitHub');
    }

    const provider = 'github'; 
    const content = {
      token: access_token,
      provider: provider
    };

    const script = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authenticating...</title>
        <style>
           body{background:#09090b;color:#eee;font-family:sans-serif;text-align:center;padding-top:40px;display:flex;flex-direction:column;align-items:center;}
           .success { color: #4ade80; font-size: 1.2em; margin-bottom: 10px; }
           .info { font-size: 0.9em; color: #888; margin-bottom: 30px; }
           button {
             background: #4f46e5;
             color: white;
             border: none;
             padding: 12px 24px;
             border-radius: 8px;
             font-size: 16px;
             cursor: pointer;
             transition: background 0.2s;
           }
           button:hover { background: #4338ca; }
        </style>
      </head>
      <body>
      <div class="success">Authentication successful!</div>
      <div class="info" id="status">Sending credentials to Lumina...</div>
      
      <button onclick="manualSend()" id="btn">Click here to finish login</button>
      
      <script>
        (function() {
          const content = ${JSON.stringify(content)};
          const provider = "${provider}";
          const message = "authorization:" + provider + ":success:" + JSON.stringify(content);
          
          window.manualSend = function() {
             const btn = document.getElementById('btn');
             btn.innerText = "Sending...";
             
             if (window.opener) {
                console.log("Sending message to opener...");
                // Send to wildcard to bypass strict origin checks
                window.opener.postMessage(message, "*");
                // Also try exact origin
                window.opener.postMessage(message, "https://gemini.wildsalt.me");
                
                document.getElementById('status').innerText = "Signal sent. You can close this window.";
                btn.innerText = "Done! Close Window";
                
                setTimeout(() => window.close(), 500);
             } else {
                alert("Error: Cannot find the main website window. Please close this and try again.");
             }
          }

          // Attempt automatic send
          manualSend();
          
          // Retry logic
          setInterval(() => {
             if(window.opener) window.opener.postMessage(message, "*");
          }, 1000);
        })();
      </script>
      </body>
      </html>
    `;

    res.send(script);
  } catch (error) {
    console.error('Access Token Error:', error.message);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
};

// --- ROUTE DEFINITIONS ---
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

// Health check
app.get('/', (req, res) => res.send('Lumina OAuth Server is running.'));

app.listen(port, () => {
  console.log(`OAuth Server listening on port ${port}`);
});