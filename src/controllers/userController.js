
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database('./src/db/app.db');

exports.register = (req, res) => {
    const { username, password, role_id} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const stmt = db.prepare("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)");
    stmt.run([username, hashedPassword, role_id], function(err) {
        if (err) return res.status(500).send("There was a problem registering the user.");
        res.status(200).send({ id: this.lastID });
    });
    stmt.finalize();
};
 
exports.login = (req, res) => {

    
    const username = req.body.uname;  // Change from 'username' to 'uname'
    const password = req.body.psw;    // Change from 'password' to 'psw'

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
        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/user');
        }
    });


};


 
exports.getUser = (req, res) => {
    const { id } = req.params;
 
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
 
        res.status(200).send(user);
    });
};
 
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, role_id } = req.body;
 
    const stmt = db.prepare("UPDATE users SET username = ?, role_id = ? WHERE id = ?");
    stmt.run([username, role_id, id], function(err) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send({ changes: this.changes });
    });
    stmt.finalize();
};
 
exports.deleteUser = (req, res) => {
    const { id } = req.params;
 
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run([id], function(err) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send({ changes: this.changes });
    });
    stmt.finalize();
};