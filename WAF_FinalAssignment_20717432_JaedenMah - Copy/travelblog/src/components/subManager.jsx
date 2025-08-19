import { useState, useEffect } from "react";
import axios from "axios";
import * as ReactBootstrap from "react-bootstrap";
import NavBar from "./navBar";
import { useAuth } from "../controllers/authContext"; 

const SubManager = () => {
    const { user } = useAuth(); 
    const [subscribedTo, setSubscribedTo] = useState([]);
        
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/travelBlog/blogs/subscribedTo/${user._id}`, {withCredentials: true});
                setSubscribedTo(response.data.listSubscribedTo || null); 
                 
            } catch (error) {
                console.error("Error fetching list of users subscribed to:", error);
            }
    };

    fetchUsers();
    }, [user._id]);

  
    return (
    <>
        <NavBar />
        <ReactBootstrap.Container className="mt-4">
        <h3 className="text-center">Subscriptions</h3>
        
        {subscribedTo.length === 0 ? (
            <p className="text-center text-muted">You're not subscribed to anyone yet.</p>
        ) : (
            <ReactBootstrap.ListGroup>
                {subscribedTo.map((subscription, index) => (
                <ReactBootstrap.ListGroup.Item key={index} className="d-flex justify-content-between">
                    {/* Correctly access the nested username */}
                    <span>{subscription.targetUserId.username}</span>
                </ReactBootstrap.ListGroup.Item>
                ))}

            </ReactBootstrap.ListGroup>
        )}
        </ReactBootstrap.Container>
    </>
    );

};

export default SubManager;