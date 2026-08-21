import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // GET PRODUCT BY ID
  // GET /products/:id
  // =========================

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  const getProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);

      console.log("Product Response:", response.data);

      const data = response.data.product;

      setProduct({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        category: data.category || "",
      });

      if (data.image) {
        setPreview(
          `http://localhost:8000/public/temp/${data.image}`
        );
      }

    } catch (error) {
      console.log(
        "Get Product Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Product not found"
      );
    }
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // IMAGE
  // =========================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", product.title);
      formData.append(
        "description",
        product.description
      );
      formData.append("price", product.price);
      formData.append("category", product.category);

      // Image optional during update
      if (image) {
        formData.append("image", image);
      }

      let response;

      // =========================
      // UPDATE
      // PUT /products/update/:id
      // =========================

      if (isEdit) {
        response = await api.put(
          `/products/update/${id}`,
          formData
        );
      }

      // =========================
      // CREATE
      // POST /products/create
      // =========================

      else {
        if (!image) {
          alert("Please select product image");
          setLoading(false);
          return;
        }

        response = await api.post(
          "/products/create",
          formData
        );
      }

      console.log(
        "Product Response:",
        response.data
      );

      alert(
        response.data.message ||
          "Success"
      );

      navigate("/admin/products");

    } catch (error) {
      console.log(
        "Product Error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-5">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}

          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={product.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* DESCRIPTION */}

          <textarea
            rows="4"
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* PRICE */}

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* CATEGORY */}

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">
              Select Category
            </option>

            <option value="Mobile">
              Mobile
            </option>

            <option value="Laptop">
              Laptop
            </option>

            <option value="Fashion">
              Fashion
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Shoes">
              Shoes
            </option>
          </select>

          {/* IMAGE */}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full border rounded-lg p-3"
          />

          {/* PREVIEW */}

          {preview && (
            <div className="flex justify-center">

              <img
                src={preview}
                alt="Product"
                className="w-40 h-40 object-cover rounded-xl border"
              />

            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading
              ? "Please Wait..."
              : isEdit
              ? "Update Product"
              : "Add Product"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
          >
            Back
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;