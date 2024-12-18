import React from 'react';
import './Tips.css';

const Tips = () => {
  return (
    <div className="tips-container">
      <h2 className="tips-title">Key Points</h2>
      <ul className="tips-list">
        <li className="tip-item">
          If your domain (From Select Box) not matching with the input, It won't
          let you proceed.
        </li>
        <li className="tip-item">
          No underscores at the start or end of the username; use them only in
          the middle.
        </li>
        <li className="tip-item">
          Numbers before '@' in email field are not allowed.
        </li>
        <li className="tip-item">Offensive usernames are not allowed.</li>
        <li className="tip-item">Special character are not allowed.</li>
        <li className="tip-item">You must be 13+ to make an account.</li>
      </ul>
    </div>
  );
};

export default Tips;
