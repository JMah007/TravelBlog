import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import NavBar from "./navBar";

function Profile() {
  const { id } = useParams(); 
  const [profileUser, setProfileUser] = useState(null);
  const [count, setPostCount] = useState(null);
  const [posts, setPosts] = useState([]); 
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    const fetchProfilePosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/travelBlog/blogs/profile/${id}`);
        setProfileUser(response.data.profileUser || null);
        setPosts(response.data.posts || []);
        setPostCount(response.data.posts ? response.data.posts.length : 0);
      } catch (error) {
        console.error("Error fetching user profile posts:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/travelBlog/blogs/users");
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchProfilePosts();
    fetchUsers();
  }, [id]);

  if (!profileUser) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <>
      <NavBar />
      <ReactBootstrap.Container className="mt-5">
        <h1 className="text-center">{profileUser.username}</h1>
        <h3 className="text-center">Number of posts: {count}</h3>

        {posts.length > 0 ? (
          <ReactBootstrap.ListGroup className="mt-4">
            {posts.map((post) => (
              <ReactBootstrap.ListGroup.Item key={post._id}>
                <Link to={`/travelBlog/blogs/${post._id}`} className="text-decoration-none">
                  <h5>{post.title}</h5>
                  <p>{post.formattedDate}</p>
                </Link>
              </ReactBootstrap.ListGroup.Item>
            ))}
          </ReactBootstrap.ListGroup>
        ) : (
          <p className="text-center mt-4">No posts available</p>
        )}
      </ReactBootstrap.Container>

      {profileUser.isAdmin && (
        <ReactBootstrap.Container className="mt-5">
          <h2 className="text-center">All Registered Users</h2>
          <ReactBootstrap.ListGroup className="mt-4">
            {users.map((user) => (
              <ReactBootstrap.ListGroup.Item key={user._id}>
                <Link to={`/travelBlog/blogs/profile/${user._id}`} className="text-decoration-none">
                  <h5>{user.username}</h5>
                </Link>
              </ReactBootstrap.ListGroup.Item>
            ))}
          </ReactBootstrap.ListGroup>
        </ReactBootstrap.Container>
      )}
    </>
  );
}

export default Profile;
