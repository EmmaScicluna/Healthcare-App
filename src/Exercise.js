import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./cssPages/Exercise.css";
import logo from "./images/caretrackLogo.png";

// Sample list of exercises
const exercises = [
  { name: "Neck Side-to-Side", image: require("./images/exercise1image.png") },
  { name: "Neck Up-and-Down", image: require("./images/exercise2image.png") },
  { name: "Arms Up and Down", image: require("./images/exercise3image.png") },
  { name: "Alternate Arm Raises", image: require("./images/exercise4image.png") },
  { name: "Arms from Side", image: require("./images/exercise5image.png") },
  { name: "Side Arm Pulses", image: require("./images/exercise6image.png") },
  { name: "Arms Open/Close", image: require("./images/exercise7image.png") },
  { name: "Stretch Left", image: require("./images/exercise8image.png") },
  { name: "Stretch Right", image: require("./images/exercise9image.png") },
];

const Exercise = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const patientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const submitted = patientsData.filter(p => p.exerciseMood && p.exerciseTimeLog);
      setPatients(submitted);
    };

    fetchPatients();
  }, []);

  return (
    <div className="exercise-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} alt="CareTrack Logo" className="navbar-logo" />
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/patients">Patients</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/pepper">Pepper</a></li>
          <li><a href="/exercise">Exercise</a></li>
        </ul>
        <a href="/" className="logout-button">Log out</a>
      </nav>

      {/* Exercise Submission Log */}
      <div className="section">
        <div className="section-header">
          <h2>Patient Exercise Log</h2>
        </div>
        <table className="exercise-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Patient ID</th>
              <th>Mood</th>
              <th>Time Submitted</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i}>
                <td>{p.name || "N/A"}</td>
                <td>{p.idNumber || "N/A"}</td>
                <td>{p.exerciseMood}</td>
                <td>{p.exerciseTimeLog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Exercises Preview Section */}
      <div className="section">
        <div className="section-header">
          <h2>Exercise Demonstrations</h2>
        </div>
        <div className="exercise-grid">
          {exercises.map((exercise, index) => (
            <div className="exercise-card" key={index}>
              <img src={exercise.image} alt={exercise.name} className="exercise-img" />
              <p>{exercise.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exercise;
