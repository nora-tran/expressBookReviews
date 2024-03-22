const axios = require('axios');
const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const baseUrl = 'http://localhost:5000';

// Task 1. Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 2. Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const foundBook = books[isbn];
  if (foundBook) {
    return res.status(200).json(foundBook);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Task 3. Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const foundBook = Object.values(books).filter((book) => book.author.toLowerCase() === author);
  if (foundBook.length > 0) {
    return res.status(200).json(foundBook);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Task 4. Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const foundBook = Object.values(books).filter((book) => book.title.toLowerCase().includes(title));
  if (foundBook.length > 0) {
    return res.status(200).json(foundBook);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Task 5. Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const foundBook = books[isbn];
  if (foundBook) {
    return res.status(200).json(foundBook.reviews);
  } else {
    return res.status(404).json({ message: 'Book reviews not found' });
  }
});

// Task 6. Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (username && isValid(username) && password) {
    users.push({ username, password });
    return res.status(201).json({ message: 'Customer registered successfully. Proceed with login.' });
  } else {
    return res.status(400).json({ message: 'Bad request' });
  }
});

// Task 10. Get the book list available in the shop using async/await
public_users.get('/async', async function (req, res) {
  try {
    const response = await axios.get(baseUrl);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Task 11. Get book details based on ISBN using async/await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${baseUrl}/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Task 12. Get book details based on author using async/await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get(`${baseUrl}/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Task 13. Get book details based on author using async/await
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get(`${baseUrl}/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
