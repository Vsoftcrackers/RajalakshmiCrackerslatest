import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons from react-icons
import "./adminlogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const correctUsername = "rajalakshmicrackersad@gmail.com"; // Correct username
  const correctPassword = "Jvraja@1994"; // Correct password

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === correctUsername && password === correctPassword) {
      navigate("/adminproducts"); // Redirect to admin page if credentials match
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="admin-login-container">
      <video autoPlay loop muted className="admin-background-video">
        <source src="/assets/contact.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="admin-login-form">
        <img src="assets/spinnerbg.jpg" style={{ width: "120px", height: "60px" }} alt="Logo" />
        <h2 className="admin-login-heading">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <label className="admin-label">Username</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-group">
            <label className="admin-label">Password</label>
            <div className="admin-password-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                className="admin-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="admin-password-visibility-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>
          {error && <p className="admin-error-message">{error}</p>}
          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
