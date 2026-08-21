import instance from "../config/razorpay.js";
import crypto from "crypto";

// ============================
// CREATE RAZORPAY ORDER
// ============================

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.log("Razorpay Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
      error: error.message,
    });
  }
};

// ============================
// VERIFY PAYMENT
// ============================

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET
      )
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });

    }

    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });

  } catch (error) {
    console.log("Payment Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};