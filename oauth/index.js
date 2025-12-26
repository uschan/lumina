const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Environment variables
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

// --- HANDLERS ---

const handleAuth = (req, res) => {
  // Redirect to GitHub
  res.redirect(`${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&scope=repo,user`);
};

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
      // Return simple error script to close popup
      return res.send('<script>alert("Authentication failed: No token received."); window.close();</script>');
    }

    const content = {
      token: access_token,
      provider: 'github'
    };

    // Standard Decap CMS message format
    const message = "authorization:github:success:" + JSON.stringify(content);

    // Minimal Script to communicate with Opener and Close
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <script>
          const message = ${JSON.stringify(message)};
          const origin = window.location.origin;
          
          if (window.opener) {
            // Post message to the opening window (the CMS)
            window.opener.postMessage(message, "*");
            
            // Close this popup
            window.close();
          } else {
            document.body.innerHTML = "Authentication successful, but unable to communicate with the main window. You may close this tab.";
          }
        </script>
      </body>
      </html>
    `;

    res.send(html);

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