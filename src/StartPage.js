import React from "react";
import "./StartPage.css"; // Import CSS for styling
import logo from "./images/caretrackLogo.png"; // Updated path to logo
import background from "./images/StartPageBackground.png"; // Updated path to background

function StartPage() {
  return (
    <div className="startpage-container" style={{ backgroundImage: `url(${background})` }}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} alt="CareTrack Logo" className="navbar-logo" />
        <button className="signin-button">Sign in</button>
      </nav>

      {/* Main Content */}
      <div className="content">
        <h1>Welcome to our community</h1>
        <p>Your smart caregiver assistant for managing patient care effortlessly.</p>
        <button className="register-button">Register</button>
      </div>
    </div>
  );
}

export default StartPage;
