import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
// import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/send-otp", {
        email,
      });

      alert(data.message);

      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      alert(data.message);

      setStep(3);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Password not matched");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });

      alert(data.message);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 p-2 rounded-full hover:bg-gray-100"
          >
            <IoArrowBack size={24} />
          </button>

          <h2 className="text-3xl font-bold text-center text-indigo-600">
            Forgot Password
          </h2>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Recover your account in 3 easy steps
          </p>

          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-xl p-3"
              />

              <button
                onClick={handleSendOtp}
                className="w-full bg-indigo-600 text-white mt-5 py-3 rounded-xl"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}
          {/* STEP 2 */}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-xl p-3"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white mt-5 py-3 rounded-xl"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-xl p-3 mb-4"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mb-4 text-indigo-600"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-xl p-3 mb-4"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="mb-4 text-indigo-600"
              >
                {showConfirm ? "Hide Password" : "Show Password"}
              </button>

              <button
                onClick={handleResetPassword}
                className="w-full bg-red-600 text-white py-3 rounded-xl"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
