import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  account,
  deposit,
  transactions,
  withdraw,
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/user/transactions", isAuthenticated, transactions);

router.post("/user/deposit", isAuthenticated, deposit);

router.post("/user/withdraw", isAuthenticated, withdraw);

router.get("/banker", isAuthenticated, account);

export default router;
