import React from 'react';
import Book from './Book';
import '../Styles/BookShelf.css';

function BookShelf({ books, onDelete }) {
  return (
    <div className="book-shelf">
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        books.map((book) => (
          <div key={book.id} className="book-item">
            <Book
              title={book.title}
              image={book.image}
            />
            <button onClick={() => onDelete({ id: book.id, image: book.image })}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default BookShelf;
