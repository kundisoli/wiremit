import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Signupform from "./pages/Signup/Signupform";
import SignInForm from "./pages/SignInForm/SignInForm";
import Dashboard from "./pages/UserDashboard/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signupform />} /> 
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<Signupform />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
