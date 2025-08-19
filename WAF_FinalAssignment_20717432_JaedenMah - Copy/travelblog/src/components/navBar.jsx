import * as ReactBootstrap from "react-bootstrap";
import { Link } from "react-router-dom"; 
import { useAuth } from "../controllers/authContext.js"; 
import axios from "axios";
import { FaBell } from "react-icons/fa"; 
import { Dropdown } from "react-bootstrap"; 

function NavBar() {
  const { user, setUser } = useAuth(); 

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/travelBlog/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(null);
        localStorage.removeItem("username");
        window.location.href = response.data.redirectTo;
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ReactBootstrap.Navbar bg="dark" variant="dark" expand="lg">
      <ReactBootstrap.Container>

        <ReactBootstrap.Navbar.Brand as={Link} to="/travelBlog/home">
          Travel Blog
        </ReactBootstrap.Navbar.Brand>
        <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
        <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
          
          <ReactBootstrap.Nav className="me-auto">
            <ReactBootstrap.Nav.Link as={Link} to="/travelBlog/home">
              Home
            </ReactBootstrap.Nav.Link>
          </ReactBootstrap.Nav>

          <ReactBootstrap.Nav className="ms-auto d-flex align-items-center">
            {user && (
              <Dropdown className="me-3">
                <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ color: "white" }}>
                  <FaBell size={20} />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {/* notifs loop goes here */}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {user ? (
              <>
                <ReactBootstrap.Nav.Link as={Link} to={`/travelBlog/blogs/profile/${user._id}`}>
                  {user?.username}
                </ReactBootstrap.Nav.Link>
                <ReactBootstrap.Nav.Link as={Link} to="/travelBlog/subscriptions">
                  Subscriptions
                </ReactBootstrap.Nav.Link>
                <ReactBootstrap.Nav.Link as={Link} to="/travelBlog/blogs/myBlogs">
                  MyBlogs
                </ReactBootstrap.Nav.Link>
                <ReactBootstrap.Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </ReactBootstrap.Button>
              </>
            ) : (
              <>
                <ReactBootstrap.Nav.Link as={Link} to="/travelBlog/login">
                  Login
                </ReactBootstrap.Nav.Link>
                <ReactBootstrap.Nav.Link as={Link} to="/travelBlog/register">
                  Register
                </ReactBootstrap.Nav.Link>
              </>
            )}
          </ReactBootstrap.Nav>
        </ReactBootstrap.Navbar.Collapse>
      </ReactBootstrap.Container>
    </ReactBootstrap.Navbar>
  );
}

export default NavBar;