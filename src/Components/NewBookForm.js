import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook as createBookMutation } from '../graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';
import '../Styles/NewBookForm.css';
import { listBooks } from '../graphql/queries';

const client = generateClient();

function NewBookForm() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const apiData = await client.graphql({ query: listBooks });
    const booksFromAPI = apiData.data.listBooks.items;
    await Promise.all(
      booksFromAPI.map(async (book) => {
        if (book.imagePath) {
          const url = await getUrl({ key: book.imagePath });
          book.image = url.url;
        }
        return book;
      })
    );
    setBooks(booksFromAPI);
  }

  async function createBook(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      title: form.get("title"),
      tableOfContents: form.get("tableOfContents"),
      imagePath: image.name,
    };

    try {
      if (data.imagePath) {
        await uploadData({
          key: data.imagePath,
          data: image,
        });
      }

      await client.graphql({
        query: createBookMutation,
        variables: { input: data },
      });

      fetchBooks();
      event.target.reset();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating book:', error);
    }
  }

  return (
    <div className="new-book-form">
      <h2>Create New Book</h2>
      <form onSubmit={createBook}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
          />

          <label htmlFor="tableOfContents">Table of Contents:</label>
          <input
            type="text"
            id="tableOfContents"
            name="tableOfContents"
          />

          <label htmlFor="image">Cover Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
          />
        </div>

        <button type="submit">Create Book</button>
      </form>
    </div>
  );
}

export default NewBookForm;
