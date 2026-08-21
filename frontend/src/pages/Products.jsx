import React, { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // =====================================
  // GET PRODUCTS
  // =====================================

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/products");

      console.log("PRODUCT RESPONSE:", data);

      setProducts(data.products || []);
    } catch (error) {
      console.log("Get Products Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // ADD TO CART
  // =====================================

  const addToCart = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !token) {
        alert("Please Login First");
        navigate("/login");
        return;
      }

      const userId =
        user._id ||
        user.id ||
        localStorage.getItem("userId");

      if (!userId) {
        alert("User ID not found");
        return;
      }

      await api.post(
        "/cart/add",
        {
          userId,
          productId: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Added To Cart 🛒");

      // Navbar cart count update
      window.dispatchEvent(new Event("cartUpdate"));

    } catch (error) {
      console.log("Add Cart Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add product to cart"
      );
    }
  };

  // =====================================
  // WISHLIST
  // =====================================

  const addToWishlist = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please Login First");
        navigate("/login");
        return;
      }

      // Change this endpoint if your backend
      // wishlist route has a different name.
      await api.post(
        "/wishlist/add",
        {
          productId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added To Wishlist ❤️");

    } catch (error) {
      console.log("Wishlist Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add wishlist"
      );
    }
  };

  // =====================================
  // CATEGORY
  // =====================================

  const categories = [
    "All",
    ...new Set(
      products
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // =====================================
  // FILTER
  // =====================================

  const filteredProducts = products.filter((item) => {
    const title =
      item.title?.toLowerCase() || "";

    const itemCategory =
      item.category?.toLowerCase() || "";

    const searchText =
      search.toLowerCase();

    const searchMatch =
      title.includes(searchText) ||
      itemCategory.includes(searchText);

    const categoryMatch =
      category === "All" ||
      item.category === category;

    return searchMatch && categoryMatch;
  });

  // =====================================
  // IMAGE
  // =====================================

  const getImage = (image) => {
    if (!image) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
    }

    return `http://localhost:8000/public/temp/${image}`;
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-xl font-semibold text-gray-600">
            Loading Products...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // RETURN
  // =====================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 py-8">

      <div className="max-w-7xl mx-auto px-5">

        {/* =================================
            HEADER
        ================================= */}

        <div className="text-center mb-8">

          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">
            Explore Products 🛍️
          </h1>

          <p className="text-gray-500 mt-2">
            Find your favorite products
          </p>

        </div>

        {/* =================================
            SEARCH
        ================================= */}

        <div className="bg-white p-4 rounded-2xl shadow-md mb-8">

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

        </div>

        {/* =================================
            CATEGORIES
        ================================= */}

        <div className="flex flex-wrap gap-3 mb-8">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              className={`px-5 py-2 rounded-full font-semibold transition ${
                category === item
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        {/* =================================
            PRODUCT COUNT
        ================================= */}

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold text-gray-800">
            Products
          </h2>

          <span className="text-gray-500">
            {filteredProducts.length} Products
          </span>

        </div>

        {/* =================================
            PRODUCT GRID
        ================================= */}

        {filteredProducts.length > 0 ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

            {filteredProducts.map((item) => (

              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group"
              >

                {/* IMAGE */}

                <div className="relative overflow-hidden">

                  <img
                    src={getImage(item.image)}
                    alt={item.title}
                    className="w-full h-60 object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* CATEGORY */}

                  <span className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>

                  {/* WISHLIST */}

                  <button
                    onClick={() =>
                      addToWishlist(item._id)
                    }
                    className="absolute top-3 right-3 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-red-500 hover:text-white transition"
                    title="Add to Wishlist"
                  >
                    <FaHeart />
                  </button>

                </div>

                {/* DETAILS */}

                <div className="p-5">

                  <h2 className="text-xl font-bold text-gray-800 truncate">
                    {item.title}
                  </h2>

                  <p className="text-gray-500 text-sm mt-2 line-clamp-2 min-h-[40px]">
                    {item.description}
                  </p>

                  {/* PRICE */}

                  <div className="flex justify-between items-center mt-4">

                    <span className="text-2xl font-bold text-indigo-600">
                      ₹ {item.price}
                    </span>

                  </div>

                  {/* BUTTONS */}

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <button
                      onClick={() =>
                        navigate(
                          `/product/${item._id}`
                        )
                      }
                      className="flex items-center justify-center gap-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white py-2 rounded-lg font-semibold transition"
                    >
                      <FaEye />
                      View
                    </button>

                    <button
                      onClick={() =>
                        addToCart(item._id)
                      }
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                      <FaShoppingCart />
                      Cart
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="bg-white rounded-2xl shadow-md p-12 text-center">

            <div className="text-6xl mb-4">
              🛍️
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-2">
              Try another search or category.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Products;