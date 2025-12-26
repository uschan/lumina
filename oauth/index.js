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
      throw new Error('No access_token found in GitHub response');
    }

    const content = {
      token: access_token,
      provider: 'github'
    };

    // Specific format required by NetlifyCMS/DecapCMS
    const message = "authorization:github:success:" + JSON.stringify(content);

    // Simplified Response HTML
    // We prioritize RELIABILITY. If postMessage fails, the user sees the token and can copy it.
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Login Successful</title>
        <style>
          body { background: #111; color: #eee; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 20px; text-align: center; }
          .card { border: 1px solid #333; padding: 20px; border-radius: 8px; max-width: 500px; width: 100%; }
          h2 { color: #4ade80; margin-top: 0; }
          p { color: #888; font-size: 12px; margin-bottom: 15px; }
          .token-box { width: 100%; background: #000; color: #fff; border: 1px solid #444; padding: 10px; margin-bottom: 10px; font-family: monospace; border-radius: 4px; }
          button { cursor: pointer; background: #eee; color: #000; border: none; padding: 8px 16px; font-weight: bold; border-radius: 4px; }
          button:hover { background: #fff; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>✅ Access Granted</h2>
          <p>We are attempting to log you in automatically...</p>
          
          <div id="manual-section">
            <p>If this window doesn't close, copy the token below and paste it into the "Manual Token" field on the admin page.</p>
            <input type="text" class="token-box" value="${access_token}" readonly onclick="this.select()">
            <button onclick="copyAndClose()">Copy & Close</button>
          </div>
        </div>

        <script>
          const message = ${JSON.stringify(message)};
          
          // 1. Attempt Auto-Handshake
          try {
            if (window.opener) {
              window.opener.postMessage(message, "*");
              // Optional: Close after a short delay if we think it worked, 
              // but keeping it open is safer for debugging rate limits.
              // setTimeout(() => window.close(), 2000); 
            }
          } catch (e) {
            console.error("Auto-handshake failed", e);
          }

          // 2. Manual Fallback
          function copyAndClose() {
            const el = document.querySelector('.token-box');
            el.select();
            navigator.clipboard.writeText(el.value).then(() => {
              alert('Token copied!');
              // window.close(); // Optional: user might want to keep it
            });
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
// Support both path structures for flexibility
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));