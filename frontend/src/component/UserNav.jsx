import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaUserCircle,
  FaStore,
  FaHome,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";


function UserNav() {
  const navigate = useNavigate();

  // ==============================
  // STATES
  // ==============================

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // ==============================
  // GET USER FROM LOCAL STORAGE
  // ==============================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        console.log("Navbar User:", parsedUser);

        setUser(parsedUser);
      }
    } catch (error) {
      console.log("User Parse Error:", error);
    }
  }, []);

  // ==============================
  // TOKEN
  // ==============================

  const token = localStorage.getItem("token");

  const isLogin = !!token;

  // ==============================
  // USER ID
  // ==============================

  const userId =
    user?._id ||
    user?.id ||
    localStorage.getItem("userId");

  // ==============================
  // LOAD CART
  // ==============================

  const loadCart = async () => {
    try {
      if (!userId || !token) {
        setCartCount(0);
        return;
      }

      console.log("Loading Cart For User:", userId);

      const { data } = await api.get(
        `/cart/${userId}`
      );

      console.log(
        "Navbar Cart Response:",
        data
      );

      // Backend response:
      //
      // {
      //   success: true,
      //   cart: {
      //      items: [...]
      //   }
      // }

      const items =
        data?.cart?.items || [];

      // Total quantity
      const total = items.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0),
        0
      );

      console.log(
        "Navbar Cart Count:",
        total
      );

      setCartCount(total);

      localStorage.setItem(
        "cartCount",
        total.toString()
      );

    } catch (error) {
      console.log(
        "Navbar Cart Error:",
        error.response?.data ||
          error.message
      );

      setCartCount(0);
    }
  };

  // ==============================
  // LOAD CART
  // ==============================

  useEffect(() => {
    if (userId && token) {
      loadCart();
    } else {
      setCartCount(0);
    }

    // Cart update event
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener(
      "cartUpdate",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdate",
        handleCartUpdate
      );
    };
  }, [userId, token]);

  // ==============================
  // LOGOUT
  // ==============================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartCount");

    setUser(null);
    setCartCount(0);

    window.dispatchEvent(
      new Event("cartUpdate")
    );

    navigate("/login");
  };

  // ==============================
  // RETURN
  // ==============================

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-5">

        <div className="h-20 flex items-center justify-between">

          {/* ================================= */}
          {/* LOGO */}
          {/* ================================= */}

          <Link
            to="/"
            className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-indigo-600"
          >
            <FaStore />

            <span>
              ShopKart
            </span>
          </Link>

          {/* ================================= */}
          {/* DESKTOP MENU */}
          {/* ================================= */}

          <div className="hidden md:flex items-center gap-7">

            {/* HOME */}

            <Link
              to="/home"
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
            >
              <FaHome />

              <span>
                Home
              </span>
            </Link>

            {/* PRODUCTS */}

            <Link
  to="/products"
  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-semibold transition"
>
  <FaBoxOpen />
  <span>Products</span>
</Link>

            {/* WISHLIST */}

            <Link
              to="/wishlist"
              className="relative text-gray-700 hover:text-red-500 transition"
              title="Wishlist"
            >
              <FaHeart className="text-2xl" />
            </Link>

            {/* CART */}

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-indigo-600 transition"
              title="Cart"
            >

              <FaShoppingCart className="text-2xl" />

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}

            </Link>

          </div>

          {/* ================================= */}
          {/* RIGHT SIDE */}
          {/* ================================= */}

          <div className="flex items-center gap-3">

            {isLogin ? (

              <>
                {/* =========================== */}
                {/* USER INFORMATION */}
                {/* =========================== */}

                <Link
                  to="/usercomponent"
                  className="hidden sm:flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
                >

                  <FaUserCircle className="text-3xl text-gray-600" />

                  <div className="leading-tight">

                    <p className="font-semibold text-gray-800">
                      {user?.name ||
                        user?.fullName ||
                        "User"}
                    </p>

                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || "user"}
                    </p>

                  </div>

                </Link>

                {/* =========================== */}
                {/* MOBILE USER ICON */}
                {/* =========================== */}

                <Link
                  to="/usercomponent"
                  className="sm:hidden"
                >
                  <FaUserCircle className="text-3xl text-gray-600" />
                </Link>

                {/* =========================== */}
                {/* LOGOUT */}
                {/* =========================== */}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >

                  <FaSignOutAlt />

                  <span className="hidden sm:inline">
                    Logout
                  </span>

                </button>
              </>

            ) : (

              <>
                {/* =========================== */}
                {/* LOGIN */}
                {/* =========================== */}

                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  Login
                </Link>

                {/* =========================== */}
                {/* SIGNUP */}
                {/* =========================== */}

                <Link
                  to="/signup"
                  className="hidden sm:block border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  Signup
                </Link>

              </>
            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default UserNav;