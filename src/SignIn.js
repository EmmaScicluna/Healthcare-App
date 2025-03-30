import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig"; // Import Firestore DB
import { doc, getDoc } from "firebase/firestore";
import "./cssPages/SignIn.css"; // Import the updated CSS

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Authenticate user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get authenticated user

      // Step 2: Check Firestore if the user is a registered caregiver
      const caregiverRef = doc(db, "caregivers", user.uid);
      const caregiverSnap = await getDoc(caregiverRef);

      if (caregiverSnap.exists()) {
        // User exists in caregivers collection, allow access
        navigate("/home");
      } else {
        // If user is not in the caregivers collection, log them out and show error
        setError("Access Denied: Only registered caregivers can sign in.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h1 className="signin-title">Sign in</h1>
        <form className="signin-form" onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signin-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signin-input"
          />
          <div className="signin-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="signin-button2">SIGN IN</button>
        </form>
        <p className="register-text">
          Don't have a registered account? <span onClick={() => navigate('/register')} className="register-link">Register</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
