import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupPageProps {
  onSignup: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    if (username && password) {
      onSignup();
      navigate("/setup");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupPage;
