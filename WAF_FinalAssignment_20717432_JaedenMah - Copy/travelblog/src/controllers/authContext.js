import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

useEffect(() => {
  axios.get("http://localhost:3001/travelBlog/session", { withCredentials: true })
    .then((res) => {
      if (res.data.success) {
        setUser(res.data.user); 
      }
    })
    .catch(() => setUser(null));
}, []);


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
