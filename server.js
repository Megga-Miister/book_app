'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.get('/hello', (req, res) => {
  res.render('../views/pages/index');
});

// app.get('/', (req, res) => {
//   res.render('../views/pages/error');
// });

// app.post('/search', searchBooks);
app.post('/search', (req, res) => {
  console.log('search criteria', req.body);
  // res.sendFile('/searches/show', {root: './public'});
});

let books =[];

function Book(query, res) {
  this.search_query = query;
  this.title = res.volumeInfo.title;
  this.author = res.volumeInfo.author;
  this.publisher = res.volumeInfo.publisher;
  this.description = res.volumeInfo.description;
  books.push(this);
}


function searchBooks (req, res) {
  // const bookHandler = {
  //   location: req.query.data,
  // }
  Book.fetchBooks(req.query.data)
  app.get('/books', (request, response) => {
    response.render('books', {booklist: books});
  });
}

Book.fetchBooks = function (query) {
  const authorURL = `https://www.googleapis.com/books/v1/volumes?q=intitle:${query}`;
  const titleURL = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${query}`;
  if (query === 'author') {
    return superagent.get(authorURL)
      .then(result => {
        let newBook = result.body.data.map(rest => {
          const summary = new Book(rest);
          return summary;
        });
        return newBook;
      });
  } else if (query === 'title') {
    return superagent.get(titleURL)
      .then(result => {
        let newBook = result.body.data.map(rest => {
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

app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
