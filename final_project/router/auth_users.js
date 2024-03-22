const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// Task 7. User login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Bad request' });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username, password }, 'fingerprint_customer', { expiresIn: '1h' });
    req.session.authorization = { accessToken };
    return res.status(200).send({ message: 'User login successful' });
  }

  return res.status(401).json({ message: 'Unauthorized' });
});

// Task 8. Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const token = req.session.authorization.accessToken;
  try {
    const decoded = jwt.verify(token, 'fingerprint_customer');
    const username = decoded.username;
    const isbn = req.params.isbn;
    const foundBook = books[isbn];
    if (!foundBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    books[isbn].reviews[username] = req.query.review;
    return res.status(200).json({ message: `Review for book with ISBN ${isbn} created/updated successfully` });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Task 9. Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const token = req.session.authorization.accessToken;
  try {
    const decoded = jwt.verify(token, 'fingerprint_customer');
    const username = decoded.username;
    const isbn = req.params.isbn;
    const foundBook = books[isbn];
    if (!foundBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: 'Review not found' });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: `Review for book with ISBN ${isbn} deleted successfully` });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
