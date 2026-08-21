import React, { useEffect, useState } from "react";
import {
  FaStore,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaSpinner,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShop();
    getAllShops();
  }, [id]);

  // ================= Selected Shop =================

  const getShop = async () => {
    try {
      const { data } = await api.get(`/shop/${id}`);
      setShop(data.shop);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= All Shops =================

  const getAllShops = async () => {
    try {
      const { data } = await api.get("/shop/all");
      setShops(data.shops);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= Loading =================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl text-indigo-600">
        <FaSpinner className="animate-spin mr-3" />
        Loading...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl text-red-600 font-bold">
          Shop Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 min-h-screen py-10">

      {/* ================= Selected Shop ================= */}

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <img
          src={
            shop.image
              ? `http://localhost:8000/public/temp/${shop.image}`
              : "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200"
          }
          alt={shop.name}
          className="w-full h-96 object-cover"
        />

        <div className="p-8">

          <h1 className="text-4xl font-bold text-indigo-700 flex items-center gap-3">
            <FaStore />
            {shop.name}
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="bg-indigo-50 p-5 rounded-xl">
              <p className="flex gap-3 items-center">
                <FaCity />
                <strong>City :</strong>
                {shop.city}
              </p>
            </div>

            <div className="bg-red-50 p-5 rounded-xl">
              <p className="flex gap-3 items-center">
                <FaMapMarkerAlt />
                <strong>State :</strong>
                {shop.state}
              </p>
            </div>

            <div className="bg-green-50 p-5 rounded-xl">
              <p className="flex gap-3 items-center">
                <FaGlobe />
                <strong>Country :</strong>
                {shop.country}
              </p>
            </div>

            <div className="bg-yellow-50 p-5 rounded-xl">
              <strong>Address</strong>
              <p>{shop.address}</p>
            </div>

          </div>

          {shop.owner && (
            <div className="mt-8 border-t pt-6">

              <h2 className="text-2xl font-bold mb-5">
                Owner Details
              </h2>

              <p className="flex gap-3 items-center mb-3">
                <FaUser />
                {shop.owner.name}
              </p>

              <p className="flex gap-3 items-center">
                <FaEnvelope />
                {shop.owner.email}
              </p>

            </div>
          )}

        </div>

      </div>

      {/* ================= Other Shops ================= */}

      <div className="max-w-7xl mx-auto mt-14">

        <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          Other Shops
        </h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">

          {shops
            .filter((item) => item._id !== shop._id)
            .map((item) => (

              <div
                key={item._id}
                onClick={() => navigate(`/shopdetails/${item._id}`)}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer duration-300 hover:scale-105 overflow-hidden"
              >

                <img
                  src={
                    item.image
                      ? `http://localhost:8000/public/temp/${item.image}`
                      : "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400"
                  }
                  alt={item.name}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">

                  <h3 className="text-2xl font-bold">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {item.city}, {item.state}
                  </p>

                </div>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default ShopDetails;