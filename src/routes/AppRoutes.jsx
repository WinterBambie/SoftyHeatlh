import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/login.jsx";
import Signup from "../pages/signup.jsx";
import DoctorDashboard from "../pages/doctor/DoctorDashboard.jsx";
import PatientDashboard from "../pages/patient/PatientDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import CreateAccount from "../pages/create-acount.jsx";
import ForgotPassword from "../pages/forgot-password.jsx";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/doctor/DoctorDashboard" element={<DoctorDashboard />} />
      <Route path="/patient/PatientDashboard" element={<PatientDashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default AppRoutes;
