import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons from react-icons
import "./MKMadminlogin.css";

const MKMadminlogin = () => {
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
    <div className="login-container-mkmadmin">
      <video autoPlay loop muted className="background-video">
        <source src="/assets/contact.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="login-form-mkmadmin">
        <img src="assets/spinnerbg.jpg" style={{ width: "120px", height: "60px" }} alt="Logo" />
        <h2 className="login-heading-mkmadmin">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group-mkmadmin">
            <label className="label-mkmadmin">Username</label>
            <input
              type="text"
              className="input-mkmadmin"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group-mkmadmin">
            <label className="label-mkmadmin">Password</label>
            <div className="password-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                className="input-mkmadmin"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-visibility-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>
          {error && <p className="error-message-mkmadmin">{error}</p>}
          <button type="submit" className="login-btn-mkmadmin">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default MKMadminlogin;
