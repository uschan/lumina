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
app.get('/auth', (req, res) => {
  res.redirect(`${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&scope=repo,user`);
});

// 2. Callback from GitHub
app.get('/callback', async (req, res) => {
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
      headers: {
        Accept: 'application/json',
      },
    });

    const { access_token } = response.data;
    
    if (!access_token) {
      console.error('GitHub response error:', response.data);
      return res.status(500).send('Failed to obtain access token');
    }

    const provider = 'github'; 
    const content = {
      token: access_token,
      provider: provider
    };

    // We inject the data as a JavaScript object directly into the script
    // This avoids double-stringification issues and makes it cleaner.
    const script = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authenticating...</title>
        <style>body{background:#111;color:#eee;font-family:sans-serif;text-align:center;padding-top:50px;}</style>
      </head>
      <body>
      <p>Authentication successful.</p>
      <p>Redirecting you back to the laboratory...</p>
      <script>
        (function() {
          const content = ${JSON.stringify(content)};
          const provider = "${provider}";
          
          // Construct the message string exactly as Decap CMS expects it
          // Format: authorization:provider:success:json_string
          const message = "authorization:" + provider + ":success:" + JSON.stringify(content);
          
          // The exact origin of your CMS
          const targetOrigin = "https://gemini.wildsalt.me";
          
          console.log("Sending message to opener:", targetOrigin);

          if (window.opener) {
            // 1. Try sending to the specific origin (Safest)
            window.opener.postMessage(message, targetOrigin);
            
            // 2. Fallback to wildcard (Just in case origin checks are weird)
            window.opener.postMessage(message, "*");
          } else {
            console.error("No window.opener found! Cannot complete authentication.");
          }
          
          // Close after 1 second to ensure message is processed
          setTimeout(function() {
            window.close();
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
});

// Health check
app.get('/', (req, res) => {
  res.send('Lumina OAuth Server is running.');
});

app.listen(port, () => {
  console.log(`OAuth Server listening on port ${port}`);
});