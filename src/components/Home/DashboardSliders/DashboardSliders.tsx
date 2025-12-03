import img1 from "@/assets/images/img1.png";
import img2 from "@/assets/images/img2.png";
import img3 from "@/assets/images/img3.png";
import img4 from "@/assets/images/img4.png";
import img5 from "@/assets/images/img5.png";
import img6 from "@/assets/images/img6.png";
import arrowLeft from "@/assets/svgs/arrow-carv-left.svg";
import arrowRight from "@/assets/svgs/arrow-right.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Icon from "@/components/common/Icon";

export default function DashboardSliders() {
  return (
    <div className="py-14 bg-linear-to-b from-[#464466] via-[#4E4749] to-[##282729]">
      <div className="relative mx-auto p-3 md:p-0">
        {/* Dashboard-style container */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            navigation={{
              nextEl: ".dashboard-next",
              prevEl: ".dashboard-prev",
            }}
            slidesPerView={1.3}
            centeredSlides={true}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet dashboard-bullet",
              bulletActiveClass:
                "swiper-pagination-bullet-active dashboard-bullet-active",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            // loopAdditionalSlides={2}
            speed={800}
            className="dashboard-carousel"
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 1.3,
              },
              1024: {
                slidesPerView: 1.3,
              },
            }}
          >
            {dashboardSlides.map((slide, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <div
                    className={`relative cursor-pointer transition-all duration-500 p-3.5 bg-linear-to-b from-[#4F4E66] to-[#44413F] rounded-xl ${
                      isActive ? "z-10" : "opacity-100"
                    }`}
                  >
                    {/* Main image */}
                    <div className="p-3.5 bg-linear-to-b from-[#767390] to-[#5C5A5A] rounded-xl">
                      <img
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        className={`w-full h-full object-cover rounded-xl! shadow-md md:border-none md:h-[750px] ${isActive ? "md:shadow-[0_5px_15px_rgba(0,0,0,0.35)]" : ""}`}
                      />
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex justify-center items-center gap-5 md:gap-24 mt-10 md:-mt-12 relative z-20">
            {/* Left Arrow */}
            <button className="dashboard-prev w-12 h-12 rounded-full flex items-center justify-center bg-linear-to-b from-[#4A525B] via-[#212B36] to-[#212B36] hover:bg-linear-to-b hover:from-[#7F82F4] hover:via-[#6366F1] hover:to-[#6366F1] transition-colors cursor-pointer shadow-[0_0_25px_5px_#343434]">
              <Icon src={arrowLeft} className="text-white size-5" />
            </button>

            {/* Pagination goes here */}
            <div className="dashboard-pagination flex items-center"></div>

            {/* Right Arrow */}
            <button className="dashboard-next w-12 h-12 rounded-full flex items-center justify-center bg-linear-to-b from-[#4A525B] via-[#212B36] to-[#212B36] hover:bg-linear-to-b hover:from-[#7F82F4] hover:via-[#6366F1] hover:to-[#6366F1] transition-colors cursor-pointer shadow-[0_0_25px_5px_#343434]">
              <Icon src={arrowRight} className="text-white size-5" />
            </button>
          </div>
        </div>

        {/* Custom pagination styles */}
        <style>{`
        .dashboard-carousel {
          padding: 60px 0 100px 0;
          overflow: hidden;
        }
        
        .dashboard-carousel .swiper-slide {
          transition: all 0.5s ease;
        }
        
        .dashboard-carousel .swiper-slide-active {
          transform: scale(1) !important;
          opacity: 1 !important;
          z-index: 10;
        }
        
        .dashboard-carousel .swiper-slide:not(.swiper-slide-active) {
          transform: scale(0.85) !important;
          opacity: 0.7 !important;
          z-index: 1;
        }

        .dashboard-pagination {
            display: flex;
            align-items: center;
            gap: 8px;
          }
        
        .dashboard-carousel .swiper-pagination {
        margin-top: -30px !important;
          text-align: center;
          }
          
        .dashboard-bullet {
          width: 16px !important;
          height: 16px !important;
          background: #d9d9d9 !important;
          border-radius: 50% !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          opacity: 1 !important;
          bottom: -100px !important;
        }
        
        .dashboard-bullet-active {
          background: #38988a !important;
          background: linear-gradient(135deg, #6F6EC9, #867D73) !important;
          border: 2px solid #FFFFFF !important;
        }

        .dashboard-bullet:hover {
          background: rgba(255, 255, 255, 0.8) !important;
          transform: scale(1.1) !important;
        }
      `}</style>
      </div>
    </div>
  );
}

const dashboardSlides = [
  { image: img1 },
  { image: img2 },
  { image: img3 },
  { image: img4 },
  { image: img5 },
  { image: img6 },
];
