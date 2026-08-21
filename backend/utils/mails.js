import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("Mail Error:", err);
  } else {
    console.log("Mail Server Ready");
  }
});

export const sendOtpMail = async (to, otp) => {
  return await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "OTP Verification",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};
console.log("EMAIL =", process.env.EMAIL);
console.log("PASS LENGTH =", process.env.PASS.length);