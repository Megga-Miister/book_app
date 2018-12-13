DROP DATABASE book_app;
CREATE DATABASE book_app;
\c book_app;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255),
  author VARCHAR (255),
  isbn VARCHAR (255),
  description TEXT,
  img_url VARCHAR (255),
  bookshelf VARCHAR (255)
);
