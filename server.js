const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { addUser, findUserByNumber } = require('./db');
const sqlite3 = require('sqlite3').verbose(); // Add this line to require SQLite3

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '192.168.1.6';

// Initialize SQLite3 Database
const db = new sqlite3.Database('./ITMILAN.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware
app.use(bodyParser.json());

// Register route
app.post('/register', async (req, res) => {
  const { name, email, number, ITMILAN, responsibilityName, responsibilityType, address, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  addUser(name, email, number, ITMILAN, responsibilityName, responsibilityType, address, hashedPassword, (err, userId) => {
    if (err) {
      res.status(500).send({ message: 'Error registering user' });
    } else {
      res.status(201).send({ message: 'User registered successfully', userId });
    }
  });
});

// Login route
app.post('/login', async (req, res) => {
  const { number, password } = req.body;

  findUserByNumber(number, async (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error logging in' });
    } else if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(400).send({ message: 'Invalid credentials' });
      } else {
        res.send({ message: 'Login successful', selectedITMILAN: user.ITMILAN });
      }
    }
  });
});

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching users' });
    } else {
      res.send({
        users: rows,
      });
    }
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
