import express from "express";
import { authController } from "../../controllers";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh-token", authController.refreshToken);

router.get("/check", authController.checkAuth);

export default router;
