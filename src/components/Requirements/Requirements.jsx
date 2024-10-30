import React from 'react';
import './Com';

const Requirements = () => {
  return (
    <div>
      <div className="password-requirements">
        <div className="requirement">
          {password.length >= 8 ? (
            <AiFillCheckCircle className="valid" />
          ) : (
            <AiFillCloseCircle className="invalid" />
          )}
          Password should be at least 8 characters long.
        </div>
        <div className="requirement">
          {/[!@#$%^&*]/.test(password) ? (
            <AiFillCheckCircle className="valid" />
          ) : (
            <AiFillCloseCircle className="invalid" />
          )}
          Must have a special character (e.g., @, #, $, %)
        </div>
        <div className="requirement">
          {/[A-Z]/.test(password) ? (
            <AiFillCheckCircle className="valid" />
          ) : (
            <AiFillCloseCircle className="invalid" />
          )}
          Must have an upper case letter.
        </div>
        <div className="requirement">
          {/[0-9]/.test(password) ? (
            <AiFillCheckCircle className="valid" />
          ) : (
            <AiFillCloseCircle className="invalid" />
          )}
          Must have a number.
        </div>
        <div className="requirement">
          {/[a-z]/.test(password) ? (
            <AiFillCheckCircle className="valid" />
          ) : (
            <AiFillCloseCircle className="invalid" />
          )}
          Must have a lower case letter.
        </div>
        <div className="requirement">
          {!/\s/.test(password) ? (
            <AiFillCheckCircle className="valid" />
          ) : (
            <AiFillCloseCircle className="invalid" />
          )}
          Password must not contain spaces.
        </div>
        <div className="requirement">
          {age >= 13 ? (
            <AiFillCheckCircle className="valid" />
          ) : (
            <AiFillCloseCircle className="invalid" />
          )}
          User must be at least 13 years old.
        </div>
      </div>
    </div>
  );
};

export default Requirements;
