const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Hardcoded Configuration based on your provided inputs
// Ideally these should be process.env, but ensuring they are correct here for the fix.
const CLIENT_ID = process.env.OAUTH_CLIENT_ID || 'Iv23li5ruvGgBnvl0J3c';
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '4718d7dd8dfabc4d745539368039d495077c591b';

// GitHub Endpoints
const AUTHORIZATION_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

// --- ROUTE HANDLERS ---

/**
 * 1. Authorization Redirect
 * Decap CMS opens this link in a popup.
 * We redirect the user to GitHub to approve access.
 */
const authHandler = (req, res) => {
  // Use a random state string for security (optional but recommended)
  const state = Math.random().toString(36).substring(7);
  
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: 'repo,user', // 'repo' is required for CMS to commit changes
    state: state
  });

  res.redirect(`${AUTHORIZATION_URL}?${params.toString()}`);
};

/**
 * 2. Callback Handler
 * GitHub redirects back here with a ?code= parameter.
 * We exchange this code for an access token.
 * Then we postMessage the token back to the main window.
 */
const callbackHandler = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Error: No code received from GitHub.');
  }

  try {
    // Exchange Code for Token
    const response = await axios.post(TOKEN_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
    }, {
      headers: { 
        Accept: 'application/json' // Force JSON response
      },
    });

    const data = response.data;
    const accessToken = data.access_token;

    if (!accessToken) {
      console.error('GitHub Response Error:', data);
      return res.status(500).send(`GitHub Login Failed: ${JSON.stringify(data)}`);
    }

    // --- CRITICAL PART ---
    // Construct the message exactly as Decap CMS expects it.
    // Format: "authorization:provider:success:json_string_content"
    const content = {
      token: accessToken,
      provider: 'github'
    };
    
    // We send a script that executes immediately in the popup
    // It finds the opener (main CMS window) and sends the message
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("Sending message to opener");
            // Send the token to the main window
            // window.opener is the window that opened this popup
            window.opener.postMessage(
              "authorization:github:success:${JSON.stringify(content)}",
              window.location.origin // Ensure security by matching origin
            );
            
            // Close the popup after a brief moment
            setTimeout(() => { window.close(); }, 50);
          }
          
          receiveMessage();
        })();
      </script>
    `;

    res.send(script);

  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
};

// --- ROUTING SETUP ---

// We handle both root paths and /oauth/ prefixed paths to accommodate 
// different Nginx proxy configurations.
app.get('/auth', authHandler);
app.get('/callback', callbackHandler);

app.get('/oauth/auth', authHandler);
app.get('/oauth/callback', callbackHandler);

app.listen(port, () => console.log(`OAuth Server running on ${port}`));