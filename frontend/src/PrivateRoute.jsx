import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

// Check authentication function using the existing check-auth endpoint
const checkAuth = async () => {
  try {
    const response = await axios.get("http://localhost:8800/api/user/check-auth", {
      withCredentials: true, // Sends cookies with the request
    });

    return response.data.status === true; // Assuming the response contains a "status" field indicating authentication
  } catch (error) {
    console.error("Error checking auth:", error);
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const checkUserAuth = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    checkUserAuth();
  }, []);
  
  if (isAuthenticated === null) {
    console.log(isAuthenticated);
    return <div>Loading...</div>; // Show a loading state while checking authentication
  }

  if (!isAuthenticated) {
    return <Navigate to="/log-in" />; // Redirect to login if not authenticated
  }

  return children; // Render the child components if authenticated
};

export default PrivateRoute;
