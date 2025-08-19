import { AuthProvider } from "./controllers/authContext.js"; // Import Auth Context
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login.jsx";
import RegisterPage from "./components/register.jsx";
import Home from "./components/home.jsx";
import Post from "./components/post.jsx";
import MyBlogs from "./components/myBlogs.jsx";
import CreatePost from "./components/createPost.jsx";
import EditPost from "./components/editPost.jsx";
import Profile from "./components/profile.jsx";
import SubManager from "./components/subManager.jsx";

function App() {
  return (
    <AuthProvider> 
        <Routes> 
          <Route path="/travelBlog/login" element={<LoginPage />} /> 
          <Route path="/travelBlog/register" element={<RegisterPage />} /> 
          <Route path="/travelBlog/home" element={<Home />} /> 
          <Route path="/travelBlog/subscriptions" element={<SubManager />} /> 
          <Route path="/travelBlog/blogs/:id" element={<Post />} />
          <Route path="/travelBlog/blogs/edit/:id" element={<EditPost />} />
          <Route path="/travelBlog/blogs/myBlogs" element={<MyBlogs />} />
          <Route path="/travelBlog/blogs/myBlogs/create" element={<CreatePost />} />
          <Route path="/travelBlog/blogs/profile/:id" element={<Profile />} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
