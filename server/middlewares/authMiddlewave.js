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
const checkAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;  // Extract token from cookies

    if (token) {
      // Verify the token using JWT
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({
            status: false,
            message: "Token is invalid. Please login again.",
          });
        }

        // If token is valid, return a success response
        res.status(200).json({
          status: true,
          message: "User is authenticated",
        });
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "No token found. Please login.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      status: false,
      message: "Token verification failed. Please login again.",
    });
  }
};
export { isAdminRoute, protectRoute ,checkAuth};