import * as ReactBootstrap from "react-bootstrap";
import NavBar from "./navBar";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3001/travelBlog/register", { username, password });
      navigate(response.data.redirectTo); 
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <>
      <NavBar />

      {/* Register Form */}
      <ReactBootstrap.Container className="mt-5">
        <h1>Register Page</h1>

        <ReactBootstrap.Form>
          {/* Username Input */}
          <ReactBootstrap.Form.Group>
            <ReactBootstrap.Form.Label htmlFor="inputUsername">Username</ReactBootstrap.Form.Label>
            <ReactBootstrap.Form.Control
              type="text"
              id="inputUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </ReactBootstrap.Form.Group>

          {/* Password Input */}
          <ReactBootstrap.Form.Group className="mt-3">
            <ReactBootstrap.Form.Label htmlFor="inputPassword">Password</ReactBootstrap.Form.Label>
            <ReactBootstrap.Form.Control
              type="password"
              id="inputPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </ReactBootstrap.Form.Group>

          {/* Register Button */}
          <ReactBootstrap.Button variant="primary" className="mt-4" onClick={handleRegister}>
            Register
          </ReactBootstrap.Button>
        </ReactBootstrap.Form>
      </ReactBootstrap.Container>
    </>
  );
}

export default RegisterPage;
