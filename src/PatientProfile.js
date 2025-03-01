import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./cssPages/PatientProfile.css";
import logo from "./images/caretrackLogo.png";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Ensures accessibility

const PatientProfile = () => {
  const { id } = useParams(); // Firestore document ID
  const [patient, setPatient] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      const patientRef = doc(db, "patients", id);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        setPatient({ id: patientSnap.id, ...patientSnap.data() });
      } else {
        console.error("Patient not found");
      }
    };

    fetchPatient();
  }, [id]);

  // Open modal and store selected medication
  const openModal = (medication) => {
    setSelectedMedication(medication);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedMedication(null);
  };

  // Confirm Medication Update
  const confirmMedicationUpdate = async () => {
    if (!patient || !selectedMedication) return;

    const updatedMedications = patient.medications.map((med) =>
      med.name === selectedMedication.name
        ? { ...med, taken: med.taken === "Yes" ? "No" : "Yes" }
        : med
    );

    try {
      const patientRef = doc(db, "patients", patient.id);
      await updateDoc(patientRef, { medications: updatedMedications });

      setPatient((prevPatient) => ({
        ...prevPatient,
        medications: updatedMedications,
      }));
    } catch (error) {
      console.error("Error updating medication:", error);
    }

    closeModal();
  };

  if (!patient) {
    return <p>Loading patient data...</p>;
  }

  return (
    <div className="profile-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="CareTrack Logo" className="navbar-logo" />
        </div>
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
      <div className="profile-content">
        {/* Patient Name */}
        <h1 className="profile-patient-name">{patient.name}</h1>

        {/* Patient Details Section */}
        <div className="profile-section">
          <h2>Patient Details</h2>
          <p><strong>ID Number:</strong> {patient.idNumber}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Condition:</strong> {patient.condition}</p>
          <p><strong>Ward:</strong> {patient.ward}</p>
          <p><strong>Medication Intake:</strong> {patient.medicationIntake}</p>
        </div>

        {/* Contact Information Section */}
        <div className="profile-section">
          <h2>Contact Information</h2>
          <p><strong>ICE Number:</strong> {patient.iceNumber}</p>
          <p><strong>ICE Email:</strong> {patient.iceEmail}</p>
          <p><strong>Relationship to Patient:</strong> {patient.relationship}</p>
          <p><strong>Primary Caregiver:</strong> {patient.primaryCaregiver}</p>
        </div>

        {/* Medical History Section */}
        <div className="profile-section">
          <h2>Medical History</h2>
          <ul>
            {patient.medicalHistory?.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </div>

        {/* Medications Section */}
        <div className="profile-section">
          <h2>Medications</h2>
          <table className="profile-medications-table">
            <thead>
              <tr>
                <th>Medication Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Purpose</th>
                <th>Intake</th>
              </tr>
            </thead>
            <tbody>
              {patient.medications?.map((med, index) => (
                <tr key={index}>
                  <td>{med.name}</td>
                  <td>{med.dosage}</td>
                  <td>{med.frequency}</td>
                  <td>{med.purpose}</td>
                  <td>
                    <button
                      className={`medication-button ${med.taken === "Yes" ? "yes" : "no"}`}
                      onClick={() => openModal(med)}
                    >
                      {med.taken}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirmation Modal */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
          <h2>CareTrack</h2>
          <p>
            Are you sure you want to mark the medication{" "}
            <strong>{selectedMedication?.name}</strong>{" "}
            as {selectedMedication?.taken === "Yes" ? "NOT taken?" : "taken?"}
          </p>
          <button className="confirm-button" onClick={confirmMedicationUpdate}>Confirm</button>
          <button className="cancel-button" onClick={closeModal}>Cancel</button>
        </Modal>
      </div>
    </div>
  );
};

export default PatientProfile;
