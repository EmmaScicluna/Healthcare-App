import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./cssPages/Patients.css";
import logo from "./images/caretrackLogo.png";
import dayjs from "dayjs"; // For handling date logic
import Modal from "react-modal"; // Import Modal for custom popup

Modal.setAppElement("#root"); // Ensures accessibility

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const patientsPerPage = 9;
  const navigate = useNavigate();
  
  const todayDate = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const patientList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const updatedPatients = patientList.map((patient) => {
        if (patient.lastUpdated !== todayDate) {
          return { ...patient, medicationIntake: "No", lastUpdated: todayDate };
        }
        return patient;
      });

      setPatients(updatedPatients);

      updatedPatients.forEach(async (patient) => {
        if (patient.lastUpdated !== todayDate) {
          const patientRef = doc(db, "patients", patient.id);
          await updateDoc(patientRef, { medicationIntake: "No", lastUpdated: todayDate });
        }
      });
    };

    fetchPatients();
  }, []);

  // Open modal and store selected patient
  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };

  // Confirm Medication Intake Change
  const confirmMedicationChange = async () => {
    if (!selectedPatient) return;

    const newStatus = selectedPatient.medicationIntake === "Yes" ? "No" : "Yes";

    try {
      const patientRef = doc(db, "patients", selectedPatient.id);
      await updateDoc(patientRef, { medicationIntake: newStatus, lastUpdated: todayDate });

      // Update UI instantly
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === selectedPatient.id ? { ...patient, medicationIntake: newStatus } : patient
        )
      );
    } catch (error) {
      console.error("Error updating medication intake:", error);
    }

    closeModal();
  };

  // Filter patients by search input
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicationIntake.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Change Page
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredPatients.length / patientsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="patients-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} alt="CareTrack Logo" className="navbar-logo" />
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/patients">Patients</a></li>
          <li><a href="/tasks">Tasks</a></li>
          <li><a href="/pepper">Pepper</a></li>
          <li><a href="/help">Help</a></li>
        </ul>
        <button className="logout-button" onClick={() => navigate("/")}>Log out</button>
      </nav>

      {/* Page Content */}
      <div className="patients-content">
        <div className="patients-header">
          <h1>Patients</h1>
          <input
            type="text"
            placeholder="Search by Name, ID, Ward, or Medication"
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Patients Table */}
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>ID Number</th>
              <th>ICE Number</th>
              <th>ICE Email</th>
              <th>Ward</th>
              <th>Medication Intake</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td onClick={() => navigate(`/patient/${patient.id}`)}>{patient.name}</td>
                <td>{patient.idNumber}</td>
                <td>{patient.iceNumber}</td>
                <td>{patient.iceEmail}</td>
                <td>{patient.ward}</td>
                <td>
                  <button
                    className={`medication-button ${patient.medicationIntake === "Yes" ? "yes" : "no"}`}
                    onClick={() => openModal(patient)}
                  >
                    {patient.medicationIntake}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>❮</button>
          {Array.from({ length: Math.ceil(filteredPatients.length / patientsPerPage) }, (_, i) => (
            <button key={i + 1} className={`page-button ${currentPage === i + 1 ? "active" : ""}`} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredPatients.length / patientsPerPage)}>❯</button>
        </div>

        {/* Custom Modal for Confirmation */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
          <h2>CareTrack</h2>
          <p>
            Are you sure you want to confirm that the patient{" "}
            <strong>{selectedPatient?.name}</strong>{" "}
            {selectedPatient?.medicationIntake === "Yes"
              ? "DID NOT take the medication?"
              : "took the medication?"}
          </p>
          <button className="confirm-button" onClick={confirmMedicationChange}>Confirm</button>
          <button className="cancel-button" onClick={closeModal}>Cancel</button>
        </Modal>
      </div>
    </div>
  );
};

export default Patients;
