import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import story1 from "@/assets/images/story1.png";
import story2 from "@/assets/images/story2.png";
import story3 from "@/assets/images/story3.png";

export default function StoryCarousel() {
  return (
    <div className=' mx-auto p-3 md:p-0'>
      {/* Dashboard-style container */}
      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1.7}
          centeredSlides={true}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet dashboard-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active dashboard-bullet-active',
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          speed={800}
          className="dashboard-carousel"
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 1.7,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
        >
          {dashboardSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div
                  className={`relative cursor-pointer transition-all duration-500 md:h-[500px] flex items-center justify-center ${isActive ? 'z-10' : 'opacity-100'
                    }`}
                >
                  {/* Main image */}
                  <img
                    src={slide.image}
                    alt="Story slide"
                    className={`md:w-[1200px] h-full object-contain rounded-lg shadow-md relative z-10 ${isActive ? '' : ''}`}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom pagination styles */}
      <style>{`
        .dashboard-carousel {
          padding: 20px 0 60px 0;
          overflow: hidden !important;
        }
        @media (min-width: 0px) and (max-width: 767px) {  
          .dashboard-carousel {
            padding: 0 0 !important;
          }
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
          transform: scale(0.9) !important;
          opacity: 0.7 !important;
          z-index: 1;
        }
        
        .dashboard-carousel .swiper-pagination {
          bottom: -10px !important;
          padding-bottom: 20px !important;
          text-align: center;
        }
          @media (min-width: 0px) and (max-width: 767px) {  
          .dashboard-carousel .swiper-pagination {
            bottom: -60px !important;
          }
        }
        
        .dashboard-bullet {
          width: 16px !important;
          height: 16px !important;
          background: #3F3F3E !important;
          border-radius: 50% !important;
          margin: 0 4px !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
          opacity: 1 !important;
          margin-top: 100px !important;
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
  )
}

const dashboardSlides = [
  { image: story1 },
  { image: story2 },
  { image: story3 },
  { image: story1 },
  { image: story2 },
  { image: story3 },
];
