import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSetupPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handlePaymentSetup = () => {
    if (phoneNumber.match(/^\d{10}$/)) {
      // Perform payment setup
      navigate("/dashboard");
    } else {
      alert("Please enter a valid phone number");
    }
  };

  return (
    <div>
      <h1>Payment Setup</h1>
      <select>
        <option value="mpesa">M-Pesa</option>
      </select>
      <input
        type="text"
        placeholder="Enter M-Pesa Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handlePaymentSetup}>Complete Setup</button>
    </div>
  );
};

export default PaymentSetupPage;
