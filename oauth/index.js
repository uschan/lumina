const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Environment variables
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

// Helper: Redirect to GitHub
const handleAuth = (req, res) => {
  res.redirect(`${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&scope=repo,user`);
};

// Helper: Handle Callback
const handleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: No code received from GitHub.');
  }

  try {
    const response = await axios.post(TOKEN_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const { access_token } = response.data;

    if (!access_token) {
      throw new Error('No access_token found');
    }

    const content = {
      token: access_token,
      provider: 'github'
    };

    // CRITICAL FIX: 
    // 1. Send the message immediately.
    // 2. Wait 800ms before closing. This allows the parent window's event loop
    //    to process the message before the source window is destroyed.
    const script = `
      <!DOCTYPE html>
      <html>
      <body style="background-color: #111; color: #eee; font-family: monospace; text-align: center; padding-top: 50px;">
        <p>Authenticating...</p>
        <script>
          (function() {
            try {
              // Standard Decap CMS message format
              const message = "authorization:github:success:" + ${JSON.stringify(JSON.stringify(content))};
              
              if (window.opener) {
                // Send content to parent
                window.opener.postMessage(message, "*");
                
                // Keep window open briefly to ensure message processing
                setTimeout(function() {
                  window.close();
                }, 800);
              } else {
                document.body.innerText = "Error: Parent window lost. Please try again.";
              }
            } catch (err) {
              console.error(err);
            }
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

// --- ROUTES ---
// Handle both root-relative and /oauth-prefixed routes to be safe behind proxies
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));