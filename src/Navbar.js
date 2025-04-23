import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import Modal from "react-modal";
import logo from "./images/caretrackLogo.png";
import "./cssPages/Navbar.css";

Modal.setAppElement("#root");

const Navbar = () => {
  const [alertCount, setAlertCount] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    closeModal();
  };

  return (
    <>
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
        <button className="logout-button" onClick={openModal}>Log out</button>
      </nav>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-buttons">
          <button className="confirm-button-2" onClick={confirmLogout}>Yes</button>
          <button className="cancel-button-2" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
