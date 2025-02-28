import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import SignIn from "./SignIn";
import Register from "./Register";
import Home from "./Home";
import Patients from "./Patients";
import PatientDetails from "./PatientDetails"; // Add this for individual patient pages

function AppNavigator() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patient/:id" element={<PatientDetails />} /> {/* Individual Patient Page */}
      </Routes>
    </Router>
  );
}

export default AppNavigator;
