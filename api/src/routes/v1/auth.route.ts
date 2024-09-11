import express from "express";
import { authController } from "../../controllers";

const router = express.Router();

router.get("/register", authController.register);

router.get("/login", authController.login);

export default router;
