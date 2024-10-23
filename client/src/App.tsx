import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignupPage from "./components/RegistrationPage/SignupPage";
import SetupPage from "./components/SetupPage/SetupPage";
import PaymentSetupPage from "./components/PaymentSetupPage/PaymentSetupPage";
import DashboardPage from "./components/DashboardPage/DashboardPage";
import LoginPage from "./components/RegistrationPage/LoginPage";

const App: React.FC = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* New User Flow */}
        <Route
          path="/"
          element={<SignupPage onSignup={() => setIsSignedUp(true)} />}
        />
        <Route
          path="/setup"
          element={isSignedUp ? <SetupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/payment-setup"
          element={isSignedUp ? <PaymentSetupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={
            isSignedUp || isLoggedIn ? <DashboardPage /> : <Navigate to="/" />
          }
        />

        {/* Returning User Flow */}
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
