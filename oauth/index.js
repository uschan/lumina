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
    return res.status(400).send('Error: No code received from GitHub.');
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

    // GitHub sometimes returns 200 OK but with an "error" field in the body
    if (response.data.error) {
       throw new Error(`GitHub Error: ${response.data.error_description || response.data.error}`);
    }

    const { access_token } = response.data;
    
    if (!access_token) {
      throw new Error('No access_token found in response');
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
             font-family: monospace;
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
           }
           h2 { color: #10b981; margin-top: 0; }
           p { color: #a1a1aa; font-size: 0.9rem; margin-bottom: 1.5rem; }
           
           button {
             background: #27272a;
             color: white;
             border: 1px solid #3f3f46;
             padding: 0.75rem 1.5rem;
             border-radius: 0.5rem;
             cursor: pointer;
             width: 100%;
             margin-top: 10px;
           }
           button:hover { background: #3f3f46; }

           .debug-log {
             margin-top: 1rem;
             font-size: 0.7rem;
             color: #52525b;
             text-align: left;
             width: 100%;
             overflow-wrap: break-word;
           }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>✅ Authorization Granted</h2>
          <p id="msg">Broadcasting credentials to Lumina CMS...</p>
          
          <!-- Manual fallback buttons -->
          <button onclick="handshake()">Resend Signal</button>
          <button onclick="window.close()">Close Window</button>

          <div id="log" class="debug-log"></div>
        </div>

        <script>
          const content = ${JSON.stringify(content)};
          const provider = "${provider}";
          const message = "authorization:" + provider + ":success:" + JSON.stringify(content);
          
          // USE WILDCARD TO ENSURE MESSAGE DELIVERY
          // This fixes issues where protocol (http vs https) or subdomains might differ slightly
          const targetOrigin = "*";

          function log(txt) {
            console.log(txt);
            document.getElementById('log').innerText = txt;
          }

          function handshake() {
            try {
              if (!window.opener) {
                document.getElementById('msg').innerText = "Error: Parent window lost.";
                document.getElementById('msg').style.color = "#ef4444";
                return;
              }

              log("Sending postMessage to parent window...");
              window.opener.postMessage(message, targetOrigin);
              
              document.getElementById('msg').innerText = "Signal sent. You can close this window.";
              
              // Close automatically after a short delay
              setTimeout(() => {
                window.close();
              }, 1200);

            } catch (e) {
              log("Exception: " + e.message);
            }
          }

          // Execute immediately
          handshake();
        </script>
      </body>
      </html>
    `;

    res.send(script);
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(500).send(`
      <body style="background:#09090b;color:#ef4444;font-family:monospace;padding:2rem;">
        <h2>Authentication Failed</h2>
        <p>${error.message}</p>
        <p>Please close this window and try again.</p>
      </body>
    `);
  }
};

// --- ROUTE DEFINITIONS ---
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));