'use strict';

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/views/pages/index', (req, res) => {
  res.render('index', {});
});
app.get('/views/pages/error', (req, res) => {
  res.render('index', {});
});
app.get('/views/pages/searches/show', (req, res) => {
  res.render('index', {});
});

app.listen(PORT, () => {
  console.log(`listening on PORT: ${PORT}`);
});
