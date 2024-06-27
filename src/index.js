const express = require('express');
const mysql = require('mysql2');
const app = express();
const dotenv = require("dotenv");
dotenv.config()
app.use(express.json()); 


const connection = mysql.createConnection({
    host: process.env.SQL_DB_HOST,
    user: process.env.SQL_DB_USERNAME,
    password: process.env.SQL_DB_PASSWORD,
    database: process.env.SQL_DB_DATABASENAME
});


connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usernames (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL
    )
  `;
    connection.query(createTableQuery, (err, results) => {
        if (err) throw err;
        console.log('Usernames table created');

        const checkTableQuery = 'SELECT COUNT(*) AS count FROM usernames';
        connection.query(checkTableQuery, (err, results) => {
            if (err) throw err;

            const count = results[0].count;
            if (count === 0) {
                const seedDataQuery = `
                INSERT INTO usernames (username)
                VALUES 
                    ('john_doe'),
                    ('jane_smith'),
                    ('alice_johnson')
                `;
                connection.query(seedDataQuery, (err, results) => {
                    if (err) throw err;
                    console.log('Usernames table seeded');
                });
            }
        });

    });
});

app.post('/usernames', (req, res) => {
    const { username } = req.body;
    const insertQuery = 'INSERT INTO usernames (username) VALUES (?)';
    connection.query(insertQuery, [username], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).send('Username added');
        }
    });
});


app.get('/usernames', (req, res) => {
    const selectQuery = 'SELECT * FROM usernames';
    connection.query(selectQuery, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).json(results);
        }
    });
});

app.put('/usernames/:id', (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    const updateQuery = 'UPDATE usernames SET username = ? WHERE id = ?';
    connection.query(updateQuery, [username, id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Username updated');
        }
    });
});

app.delete('/usernames/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM usernames WHERE id = ?';
    connection.query(deleteQuery, [id], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Username deleted');
        }
    });
});


const port = process.env.PORT | 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { app, connection };