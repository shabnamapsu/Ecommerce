import React from "react";
import UserComponent from "../component/users/UserComponent";
import AdminPart from "../component/admin/AdminPart";
import { Link } from "react-router-dom";

function Home() {
  const userData = JSON.parse(
    localStorage.getItem("user")
  );

  console.log("HOME USER:", userData);
  console.log("HOME ROLE:", userData?.role);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500">
            Please Login First
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Welcome */}

      <div className="max-w-7xl mx-auto">

        <div className="bg-white shadow-lg rounded-3xl p-6 mb-6">

          <h1 className="text-3xl font-bold text-indigo-600">
            Welcome, {userData.name} 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Logged in as{" "}
            <span
              className={`px-3 py-1 rounded-full text-white font-semibold ${
                userData.role === "owner"
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            >
              {userData.role}
            </span>
          </p>
         <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
        </div>

        {/* Dashboard */}

        <div className="bg-white shadow-lg rounded-3xl p-6">

          {userData.role === "user" && (
            <UserComponent />
          )}

          {userData.role === "owner" && (
            <AdminPart />
          )}

        </div>

      </div>

    </div>
  );
}

export default Home;