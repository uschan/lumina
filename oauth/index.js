const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Environment variables
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

// Helper function to handle auth redirect
const handleAuth = (req, res) => {
  res.redirect(`${AUTHORIZATION_URL}?client_id=${CLIENT_ID}&scope=repo,user`);
};

// Helper function to handle callback
const handleCallback = async (req, res) => {
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
      headers: { Accept: 'application/json' },
    });

    const { access_token } = response.data;
    
    if (!access_token) {
      return res.status(500).send('Failed to obtain access token from GitHub');
    }

    const provider = 'github'; 
    const content = {
      token: access_token,
      provider: provider
    };

    // Robust page with enhanced handoff logic
    const script = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Lumina Security Link</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
           body {
             background-color: #09090b;
             color: #e4e4e7;
             font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: center;
             height: 100vh;
             margin: 0;
             text-align: center;
             padding: 20px;
           }
           .card {
             background: #18181b;
             border: 1px solid #27272a;
             padding: 2rem;
             border-radius: 1rem;
             max-width: 400px;
             width: 100%;
             box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
           }
           h2 { color: #818cf8; margin-top: 0; font-size: 1.25rem; }
           p { color: #a1a1aa; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; }
           .status-line { margin-top: 1rem; font-size: 0.75rem; color: #71717a; }
           
           button {
             background: #4f46e5;
             color: white;
             border: none;
             padding: 0.75rem 1.5rem;
             border-radius: 0.5rem;
             font-size: 0.875rem;
             font-weight: 600;
             cursor: pointer;
             width: 100%;
             transition: all 0.2s;
           }
           button:hover { background: #4338ca; }
           
           .error-box {
             margin-top: 1rem;
             padding: 0.75rem;
             background: rgba(239, 68, 68, 0.1);
             border: 1px solid rgba(239, 68, 68, 0.2);
             color: #ef4444;
             border-radius: 0.5rem;
             font-size: 0.75rem;
             display: none;
             text-align: left;
           }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🔐 Verifying Credentials</h2>
          <p id="msg">Establishing secure uplink to Lumina CMS...</p>
          
          <button id="btn" onclick="retryHandshake()">Retry Handshake</button>
          
          <div id="error-log" class="error-box"></div>
          <div class="status-line">Token acquired. Waiting for parent window.</div>
        </div>

        <script>
          const content = ${JSON.stringify(content)};
          const provider = "${provider}";
          // Standard Decap CMS message format
          const message = "authorization:" + provider + ":success:" + JSON.stringify(content);
          const targetOrigin = window.location.origin; // Matches https://gemini.wildsalt.me

          function logError(txt) {
            const el = document.getElementById('error-log');
            el.style.display = 'block';
            el.innerText += "> " + txt + "\\n";
          }

          function status(txt) {
            document.getElementById('msg').innerText = txt;
          }

          function handshake() {
            try {
              if (!window.opener) {
                logError("CRITICAL: 'window.opener' is null.");
                logError("Did you close the main tab?");
                logError("Try closing this popup and clicking Login again.");
                status("Connection Lost");
                return;
              }

              status("Transmitting credentials...");

              // 1. Send to Exact Origin (Most Secure/Reliable for same-domain)
              window.opener.postMessage(message, targetOrigin);
              
              // 2. Send to Wildcard (Fallback)
              window.opener.postMessage(message, "*");

              status("Success! Redirecting...");
              
              // Visual feedback
              const btn = document.getElementById('btn');
              btn.innerText = "Login Successful";
              btn.style.backgroundColor = "#10b981";
              
              // Close after a clear delay so user sees success
              setTimeout(() => {
                window.close();
              }, 1500);

            } catch (e) {
              logError("Exception: " + e.message);
            }
          }

          // Start automatically, but with a slight delay to ensure browser is ready
          setTimeout(handshake, 800);

          function retryHandshake() {
            logError("Retrying manual handshake...");
            handshake();
          }
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

// --- ROUTE DEFINITIONS ---
// Handle both root relative and full path routing
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));