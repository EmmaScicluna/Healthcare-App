import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import "./cssPages/Home.css";
import logo from "./images/caretrackLogo.png";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const patientList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientList.slice(0, 3));
    };

    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList.slice(0, 3));
    };

    const fetchExerciseLogs = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const logs = querySnapshot.docs
        .filter(doc => doc.data().exerciseMood && doc.data().exerciseTimeLog)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setExerciseLogs(logs.slice(0, 3));
    };

    const fetchAlerts = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const alertsArray = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        if (data.categoryAlert || data.urgencyOfAlert || data.locationOfAlert) {
          alertsArray.push({
            id: docSnap.id,
            name: data.name,
            categoryAlert: data.categoryAlert,
            urgencyOfAlert: data.urgencyOfAlert,
            time: data.alertTime || "N/A",
          });
        }
      }

      // Sort by time descending (most recent first)
      const sorted = alertsArray.sort((a, b) => {
        const timeA = new Date(a.time.split(", ")[0].split("/").reverse().join("/") + " " + a.time.split(", ")[1]);
        const timeB = new Date(b.time.split(", ")[0].split("/").reverse().join("/") + " " + b.time.split(", ")[1]);
        return timeB - timeA;
      });

      setAlerts(sorted.slice(0, 3));
    };

    fetchPatients();
    fetchTasks();
    fetchExerciseLogs();
    fetchAlerts();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="home-container">
      <Navbar />

      <section className="home-section welcome-section">
        <h1>Welcome to CareTrack</h1>
        <p>Your caregiving assistant for managing patients and tasks efficiently.</p>
      </section>

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

      <section className="home-section">
        <div className="section-header">
          <h2>Exercise Logs</h2>
          <button className="view-more-btn" onClick={() => navigate("/exercise")}>View More</button>
        </div>
        <div className="preview-list">
          {exerciseLogs.length > 0 ? (
            exerciseLogs.map((log) => (
              <div key={log.id} className="preview-card">
                <h3>{log.name}</h3>
                <p>Mood: {log.exerciseMood}</p>
                <p>Submitted: {log.exerciseTimeLog}</p>
              </div>
            ))
          ) : (
            <p>No exercise logs available.</p>
          )}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Alerts</h2>
          <button className="view-more-btn" onClick={() => navigate("/alerts")}>View More</button>
        </div>
        <div className="preview-list">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="preview-card">
                <h3>{alert.name}</h3>
                <p>Category: {alert.categoryAlert}</p>
                <p>Urgency: {alert.urgencyOfAlert}</p>
                <p>Time: {alert.time}</p>
              </div>
            ))
          ) : (
            <p>No alerts available.</p>
          )}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>About Pepper</h2>
          <button className="view-more-btn" onClick={() => navigate("/pepper")}>Learn More</button>
        </div>
        <div className="preview-list">
          <div className="preview-card">
            <h3>Pepper, Your Robotic Assistant</h3>
            <p>Click to explore how Pepper helps with daily activities, communication, and engagement.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
