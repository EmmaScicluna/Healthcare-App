import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./cssPages/ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset email has been sent to your inbox.");
    } catch (err) {
      setError("Failed to send reset email. Please check the email address.");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h1 className="forgot-title">Reset Password</h1>
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-input"
          />
          <button type="submit" className="forgot-button">Send Reset Email</button>
        </form>
        {message && (
          <div className="success-message">
            <p>{message}</p>
            <button className="back-button" onClick={() => navigate("/SignIn")}>Back to Sign In</button>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
