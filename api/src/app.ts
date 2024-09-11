import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import httpStatus = require("http-status");
import routes from "./routes/v1";
import ApiError from "./utils/ApiError";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

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

app.listen(PORT, () => {
  console.log(`Server is Fire at PORT ${PORT}`);
});
