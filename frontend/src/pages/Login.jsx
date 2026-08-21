import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../api/Axios";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // ============================
  // HANDLE CHANGE
  // ============================

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // LOGIN
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg("");

    try {
      const response = await api.post("/auth/login", data);

      console.log("Login Response:", response.data);

      const { token, user, message } = response.data;

      console.log("Login User:", user);
      console.log("Login Role:", user?.role);

      // ============================
      // CHECK RESPONSE
      // ============================

      if (!token || !user) {
        setMsg("Invalid login response");
        return;
      }

      // ============================
      // SAVE TOKEN
      // ============================

      localStorage.setItem("token", token);

      // ============================
      // SAVE USER
      // ============================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setMsg(message || "Login Successful");

      // ============================
      // RESET FORM
      // ============================

      setData({
        email: "",
        password: "",
      });

      // ============================
      // ROLE BASED REDIRECT
      // ============================

      if (user.role === "owner") {
        console.log("Owner Login → Admin");

        navigate("/admincomponent", {
          replace: true,
        });

      } else if (user.role === "user") {
        console.log("User Login → Home");

        navigate("/home", {
          replace: true,
        });

      } else {
        console.log("Unknown Role:", user.role);

        setMsg("Invalid user role");
      }

    } catch (error) {
      console.log(
        "Login Error:",
        error.response?.data || error.message
      );

      setMsg(
        error.response?.data?.message ||
          "Login Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        {/* =========================
            HEADING
        ========================= */}

        <h1 className="text-4xl font-bold text-center text-indigo-600">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Login to your account
        </p>

        {/* =========================
            MESSAGE
        ========================= */}

        {msg && (
          <div className="mb-5 text-center text-sm text-indigo-600 font-medium">
            {msg}
          </div>
        )}

        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div className="relative">

            <FaEnvelope
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={data.email}
              onChange={handleChange}
              className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-600"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="relative">

            <FaLock
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              className="w-full border rounded-xl py-3 pl-11 pr-12 outline-none focus:border-indigo-600"
              required
            />

            <button
              type="button"
              className="absolute right-4 top-4 text-gray-500"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>

          </div>

          {/* FORGOT PASSWORD */}

          <div className="flex justify-end">

            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* =========================
            DIVIDER
        ========================= */}

        <div className="flex items-center my-6">

          <div className="flex-1 border"></div>

          <span className="mx-3 text-gray-400">
            OR
          </span>

          <div className="flex-1 border"></div>

        </div>

        {/* GOOGLE */}

        <button
          type="button"
          className="w-full border rounded-xl py-3 hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        {/* =========================
            SIGNUP
        ========================= */}

        <p className="text-center mt-6 text-gray-600">

          Don't have an account?{" "}

          <Link
            to="/"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;