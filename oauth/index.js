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

    // CRITICAL FIX: Only stringify ONCE.
    // Previous error: JSON.stringify(JSON.stringify(content)) created a string-escaped string, 
    // causing Decap CMS to fail parsing the JSON object.
    const message = "authorization:github:success:" + JSON.stringify(content);

    const script = `
      <!DOCTYPE html>
      <html>
      <body style="background-color: #111; color: #444; font-family: sans-serif; text-align: center; display: flex; height: 100vh; align-items: center; justify-content: center;">
        <p>Connecting...</p>
        <script>
          (function() {
            try {
              const message = ${JSON.stringify(message)};
              
              if (window.opener) {
                window.opener.postMessage(message, "*");
                // Small delay to ensure the main window event loop processes the message
                setTimeout(function() {
                  window.close();
                }, 500);
              } else {
                document.body.innerText = "Error: Connection lost. Close this and try again.";
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
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));