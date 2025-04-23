import React from "react";
import "./cssPages/Pepper.css";
import pepperImg from "./images/pepperRobot.png"; 
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
            <li>✅ Switch Pepper on using the power button on its chest.</li>
            <li>✅ Ensure Pepper is connected to Wi-Fi successfully.</li>
            <li>✅ Once connected, you can begin the interaction by saying “Hello Pepper”.</li>
            <li>✅ Alternatively, refer to the example phrases on the tablet and speak one aloud.</li>
            <li>✅ Continue the interaction naturally by asking for tasks like medication reminders or starting an exercise session.</li>
          </ul>
        </div>

        <div className="section">
          <h2>Things You Can Say</h2>
          <ul className="pepper-list examples">
            <li>🗣️ “Hello Pepper”</li>
            <li>🗣️ “Pepper, when do I need to take my medication?”</li>
            <li>🗣️ “Pepper, can we start some exercises?”</li>
            <li>🗣️ “Pepper, what day is it today?”</li>
          </ul>
        </div>

        <div className="section">
          <h2>Helpful Tips</h2>
          <p className="tip-text">
            Position Pepper in a quiet, open area for better voice detection.
          </p>
          <p className="tip-text">
            Confirm that Pepper is connected to Wi-Fi before starting.
          </p>
          <p className="tip-text">
            Speak clearly and wait for Pepper to respond before continuing.
          </p>
          <p className="tip-text">
            If Pepper doesn’t respond, try saying “Hello Pepper” again clearly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pepper;
