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

    // Robust script:
    // 1. Visual feedback
    // 2. Send message to * (wildcard) to avoid origin mismatches
    // 3. Send repeatedly to ensure reception
    const script = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authenticating...</title>
        <style>
           body{background:#111;color:#eee;font-family:monospace;text-align:center;padding-top:50px;}
           .success { color: #4ade80; font-size: 1.2em; margin-bottom: 20px; }
           .info { font-size: 0.9em; color: #888; }
        </style>
      </head>
      <body>
      <div class="success">Authentication successful!</div>
      <div class="info">Handing over credentials to Lumina...</div>
      <div class="info" id="status">Sending signal...</div>
      
      <script>
        (function() {
          const content = ${JSON.stringify(content)};
          const provider = "${provider}";
          // Decap CMS specific message format
          const message = "authorization:" + provider + ":success:" + JSON.stringify(content);
          
          function sendMessage() {
             if (window.opener) {
                // Send to wildcard '*' to bypass any strict origin checks
                window.opener.postMessage(message, "*");
                // Also try specific origin just in case
                window.opener.postMessage(message, "https://gemini.wildsalt.me");
                
                document.getElementById('status').innerText = "Signal sent. Closing...";
             } else {
                document.getElementById('status').innerText = "Error: Parent window lost.";
             }
          }

          // Send immediately
          sendMessage();

          // Send repeatedly every 500ms for 3 seconds to guarantee delivery
          // This handles cases where the parent window is busy or not ready
          let count = 0;
          const interval = setInterval(() => {
             sendMessage();
             count++;
             if (count > 6) clearInterval(interval);
          }, 500);
          
          // Close after 2 seconds
          setTimeout(function() {
            window.close();
          }, 2000);
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
// Handle both root paths and /oauth prefixed paths to account for different Nginx proxy configs
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

// Health check
app.get('/', (req, res) => res.send('Lumina OAuth Server is running.'));

app.listen(port, () => {
  console.log(`OAuth Server listening on port ${port}`);
});