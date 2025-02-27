// src/FirestoreService.js
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Function to add a new caregiver task
export const addTask = async (task) => {
  try {
    const docRef = await addDoc(collection(db, "caregiverTasks"), task);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Function to get all caregiver tasks
export const getTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "caregiverTasks"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
};
