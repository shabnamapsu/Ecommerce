import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaStore,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">

      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 md:grid-cols-2 gap-10">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <FaStore className="text-4xl text-indigo-500" />
            <h2 className="text-3xl font-bold text-white">
              ShopHub
            </h2>
          </div>

          <p className="leading-7 text-gray-400">
            ShopHub helps customers discover the best shops near them.
            Browse stores, explore products, and enjoy an easy shopping
            experience.
          </p>

          <div className="flex gap-4 mt-6">

            <div className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-full cursor-pointer duration-300">
              <FaFacebookF />
            </div>

            <div className="bg-pink-600 hover:bg-pink-700 p-3 rounded-full cursor-pointer duration-300">
              <FaInstagram />
            </div>

            <div className="bg-sky-500 hover:bg-sky-600 p-3 rounded-full cursor-pointer duration-300">
              <FaTwitter />
            </div>

            <div className="bg-blue-700 hover:bg-blue-800 p-3 rounded-full cursor-pointer duration-300">
              <FaLinkedinIn />
            </div>

            <div className="bg-gray-700 hover:bg-gray-800 p-3 rounded-full cursor-pointer duration-300">
              <FaGithub />
            </div>

          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3">

            <li className="hover:text-indigo-400 cursor-pointer">
              Home
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              Shops
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              Products
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              Wishlist
            </li>

            <li className="hover:text-indigo-400 cursor-pointer">
              Cart
            </li>

          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-xl font-bold text-white mb-5">
            Customer Support
          </h3>

          <ul className="space-y-3">

            <li>Help Center</li>

            <li>Privacy Policy</li>

            <li>Terms & Conditions</li>

            <li>Refund Policy</li>

            <li>FAQs</li>

          </ul>
        </div>

        {/* Contact */}
        <div>

          <h3 className="text-xl font-bold text-white mb-5">
            Contact Us
          </h3>

          <div className="space-y-4">

            <p className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-red-500" />
              Rewa, Madhya Pradesh, India
            </p>

            <p className="flex items-center gap-3">
              <FaEnvelope className="text-yellow-400" />
              support@shophub.com
            </p>

            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-green-500" />
              +91 9876543210
            </p>

          </div>

        </div>

      </div>

      {/* Newsletter */}
      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-5">

          <div>

            <h3 className="text-xl text-white font-bold">
              Subscribe to our Newsletter
            </h3>

            <p className="text-gray-400">
              Get latest offers and shop updates.
            </p>

          </div>

          <div className="flex w-full md:w-auto">

            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-l-xl w-full md:w-80 outline-none text-black"
            />

            <button className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-r-xl font-semibold">
              Subscribe
            </button>

          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700">

        <div className="max-w-7xl mx-auto py-5 px-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-400 text-center">
            © {new Date().getFullYear()} ShopHub. All Rights Reserved.
          </p>

          <p className="text-gray-500 mt-3 md:mt-0">
            Made with ❤️ using React & Tailwind CSS
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;