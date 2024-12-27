import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connection established");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export const createJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
};
