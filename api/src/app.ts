import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & Typescript Server");
});

app.listen(PORT, () => {
  console.log(`Server is Fire at PORT ${PORT}`);
});
