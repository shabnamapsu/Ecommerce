import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getShops();
  }, []);

  const getShops = async () => {
    try {
      const { data } = await api.get("/shop/all");

      if (data.success) {
        setShops(data.shops);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const shopDetails = (id) => {
    navigate(`/shopdetails/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
  <>
 
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 py-10 px-5 mt-3 px-4">
      <h1 className="text-4xl font-bold text-center text-white mb-10">
        Our Shops
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {shops.length > 0 ? (
          shops.map((shop) => (
            <div
              key={shop._id}
              onClick={() => shopDetails(shop._id)}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer hover:scale-105 duration-300 p-5 flex flex-col items-center"
            >
              <img
                src={
                  shop.image
                    ? `https://ecommerce-3-nee8.onrender.com/public/temp/${shop.image}`
                    : "https://picsum.photos/250"
                }
                alt={shop.name}
                className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500"
              />

              <h2 className="mt-5 text-2xl font-bold text-gray-700">
                {shop.name}
              </h2>

              {/* <p className="text-gray-500 mt-2">
                {shop.city}, {shop.state}
              </p> */}

              <button className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full">
                View Shop
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-2xl text-red-500">
            No Shops Found
          </div>
        )}

      </div>
    </div>
     <div className="min-h-1 bg-white py-10 px-5 mt-3 px-4"></div>
    </>
  );
}

export default Shops;