import * as ReactBootstrap from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./navBar";
import { Link } from "react-router-dom"; 


function Home() {
  const [posts, setPosts] = useState([]); 
  const [activeUsers, setActiveUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/travelBlog/blogs");
        setPosts(response.data.postsWithAuthors);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const fetchFilteredPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/travelBlog/blogs?search=${searchTerm}`);
      setPosts(response.data.postsWithAuthors);
    } catch (error) {
      console.error("Error fetching filtered blog posts:", error);
    }
  };

  return (
    <>
      <NavBar />

      {/* Main Container */}
      <ReactBootstrap.Container className="mt-5">
        <ReactBootstrap.Row>
          
          {/* Active Users Section */}
          <ReactBootstrap.Col md={3}>
            <h4>Active Users Online</h4>
            <ReactBootstrap.ListGroup>
              {activeUsers.length > 0 ? (
                activeUsers.map((user, index) => (
                  <ReactBootstrap.ListGroup.Item key={index}>{user}</ReactBootstrap.ListGroup.Item>
                ))
              ) : (
                <p>No active users currently online</p>
              )}
            </ReactBootstrap.ListGroup>
          </ReactBootstrap.Col>

          {/* Blog Articles Section */}
          <ReactBootstrap.Col md={6}>
            <h1 className="text-center">Blog Articles</h1>
            <ReactBootstrap.Row>
              {posts.map((post) => (
                <ReactBootstrap.Col key={post._id} md={12}>
                  <ReactBootstrap.Card className="shadow-sm">
                    <ReactBootstrap.Card.Body>
                      <ReactBootstrap.Card.Title>{post.title}</ReactBootstrap.Card.Title>
                      <ReactBootstrap.Card.Text>
                        {post.content.length > 50 ? post.content.substring(0, 150) + "..." : post.content}
                      </ReactBootstrap.Card.Text>
                      <ReactBootstrap.Card.Text className="text-muted">
                        Date Created: {post.formattedDate}
                      </ReactBootstrap.Card.Text>
                      <ReactBootstrap.Nav.Link as={Link} to={`/travelBlog/blogs/profile/${post.createdBy}`}className="text-primary">
                          Author: {post.authorUsername}
                      </ReactBootstrap.Nav.Link>


                      {/* Display Tags */}
                      {post.tags?.length > 0 && (
                        <div className="tags-container">
                          {post.tags.map((tag, index) => (
                            <ReactBootstrap.Badge key={index} bg="secondary" className="me-1">
                              {tag}
                            </ReactBootstrap.Badge>
                          ))}
                        </div>
                      )}

                      {/* Read More Link */}
                      <Link to={`/travelBlog/blogs/${post._id}`} className="text-decoration-none">
                          Read More
                      </Link>
                    </ReactBootstrap.Card.Body>
                  </ReactBootstrap.Card>
                </ReactBootstrap.Col>
              ))}
            </ReactBootstrap.Row>
          </ReactBootstrap.Col>

          {/* Search Blogs Section */}
          <ReactBootstrap.Col md={3}>
            <h4>Search Blogs</h4>
            <ReactBootstrap.Form className="d-flex">
              <ReactBootstrap.Form.Control
                type="search"
                name="search"
                placeholder="Search"
                aria-label="Search"
                className="me-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ReactBootstrap.Button variant="outline-success" onClick={fetchFilteredPosts}>
                Search
              </ReactBootstrap.Button>
            </ReactBootstrap.Form>
          </ReactBootstrap.Col>

        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default Home;
