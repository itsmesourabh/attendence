
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "../src/pages/SignInPage";
import SignUpPage from "../src/pages/SignUpPage";
import HomePage from "../src/pages/HomePage";
import UserReportPage from "../src/pages/UserReportPage";
import AdminPage from "../src/pages/AdminPage";
import AttendanceDetailPage from "../src/pages/AttendanceDetailPage";
import "./App.css";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/report" element={<UserReportPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/attendance/:attendanceId" element={<AttendanceDetailPage />} />
      
      </Routes>
    </Router>
  );
}

export default App;
