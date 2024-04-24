import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/NewBookButton.css';

const NewBookButton = () => {
  return (
    <div className="new-book-button">
      <Link to="/new-book">Add New Book</Link>
    </div>
  );
}

export default NewBookButton;