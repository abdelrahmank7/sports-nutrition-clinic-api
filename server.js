const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

// Create a new SQLite database
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create a table for users if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    password TEXT NOT NULL
  );
`);

// Parse JSON bodies
app.use(cors());
app.use(express.json());

// API endpoint for signin
app.post('/signin', (req, res) => {
  const { id, password } = req.body;
  const query = `SELECT * FROM users WHERE id =? AND password =?`;
  db.get(query, [id, password], (err, row) => {
    if (err) {
      res.status(500).send({ error: 'Error signing in' });
    } else if (row) {
      res.json({ id: row.id });
      // Redirect to ClientHomePage
      res.redirect('/ClientHomePage');
    } else {
      res.status(401).send({ error: 'Invalid credentials' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});