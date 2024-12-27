import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes by verifying user authentication
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId).select("isAdmin email");

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found. Please log in again.",
      });
    }

    // Attach user data to the request object
    req.user = {
      email: user.email,
      isAdmin: user.isAdmin,
      userId: decodedToken.userId,
    };

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(401).json({
      status: false,
      message: "Unauthorized. Invalid or expired token.",
    });
  }
};

// Middleware to ensure user has admin privileges
const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      status: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

// Middleware to check if the user is authenticated
const checkAuth = (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token found. Please log in.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "Invalid token. Please log in again.",
        });
      }

      // Token is valid, user is authenticated
      return res.status(200).json({
        status: true,
        message: "User is authenticated",
      });
    });
  } catch (error) {
    console.error("Error in checkAuth middleware:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error. Please try again later.",
    });
  }
};

export { protectRoute, isAdminRoute, checkAuth };
