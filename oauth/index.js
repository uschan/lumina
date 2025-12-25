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

    // Robust page with manual trigger
    const script = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Auth Success</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
           body {
             background-color: #09090b;
             color: #e4e4e7;
             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: center;
             height: 100vh;
             margin: 0;
             text-align: center;
           }
           h2 { color: #4ade80; margin-bottom: 10px; }
           p { color: #a1a1aa; margin-bottom: 30px; }
           button {
             background: #6366f1;
             color: white;
             border: none;
             padding: 16px 32px;
             border-radius: 12px;
             font-size: 16px;
             font-weight: 600;
             cursor: pointer;
             box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
             transition: all 0.2s;
           }
           button:hover { background: #4f46e5; transform: translateY(-1px); }
           button:active { transform: translateY(0); }
           .debug { font-family: monospace; font-size: 10px; color: #555; margin-top: 20px; }
        </style>
      </head>
      <body>
      <h2>✅ Authentication Successful</h2>
      <p>Click the button below to complete the login process.</p>
      
      <button id="btn" onclick="sendMsg()">Complete Login</button>
      
      <div class="debug">Token: ${access_token.substring(0,5)}...</div>
      
      <script>
        function sendMsg() {
          const content = ${JSON.stringify(content)};
          const provider = "${provider}";
          // Standard Decap CMS message format
          const message = "authorization:" + provider + ":success:" + JSON.stringify(content);
          
          const btn = document.getElementById('btn');
          
          if (window.opener) {
             console.log("Sending message...", message);
             // 1. Try generic wildcard (most likely to work)
             window.opener.postMessage(message, "*");
             // 2. Try specific origin
             window.opener.postMessage(message, "https://gemini.wildsalt.me");
             
             btn.innerText = "Login Signal Sent!";
             btn.style.background = "#22c55e";
             
             // Close after a short delay
             setTimeout(() => window.close(), 800);
          } else {
             btn.innerText = "Error: Parent window not found";
             btn.style.background = "#ef4444";
             alert("Could not find the CMS window. Please close this popup and try clicking 'Login' again.");
          }
        }

        // Try to send automatically once immediately
        setTimeout(sendMsg, 500);
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
app.get('/auth', handleAuth);
app.get('/callback', handleCallback);
app.get('/oauth/auth', handleAuth);
app.get('/oauth/callback', handleCallback);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));