import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select(
        "isAdmin email"
      );

      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

// Middleware to check if the user is authenticated
const checkAuth = (req, res) => {
  try {
    const token = req.cookies?.token; // Extract token from cookies

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token found. Please log in.",
      });
    }

    // Verify the token
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

export { isAdminRoute, protectRoute ,checkAuth};
