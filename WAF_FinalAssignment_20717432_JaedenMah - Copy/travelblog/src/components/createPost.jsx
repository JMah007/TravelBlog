import { useState } from "react";
import * as ReactBootstrap from "react-bootstrap";
import axios from "axios";
import NavBar from "./navBar";
import {useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents reloading of page (From Copilot)
    try {
      const response = await axios.post(
        "http://localhost:3001/travelBlog/blogs/myBlogs/create",
        { title, content, tags },
        { withCredentials: true }
      );

      setTitle("");
      setContent("");
      setTags(""); 
      navigate(response.data.redirectTo);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      <NavBar />

      {/* Create Post Form Container */}
      <ReactBootstrap.Container className="d-flex justify-content-center align-items-center mt-5">
        <ReactBootstrap.Col md={6}>
          <ReactBootstrap.Form onSubmit={handleSubmit}>
            
            {/* Title Input */}
            <ReactBootstrap.Form.Group>
              <ReactBootstrap.Form.Label htmlFor="title">Title:</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Control
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </ReactBootstrap.Form.Group>

            {/* Content Input */}
            <ReactBootstrap.Form.Group className="mt-3">
              <ReactBootstrap.Form.Label htmlFor="content">Content:</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Control
                as="textarea"
                id="content"
                name="content"
                rows="5"
                required
                value={content}
                onChange={(event) => setContent(event.target.value)} 
              />
            </ReactBootstrap.Form.Group>

            {/* Tags Dropdown */}
            <ReactBootstrap.Form.Group className="mt-3">
              <ReactBootstrap.Form.Label htmlFor="inputTag">Tags:</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Select
                id="inputTag"
                name="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              >
                <option value="" disabled>Select a tag</option>
                <option value="Tips">Tips</option>
                <option value="Food">Food</option>
                <option value="Accommodation">Accommodation</option>
              </ReactBootstrap.Form.Select>
            </ReactBootstrap.Form.Group>

            {/* Submit Button */}
            <ReactBootstrap.Container className="mt-5">
              <ReactBootstrap.Button variant="primary" type="submit" className="w-100">
                Create Post
              </ReactBootstrap.Button>
            </ReactBootstrap.Container>
          </ReactBootstrap.Form>
        </ReactBootstrap.Col>
      </ReactBootstrap.Container>
    </>
  );
}

export default CreatePost;
