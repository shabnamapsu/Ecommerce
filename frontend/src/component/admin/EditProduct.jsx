import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import api from "../../api/Axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);

      setProduct(data.product);
    } catch (error) {
      console.log(error);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const { data } = await api.delete(
        `/products/delete/${id}`
      );

      alert(data.message);

      navigate("/admin-product");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-3xl font-bold">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-3xl">
        Product Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-5">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="grid md:grid-cols-2">

          {/* Left */}

          <div className="bg-gray-100 flex justify-center items-center p-10">

            <img
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `http://localhost:8000/public/temp/${product.image}`
              }
              alt={product.title}
              className="w-full max-w-md h-[450px] object-contain"
            />

          </div>

          {/* Right */}

          <div className="p-10">

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-indigo-600 font-semibold mb-6 hover:text-indigo-800"
            >
              <FaArrowLeft />
              Back
            </button>

            <h1 className="text-4xl font-bold">
              {product.title}
            </h1>

            <span className="inline-block mt-5 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {product.category}
            </span>

            <h2 className="text-4xl font-bold text-green-600 mt-6">
              ₹ {product.price}
            </h2>

            <div className="mt-8">

              <h3 className="text-2xl font-bold mb-3">
                Description
              </h3>

              <p className="text-gray-600 leading-7">
                {product.description || product.discription}
              </p>

            </div>

            <div className="mt-8 bg-gray-50 border rounded-xl p-5">

              <p>
                <strong>ID :</strong> {product._id}
              </p>

              <p className="mt-2">
                <strong>Created :</strong>{" "}
                {new Date(
                  product.createdAt
                ).toLocaleString()}
              </p>

              <p className="mt-2">
                <strong>Updated :</strong>{" "}
                {new Date(
                  product.updatedAt
                ).toLocaleString()}
              </p>

            </div>

            <div className="flex gap-5 mt-10">

              <button
                onClick={() =>
                  navigate(`/update/${product._id}`)
                }
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl flex justify-center items-center gap-3 text-lg"
              >
                <FaEdit />
                Update Product
              </button>

              <button
                onClick={deleteHandler}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex justify-center items-center gap-3 text-lg"
              >
                <FaTrash />
                Delete Product
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EditProduct;