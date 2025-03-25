import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import SignIn from "./SignIn";
import Register from "./Register";
import Home from "./Home";
import Patients from "./Patients";
import PatientProfile from "./PatientProfile"; // Ensures individual patient pages work
import Tasks from "./Tasks"; // Tasks page
import Pepper from "./Pepper"; // Pepper page
import Exercise from "./Exercise"; // Exercise page         

function AppNavigator() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patient/:id" element={<PatientProfile />} /> {/* Individual Patient Page */}
        <Route path="/tasks" element={<Tasks />} /> 
        <Route path="/pepper" element={<Pepper />} />
        <Route path="/exercise" element={<Exercise />} />
      </Routes>
    </Router>
  );
}

export default AppNavigator;
