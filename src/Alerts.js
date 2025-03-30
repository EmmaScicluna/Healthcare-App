import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import Modal from "react-modal";
import "./cssPages/Alerts.css";
import Navbar from "./Navbar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

Modal.setAppElement("#root");

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const alertsArray = [];
    
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        if (data.categoryAlert || data.urgencyOfAlert || data.locationOfAlert) {
          alertsArray.push({
            id: docSnap.id,
            name: data.name,
            idNumber: data.idNumber,
            category: data.categoryAlert,
            urgency: data.urgencyOfAlert,
            location: data.locationOfAlert,
            time: data.alertTime || "Unknown",
          });
        }
      }
    
      alertsArray.sort((a, b) => {
        const dateA = dayjs(a.time, "DD/MM/YYYY, HH:mm:ss");
        const dateB = dayjs(b.time, "DD/MM/YYYY, HH:mm:ss");
        return dateB.valueOf() - dateA.valueOf(); // Latest first
      });      
    
      setAlerts(alertsArray);
    };
     

    fetchAlerts();
  }, []);

  const openModal = (alert) => {
    setSelectedAlert(alert);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAlert(null);
  };

  const confirmDelete = async () => {
    if (!selectedAlert) return;

    try {
      const alertRef = doc(db, "patients", selectedAlert.id);
      await updateDoc(alertRef, {
        categoryAlert: "",
        urgencyOfAlert: "",
        locationOfAlert: "",
        alertTime: "",
      });
      setAlerts(alerts.filter((a) => a.id !== selectedAlert.id));
    } catch (error) {
      console.error("Error removing alert:", error);
    }

    closeModal();
  };

  return (
    <div className="alerts-container">
      {/* 🔹 Navigation Bar */}
      <Navbar />

      {/* 🔹 Left-Aligned Title */}
      <h1 className="alerts-header-left">Alerts</h1>

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <div>
              <strong>{alert.name}</strong> ({alert.idNumber})<br />
              <span>Location: {alert.location}</span><br />
              <span>Category: {alert.category}</span><br />
              <span>Urgency: {alert.urgency}</span><br />
              <span>Time: {alert.time}</span>
            </div>
            <button className="delete-icon" onClick={() => openModal(alert)}>
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2>Confirm Alert Deletion</h2>
        <p>Are you sure you have taken care of this alert?</p>
        <div className="modal-buttons">
          <button className="confirm-button-2" onClick={confirmDelete}>Yes</button>
          <button className="cancel-button-2" onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Alerts;
