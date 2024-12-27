import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

// Get the allowed origin from the environment variable
const allowedOrigin = process.env.ALLOWEDORIGIN;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Domain Not allowed"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
