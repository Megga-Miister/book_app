'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));
app.use(cors());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('../views/pages/index');
});

app.post('/search',searchBooks);

let books =[];

function Book(query) {
  this.search_query = query;
  this.title = query.volumeInfo.title;
  this.author = query.volumeInfo.authors;
  this.description = query.volumeInfo.description;
  this.img_url = query.volumeInfo.imageLinks.thumbnail;
  books.push(this);
}


function searchBooks (req, res) {
  const bookHandler = req.body;

  Book.fetchBooks(bookHandler)
    .then( books => {
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

// function searchBook (req, res) {
//   const handler = {
//     locaiton: req.query.data,
//     cacheHit: (results) => {
//       console.log('hit data from SQL', results);
//       res.send(results.rows[0]);
//     },
//     cacheMiss: () => {
//       Location.fetchBook(req.query.data)
//         .then(data => res.send(data))
//         .catch(console.error);
//     }
//   };
//   Book.bookLookup(handler);
// }

// Book.bookLookup = element => {
//   const SQL = `SELECT * FROM bookdata WHERE search_query=$1;`;
//   const values = [element.query];
//   return clientInformation.query(SQL, values)
//     .then(results => {
//       if (results.rowCount > 0) {
//         element.cacheHit(results);
//       } else {
//         element.cacheMiss();
//       }
//     })
//     .catch(console.error);
// }


// Book.prototype.save = function () {
//   let SQL = `
//   INSERT INTO bookdata
//     (search_query,title,author,publisher,description)
//     VALUES($1,$2,$3,$4,$5)
//     RETURNING id;`;
//   let values = Object.values(this);
//   console.log('book values', values);
//   return client.query(SQL, values);
// }

app.get('*', (req, res) => res.status(404).send('Page Not Found'));
app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
