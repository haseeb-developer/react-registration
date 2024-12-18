import React, { useState, useEffect, useCallback } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Tips from './Tips/Tips';
import './SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
  });

  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [age, setAge] = useState(null);
  const navigate = useNavigate();

  const offensiveRegex =
    /(?:fuck|shit|bitch|asshole|dick|cunt|nigger|faggot|whore|slut|idiot|retard|crazy|dumb|fu_ck|bit__ch|benchod|crazy|facker|sucker|sh_it|lmao|rofl|damn|holyshit|holy_shit|idiot|shhit|shhhit|shhhhit|fuc-er[^a-zA-Z0-9_])/i;

  const isOffensive = (name) => {
    return offensiveRegex.test(name);
  };

  const validateUsername = (name) => {
    if (isOffensive(name)) {
      return 'This username is not allowed due to offensive content.';
    }

    const isValidFormat = /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)?$/.test(name);
    if (!isValidFormat) {
      return 'Only letters, numbers, and one underscore are allowed.';
    }

    if (name.startsWith('_') || name.endsWith('_')) {
      return 'Username cannot start or end with an underscore.';
    }

    const underscoreCount = (name.match(/_/g) || []).length;
    if (underscoreCount > 1) {
      return 'Only one underscore is allowed in the username.';
    }

    return '';
  };

  const validateEmail = useCallback(
    (email) => {
      if (/\s/.test(email)) {
        return 'There should be no spaces in the email.';
      }

      const emailParts = email.split('@');
      if (emailParts.length === 1) {
        return 'Please enter your email address first.';
      } else if (emailParts.length > 2) {
        return 'Invalid email format.';
      }

      const prefix = emailParts[0];
      if (prefix.length < 4 || /^\d+$/.test(prefix)) {
        return "You must have at least 4 non-numeric characters before the '@'.";
      }

      const domain = `@${emailParts[1]}`;
      if (domain !== selectedDomain) {
        return `Email must end with ${selectedDomain}.`;
      }

      return '';
    },
    [selectedDomain]
  );

  const validateDOB = (day, month, year) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (age < 13 || (age === 13 && monthDiff < 0)) {
      return 'You must be at least 13 years old to register.';
    }
    return '';
  };

  const handleUsernameChange = (e) => {
    const name = e.target.value;

    const newName = name.replace(offensiveRegex, (match) => {
      return '#'.repeat(match.length);
    });

    setUsername(newName);

    const error = validateUsername(newName);
    setErrors((prev) => ({ ...prev, username: error }));
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (inputEmail) {
      const error = validateEmail(inputEmail);
      setErrors((prev) => ({ ...prev, email: error }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleDomainChange = (e) => {
    const newDomain = e.target.value;
    setSelectedDomain(newDomain);

    const emailPrefix = email.split('@')[0];
    const newEmail = `${emailPrefix}${newDomain}`;
    setEmail(newEmail);

    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    if (pass !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Your password is not matching.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const pass = e.target.value;
    setConfirmPassword(pass);
    if (password !== pass) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Your password is not matching.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  useEffect(() => {
    const emailError = validateEmail(email);
    const dobError = validateDOB(dobDay, dobMonth, dobYear);

    const isValid =
      username &&
      !errors.username &&
      email &&
      !emailError &&
      password &&
      password.length >= 8 &&
      /[!@#$%^&*]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[a-z]/.test(password) &&
      !/\s/.test(password) &&
      confirmPassword === password &&
      dobDay &&
      dobMonth &&
      dobYear &&
      !dobError;

    setButtonDisabled(!isValid);

    if (dobDay && dobMonth && dobYear) {
      const today = new Date();
      const birthDate = new Date(dobYear, dobMonth - 1, dobDay);
      const calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDay)) {
        setAge(calculatedAge - 1);
      } else {
        setAge(calculatedAge);
      }
    } else {
      setAge(null);
    }
  }, [
    username,
    email,
    password,
    confirmPassword,
    errors.username,
    validateEmail,
    dobDay,
    dobMonth,
    dobYear,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !errors.username &&
      !errors.email &&
      !errors.confirmPassword &&
      !errors.dob
    ) {
      localStorage.setItem('username', username);
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Tips />
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputField">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
          </div>

          <div className="inputField domainInput">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <select onChange={handleDomainChange} value={selectedDomain}>
              <option value="@gmail.com">@gmail.com</option>
              <option value="@yahoo.com">@yahoo.com</option>
              <option value="@hotmail.com">@hotmail.com</option>
              <option value="@outlook.com">@outlook.com</option>
              <option value="@live.com">@live.com</option>
              <option value="@custom.com">@custom.com</option>
            </select>
          </div>
          {errors.email && <span className="error">{errors.email}</span>}

          <div className="inputField password-input">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <div className="inputField password-input cpassword">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <PasswordStrengthBar password={password} />

          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}

          <div className="dob-container">
            <div className="dob-inputs">
              <select
                value={dobDay}
                onChange={(e) => setDobDay(e.target.value)}
                required
              >
                <option value="">Day</option>
                {[...Array(31)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <select
                value={dobMonth}
                onChange={(e) => setDobMonth(e.target.value)}
                required
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <select
                value={dobYear}
                onChange={(e) => setDobYear(e.target.value)}
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 100 }, (_, i) => 2024 - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            {errors.dob && <span className="error">{errors.dob}</span>}
            {age !== null && (
              <span className="age-display">You're {age} years old.</span>
            )}
          </div>

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

          <button type="submit" disabled={isButtonDisabled}>
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
