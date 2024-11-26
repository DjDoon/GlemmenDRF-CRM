const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Bruk body-parser for å lese POST-data
app.use(bodyParser.urlencoded({ extended: true }));

// Sett opp session management
app.use(session({
    secret: 'dronecrmsecret',  // En hemmelig nøkkel for å signere session cookies
    resave: false,
    saveUninitialized: true,
}));

// Simulert brukerdatabase
const users = {
    'admin': { password: 'adminpass' },
};

// Serve login-siden
app.get('/login', (req, res) => {
    res.sendFile('C:/Users/jonerlings_o/OneDrive - Østfold fylkeskommune/Dokumenter/GitHub/GlemmenDRF-CRM/login.html');  // Bruk den fulle banen til filen
});


// Håndter login POST request
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        req.session.user = username;
        res.redirect('/dashboard');
    } else {
        res.send('Feil brukernavn eller passord.');
    }
});

// Dashboard-side (beskyttet rute)
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`<h1>Velkommen, ${req.session.user}!</h1><a href="/logout">Logg ut</a>`);
    } else {
        res.redirect('/login');
    }
});

// Logout-funksjon
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Feil ved utlogging.');
        }
        res.redirect('/login');
    });
});

// Start serveren på port 3000
app.listen(3000, () => {
    console.log('Serveren kjører på http://localhost:3000');
});
