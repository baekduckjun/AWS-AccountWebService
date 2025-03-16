import React from "react";

const Header = ({
  title="No Title",
  goBack=alert('No onClick')
}) => (
  <div className='header'>
    <div className="g_goback">
      <a href="#" onClick={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="goback-icon"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </a>
    </div>
    <div className='title'>{title}</div>
  </div>
);

export default Header;