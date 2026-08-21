import React, { useEffect, useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/Axios";

function Cart() {
  const navigate = useNavigate();

  // ==========================================
  // GET LOGGED USER
  // ==========================================

  const getUser = () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        return null;
      }

      return JSON.parse(userData);
    } catch (error) {
      console.log("User Parse Error:", error);
      return null;
    }
  };

  const user = getUser();

  const userId = user?._id || user?.id;

  // ==========================================
  // STATES
  // ==========================================

  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {
    try {
      const currentUser = getUser();

      const currentUserId =
        currentUser?._id || currentUser?.id;

      const token = localStorage.getItem("token");

      console.log("========== LOAD CART ==========");
      console.log("User:", currentUser);
      console.log("User ID:", currentUserId);
      console.log("Token:", token);

      if (!currentUserId) {
        console.log("User ID not found");

        setCart({
          items: [],
        });

        return;
      }

      if (!token) {
        console.log("Token not found");

        setCart({
          items: [],
        });

        return;
      }

      // ======================================
      // GET CART
      // ======================================

      const response = await api.get(
        `/cart/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("GET CART RESPONSE:", response.data);

      if (response.data?.success) {
        setCart(
          response.data.cart || {
            items: [],
          }
        );

        updateNavbarCount(
          response.data.cart?.items || []
        );
      } else {
        setCart({
          items: [],
        });
      }
    } catch (error) {
      console.log(
        "GET CART ERROR:",
        error.response?.data || error.message
      );

      setCart({
        items: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // USE EFFECT
  // ==========================================

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      console.log("Cart update event received");
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
  }, []);

  // ==========================================
  // UPDATE NAVBAR COUNT
  // ==========================================

  const updateNavbarCount = (items) => {
    const count = (items || []).reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

    localStorage.setItem(
      "cartCount",
      count
    );

    window.dispatchEvent(
      new Event("cartUpdate")
    );
  };

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQty = async (
    productId,
    quantity
  ) => {
    try {
      if (!userId) {
        alert("User not found");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found");
        navigate("/login");
        return;
      }

      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      console.log("Updating Cart:", {
        userId,
        productId,
        quantity,
      });

      const response = await api.post(
        "/cart/update",
        {
          userId,
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "UPDATE CART RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setCart(response.data.cart);

        updateNavbarCount(
          response.data.cart?.items || []
        );
      }
    } catch (error) {
      console.log(
        "UPDATE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = async (productId) => {
    try {
      if (!userId) {
        alert("User not found");
        return;
      }

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/cart/remove",
        {
          userId,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "REMOVE RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setCart(response.data.cart);

        updateNavbarCount(
          response.data.cart?.items || []
        );
      }
    } catch (error) {
      console.log(
        "REMOVE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    try {
      if (!userId) {
        alert("User not found");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to clear cart?"
      );

      if (!confirmDelete) {
        return;
      }

      const token = localStorage.getItem("token");

      const response = await api.delete(
        `/cart/clear/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "CLEAR CART RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        setCart({
          items: [],
        });

        updateNavbarCount([]);
      }
    } catch (error) {
      console.log(
        "CLEAR CART ERROR:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-bold text-indigo-600">
          Loading Cart...
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

        <FaShoppingCart className="text-7xl text-gray-300 mb-5" />

        <h2 className="text-3xl font-bold text-gray-700">
          Please Login
        </h2>

        <button
          onClick={() => navigate("/login")}
          className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl"
        >
          Login
        </button>

      </div>
    );
  }

  // ==========================================
  // CART ITEMS
  // ==========================================

  const items = cart?.items || [];

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const total = items.reduce(
    (sum, item) => {
      const product = item.productId;

      if (!product) {
        return sum;
      }

      const price = Number(product.price || 0);

      const quantity = Number(
        item.quantity || 0
      );

      return sum + price * quantity;
    },
    0
  );

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-6xl mx-auto px-5">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800"
          >
            <FaArrowLeft />
            Continue Shopping
          </button>

          <h1 className="text-4xl font-bold text-indigo-600">
            My Cart
          </h1>

        </div>

        {/* EMPTY CART */}

        {items.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-14 text-center">

            <FaShoppingCart className="text-8xl text-gray-300 mx-auto mb-6" />

            <h2 className="text-3xl font-bold text-gray-700">
              Your Cart is Empty
            </h2>

            <p className="text-gray-500 mt-3">
              Add some products to your cart.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Shop Now
            </button>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* =================================
                CART PRODUCTS
            ================================= */}

            <div className="lg:col-span-2 space-y-5">

              {items.map((item, index) => {

                const product = item.productId;

                // Product populate nahi hua
                if (!product) {
                  console.log(
                    "Product not populated:",
                    item
                  );

                  return null;
                }

                return (
                  <div
                    key={
                      product._id || index
                    }
                    className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-5 items-center"
                  >

                    {/* IMAGE */}

                    <img
                      src={`http://localhost:8000/public/temp/${product.image}`}
                      alt={product.title}
                      className="w-28 h-28 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150";
                      }}
                    />

                    {/* DETAILS */}

                    <div className="flex-1">

                      <h2 className="text-xl font-bold text-gray-800">
                        {product.title}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        {product.category}
                      </p>

                      <p className="text-green-600 font-bold text-lg mt-2">
                        ₹{product.price}
                      </p>

                    </div>

                    {/* QUANTITY */}

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          updateQty(
                            product._id,
                            Number(item.quantity) - 1
                          )
                        }
                        className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center"
                      >
                        <FaMinus />
                      </button>

                      <span className="font-bold text-lg w-8 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(
                            product._id,
                            Number(item.quantity) + 1
                          )
                        }
                        className="w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"
                      >
                        <FaPlus />
                      </button>

                    </div>

                    {/* ITEM TOTAL */}

                    <div className="font-bold text-lg text-gray-800 min-w-[80px] text-center">
                      ₹
                      {Number(product.price || 0) *
                        Number(item.quantity || 0)}
                    </div>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        removeItem(product._id)
                      }
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      <FaTrash />
                    </button>

                  </div>
                );
              })}

              {/* CLEAR CART */}

              <button
                onClick={clearCart}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                <FaTrash className="inline mr-2" />
                Clear Cart
              </button>

            </div>

            {/* =================================
                ORDER SUMMARY
            ================================= */}

            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">

              <h2 className="text-2xl font-bold border-b pb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mt-5">

                <span>
                  Total Items
                </span>

                <span className="font-bold">
                  {totalItems}
                </span>

              </div>

              <div className="flex justify-between mt-4">

                <span>
                  Subtotal
                </span>

                <span className="font-bold">
                  ₹{total}
                </span>

              </div>

              <div className="flex justify-between mt-4 text-green-600">

                <span>
                  Delivery
                </span>

                <span>
                  FREE
                </span>

              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-2xl font-bold">

                <span>
                  Total
                </span>

                <span className="text-green-600">
                  ₹{total}
                </span>

              </div>

              <button
                onClick={() => navigate("/success")}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold"
              >
                Proceed To Checkout
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Cart;