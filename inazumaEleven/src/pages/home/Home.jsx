import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "./home.css";

const Home = () => {
  return (
    <div className="home-contendor">
      <div className="home-imagenes">
        <Swiper
          modules={[Autoplay, EffectFade]}
          autoplay={{delay: 2000,disableOnInteraction: false,}}
          loop={true}
          effect="fade"
          speed={1000}
          className="img"
        >
          <SwiperSlide> <img src="fondo1.webp" alt="foto 1" /> </SwiperSlide>
          <SwiperSlide> <img src="fondo2.webp" alt="foto 2" /> </SwiperSlide>
          <SwiperSlide> <img src="fondo3.webp" alt="foto 3" /> </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Home;
