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
    // Extract token from cookies
    let token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token found. Please login.",
      });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "Token is invalid or expired. Please login again.",
        });
      }

      // If token is valid, proceed
      req.user = decodedToken; // Attach decoded token to the request
      next();
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};

export { isAdminRoute, protectRoute ,checkAuth};
