import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import Navbar from "./Navbar";
import "./cssPages/Exercise.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Exercise = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    const fetchLogs = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const allLogs = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.exerciseTimeLog && data.exerciseMood) {
          const parsedDate = dayjs(data.exerciseTimeLog, "DD/MM/YYYY, HH:mm:ss");
          if (parsedDate.isValid()) {
            allLogs.push({
              id: doc.id,
              name: data.name || "N/A",
              idNumber: data.idNumber || "N/A",
              exerciseMood: data.exerciseMood,
              exerciseHelpfulness: data.exerciseHelpfulness || "N/A",
              exerciseTimeLog: parsedDate.format("DD/MM/YYYY, HH:mm:ss"),
              timestamp: parsedDate.toDate()
            });
          }
        }
      });

      // Sort by most recent
      allLogs.sort((a, b) => b.timestamp - a.timestamp);
      setLogs(allLogs);
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) =>
    (log.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.idNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.exerciseMood || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.exerciseHelpfulness || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="exercise-container">
      <Navbar />
      <div className="exercise-content">
        <div className="exercise-header">
          <h1 className="exercise-title">Exercise Logs</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by Name, ID, Mood or Helpfulness"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="exercise-table">
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
            {currentLogs.map((log, i) => (
              <tr key={i}>
                <td>{log.name}</td>
                <td>{log.idNumber}</td>
                <td>{log.exerciseMood}</td>
                <td>{log.exerciseHelpfulness}</td>
                <td>{log.exerciseTimeLog}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ❮
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
