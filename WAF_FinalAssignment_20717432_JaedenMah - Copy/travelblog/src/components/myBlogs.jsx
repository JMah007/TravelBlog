import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import NavBar from "./navBar";

function MyBlogs() {
  const [posts, setPosts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchPosts = async () => {

      try {
        const response = await axios.get("http://localhost:3001/travelBlog/blogs/myBlogs", { withCredentials: true });
        setPosts(response.data.posts || []);

      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const fetchFilteredPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/travelBlog/blogs/myBlogs?search=${searchTerm}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching filtered blog posts:", error);
    }
  };

  return (
    <>
      <NavBar />

      {/* Page Title */}
      <ReactBootstrap.Container className="mt-5">
        <h1 className="text-center">My Posts</h1>
      </ReactBootstrap.Container>

      {/* Search Bar */}
      <ReactBootstrap.Container className="d-flex justify-content-center mt-4">
        <ReactBootstrap.Form className="d-flex w-50">
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
      </ReactBootstrap.Container>

      {/* Create Post Button */}
      <ReactBootstrap.Container className="d-flex justify-content-center mt-3">
        <Link to="/travelBlog/blogs/myBlogs/create">
          <ReactBootstrap.Button variant="primary" size="lg" className="w-100">
            Create Post
          </ReactBootstrap.Button>
        </Link>
      </ReactBootstrap.Container>

      {/* Blog Posts */}
      <ReactBootstrap.Container className="mt-5">
        <ReactBootstrap.Row>
          {posts.map((post) => (
            <ReactBootstrap.Col key={post._id} md={4}>
              <ReactBootstrap.Card className="shadow-sm">
                <ReactBootstrap.Card.Body>
                  <ReactBootstrap.Card.Title>{post.title}</ReactBootstrap.Card.Title>
                  <ReactBootstrap.Card.Text>
                    {post.content.length > 50 ? post.content.substring(0, 150) + "..." : post.content}
                  </ReactBootstrap.Card.Text>
                  <ReactBootstrap.Card.Text className="text-muted">
                    Created on: {post.formattedDate}
                  </ReactBootstrap.Card.Text>

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
      </ReactBootstrap.Container>
    </>
  );
}

export default MyBlogs;
