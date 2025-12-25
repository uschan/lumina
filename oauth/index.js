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
    const message = "authorization:github:success:" + JSON.stringify(content);

    // HTML Response with Visual Token
    // We display the token so you can manually copy it if the window closes too fast or postMessage fails.
    const script = `
      <!DOCTYPE html>
      <html>
      <body style="background-color: #09090b; color: #e4e4e7; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center;">
        <div style="font-size: 24px; margin-bottom: 20px;">✅ Login Successful</div>
        <div style="color: #71717a; margin-bottom: 20px;">Sending credentials to Lumina...</div>
        
        <!-- Debugging: Show Token -->
        <div style="background: #18181b; padding: 15px; border-radius: 8px; border: 1px solid #27272a; margin-bottom: 20px; max-width: 90%; word-break: break-all;">
            <div style="font-size: 10px; color: #71717a; margin-bottom: 5px;">DEBUG TOKEN (COPY IF NEEDED)</div>
            <code style="color: #4ade80; font-size: 12px;">${access_token}</code>
        </div>

        <script>
          (function() {
            const message = ${JSON.stringify(message)};
            
            function sendMessage() {
              if (window.opener) {
                console.log("Sending auth message to opener...");
                window.opener.postMessage(message, "*");
              }
            }

            // Retry strategy
            sendMessage();
            setInterval(sendMessage, 800);

            // Close automatically after 5 seconds (Increased time to allow copying if needed)
            setTimeout(function() {
              window.close();
            }, 5000);
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