import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./cssPages/StartPage.css"; // Import CSS for styling
import logo from "./images/caretrackLogo.png"; // Updated path to logo
import background from "./images/StartPageBackground.png"; // Updated path to background

function StartPage() {
    return (
      <div className="startpage-container" style={{ backgroundImage: `url(${background})` }}>
        {/* Navigation Bar */}
        <nav className="navbar">
          <img src={logo} alt="CareTrack Logo" className="navbar-logo" />
          <Link to="/signin">
            <button className="signin-button">Sign in</button>
          </Link>
        </nav>
  
        {/* Main Content */}
        <div className="content">
          <h1>Welcome to our community</h1>
          <p>Your smart caregiver assistant for managing patient care effortlessly.</p>
          <Link to="/register">
            <button className="register-button">Register</button>
          </Link>
        </div>
      </div>
    );
  }
  
  export default StartPage;