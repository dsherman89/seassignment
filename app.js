const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const dbInit = require('./src/db/init');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;    // note to come back and check this out when running

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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


app.use('./api/users', userRoutes);
app.use('./api/posts', postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);   // make this work with PORT const in line 8 if changed there too
});