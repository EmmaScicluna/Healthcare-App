import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const docRef = doc(db, "patients", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPatient(docSnap.data());
    };

    fetchPatient();
  }, [id]);

  return patient ? (
    <div>
      <h1>{patient.name}</h1>
      <p>ID: {patient.idNumber}</p>
      {/* More patient details */}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default PatientDetails;
