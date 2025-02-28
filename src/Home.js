import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./cssPages/Home.css"; // Import CSS for styling
import logo from "./images/caretrackLogo.png"; // Import logo

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to Start Page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} alt="CareTrack Logo" className="navbar-logo" />
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/patients">Patients</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/pepper">Pepper</a></li>
          <li><a href="/help">Help</a></li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </nav>

      {/* Placeholder for future content */}
      <div className="home-content">
        <h1>Welcome to CareTrack</h1>
        <p>Dashboard content will be added later.</p>
      </div>
    </div>
  );
};

export default Home;
