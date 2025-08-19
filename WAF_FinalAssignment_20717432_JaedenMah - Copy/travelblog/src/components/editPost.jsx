import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import NavBar from "./navBar";

function EditPost() {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [post, setPost] = useState({ title: "", content: "", tags: "" });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/travelBlog/blogs/${id}`);
        if (response.data.success) {
          setPost(response.data.foundPost); 
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

// Updates form dynamically (From copilot)
const handleChange = (e) => {
  setPost({ ...post, [e.target.name]: e.target.value });
};


  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3001/travelBlog/blogs/update/${id}`,
        post,
        { withCredentials: true }
      );

      navigate("/travelBlog/blogs/myBlogs"); 
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <>
      <NavBar />

      {/* Edit Post Form  */}
      <ReactBootstrap.Container className="d-flex justify-content-center align-items-center mt-5">
        <div className="col-md-6">
          <ReactBootstrap.Form onSubmit={handleSave}>
            {/* Title Input */}
            <ReactBootstrap.Form.Group>
              <ReactBootstrap.Form.Label htmlFor="title">Title:</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Control
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
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
                value={post.content}
                onChange={handleChange}
                required
              />
            </ReactBootstrap.Form.Group>

            {/* Tags Selection */}
            <ReactBootstrap.Form.Group className="mt-3">
              <ReactBootstrap.Form.Label htmlFor="tags">Tags:</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Select
                id="tags"
                name="tags"
                value={post.tags}
                onChange={handleChange}
              >
                <option value="" disabled>Select tag</option>
                <option value="Tips">Tips</option>
                <option value="Food">Food</option>
                <option value="Accommodation">Accommodation</option>
              </ReactBootstrap.Form.Select>
            </ReactBootstrap.Form.Group>

            {/* Save Changes Button */}
            <ReactBootstrap.Container className="mt-5">
              <ReactBootstrap.Button type="submit" variant="primary" className="w-100">
                Save Changes
              </ReactBootstrap.Button>
            </ReactBootstrap.Container>
          </ReactBootstrap.Form>
        </div>
      </ReactBootstrap.Container>
    </>
  );
}

export default EditPost;
