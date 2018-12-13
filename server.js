'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const PORT = process.env.PORT || 3000;

require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cors());
app.set('view engine', 'ejs');


app.get('/new', (req, res) => {
  res.render('../views/pages/searches/new');
});
app.get('/', getBooks);
app.get('/books/details/:id', getOneBook);
app.post('/search', searchBooks);
app.post('/', saveBook);
let books = [];

function Book(query) {
  this.title = query.volumeInfo.title;
  this.author = query.volumeInfo.authors;
  this.isbn = parseInt(query.volumeInfo.industryIdentifiers[0].identifier);
  this.description = query.volumeInfo.description;
  this.img_url = query.volumeInfo.imageLinks.thumbnail;
  books.push(this);
}


function searchBooks(req, res) {
  const bookHandler = req.body;

  Book.fetchBooks(bookHandler)
    .then(books => {
      console.log('fetch handler', bookHandler);
      console.log('book object', books);
      res.render('pages/searches/show', { booklist: books });
    });
}

Book.fetchBooks = function (data) {
  let search = data.searchBook;
  let query = data.search;
  const authorURL = `https://www.googleapis.com/books/v1/volumes?q=${search}:intitle=${search}`;
  const titleURL = `https://www.googleapis.com/books/v1/volumes?q=${search}:inauthor=${search}`;
  if (query === 'author') {
    return superagent.get(authorURL)
      .then(result => {
        let newBook = result.body.items.map(rest => {
          const summary = new Book(rest);
          return summary;
        });
        return newBook;
      });
  } else if (query === 'title') {
    return superagent.get(titleURL)
      .then(result => {
        let newBook = result.body.items.map(rest => {
          const summary = new Book(rest);
          return summary;
        });
        return newBook;
      });
  }
}

function getBooks(req, res) {
  let SQL = `SELECT * from books;`;
  console.log('sql get books', client.query(SQL));
  return client.query(SQL)
    .then(results => res.render('pages/index', { bookshelf: results.rows }))
    .catch(err => errorHandler(err, res));
}

function getOneBook(req, res) {
  let SQL = `SELECT * FROM books WHERE id=$1;`;
  let book = [req.params.id];
  return client.query(SQL, book)
    .then(result => {
      return res.render('../views/pages/books/details', { singlebook: result.rows[0] });
    });
}

function saveBook(req, res) {
  console.log('saveBook hit')
  let { title, author, isbn, description, img_url } = req.body;
  let SQL = `INSERT INTO books(title, author, isbn, description, img_url) VALUES ($1,$2,$3,$4,$5);`;
  let values = [title, author, isbn, description, img_url];
  console.log('book sql values', values);
  console.log('sequel console', client.query(SQL, values));
  client.query(SQL, values)
    .then(res.redirect(`/`))
    .catch(err => errorHandler(err, res));
}
function errorHandler(err, res) {
  res.render('/error', { error: 'PAGE NOT FOUND' });
}
// https://http.cat/404
app.get('*', (req, res) => res.status(404).send('Page Not Found'));
app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
