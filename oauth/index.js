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
      return res.send('<html><body><h3>Authentication failed</h3><p>No token received from GitHub.</p></body></html>');
    }

    // Standard Decap CMS message format
    // content must be an object with 'token' and 'provider'
    const content = {
      token: access_token,
      provider: 'github'
    };

    // The message string Decap CMS listens for regex: /^authorization:github:success:(.+)$/
    const message = "authorization:github:success:" + JSON.stringify(content);

    // Robust HTML Response
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Successful</title>
        <style>
          body { font-family: -apple-system, system-ui, sans-serif; background: #0d1117; color: #c9d1d9; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
          .card { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); max-width: 400px; width: 90%; }
          h2 { color: #2ea043; margin-top: 0; }
          p { color: #8b949e; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
          code { background: #21262d; padding: 4px 8px; border-radius: 4px; color: #58a6ff; word-break: break-all; font-family: monospace; font-size: 12px; display: block; margin: 10px 0; }
          button { background: #238636; color: white; border: 1px solid rgba(240,246,252,0.1); padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; }
          button:hover { background: #2ea043; }
          .status { font-size: 12px; margin-top: 15px; color: #8b949e; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>✅ Access Granted</h2>
          <p>You have successfully authenticated with GitHub.</p>
          
          <div style="text-align: left; background: #000; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
             <span style="font-size: 10px; color: #666; display: block; margin-bottom: 4px;">DEBUG INFO (TOKEN):</span>
             <code>${access_token}</code>
          </div>

          <p>We are broadcasting this token to the main window...</p>
          <button onclick="window.close()">Close Window</button>
          
          <div class="status" id="status">Status: Initializing...</div>
        </div>

        <script>
          const message = ${JSON.stringify(message)};
          const statusEl = document.getElementById('status');
          
          function send() {
            if (window.opener) {
              window.opener.postMessage(message, "*");
              statusEl.innerText = "Status: Broadcasting token to CMS... (" + new Date().toLocaleTimeString() + ")";
              console.log("Sent message:", message);
            } else {
              statusEl.innerText = "Status: ⚠️ Main window lost. Please copy the token above manually if needed.";
              statusEl.style.color = "#f85149";
            }
          }

          // Send immediately
          send();

          // Keep sending every 500ms in case the CMS window wasn't ready
          setInterval(send, 1000);
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