import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import SignIn from "./SignIn";
import Register from "./Register"; // Import Register Page

function AppNavigator() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default AppNavigator;
