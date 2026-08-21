import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../utils/mails.js";

// ====================== SIGNUP ======================

// ====================== SIGNUP ======================

export const signupUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    console.log("SIGNUP BODY:", req.body);

    // ======================
    // VALIDATION
    // ======================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // ======================
    // ROLE VALIDATION
    // ======================

    if (role !== "user" && role !== "owner") {
      return res.status(400).json({
        message: "Invalid role. Select user or owner",
      });
    }

    // ======================
    // CHECK USER
    // ======================

    const userExist = await User.findOne({
      email,
    });

    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ======================
    // HASH PASSWORD
    // ======================

    const hashPassword = await bcrypt.hash(
      password,
      10
    );

    // ======================
    // CREATE USER
    // ======================

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: role,
    });

    console.log("CREATED USER:", user);

    // ======================
    // RESPONSE
    // ======================

    res.status(201).json({
      success: true,
      message: "User created successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
// ====================== LOGIN ======================

// ====================== LOGIN ======================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // ======================
    // JWT
    // ======================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ======================
    // RESPONSE
    // ======================

    res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ====================== SEND OTP ======================

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();

    await sendOtpMail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// ====================== VERIFY OTP ======================

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user.resetOtp !== otp ||
      !user.otpExpire ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or Expired OTP",
      });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

// ====================== RESET PASSWORD ======================

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isOtpVerified) {
      return res.status(400).json({
        message: "OTP not verified",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    user.isOtpVerified = false;
    user.resetOtp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
};