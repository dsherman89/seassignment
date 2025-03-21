const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const dbInit = require('./src/db/init');
const path = require('path');

// Remove below when fixed
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = new sqlite3.Database('./src/db/app.db');

// Remove above when fixed 

const app = express();
const PORT = process.env.PORT || 3000;    // note to come back and check this out when running

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// run db
dbInit();

const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');

// Static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src', 'public')));

  
app.get('/', (req, res) => {
//    res.send('heres a message')
    res.sendFile(path.join(__dirname, 'src/public', 'index.html'), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});

/*
app.post('/login', (req,res) => {
    console.log('i hit this');
 const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare input password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
  //      const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/user');
        }
    });

})
*/

app.post('/login', (req, res) => {
    console.log('i hit this');
    console.log('req body', req.body);


    const username = req.body.uname; 
    const password = req.body.psw; 

    // Query the database for the user
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        console.log(`User found: ${user.username}, Stored Password: ${user.password}`);

        // Since passwords stored in plain text for this function
        if (password !== user.password) {
            console.warn(`Login failed: Incorrect password for user '${username}'`);
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        console.log('Password matched successfully!');

        // Generate JWT token
        const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';
        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        //return res.json({ message: 'Login successful', token, role: user.role });

        console.log(`User found: ${user.username}, Role: ${user.role}`);


        let message = "";
        if (user.role === "admin") {
            message = "✅ Welcome, Admin! You have full access.";
        } else {
            message = `✅ Welcome, ${user.username}! You have user privileges.`;
        }

        return res.send(message);


    });
});


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);   // make this work with PORT const in line 8 if changed there too
});