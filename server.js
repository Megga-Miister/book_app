'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.get('/hello', (req, res) => {
  res.render('../views/pages/index');
});

app.get('/', (req, res) => {
  res.render('../views/pages/error');
});

app.get('/', (req, res) => {
  res.render('../views/pages/searches/show');
});

app.post('/search', (req, res) => {
  console.log('search criteria', req.body);
  // res.sendFile('/searches/show', {root: './public'});
});

function Book(query, res) {
  this.search_query = query;
  this.title = res.title;
  this.author = res.author;
  this.publisher = res.publisher;
  this.description = res.description;
}




app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
