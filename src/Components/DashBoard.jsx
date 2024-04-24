import React, { useState, useEffect } from 'react';
import { listBooks } from '../graphql/queries';
import { deleteBook as deleteBookMutation } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { remove, getUrl } from 'aws-amplify/storage';
import BookShelf from './BookShelf';
import NewBookButton from './NewBookButton';
import '../Styles/Dashboard.css';

const client = generateClient();

function Dashboard() {
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

  async function deleteBook({ id, image }) {
    const newBooks = books.filter((book) => book.id !== id);
    setBooks(newBooks);

    if (image) {
      await remove({ key: image });
    }

    await client.graphql({
      query: deleteBookMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h2>Bookshelf</h2>
        <BookShelf books={books} onDelete={deleteBook} />
        <NewBookButton />
      </div>
    </div>
  );
}

export default Dashboard;