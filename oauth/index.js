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
      throw new Error('No access_token found');
    }

    const content = {
      token: access_token,
      provider: 'github'
    };

    // Prepare the message string
    // NOTE: This JSON.stringify is correct. It produces '{"token":"...","provider":"github"}'
    // Decap CMS expects: "authorization:github:success:" + JSON_STRING
    const message = "authorization:github:success:" + JSON.stringify(content);

    // HTML Response
    // We send the message MULTIPLE times to ensure the parent window catches it (race condition fix)
    // We keep the window open for 2 seconds to allow visual confirmation and script execution
    const script = `
      <!DOCTYPE html>
      <html>
      <body style="background-color: #09090b; color: #e4e4e7; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0;">
        <div style="font-size: 24px; margin-bottom: 20px;">✅ Connecting...</div>
        <div style="color: #71717a;">Do not close this window.</div>
        <script>
          (function() {
            const message = ${JSON.stringify(message)};
            
            function sendMessage() {
              if (window.opener) {
                console.log("Sending auth message to opener...");
                window.opener.postMessage(message, "*");
              }
            }

            // Strategy: Send immediately, then retry a few times to be safe
            sendMessage();
            setTimeout(sendMessage, 500);
            setTimeout(sendMessage, 1000);
            setTimeout(sendMessage, 1500);

            // Close after 2.5 seconds - giving plenty of time for CMS to react
            setTimeout(function() {
              window.close();
            }, 2500);
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
// We listen on ALL variants to be safe against Nginx config differences
// (e.g. proxy_pass with or without trailing slash)
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));