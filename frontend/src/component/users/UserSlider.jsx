import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  FaMapMarkerAlt,
  FaStore,
  FaArrowRight,
} from "react-icons/fa";

import api from "../../api/axios";

function UserSlider() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getShops();
  }, []);

  const getShops = async () => {
    try {
      const { data } = await api.get("/shop/all");
      setShops(data.shops);
    } catch (error) {
      console.log(error);
    }
  };

  const imageUrl = (image) => {
    if (!image) {
      return "https://picsum.photos/800/500";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://ecommerce-3-nee8.onrender.com/public/temp/${image}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 py-16">

      <h1 className="text-5xl font-bold text-center text-white mb-12">
        🏪 Explore Our Shops
      </h1>

      <div className="max-w-7xl mx-auto px-6">

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {shops.map((shop) => (
            <SwiperSlide key={shop._id}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:scale-105 duration-300">

                <img
                  src={imageUrl(shop.image)}
                  alt={shop.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-6">

                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaStore className="text-indigo-600" />
                    {shop.name}
                  </h2>

                  <p className="flex items-center gap-2 text-gray-600 mt-4">
                    <FaMapMarkerAlt className="text-red-500" />
                    {shop.city}, {shop.state}
                  </p>

                  {shop.owner && (
                    <p className="mt-3 text-gray-700">
                      <span className="font-bold">
                        Owner :
                      </span>{" "}
                      {shop.owner.name}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/shopdetails/${shop._id}`)
                    }
                    className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex justify-center items-center gap-2"
                  >
                    View Shop
                    <FaArrowRight />
                  </button>

                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
}

export default UserSlider;