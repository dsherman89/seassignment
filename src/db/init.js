/*const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/app.db');

const dbInit = () => {

    db.serialize(() => {
        // creates
        db.run("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)");
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, role_id INTEGER, FOREIGN KEY (role_id) REFERENCES roles(id))");
        db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES users(id))");
        db.run("CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, post_id INTEGER, user_id INTEGER, FOREIGN KEY (post_id) REFERENCES posts(id), FOREIGN KEY (user_id) REFERENCES users(id))");

        // insert dummy data for use in db
        db.run("INSERT INTO roles (name) VALUES ('admin'), ('user')");
        db.run("INSERT INTO users (username, password, role_id) VALUES ('admin', 'adminpass', 1), ('user1', 'user1pass', 2), ('user2', 'user2pass', 3), ('user3', 'user3pass', 4)");
        db.run("INSERT INTO posts (title, content, user_id) VALUES ('First Post', 'This is the first post', 1)");
        db.run("INSERT INTO comments (content, post_id, user_id) VALUES ('First Comment', 1, 2)");

    });
        
    db.close();
};

module.exports = dbInit;*/