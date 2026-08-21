import express from "express";
import {
  signupUser,
  loginUser,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controller/authController.js";


const router = express.Router();

router.post("/signup", signupUser);
router.post("/login" ,loginUser);
router.post("/send-otp" ,sendOtp);
router.post("/verify-otp",verifyOtp);
router.post("/reset-password", resetPassword);

export default router;