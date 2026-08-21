import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaArrowDown, FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminPart() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // ===========================
  // States
  // ===========================

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState([]);

  // Rating
  const [ratings, setRatings] = useState({});

  // ===========================
  // Load Data
  // ===========================

  useEffect(() => {

    getProducts();

    if (user?._id) {
      getWishlist();
      getRatings();
    }

  }, []);

  // ===========================
  // Get Products
  // ===========================

  const getProducts = async () => {
    try {

      const { data } = await api.get("/products");

      setProducts(data.products);

    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Get Wishlist
  // ===========================

const getWishlist = async () => {
  try {
    const { data } = await api.get(`https://ecommerce-2-0n96.onrender.com/wishlist/${user._id}`);

    const products = data?.wishlist?.products || [];

    const ids = products
      .filter((product) => product?._id)
      .map((product) => product._id);

    setWishlistIds(ids);

  } catch (error) {
    console.log(
      "Wishlist Error:",
      error.response?.data || error.message
    );

    setWishlistIds([]);
  }
};// ===========================
  // Get User Ratings
  // ===========================

  const getRatings = async () => {

    try {

     const { data } = await api.get(`https://ecommerce-2-0n96.onrender.com/rating/${user._id}`);

  

      let obj = {};

      data.ratings.forEach((item) => {

        obj[item.productId] = item.rating;

      });

      setRatings(obj);

    } catch (error) {

      console.log(error);

    }
}

  // ============== Wishlist==========================

 const addToWishlist = async (productId) => {
  try {
    if (!user?._id) {
      alert("Please Login");
      return;
    }

    const { data } = await api.post("https://ecommerce-2-0n96.onrender.com/wishlist/add", {
      userId: user._id,
      productId,
    });

    if (data.added) {
      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev
          : [...prev, productId]
      );
    } else {
      setWishlistIds((prev) =>
        prev.filter((id) => id !== productId)
      );
    }

  } catch (error) {
    console.log(
      "Wishlist Error:",
      error.response?.data || error.message
    );
  }
};

  // ===========================
  // Rating Toggle
  // ===========================

  const toggleRating = async (productId, star) => {

    try {

      if (!user?._id) {
        return alert("Please Login");
      }

      // Same star clicked again
      if (ratings[productId] === star) {

        await api.delete("https://ecommerce-2-0n96.onrender.com/rating/delete", {
          data: {
            userId: user._id,
            productId,
          },
        });

        setRatings((prev) => ({
          ...prev,
          [productId]: 0,
        }));

        return;
      }

      // Add / Update Rating

      await api.post("https://ecommerce-2-0n96.onrender.com/rating/add", {

        userId: user._id,

        productId,

        rating: star,

      });

      setRatings((prev) => ({

        ...prev,

        [productId]: star,

      }));

    } catch (error) {

      console.log(error);

    }

  };

  // ===========================
  // Product Details
  // ===========================

  const productDetails = (id) => {

    navigate(`/product/${id}`);

  };

  // ===========================
  // Filter Products
  // ===========================

  const filteredProducts = products.filter((item) => {

    const searchMatch =
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase());

    const categoryMatch =
      category === "All" ||
      item.category === category;

    return searchMatch && categoryMatch;

  });


  return (
  <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 py-10">

    <div className="max-w-7xl mx-auto px-5">

      {/* Search */}

      <div className="flex flex-col md:flex-row gap-5 mb-8">

        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white rounded-xl px-4 py-3 outline-none"
        />

        <div className="relative md:w-64">

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl px-4 py-3 appearance-none bg-white"
          >
            <option value="All">All</option>
            <option value="Mobile">Mobile</option>
            <option value="Laptop">Laptop</option>
            <option value="Fashion">Fashion</option>
            <option value="Shoes">Shoes</option>
            <option value="Electronics">Electronics</option>
          </select>

          <FaArrowDown className="absolute right-4 top-1/2 -translate-y-1/2" />

        </div>

      </div>

      <h1 className="text-center text-4xl font-bold text-white mb-10">
        Our Products
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredProducts.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
          >

            {/* Image */}

            <div
              onClick={() => productDetails(item._id)}
              className="cursor-pointer"
            >

              <img
                src={`http://localhost:8000/public/temp/${item.image}`}
                alt={item.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-5">

                <h2 className="text-2xl font-bold">
                  {item.title}
                </h2>

                <p className="text-gray-500 mt-2 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-4">

                  <h3 className="text-2xl font-bold text-green-600">
                    ₹{item.price}
                  </h3>

                  <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                    {item.category}
                  </span>

                </div>

              </div>

            </div>

            {/* Rating */}

            <div className="px-5">

              <h3 className="font-semibold mb-2">
                Rate this Product
              </h3>

              <div className="flex gap-1">

                {[1, 2, 3, 4, 5].map((star) => (

                  <FaStar
                    key={star}
                    onClick={() => toggleRating(item._id, star)}
                    className={`cursor-pointer text-2xl transition-all duration-300 ${
                      star <= (ratings[item._id] || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />

                ))}

              </div>

            </div>

            {/* Wishlist */}

            <div className="p-5">

              <button
                onClick={() => addToWishlist(item._id)}
                className={`w-full py-3 rounded-xl flex justify-center items-center gap-3 text-lg transition-all duration-300 ${
                  wishlistIds.includes(item._id)
                    ? "bg-red-500 text-white"
                    : "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                }`}
              >

                <FaHeart />

                {wishlistIds.includes(item._id)
                  ? "Added To Wishlist"
                  : "Add To Wishlist"}

              </button>

            </div>

          </div>

        ))}

      </div>

      {filteredProducts.length === 0 && (

        <div className="text-center mt-20">

          <h2 className="text-3xl font-bold text-white">
            No Products Found
          </h2>

        </div>

      )}

    </div>

  </div>
);
}

export default AdminPart;