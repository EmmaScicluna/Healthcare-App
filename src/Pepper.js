import React from "react";
import "./cssPages/Pepper.css";
import logo from "./images/caretrackLogo.png";
import pepperImg from "./images/pepperRobot.png"; // optional image
import Navbar from "./Navbar";


const Pepper = () => {
  return (
    <div className="pepper-container">
      {/* Navigation Bar */}
      <Navbar />

      <div className="pepper-content">
        <h1>Meet Pepper</h1>
        <p className="intro-text">
          Pepper is here to assist caregivers and patients using interactive, friendly communication. Learn how to interact with Pepper below.
        </p>

        {/* Optional Image */}
        <div className="pepper-image-section">
          <img src={pepperImg} alt="Pepper the Robot" className="pepper-image" />
        </div>

        <div className="section">
          <h2>How to Use Pepper</h2>
          <ul className="pepper-list">
            <li>✅ Stand in front of Pepper and speak clearly</li>
            <li>✅ Use trigger phrases like “Pepper,” before asking something</li>
            <li>✅ Wait for Pepper to respond before continuing</li>
          </ul>
        </div>

        <div className="section">
          <h2>Things You Can Say</h2>
          <ul className="pepper-list examples">
            <li>🗣️ “Pepper, remind Maria to take her medicine”</li>
            <li>🗣️ “Pepper, start exercise session”</li>
            <li>🗣️ “Pepper, what day is it today?”</li>
            <li>🗣️ “Pepper, show me today’s appointments”</li>
          </ul>
        </div>

        <div className="section">
          <h2>Helpful Tips</h2>
          <p className="tip-text">
            Make sure Pepper is connected to Wi-Fi and positioned in a quiet, open space for better voice detection. If Pepper doesn't respond, gently say “Hello Pepper” again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pepper;
