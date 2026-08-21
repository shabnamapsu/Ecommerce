import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/Axios";

function ShopcreateAdd() {

  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [shop, setShop] = useState({
    name: "",
    city: "",
    state: "",
    country: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [oldImage, setOldImage] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================
  // GET SHOP FOR UPDATE
  // =====================================

  useEffect(() => {

    if (id) {
      getShop();
    }

  }, [id]);

  const getShop = async () => {

    try {

      const { data } = await api.get(`/shop/${id}`);

      const shopData = data.shop;

      setShop({
        name: shopData.name || "",
        city: shopData.city || "",
        state: shopData.state || "",
        country: shopData.country || "",
        address: shopData.address || "",
      });

      setOldImage(shopData.image || "");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to load shop"
      );
    }
  };

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    setShop({
      ...shop,
      [e.target.name]: e.target.value,
    });

  };

  // =====================================
  // IMAGE CHANGE
  // =====================================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));

  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("name", shop.name);
      formData.append("city", shop.city);
      formData.append("state", shop.state);
      formData.append("country", shop.country);
      formData.append("address", shop.address);

      // Image only if selected
      if (image) {
        formData.append("image", image);
      }

      let res;

      // =================================
      // CREATE
      // =================================

      if (!isEditMode) {

        res = await api.post(
          "/shop/create",
          formData
        );

      }

      // =================================
      // UPDATE
      // =================================

      else {

        formData.append("id", id);

        res = await api.put(
          "/shop/update",
          formData
        );

      }

      alert(res.data.message);

      // Go back to shop list
      navigate("/shops");

    } catch (error) {

      console.log(error);

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

        {/* ================================= */}
        {/* TITLE */}
        {/* ================================= */}

        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">

          {isEditMode
            ? "Update Shop"
            : "Create Shop"}

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <input
            type="text"
            name="name"
            value={shop.name}
            onChange={handleChange}
            placeholder="Shop Name"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* CITY */}

          <input
            type="text"
            name="city"
            value={shop.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* STATE */}

          <input
            type="text"
            name="state"
            value={shop.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* COUNTRY */}

          <input
            type="text"
            name="country"
            value={shop.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* ADDRESS */}

          <textarea
            rows="4"
            name="address"
            value={shop.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border rounded-lg p-3"
            required
          />

          {/* OLD IMAGE */}

          {isEditMode && oldImage && !preview && (

            <div>

              <p className="text-gray-600 mb-2">
                Current Image
              </p>

              <img
                src={`http://localhost:8000/public/temp/${oldImage}`}
                alt="Current Shop"
                className="w-40 h-40 rounded-xl object-cover border"
              />

            </div>

          )}

          {/* IMAGE */}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full border rounded-lg p-3"
          />

          {/* NEW IMAGE PREVIEW */}

          {preview && (

            <div className="flex justify-center">

              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 rounded-xl object-cover border"
              />

            </div>

          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
          >

            {loading
              ? "Please Wait..."
              : isEditMode
              ? "Update Shop"
              : "Create Shop"}

          </button>

          {/* CANCEL */}

          {isEditMode && (

            <button
              type="button"
              onClick={() => navigate("/shops")}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
            >
              Cancel
            </button>

          )}

        </form>

      </div>

    </div>

  );
}

export default ShopcreateAdd;