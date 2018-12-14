'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cors());

/////// methodoverride goes here////////////
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body_method;
    return method;
  }
}));
require('dotenv').config();

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


app.set('view engine', 'ejs');


app.get('/new', (req, res) => {
  res.render('../views/pages/searches/new');
});


app.get('/', getBooks);
app.get('/books/details/:id', getOneBook);
app.post('/search', searchBooks);
app.post('/', saveBook);
app.put('/books/details/:id', editBook);
app.post('/delete/:id', deleteBook);

function Book(query) {
  this.img_url = query.volumeInfo.imageLinks.thumbnail;
  this.title = query.volumeInfo.title || 'N/A';
  this.author = query.volumeInfo.authors || 'N/A';
  this.isbn = parseInt(query.volumeInfo.industryIdentifiers[0].identifier) || 'N/A';
  this.description = query.volumeInfo.description || 'N/A';
}


function searchBooks(req, res) {
  const bookHandler = req.body;

  Book.fetchBooks(bookHandler)
    .then(books => {
      console.log('fetch handler', bookHandler);
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
  // let values = [req.params.id];
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
  let { img_url, title, author, isbn, description } = req.body;
  let SQL = `INSERT INTO books(img_url, title, author, isbn, description) VALUES ($1,$2,$3,$4,$5) RETURNING id;`;
  let values = [img_url, title, author, isbn, description];
  client.query(SQL, values)
    .then(res.redirect(`/`))
    .catch(err => errorHandler(err, res));
}

function editBook(req, res) {
  console.log('editBook hit')
  let { img_url, title, author, isbn, description } = req.body;
  let SQL = `UPDATE books SET img_url=$1, title=$2, author=$3, isbn=$4, description=$5 WHERE id=$6;`;
  let values = [img_url, title, author, isbn, description, req.params.id];
  console.log('edited book alues', values);
  client.query(SQL, values)
    .then(res.redirect(`${req.params.id}`))
    .catch(err => errorHandler(err, res));
}
function deleteBook(req, res) {
  let SQL = `DELETE FROM books WHERE id=$1;`;
  let values = [req.params.id];
  console.log('hit delete book', values);
  client.query(SQL, values)
    .then(res.redirect(`/`))
    .catch(err => errorHandler(err, res));
}

function errorHandler(err, res) {
  res.render('pages/error', { error: 'https://http.cat/404' });
}

// https://http.cat/404
app.get('*', (req, res) => res.status(404).send('Page Not Found'));
app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
