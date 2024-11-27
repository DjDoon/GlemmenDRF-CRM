const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Replace with your GitHub OAuth App credentials
const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, '../'))); // Adjust to the parent folder containing login.html

// Serve the login.html file at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html')); // Points to login.html in the parent folder
  });  

// Step 1: Redirect user to GitHub OAuth page
app.get('/auth/github', (req, res) => {
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
  res.redirect(redirectUri);
});

// Step 2: Handle GitHub OAuth callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Use access token to fetch user data
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = userResponse.data;

    // Display user data (or redirect to a dashboard)
    res.send(`
      <h1>Welcome, ${userData.login}!</h1>
      <img src="${userData.avatar_url}" alt="Avatar" width="100">
      <p>Name: ${userData.name}</p>
      <p>GitHub URL: <a href="${userData.html_url}">${userData.html_url}</a></p>
    `);
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send('Authentication failed');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
