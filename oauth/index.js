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
       return res.send('<script>alert("GitHub Login Failed: No token returned");window.close();</script>');
    }

    const content = {
      token: access_token,
      provider: 'github'
    };

    // Prepare the payload string
    const payloadStr = JSON.stringify(content);
    const message = "authorization:github:success:" + payloadStr;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Authenticating...</title>
      <style>body{background:#111;color:#888;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;}</style>
    </head>
    <body>
      <div id="msg">Authenticating...</div>
      <script>
        const content = ${payloadStr};
        const message = '${message}';
        
        // STRATEGY 1: LocalStorage Bridge (The "Nuclear" Option)
        // Since we are on the same domain, we can write to storage.
        // The main window listens for 'storage' events.
        try {
          localStorage.setItem("lumina_cms_auth", JSON.stringify(content));
          // Remove it shortly after to clean up, but give main window time to read
          setTimeout(() => localStorage.removeItem("lumina_cms_auth"), 2000);
        } catch (e) {
          console.error("LS Error", e);
        }

        // STRATEGY 2: Standard PostMessage (The "Polite" Option)
        function notify() {
           if (window.opener) {
              window.opener.postMessage(message, "*");
           }
        }
        
        notify();
        // Spam it a few times just to be safe against race conditions
        let count = 0;
        const interval = setInterval(() => {
           notify();
           count++;
           if (count > 5) {
             clearInterval(interval);
             window.close(); // Close after 5 attempts (~500ms)
           }
        }, 100);
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
// Handle subpath routing cases
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));