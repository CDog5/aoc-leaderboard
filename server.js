
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Static folder for assets
app.use(express.static('public'));

// Fetch leaderboard data
const fetchLeaderboard = async (sessionCookie) => {
    try {
        const response = await axios.get(`https://adventofcode.com/2024/leaderboard/private/view/123456.json`, {
            headers: { Cookie: `session=${sessionCookie}` }
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching leaderboard:", err.message);
        return null;
    }
};

// Home route
app.get('/', async (req, res) => {
    const sessionCookie = req.query.session; // Provide session cookie as a query parameter
    if (!sessionCookie) {
        return res.status(400).send("Session cookie is required. Pass it via ?session=<your_cookie>");
    }

    const leaderboard = await fetchLeaderboard(sessionCookie);
    if (!leaderboard) return res.status(500).send("Failed to load leaderboard.");

    res.render('leaderboard', { leaderboard });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
