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

INSERT INTO books (title, author, isbn, description, img_url, bookshelf) VALUES ('Frank', 'the tank', '87798', 'Just one', 'www.img.com', 'shelf');
INSERT INTO books (title, author, isbn, description, img_url, bookshelf) VALUES ('Crank', 'Soldier boy', '87798', 'Just two', 'www.img.com', 'shelf2');