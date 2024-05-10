const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const createUserTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      password TEXT NOT NULL
    );
  `);
};

const getUserByIdAndPassword = (id, password) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id =?`;
    db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (!row) {
        resolve(null);
      } else {
        const hashedPassword = row.password;
        const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
        if (isPasswordValid) {
          resolve(row);
        } else {
          resolve(null);
        }
      }
    });
  });
};

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const storeUser = (id, password) => {
  const hashedPassword = hashPassword(password);
  db.run(`
    INSERT INTO users (id, password) VALUES (?, ?)
  `, [id, hashedPassword]);
};

module.exports = { createUserTable, getUserByIdAndPassword, storeUser };