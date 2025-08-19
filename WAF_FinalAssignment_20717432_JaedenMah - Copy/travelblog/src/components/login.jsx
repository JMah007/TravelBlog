import * as ReactBootstrap from "react-bootstrap";
import NavBar from "./navBar";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../controllers/authContext.js";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    
    try {
      
      const response = await axios.post("http://localhost:3001/travelBlog/login",{ username, password },{ withCredentials: true });
      
      setUser(response.data.user);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("token", response.data.token); 
      navigate(response.data.redirectTo); 
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed, please try again.");
    }
  };

  return (
    <>
      <NavBar />

      {/* Page Container */}
      <ReactBootstrap.Container className="mt-5">
        <h1>Login Page</h1>
        
        {/* Login Form */}
        <ReactBootstrap.Form>
          <ReactBootstrap.Form.Group>
            <ReactBootstrap.Form.Label htmlFor="username">Username</ReactBootstrap.Form.Label>
            <ReactBootstrap.Form.Control
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </ReactBootstrap.Form.Group>

          <ReactBootstrap.Form.Group>
            <ReactBootstrap.Form.Label htmlFor="password">Password</ReactBootstrap.Form.Label>
            <ReactBootstrap.Form.Control
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </ReactBootstrap.Form.Group>

          <ReactBootstrap.Button variant="primary" onClick={handleLogin}>
            Login
          </ReactBootstrap.Button>
        </ReactBootstrap.Form>
      </ReactBootstrap.Container>
    </>
  );
}

export default LoginPage;
