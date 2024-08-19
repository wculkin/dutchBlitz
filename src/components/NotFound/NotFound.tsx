import React from 'react';
import './NotFound.css'; // Make sure the CSS file is correctly imported

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <a href="/">Go to Homepage</a>
    </div>
  );
}

export default NotFound;