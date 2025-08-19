import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import NavBar from "./navBar";
import { useAuth } from "../controllers/authContext"; 

function BlogPost() {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [postsUser, setPostsUser] = useState(null);
  const [subscribed, setSubscribed] = useState("Subscribe");
  const { user } = useAuth(); 
  const navigate = useNavigate(); 
    
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/travelBlog/blogs/${id}`);
        setPost(response.data.foundPost || null); 
        setPostsUser(response.data.postCreatedBy || null);
      } catch (error) {
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const subResponse = await axios.post(
          `http://localhost:3001/travelBlog/blogs/subscribe/${postsUser._id}`, 
          { subscriberId: user._id }
        );
        setSubscribed(subResponse.data.isSubscribed ? "Unsubscribe" : "Subscribe");
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    checkSubscription();
  }, [postsUser._id, user._id]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/travelBlog/blogs/delete/${id}`, 
        { withCredentials: true }
      ); 

      navigate(response.data.redirectTo); 
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSubscription = async () => {
    try {
      if (subscribed === "Unsubscribe") {
        const response = await axios.delete(
          `http://localhost:3001/travelBlog/blogs/unsubscribe`,
          {
            data: { subscriberId: user._id, targetUserId: postsUser._id }, 
            withCredentials: true
          }
        );
        
        setSubscribed(response.data.isSubscribed ? "Unsubscribe" : "Subscribe");
      } else {
        await axios.post(
          `http://localhost:3001/travelBlog/blogs/subscribe/${postsUser._id}`, 
          { subscriberId: user._id }, 
          { withCredentials: true }
        );

        setSubscribed("Unsubscribe");
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  if (!post) return <h2 className="text-center">Loading...</h2>;

  return (
    <>
      <NavBar />
      <ReactBootstrap.Container className="mt-3 d-flex justify-content-between">
        <Link to="/travelBlog/home" className="btn btn-primary ms-4">
          Back
        </Link>
        <Link to={`/travelBlog/blogs/profile/${postsUser._id}`} className="btn btn-primary me-2">
          {postsUser.username}
        </Link>
        
        <button onClick={handleSubscription} className="btn btn-danger">
          {subscribed}
        </button>

        {user && post && (() => {
          return user._id?.toString() === post.createdBy?.toString();
        })() && (
          <div className="d-flex me-4">
            <Link to={`/travelBlog/blogs/edit/${post._id}`} className="btn btn-primary me-2">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        )}
      </ReactBootstrap.Container>

      <ReactBootstrap.Container className="mt-5 d-flex flex-column align-items-center">
        <h1 className="text-center">{post.title}</h1>
        <div className="mt-5">
          <p className="text-center">{post.content}</p>
        </div>
      </ReactBootstrap.Container>
    </>
  );
}

export default BlogPost;