import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/user/new", register);

router.post("/user/login", login);

router.get("/user/logout", isAuthenticated, logout);

router.get("/user/profile", isAuthenticated, getUserProfile);

export default router;
