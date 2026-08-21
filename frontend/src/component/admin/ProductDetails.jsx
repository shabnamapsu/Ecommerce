import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaStar,
  FaShoppingCart,
  FaBolt,
  FaMinus,
  FaPlus,
  FaHeart,
} from "react-icons/fa";

import api from "../../api/Axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [product, setProduct] = useState(null);

  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(true);

  const [cartLoading, setCartLoading] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [isWishlist, setIsWishlist] = useState(false);

  // =========================
  // GET LOGGED USER
  // =========================

  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.log("User parse error:", error);
      return null;
    }
  };

  // =========================
  // GET PRODUCT
  // =========================

  const getProduct = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/products/${id}`);

      console.log("Product Response:", data);

      setProduct(data.product);
    } catch (error) {
      console.log(
        "Product Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD PRODUCT
  // =========================

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  // =========================
  // CHECK LOGIN
  // =========================

  const checkLogin = () => {
    const user = getUser();

    const token = localStorage.getItem("token");

    if (!user) {
      alert("Please Login First");
      navigate("/login");
      return null;
    }

    if (!token) {
      alert("Token not found. Please login again.");
      navigate("/login");
      return null;
    }

    return {
      user,
      token,
    };
  };

  // =========================
  // DECREASE QTY
  // =========================

  const decreaseQty = () => {
    setQty((prev) => {
      if (prev <= 1) {
        return 1;
      }

      return prev - 1;
    });
  };

  // =========================
  // INCREASE QTY
  // =========================

  const increaseQty = () => {
    setQty((prev) => prev + 1);
  };

  // =========================
  // UPDATE CART COUNT
  // =========================

  const updateCartCount = (items = []) => {
    const count = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    localStorage.setItem("cartCount", count);

    window.dispatchEvent(new Event("cartUpdate"));
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = async () => {
    try {
      const loginData = checkLogin();

      if (!loginData) {
        return;
      }

      const { user } = loginData;

      if (!product?._id) {
        alert("Product not found");
        return;
      }

      const userId = user._id || user.id;

      if (!userId) {
        alert("User ID not found. Please login again.");
        return;
      }

      setCartLoading(true);

      const cartData = {
        userId: userId,
        productId: product._id,
        quantity: qty,
      };

      console.log("Sending Cart Data:", cartData);

      /*
        Axios interceptor automatically sends:

        Authorization: Bearer TOKEN
      */

      const { data } = await api.post(
        "/cart/add",
        cartData
      );

      console.log("Cart Response:", data);

      if (data?.cart?.items) {
        updateCartCount(data.cart.items);
      }

      alert("Product Added To Cart Successfully");
    } catch (error) {
      console.log("Add Cart Error:", error);

      console.log(
        "Backend Error:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        alert(
          error.response?.data?.message ||
            "Session expired. Please login again."
        );

        localStorage.removeItem("token");

        navigate("/login");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to add product to cart"
        );
      }
    } finally {
      setCartLoading(false);
    }
  };

  // =========================
  // BUY NOW
  // =========================

  const buyNow = () => {
    const loginData = checkLogin();

    if (!loginData) {
      return;
    }

    if (!product) {
      alert("Product not found");
      return;
    }

    navigate("/success", {
      state: {
        product,
        quantity: qty,
      },
    });
  };

  // =========================
  // ADD / REMOVE WISHLIST
  // =========================

  const toggleWishlist = async () => {
    try {
      const loginData = checkLogin();

      if (!loginData) {
        return;
      }

      const { user } = loginData;

      if (!product?._id) {
        return;
      }

      setWishlistLoading(true);

      const { data } = await api.post(
        "/wishlist/add",
        {
          userId: user._id,
          productId: product._id,
        }
      );

      console.log("Wishlist Response:", data);

      /*
        Backend same API se:

        First click  => ADD
        Second click => DELETE
      */

      setIsWishlist(
        data?.wishlist?.products?.some(
          (item) => {
            const itemId =
              typeof item === "object"
                ? item._id
                : item;

            return itemId?.toString() ===
              product._id.toString();
          }
        ) || false
      );
    } catch (error) {
      console.log(
        "Wishlist Error:",
        error.response?.data || error.message
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-xl font-semibold text-gray-700">
            Loading Product...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500">
            Product Not Found
          </h2>

          <button
            onClick={() => navigate("/products")}
            className="mt-5 bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Go To Products
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // IMAGE
  // =========================

  const imageUrl =
    `http://localhost:8000/public/temp/${product.image}`;

  // =========================
  // TOTAL PRICE
  // =========================

  const totalPrice =
    Number(product.price || 0) * qty;

  // =========================
  // JSX
  // =========================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-5">

      <div className="max-w-7xl mx-auto">

        {/* ================= BACK ================= */}

        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white px-5 py-3 rounded-xl shadow hover:bg-gray-100 transition font-semibold"
        >
          ← Back
        </button>

        {/* ================= MAIN CARD ================= */}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="grid lg:grid-cols-2 gap-10 p-8">

            {/* ================= IMAGE ================= */}

            <div className="bg-gray-100 rounded-3xl flex justify-center items-center min-h-[500px] p-8">

              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-[450px] object-contain hover:scale-105 transition duration-500"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/500";
                }}
              />

            </div>

            {/* ================= DETAILS ================= */}

            <div className="flex flex-col justify-center">

              {/* CATEGORY */}

              <span className="w-fit bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full font-semibold">
                {product.category}
              </span>

              {/* TITLE */}

              <h1 className="text-4xl lg:text-5xl font-bold mt-5 text-gray-900">
                {product.title}
              </h1>

              {/* RATING */}

              <div className="flex items-center gap-1 mt-5">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <FaStar
                      key={star}
                      className="text-yellow-400 text-xl"
                    />
                  )
                )}

                <span className="ml-2 text-gray-500">
                  5.0 Rating
                </span>

              </div>

              {/* PRICE */}

              <div className="mt-6">

                <span className="text-4xl font-bold text-green-600">
                  ₹{product.price}
                </span>

              </div>

              {/* DESCRIPTION */}

              <p className="text-gray-600 text-lg leading-8 mt-6">
                {product.description ||
                  product.discription ||
                  "No description available for this product."}
              </p>

              {/* DIVIDER */}

              <div className="border-t border-gray-200 mt-8 pt-6">

                <div className="space-y-4">

                  <div className="flex justify-between gap-5">
                    <span className="font-semibold">
                      Category
                    </span>

                    <span className="text-gray-600">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex justify-between gap-5">
                    <span className="font-semibold">
                      Product ID
                    </span>

                    <span className="text-gray-500 text-sm break-all">
                      {product._id}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold">
                      Status
                    </span>

                    <span className="text-green-600 font-semibold">
                      Available
                    </span>
                  </div>

                </div>

              </div>

              {/* ================= QUANTITY ================= */}

              <div className="flex items-center gap-5 mt-8">

                <span className="font-bold text-lg">
                  Quantity
                </span>

                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden">

                  <button
                    onClick={decreaseQty}
                    className="w-12 h-12 flex justify-center items-center hover:bg-gray-100 transition"
                  >
                    <FaMinus />
                  </button>

                  <span className="w-14 h-12 flex justify-center items-center font-bold text-lg bg-gray-50">
                    {qty}
                  </span>

                  <button
                    onClick={increaseQty}
                    className="w-12 h-12 flex justify-center items-center hover:bg-gray-100 transition"
                  >
                    <FaPlus />
                  </button>

                </div>

              </div>

              {/* ================= TOTAL ================= */}

              <div className="mt-5">

                <span className="text-gray-600">
                  Total:
                </span>

                <span className="text-2xl font-bold text-green-600 ml-3">
                  ₹{totalPrice}
                </span>

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="grid sm:grid-cols-2 gap-4 mt-8">

                {/* ADD CART */}

                <button
                  onClick={addToCart}
                  disabled={cartLoading}
                  className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-4 rounded-xl font-bold text-lg transition"
                >

                  <FaShoppingCart />

                  {cartLoading
                    ? "Adding..."
                    : "Add To Cart"}

                </button>

                {/* BUY NOW */}

                <button
                  onClick={buyNow}
                  className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition"
                >

                  <FaBolt />

                  Buy Now

                </button>

              </div>

              {/* ================= WISHLIST ================= */}

              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`mt-4 flex items-center justify-center gap-3 py-3 rounded-xl font-semibold transition border-2 ${
                  isWishlist
                    ? "bg-red-500 border-red-500 text-white"
                    : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                }`}
              >

                <FaHeart />

                {wishlistLoading
                  ? "Please Wait..."
                  : isWishlist
                  ? "Remove From Wishlist"
                  : "Add To Wishlist"}

              </button>

            </div>

          </div>

          {/* ================= SPECIFICATIONS ================= */}

          <div className="border-t p-8">

            <h2 className="text-3xl font-bold mb-6">
              Product Specifications
            </h2>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-5">

              <div className="flex justify-between border-b pb-4 gap-5">
                <span className="font-semibold">
                  Product ID
                </span>

                <span className="text-gray-600 break-all">
                  {product._id}
                </span>
              </div>

              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">
                  Category
                </span>

                <span className="text-gray-600">
                  {product.category}
                </span>
              </div>

              <div className="flex justify-between border-b pb-4">
                <span className="font-semibold">
                  Price
                </span>

                <span className="text-green-600 font-bold">
                  ₹{product.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">
                  Availability
                </span>

                <span className="text-green-600 font-semibold">
                  In Stock
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;