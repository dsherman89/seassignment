
const sqlite3 = require('sqlite3').verbose();
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database('./src/db/app.db');

exports.getAllPosts = (req, res) => {
    const { username, password, role_id} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const stmt = db.prepare("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)");
    stmt.run([username, hashedPassword, role_id], function(err) {
        if (err) return res.status(500).send("There was a problem registering the user.");
        res.status(200).send({ id: this.lastID });
    });
    stmt.finalize();
};
 
exports.getPostsById = (req, res) => {
    const { username, password } = req.body;
 
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
 
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
 
        const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 }); // 24 hours
        res.status(200).send({ auth: true, token });
    });
};
 
exports.createPost = (req, res) => {
    const { id } = req.params;
 
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
 
        res.status(200).send(user);
    });
};
 
exports.updatePost = (req, res) => {
    const { id } = req.params;
    const { username, role_id } = req.body;
 
    const stmt = db.prepare("UPDATE users SET username = ?, role_id = ? WHERE id = ?");
    stmt.run([username, role_id, id], function(err) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send({ changes: this.changes });
    });
    stmt.finalize();
};
 
exports.deletePost = (req, res) => {
    const { id } = req.params;
 
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run([id], function(err) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send({ changes: this.changes });
    });
    stmt.finalize();
};