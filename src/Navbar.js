// Navbar.js (shared across all pages)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import logo from "./images/caretrackLogo.png";
import "./cssPages/Navbar.css";

const Navbar = () => {
  const [alertCount, setAlertCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      const snapshot = await getDocs(collection(db, "patients"));
      let count = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.categoryAlert || data.urgencyOfAlert || data.locationOfAlert) {
          count++;
        }
      });
      setAlertCount(count);
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="CareTrack Logo" className="navbar-logo" />
      </div>
      <ul className="nav-links">
        <li><a href="/home">Home</a></li>
        <li><a href="/patients">Patients</a></li>
        <li><a href="/tasks">Tasks</a></li>
        <li><a href="/pepper">Pepper</a></li>
        <li><a href="/exercise">Exercise</a></li>
        <li className="alerts-tab">
          <a href="/alerts">Alerts</a>
          {alertCount > 0 && <span className="alert-badge">{alertCount}</span>}
        </li>
      </ul>
      <button className="logout-button" onClick={() => navigate("/")}>Log out</button>
    </nav>
  );
};

export default Navbar;