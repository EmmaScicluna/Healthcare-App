import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import "./cssPages/Home.css"; // Import CSS for styling
import logo from "./images/caretrackLogo.png"; // Import logo

const Home = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Fetch Patients from Firebase
  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const patientList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientList.slice(0, 3)); // Show only first 3
    };

    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList.slice(0, 3)); // Show only first 3
    };

    fetchPatients();
    fetchTasks();
  }, []);

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
      {/* 🔹 Navigation Bar */}
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

      {/* 🔹 Welcome Section */}
      <section className="home-section welcome-section">
        <h1>Welcome to CareTrack</h1>
        <p>Your caregiving assistant for managing patients and tasks efficiently.</p>
      </section>

      {/* 🔹 Patients Preview Section */}
      <section className="home-section">
        <div className="section-header">
          <h2>Patients</h2>
          <button className="view-more-btn" onClick={() => navigate("/patients")}>View More</button>
        </div>
        <div className="preview-list">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <div key={patient.id} className="preview-card">
                <h3>{patient.name}</h3>
                <p>Age: {patient.age}</p>
                <p>Condition: {patient.condition}</p>
              </div>
            ))
          ) : (
            <p>No patients available.</p>
          )}
        </div>
      </section>

      {/* 🔹 Tasks Preview Section */}
      <section className="home-section">
        <div className="section-header">
          <h2>Tasks</h2>
          <button className="view-more-btn" onClick={() => navigate("/tasks")}>View More</button>
        </div>
        <div className="preview-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="preview-card">
                <h3>{task.name}</h3>
                <p>Deadline: {task.deadline}</p>
                <p>Status: {task.status}</p>
              </div>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </section>

      {/* 🔹 Placeholder for Pepper & Help Sections */}
      <section className="home-section">
        <h2>Coming Soon: Pepper & Help</h2>
        <p>These sections will be developed later.</p>
      </section>
    </div>
  );
};

export default Home;
