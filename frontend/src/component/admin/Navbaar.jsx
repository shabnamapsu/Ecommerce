import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaStore,
  FaBoxOpen,
  FaPlusCircle,
  FaShopify,
  FaHome,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Navbaar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  // ==========================================
  // GET USER
  // ==========================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("User Error:", error);
    }
  }, []);

  // ==========================================
  // TOKEN
  // ==========================================

  const token = localStorage.getItem("token");

  // ==========================================
  // USER ID
  // ==========================================

  const userId =
    user?._id ||
    user?.id ||
    localStorage.getItem("userId");

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {
    if (!userId || !token) {
      setCartCount(0);
      return;
    }

    try {
      console.log("Cart User ID:", userId);

      const { data } = await api.get(`/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Cart API Response:", data);

      // Backend ke possible response
      const items =
        data?.cart?.items ||
        data?.items ||
        [];

      console.log("Cart Items:", items);

      const total = items.reduce((sum, item) => {
        return (
          sum +
          Number(
            item.quantity ??
            item.Quantity ??
            0
          )
        );
      }, 0);

      console.log("Total Cart:", total);

      setCartCount(total);

      localStorage.setItem(
        "cartCount",
        total.toString()
      );

    } catch (error) {
      console.log(
        "Cart Loading Error:",
        error.response?.data || error.message
      );

      setCartCount(0);
    }
  };

  // ==========================================
  // LOAD CART WHEN USER AVAILABLE
  // ==========================================

  useEffect(() => {
    if (userId && token) {
      loadCart();
    }

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

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartCount");

    setCartCount(0);
    setUser(null);

    navigate("/login");
  };

  // ==========================================
  // CART CLICK
  // ==========================================

  const openCart = () => {
    setShowMenu(false);
    navigate("/cart");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b">

      <div className="max-w-7xl mx-auto px-5">

        <div className="h-20 flex items-center justify-between">

          {/* =================================
              LOGO
          ================================= */}

          <Link
            to="/home"
            className="flex items-center gap-3 group"
          >

            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition">

              <FaStore className="text-white text-xl" />

            </div>

            <div>

              <h1 className="text-2xl font-extrabold text-gray-800">
                Shop<span className="text-indigo-600">Kart</span>
              </h1>

              <p className="text-xs text-gray-400">
                Admin Panel
              </p>

            </div>

          </Link>


          {/* =================================
              MENU
          ================================= */}

          <div className="hidden lg:flex items-center gap-2">

            {/* HOME */}

            <Link
              to="/home"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <FaHome />
              Home
            </Link>


            {/* ADD PRODUCT */}

            <Link
              to="/add-product"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <FaPlusCircle />
              Add Product
            </Link>


            {/* PRODUCTS */}

            <Link
              to="/admin/products"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <FaBoxOpen />
              Products
            </Link>


            {/* ADD SHOP */}

            <Link
              to="/shop/create"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <FaShopify />
              Add Shop
            </Link>


            {/* SHOPS */}

            <Link
              to="/shops"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <FaStore />
              Shops
            </Link>


            {/* WISHLIST */}

            


            {/* =================================
                CART
            ================================= */}

            <button
              onClick={openCart}
              className="relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-indigo-50 transition"
              title="Cart"
            >

              <FaShoppingCart className="text-xl text-gray-700 hover:text-indigo-600" />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[21px]
                    h-[21px]
                    px-1
                    bg-red-500
                    text-white
                    text-xs
                    font-bold
                    rounded-full
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                  "
                >
                  {cartCount}
                </span>
              )}

            </button>

          </div>


          {/* =================================
              USER
          ================================= */}

          <div className="relative">

            {token ? (

              <>

                <button
                  onClick={() =>
                    setShowMenu(!showMenu)
                  }
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                >

                  <div className="w-11 h-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow">

                    <FaUserCircle className="text-white text-3xl" />

                  </div>


                  <div className="hidden md:block text-left">

                    <p className="font-bold text-gray-800">
                      {user?.name ||
                        user?.fullName ||
                        "User"}
                    </p>

                    <p className="text-xs text-indigo-600 font-semibold uppercase">
                      {user?.role || "owner"}
                    </p>

                  </div>


                  <FaChevronDown
                    className={`text-gray-500 text-sm transition ${
                      showMenu
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>


                {/* =================================
                    DROPDOWN
                ================================= */}

                {showMenu && (

                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border overflow-hidden">

                    {/* USER HEADER */}

                    <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">

                      <p className="font-bold">
                        {user?.name ||
                          user?.fullName ||
                          "User"}
                      </p>

                      <p className="text-sm opacity-80">
                        {user?.email}
                      </p>

                    </div>


                    <div className="p-2">

                      {/* DASHBOARD */}

                      <Link
                        to="/admincomponent"
                        onClick={() =>
                          setShowMenu(false)
                        }
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
                      >

                        <FaHome />

                        Dashboard

                      </Link>


                      {/* =================================
                          DROPDOWN CART
                      ================================= */}

                      <button
                        onClick={openCart}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-700"
                      >

                        <span className="flex items-center gap-3">

                          <FaShoppingCart />

                          My Cart

                        </span>


                        {cartCount > 0 && (

                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">

                            {cartCount}

                          </span>

                        )}

                      </button>


                      {/* WISHLIST */}

                      <Link
                        to="/wishlist"
                        onClick={() =>
                          setShowMenu(false)
                        }
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-50 text-gray-700"
                      >

                        <span className="flex items-center gap-3">

                          <FaHeart className="text-red-500" />

                          Wishlist

                        </span>

                      </Link>


                      {/* LOGOUT */}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600"
                      >

                        <FaSignOutAlt />

                        Logout

                      </button>

                    </div>

                  </div>

                )}

              </>

            ) : (

              <Link
                to="/login"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
              >

                <FaUserCircle />

                Login

              </Link>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbaar;