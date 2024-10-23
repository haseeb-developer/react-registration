import React, { useState, useEffect } from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Tips from "./Tips/Tips";
import "./SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("@gmail.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const offensiveRegex =
    /(?:fuck|shit|bitch|asshole|dick|cunt|nigger|faggot|whore|slut|idiot|retard|crazy|dumb|[^a-zA-Z0-9_])/i;

  const isOffensive = (name) => {
    return offensiveRegex.test(name);
  };

  const validateUsername = (name) => {
    if (isOffensive(name)) {
      return "This username is not allowed due to offensive content.";
    }

    const isValidFormat = /^[a-zA-Z0-9]+(_[a-zA-Z0-9]+)?$/.test(name);
    if (!isValidFormat) {
      return "Only letters, numbers, and one underscore are allowed.";
    }

    if (name.startsWith("_") || name.endsWith("_")) {
      return "Username cannot start or end with an underscore.";
    }

    const underscoreCount = (name.match(/_/g) || []).length;
    if (underscoreCount > 1) {
      return "Only one underscore is allowed in the username.";
    }

    return "";
  };

  const validateEmail = (email) => {
    if (/\s/.test(email)) {
      return "There should be no spaces in the email.";
    }

    const emailParts = email.split("@");

    if (emailParts.length === 1) {
      return "Please enter your email address first.";
    } else if (emailParts.length > 2) {
      return "Invalid email format.";
    }

    if (emailParts[0].length < 4) {
      return "You must have at least 4 characters before the '@'.";
    }

    if (emailParts.length === 2) {
      const domain = `@${emailParts[1]}`;
      if (domain !== selectedDomain) {
        return `Email must end with ${selectedDomain}.`;
      }
    }

    return "";
  };

  const handleUsernameChange = (e) => {
    const name = e.target.value;
    const underscoreCount = (name.match(/_/g) || []).length;
    if (underscoreCount >= 1 && name.endsWith("_")) {
      return;
    }
    setUsername(name);
    const error = validateUsername(name);
    setErrors((prev) => ({ ...prev, username: error }));
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (inputEmail) {
      const error = validateEmail(inputEmail);
      setErrors((prev) => ({ ...prev, email: error }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleDomainChange = (e) => {
    const newDomain = e.target.value;
    setSelectedDomain(newDomain);

    const emailPrefix = email.split("@")[0];
    const newEmail = `${emailPrefix}${newDomain}`;
    setEmail(newEmail);

    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);
    if (pass !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Your password is not matching.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const pass = e.target.value;
    setConfirmPassword(pass);
    if (password !== pass) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Your password is not matching.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  useEffect(() => {
    const isValid =
      username &&
      !errors.username &&
      email &&
      !errors.email &&
      password &&
      password.length >= 8 &&
      /[!@#$%^&*]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[a-z]/.test(password) &&
      !/\s/.test(password) &&
      confirmPassword === password;

    setButtonDisabled(!isValid);
  }, [
    username,
    email,
    password,
    confirmPassword,
    errors.username,
    errors.email,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.username && !errors.email && !errors.confirmPassword) {
      localStorage.setItem("username", username);
      navigate("/dashboard");
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
              type={passwordVisible ? "text" : "password"}
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

          <div className="inputField password-input">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
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
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}

          <div className="password-requirements">
            <div className="requirement">
              {password.length >= 8 ? (
                <AiFillCheckCircle className="valid" />
              ) : (
                <AiFillCloseCircle className="invalid" />
              )}
              Password should be at least 8 characters long
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
              Must have an upper case letter
            </div>
            <div className="requirement">
              {/[0-9]/.test(password) ? (
                <AiFillCheckCircle className="valid" />
              ) : (
                <AiFillCloseCircle className="invalid" />
              )}
              Must have a number
            </div>
            <div className="requirement">
              {/[a-z]/.test(password) ? (
                <AiFillCheckCircle className="valid" />
              ) : (
                <AiFillCloseCircle className="invalid" />
              )}
              Must have a lowercase letter
            </div>
            <div className="requirement">
              {!/\s/.test(password) ? (
                <AiFillCheckCircle className="valid" />
              ) : (
                <AiFillCloseCircle className="invalid" />
              )}
              Spaces are not allowed in the password
            </div>
            <div className="requirement">
              {!/^(password|123456|123456789|12345|12345678|qwerty|abc123|letmein|monkey|111111|iloveyou|admin|welcome|password1)$/i.test(
                password
              ) ? (
                <AiFillCheckCircle className="valid" />
              ) : (
                <AiFillCloseCircle className="invalid" />
              )}
              Avoid common passwords (e.g., "password", "123456")
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
