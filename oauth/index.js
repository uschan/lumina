const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Environment variables
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

// 1. Redirect to GitHub
const handleAuth = (req, res) => {
  res.redirect(`${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&scope=repo,user`);
};

// 2. Handle GitHub Callback
const handleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.send('<script>alert("Error: No code received from GitHub");</script>');
  }

  try {
    // Exchange code for token
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

    // Construct the message object expected by Decap CMS
    const content = {
      token: access_token,
      provider: 'github'
    };

    // The message format MUST be exactly: "authorization:provider:success:JSON_STRING"
    // We use a safe script injection to execute this in the browser.
    // origin "*" allows it to work on any domain (localhost, IP, or domain).
    const script = `
      <script>
        (function() {
          try {
            const message = "authorization:github:success:" + ${JSON.stringify(JSON.stringify(content))};
            window.opener.postMessage(message, "*");
            window.close();
          } catch (err) {
            console.error(err);
            document.body.innerText = "Error sending token to CMS window.";
          }
        })();
      </script>
    `;

    res.send(script);

  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
};

// --- ROUTE DEFINITIONS ---
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));