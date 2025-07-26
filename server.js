const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get('/api/feed', async (req, res) => {
  const { playerId, skip = 0, take = 100 } = req.query;
  if (!playerId) return res.status(400).json({ error: 'Missing playerId' });

  const apiUrl = `https://apim.rec.net/apis/api/images/v3/feed/player/${playerId}?skip=${skip}&take=${take}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from RecNet feed API:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/account', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  const apiUrl = `https://apim.rec.net/accounts/account?username=${encodeURIComponent(username)}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch account info' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from RecNet account API:', err);
    res.status(500).json({ error: 'Failed to fetch account data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
