import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
const Banner = () => {
  return (
    <div className="p-4 md:p-10 m-1 w-full h-auto border object-cover rounded-lg">
      <Swiper
        slidesPerView={1}
        loop={true} 
        autoplay={{
          delay: 3500,
          disableOnInteraction: false, 
        }}
        modules={[Autoplay]}
      >
        <SwiperSlide>
          <img
            src="assets/banner1.webp"
            alt="Slide 1"
            className="w-full rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="assets/banner2.webp"
            alt="Slide 2"
            className="w-full rounded-lg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="assets/banner3.webp"
            alt="Slide 3"
            className="w-full rounded-lg"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
