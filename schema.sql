DROP DATABASE book_app;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255),
  author VARCHAR (255),
  isbn VARCHAR (255),
  description VARCHAR (255),
  img_url VARCHAR (255),
  bookshelf VARCHAR (255)
);

INSERT INTO books (title, author, isbn, description, img_url, bookshelf) VALUES ('Frank', 'the tank', '87798', 'Just one', 'www.img.com', 'shelf');
INSERT INTO books (title, author, isbn, description, img_url, bookshelf) VALUES ('Crank', 'Soldier boy', '87798', 'Just two', 'www.img.com', 'shelf2');