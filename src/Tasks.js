import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./cssPages/Tasks.css";
import logo from "./images/caretrackLogo.png";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", deadline: "", status: "Not Started" });
  const [editTask, setEditTask] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    };

    fetchTasks();
  }, []);

  // Handle adding a new task
  const addTask = async () => {
    if (newTask.name.trim() === "" || newTask.deadline === "") return;

    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
      setNewTask({ name: "", deadline: "", status: "Not Started" });
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle updating a task
  const updateTask = async () => {
    if (!editTask) return;

    try {
      const taskRef = doc(db, "tasks", editTask.id);
      await updateDoc(taskRef, editTask);
      setTasks(tasks.map((task) => (task.id === editTask.id ? editTask : task)));
      setEditTask(null);
      setModalIsOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Open confirmation modal for task deletion
  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setConfirmModalOpen(true);
  };

  // Handle confirming a task as done (delete)
  const deleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const taskRef = doc(db, "tasks", taskToDelete.id);
      await deleteDoc(taskRef);
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="tasks-container">
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
          <li><a href="/exercise">Exercise</a></li>
        </ul>
        <a href="/" className="logout-button">Log out</a>
      </nav>

      {/* Page Content */}
      <div className="tasks-content">
        <div className="tasks-header">
          <h1>Tasks</h1>
          <button className="add-task-btn" onClick={() => setAddModalOpen(true)}>+ Add Task</button>
        </div>

        {/* Task List */}
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <input
              type="checkbox"
              onChange={() => confirmDeleteTask(task)}
            />
            <span>{task.name}</span>
            <span className="deadline-box">{task.deadline}</span>
            <span className={`status ${task.status.replace(" ", "-").toLowerCase()}`}>{task.status}</span>
            <button className="edit-btn" onClick={() => { setEditTask(task); setModalIsOpen(true); }}>Edit</button>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={addModalOpen} onRequestClose={() => setAddModalOpen(false)} className="modal">
        <h2>Add Task</h2>
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
        />
        <input
          type="date"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <div className="modal-buttons">
          <button className="save-button-2" onClick={addTask}>Add</button>
          <button className="cancel-button-2" onClick={() => setAddModalOpen(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal">
        <h2>Edit Task</h2>
        <input
          type="text"
          value={editTask?.name || ""}
          onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
        />
        <input
          type="date"
          value={editTask?.deadline || ""}
          onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
        />
        <select
          value={editTask?.status || "Not Started"}
          onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <div className="modal-buttons">
          <button className="save-button-2" onClick={updateTask}>Save</button>
          <button className="cancel-button-2" onClick={() => setModalIsOpen(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModalOpen} onRequestClose={() => setConfirmModalOpen(false)} className="modal">
        <h2>Confirm Task Completion</h2>
        <p>Are you sure you want to remove this task?</p>
        <div className="modal-buttons">
          <button className="confirm-button-2" onClick={deleteTask}>Yes</button>
          <button className="cancel-button-2" onClick={() => setConfirmModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;
