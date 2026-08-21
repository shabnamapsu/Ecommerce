import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";

function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100 px-4">

      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center">

        {/* Success Icon */}
        <div className="flex justify-center">
          <FaCheckCircle className="text-green-500 text-8xl animate-bounce" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mt-6">
          Order Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mt-4 leading-7">
          Thank you for shopping with us.
          <br />
          Your order has been placed successfully.
        </p>

        {/* Order Box */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-8">
          <h3 className="text-lg font-semibold text-green-700">
            Estimated Delivery
          </h3>

          <p className="text-gray-700 mt-2">
            Within 3 - 5 Business Days
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">

          <Link
            to="/"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex justify-center items-center gap-2 font-semibold transition"
          >
            <FaHome />
            Home
          </Link>

          <Link
            to="/admin-product"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl flex justify-center items-center gap-2 font-semibold transition"
          >
            <FaShoppingBag />
            Shop More
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Success;