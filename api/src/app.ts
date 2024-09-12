import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import httpStatus from "http-status";
import routes from "./routes/v1";
import ApiError from "./utils/ApiError";
import connectDB from "./db/connect";
import cors from "cors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI as string;

// Use CORS middleware
app.use(cors());

// Parse json request body
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & Typescript Server");
});

// Reroute all API request starting with "/v1" route
app.use("/v1", routes);

// Handles 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Error handler
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
});

const start = async () => {
  try {
    await connectDB(MONGO_URI!);
    app.listen(PORT, () => {
      console.log(`Server is Fire at PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
