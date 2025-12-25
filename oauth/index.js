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
      console.error('GitHub response:', response.data);
      return res.status(500).send('Failed to obtain access token');
    }

    // Construct the postMessage content expected by Decap/Netlify CMS
    const provider = 'github'; 
    const content = {
      token: access_token,
      provider: provider
    };

    // Return HTML that posts the message back to the main window and closes the popup
    const script = `
      <!DOCTYPE html>
      <html>
      <body>
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("Authentication successful", e);
            
            // Send message to the main window (CMS)
            window.opener.postMessage(
              'authorization:${provider}:success:${JSON.stringify(content)}', 
              '*'
            );
            window.close();
          }
          receiveMessage();
        })();
      </script>
      </body>
      </html>
    `;

    res.send(script);
  } catch (error) {
    console.error('Access Token Error:', error.message);
    res.status(500).send('Authentication failed');
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Lumina OAuth Server is running.');
});

app.listen(port, () => {
  console.log(`OAuth Server listening on port ${port}`);
});