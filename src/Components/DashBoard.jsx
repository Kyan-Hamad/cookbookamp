import React from 'react';
import { generateClient } from 'aws-amplify/api';
import BookShelf from './BookShelf';
import NewBookButton from './NewBookButton';
import '../Styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h2>Bookshelf</h2>
        <BookShelf />
        <NewBookButton />
      </div>
    </div>
  );
}

export default Dashboard;
