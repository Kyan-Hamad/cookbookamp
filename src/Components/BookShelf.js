import React, { useState, useEffect } from 'react';
import Book from './Book';
import '../Styles/BookShelf.css';
import { listBooks } from '../graphql/queries';
import { getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

function BookShelf({ onDelete }) {
  const [books, setBooks] = useState([]);
  

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const apiData = await client.graphql({ query: listBooks });
    const booksFromAPI = apiData.data.listBooks.items;

    await Promise.all(
      booksFromAPI.map(async (book) => {
        if (book.image) {
          const url = await getUrl({ key: book.image });
          book.image = url.url;
        }
      })
    );

    setBooks(booksFromAPI);
  }


  return (
    <div className="book-shelf">
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        books.map((book) => (
          <div key={book.id} className="book-item">
            <Book
               title={book.title}
               imagePath={book.imagePath ? `http://localhost:5000${book.imagePath}` : 'https://kyan-hamad.github.io/RPG-Game/CookBook-Maker-Logo.png'}
            />
            <button onClick={() => onDelete({ id: book.id, image: book.image })}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default BookShelf;
