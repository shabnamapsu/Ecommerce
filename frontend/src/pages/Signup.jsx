import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // ROLE CHANGE
  // =========================

  const handleRoleChange = (role) => {
    setData((prev) => ({
      ...prev,
      role,
    }));

    console.log("Selected Role:", role);
  };

  // =========================
  // SIGNUP
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("");

      // Check what frontend is sending
      console.log("Signup Data:", data);

      const response = await api.post(
        "/auth/signup",
        data
      );

      console.log(
        "Signup Response:",
        response.data
      );

      setMsg(
        response.data.message ||
          "Account created successfully"
      );

      // Clear form
      setData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      // Go to login
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      console.log(
        "Signup Error:",
        error.response?.data ||
          error.message
      );

      setMsg(
        error.response?.data?.message ||
          "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-5">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        {/* ================= HEADING ================= */}

        <h1 className="text-4xl font-bold text-center text-indigo-600">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Join us and start shopping today
        </p>

        {/* ================= MESSAGE ================= */}

        {msg && (
          <div className="mb-5 text-center bg-blue-100 text-blue-700 py-2 px-3 rounded-lg">
            {msg}
          </div>
        )}

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div className="relative">

            <FaUser className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          {/* EMAIL */}

          <div className="relative">

            <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          {/* PASSWORD */}

          <div className="relative">

            <FaLock className="absolute left-4 top-4 text-gray-400" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border rounded-xl py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-4 text-gray-500"
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

          {/* ================= ROLE ================= */}

          <div>

            <label className="block text-gray-700 font-semibold mb-3">
              Select Role
            </label>

            <div className="flex gap-3">

              {["user", "owner"].map(
                (role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      handleRoleChange(
                        role
                      )
                    }
                    className={`flex-1 py-3 rounded-xl font-semibold transition ${
                      data.role === role
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {role === "user"
                      ? "User"
                      : "Owner"}
                  </button>
                )
              )}

            </div>

            {/* Selected Role */}

            <p className="text-center mt-2 text-sm text-gray-500">
              Selected Role:{" "}
              <span className="font-bold text-indigo-600">
                {data.role}
              </span>
            </p>

          </div>

          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-xl font-semibold"
          >
            {loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>

        </form>

        {/* ================= DIVIDER ================= */}

        <div className="flex items-center my-6">

          <div className="flex-1 border"></div>

          <span className="mx-3 text-gray-400">
            OR
          </span>

          <div className="flex-1 border"></div>

        </div>

        {/* ================= GOOGLE ================= */}

        <button
          type="button"
          className="w-full border py-3 rounded-xl hover:bg-gray-100"
        >
          Continue with Google
        </button>

        {/* ================= LOGIN ================= */}

        <p className="text-center mt-6 text-gray-600">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;