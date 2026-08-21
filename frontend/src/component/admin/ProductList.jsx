import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  const addToCart = async (id) => {
    try {
      await api.post("/cart/add", {
        productId: id,
        quantity: 1,
      });

      alert("Added to Cart");
    } catch (error) {
      console.log(error);
    }
  };
  // =============================
  // Get All Products
  // =============================

  const getProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // Search Filter
  // =============================

  const filteredProducts = products.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  // =============================
  // Delete Product
  // =============================

  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(`/products/delete/${id}`);
      alert(data.message);
      getProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  // =============================
  // Update Product
  // =============================

  const editHandler = (id) => {
    navigate(`/add-product/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 py-8">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}

        <h1 className="text-3xl font-bold text-white mb-6">Product List</h1>

        {/* Search */}

        <input
          type="text"
          placeholder="🔍 Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 bg-white border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Product Grid */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-2xl duration-300"
            >
              {/* ================= FIRST DIV ================= */}

              <div className="p-4 border-b">
                <img
                  src={`https://ecommerce-3-nee8.onrender.com/public/temp/${item.image}`}
                  alt={item.title}
                  className="w-full h-60 object-cover rounded-xl"
                />

                <h2 className="text-xl font-bold text-center mt-4">
                  {item.title}
                </h2>
              </div>

              {/* ================= SECOND DIV ================= */}

              <div className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹ {item.price}
                  </span>

                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </span>
                </div>

                <p className="text-gray-600 leading-7">{item.description}</p>
              </div>

              {/* ================= THIRD DIV ================= */}

              <div className="flex gap-3 p-4 border-t">
                <button
                  onClick={() => editHandler(item._id)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
                >
                  Update
                </button>

                <button
                  onClick={() => deleteHandler(item._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Product */}

        {filteredProducts.length === 0 && (
          <div className="text-center mt-10">
            <h2 className="text-2xl font-semibold text-gray-500">
              No Products Found
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
