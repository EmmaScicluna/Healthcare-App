import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./cssPages/PatientProfile.css";
import logo from "./images/caretrackLogo.png";
import Modal from "react-modal";
import Navbar from "./Navbar";


Modal.setAppElement("#root"); // Ensures accessibility

const PatientProfile = () => {
  const { id } = useParams(); // Firestore document ID
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(false); // Toggle Edit Mode
  const [editedPatient, setEditedPatient] = useState(null); // Stores updated data
  const [modalIsOpen, setModalIsOpen] = useState(false); // Confirm Save Modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      const patientRef = doc(db, "patients", id);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        const patientData = patientSnap.data();

        // Ensure medications is always an array
        const formattedPatient = {
          id: patientSnap.id,
          ...patientData,
          medications: patientData.medications ? patientData.medications : [] // Default to empty array
        };

        setPatient(formattedPatient);
        setEditedPatient(formattedPatient);
      } else {
        console.error("Patient not found");
      }
    };

    fetchPatient();
  }, [id]);

  // Toggle Edit Mode
  const handleEdit = () => {
    setEditMode(!editMode);
  };

  // Handle input changes for text fields
  const handleInputChange = (field, value) => {
    setEditedPatient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle input change for medications
  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...editedPatient.medications];
    updatedMedications[index][field] = value;
    setEditedPatient((prev) => ({
      ...prev,
      medications: updatedMedications,
    }));
  };

  // Add a new medication row
  const addMedication = () => {
    setEditedPatient((prev) => ({
      ...prev,
      medications: prev.medications
        ? [...prev.medications, { name: "", dosage: "", frequency: "", purpose: "" }]
        : [{ name: "", dosage: "", frequency: "", purpose: "" }]
    }));
  };

  // Remove a medication row
  const removeMedication = (index) => {
    if (!editedPatient.medications || editedPatient.medications.length === 0) return;

    const updatedMedications = [...editedPatient.medications];
    updatedMedications.splice(index, 1);

    setEditedPatient((prev) => ({
      ...prev,
      medications: updatedMedications,
    }));
  };

  // Open Confirm Modal
  const openConfirmModal = () => {
    setModalIsOpen(true);
  };

  // Close Confirm Modal
  const closeConfirmModal = () => {
    setModalIsOpen(false);
  };

  // Save Changes to Firebase
  const saveChanges = async () => {
    if (!editedPatient) return;

    try {
      const patientRef = doc(db, "patients", editedPatient.id);
      await updateDoc(patientRef, editedPatient);

      setPatient(editedPatient); // Update UI
      setEditMode(false); // Exit Edit Mode
      closeConfirmModal(); // Close Confirmation Modal
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  if (!patient) {
    return <p>Loading patient data...</p>;
  }

  return (
    <div className="profile-container">
      {/* Navigation Bar */}
      <Navbar />

      {/* Page Content */}
      <div className="profile-content">
        {/* Edit Button */}
        <button className="edit-button" onClick={handleEdit}>
          {editMode ? "Cancel" : "Edit"}
        </button>

        {/* Save Button (Visible in Edit Mode) */}
        {editMode && (
          <button className="save-button" onClick={openConfirmModal}>
            Save Changes
          </button>
        )}

        {/* Patient Name */}
        <h1 className="profile-patient-name">
          {editMode ? (
            <input type="text" value={editedPatient.name} onChange={(e) => handleInputChange("name", e.target.value)} />
          ) : editedPatient.name}
        </h1>

        {/* Patient Details Section (Editable) */}
        <div className="profile-section">
          <h2>Patient Details</h2>
          {["idNumber", "gender", "age", "condition", "ward"].map((field) => (
            <p key={field}>
              <strong>{field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong>
              {editMode ? (
                <input
                  type="text"
                  value={editedPatient[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              ) : editedPatient[field]}
            </p>
          ))}
        </div>

        {/* Contact Information Section (Editable) */}
        <div className="profile-section">
          <h2>Contact Information</h2>
          {["iceNumber", "iceEmail", "relationship", "primaryCaregiver"].map((field) => (
            <p key={field}>
              <strong>{field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong>
              {editMode ? (
                <input
                  type="text"
                  value={editedPatient[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              ) : editedPatient[field]}
            </p>
          ))}
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
                {editMode && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {editedPatient.medications?.map((med, index) => (
                <tr key={index}>
                  {["name", "dosage", "frequency", "purpose"].map((field) => (
                    <td key={field}>
                      {editMode ? (
                        <input
                          type="text"
                          value={med[field]}
                          onChange={(e) => handleMedicationChange(index, field, e.target.value)}
                        />
                      ) : med[field]}
                    </td>
                  ))}
                  {editMode && <td><button onClick={() => removeMedication(index)}>Remove</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
          {editMode && <button onClick={addMedication}>Add Medication</button>}
        </div>

        {/* Confirmation Modal */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeConfirmModal} className="modal">
          <h2>Confirm Changes</h2>
          <p>Are you sure you want to update this patient's information?</p>
          <button className="confirm-button" onClick={saveChanges}>Confirm</button>
          <button className="cancel-button" onClick={closeConfirmModal}>Cancel</button>
        </Modal>
      </div>
    </div>
  );
};

export default PatientProfile;
