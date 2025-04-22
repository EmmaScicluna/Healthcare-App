import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import dayjs from "dayjs";
import Navbar from "./Navbar";
import "./cssPages/Exercise.css";

const Exercise = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 9;

  const todayDate = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "patients"), async (snapshot) => {
      const updatedPatients = [];

      for (const docSnap of snapshot.docs) {
        const patient = { id: docSnap.id, ...docSnap.data() };

        if (!patient.lastExerciseUpdate || patient.lastExerciseUpdate !== todayDate) {
          const patientRef = doc(db, "patients", patient.id);

          await updateDoc(patientRef, {
            exerciseMood: "",
            exerciseHelpfulness: "",
            exerciseTimeLog: "",
            lastExerciseUpdate: todayDate,
          });

          updatedPatients.push({
            ...patient,
            exerciseMood: "",
            exerciseHelpfulness: "",
            exerciseTimeLog: "",
            lastExerciseUpdate: todayDate,
          });
        } else {
          updatedPatients.push(patient);
        }
      }

      setPatients(updatedPatients);
    });

    return () => unsubscribe();
  }, [todayDate]);

  const filteredPatients = patients.filter((patient) =>
    (patient.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.idNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.exerciseMood || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.exerciseHelpfulness || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredPatients.length / patientsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="exercise-container">
      <Navbar />

      <div className="patients-content">
        <div className="patients-header">
          <h1>Exercise Log</h1>
          <input
            type="text"
            placeholder="Search by Name, ID, Mood or Helpfulness"
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>ID Number</th>
              <th>Mood</th>
              <th>Helpfulness</th>
              <th>Time Submitted</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient, i) => (
              <tr key={i}>
                <td>{patient.name || "N/A"}</td>
                <td>{patient.idNumber || "N/A"}</td>
                <td>{patient.exerciseMood || "N/A"}</td>
                <td>{patient.exerciseHelpfulness || "N/A"}</td>
                <td>{patient.exerciseTimeLog || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>❮</button>
          {Array.from({ length: Math.ceil(filteredPatients.length / patientsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredPatients.length / patientsPerPage)}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
