const sqlite3 = require('sqlite3').verbose();

// Initialize and configure the SQLite database
const db = new sqlite3.Database('./ITMILAN.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        number TEXT NOT NULL UNIQUE,
        ITMILAN TEXT NOT NULL,
        responsibilityName TEXT NOT NULL,
        responsibilityType TEXT NOT NULL,
        address TEXT NOT NULL,
        password TEXT NOT NULL
      )`,
      (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Connected to the SQLite database.');
        }
      }
    );
  }
});

// Function to add a new user
const addUser = (name, email, number, ITMILAN, responsibilityName, responsibilityType, address, password, callback) => {
  const sql = `INSERT INTO users (name, email, number, ITMILAN, responsibilityName, responsibilityType, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [name, email, number, ITMILAN, responsibilityName, responsibilityType, address, password], function(err) {
    callback(err, this.lastID);
  });
};

// Function to find a user by number
const findUserByNumber = (number, callback) => {
  const sql = `SELECT * FROM users WHERE number = ?`;
  db.get(sql, [number], (err, row) => {
    callback(err, row);
  });
};

module.exports = {
  addUser,
  findUserByNumber,
};
