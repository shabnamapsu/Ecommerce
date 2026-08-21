import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaStar,
} from "react-icons/fa";
import api from "../api/Axios";

function WishList() {
  const [wishlist, setWishlist] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) {
      getWishlist();
    }
  }, []);

  // ================= GET WISHLIST =================
  const getWishlist = async () => {
    try {
      const { data } = await api.get(`/wishlist/${user._id}`);

      // Backend returns { wishlist }
      if (data.wishlist) {
        setWishlist(data.wishlist.products || []);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================= REMOVE FROM WISHLIST =================
  const removeWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`, {
        data: {
          userId: user._id,
        },
      });

      getWishlist();
    } catch (error) {
      console.log(error);
    }
  };
  const addToWishlist = async (productId) => {
  try {

    if (!user?._id) {
      alert("Please Login");
      return;
    }

    await api.post("/wishlist/add", {
      userId: user._id,
      productId,
    });

    alert("Added To Wishlist");

  } catch (error) {
    console.log(error);
  }
};

  // ================= ADD TO CART =================
  const addToCart = async (productId) => {
    try {
      await api.post("/cart/add", {
        userId: user._id,
        productId,
      });

      alert("Product Added To Cart");
    } catch (error) {
      console.log(error);
    }
  };

  // ================= EMPTY WISHLIST =================
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-100">
        <FaHeart className="text-8xl text-pink-500 mb-5" />

        <h1 className="text-4xl font-bold">
          Your Wishlist is Empty
        </h1>

        <p className="text-gray-500 mt-3">
          Save your favourite products here.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">

      <h1 className="text-4xl font-bold text-center mb-10 text-pink-600">
        ❤️ My Wishlist
      </h1>

      <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {wishlist.map((item) => (

          <div
            key={item._id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl duration-300 overflow-hidden"
          >

            {/* Product Image */}

            <img
              src={
                item.image
                  ? item.image.startsWith("http")
                    ? item.image
                    : `http://localhost:8000/public/temp/${item.image}`
                  : "https://dummyimage.com/400x250/e5e7eb/6b7280&text=No+Image"
              }
              alt={item.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold">
                {item.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {item.category}
              </p>

              <div className="flex items-center gap-2 mt-3">

                <FaStar className="text-yellow-500" />

                <span>4.8</span>

              </div>

              <h3 className="text-2xl font-bold text-green-600 mt-4">
                ₹ {item.price}
              </h3>

              {/* Shop Name */}

              {item.shop && (
                <p className="mt-2 text-gray-600">
                  Shop :
                  <span className="font-semibold">
                    {" "}
                    {item.shop.name}
                  </span>
                </p>
              )}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() => addToCart(item._id)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex justify-center items-center gap-2"
                >
                  <FaShoppingCart />
                  Add Cart
                </button>

                <button
                  onClick={() => removeWishlist(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 rounded-xl"
                >
                  <FaTrash />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default WishList;