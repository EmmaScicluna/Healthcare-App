import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore"
import "./cssPages/SignIn.css"; // Reuse the Sign-In styles

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Step 1: Check if email exists in the 'allowedCaregivers' collection
      const allowedCaregiversRef = collection(db, "allowedCaregivers");
      const q = query(allowedCaregiversRef, where("email", "==", email.trim())); // Match exactly

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("You are not authorized to register.");
        return;
    }

      // Step 2: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 3: Save user info in 'caregivers' collection
      await setDoc(doc(db, "caregivers", user.uid), {
        email: email,
        role: "caregiver",
      });

      // Step 4: Redirect to Sign In page
      navigate("/signin");
    } catch (err) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h1 className="signin-title">Register</h1>
        <form className="signin-form" onSubmit={handleRegister}>
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
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signin-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signin-input"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="signin-button">REGISTER</button>
        </form>
        <p className="register-text">
          Already have an account? <span onClick={() => navigate('/signin')} className="register-link">Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
