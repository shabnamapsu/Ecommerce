import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaStore, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

function ShopList() {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getShops();
  }, []);

  const getShops = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await api.get("/shop/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShops(data.shops);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.city.toLowerCase().includes(search.toLowerCase()) ||
      shop.state.toLowerCase().includes(search.toLowerCase()) ||
      shop.country.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this shop?")) return;

    try {
      const token = localStorage.getItem("token");

      const { data } = await api.delete("/shop/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });

      alert(data.message);
      getShops();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const editHandler = (shop) => {
    console.log(shop);
    navigate(`/shop/update/${shop._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 py-8">
      <div className="max-w-7xl mx-auto px-5 rounded-full">
        <input
          type="text"
          placeholder="Search Shop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border mb-8"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.map((shop) => (
            <div
              key={shop._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl duration-300"
            >
              <img
                src={
                  shop.image
                    ? `http://localhost:8000/public/temp/${shop.image}`
                    : "/shop-default.png"
                }
                alt={shop.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaStore className="text-indigo-600" />
                  {shop.name}
                </h2>

                <p className="mt-3 flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  {shop.address}
                </p>

                <div className="mt-4 space-y-1">
                  <p>
                    <b>City:</b> {shop.city}
                  </p>
                  <p>
                    <b>State:</b> {shop.state}
                  </p>
                  <p>
                    <b>Country:</b> {shop.country}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => editHandler(shop)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Update
                  </button>

                  <button
                    onClick={() => deleteHandler(shop._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <h2 className="text-center text-2xl mt-10 text-gray-500">
            No Shops Found
          </h2>
        )}
      </div>
    </div>
  );
}

export default ShopList;
