import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useState } from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "./home.css";

const Home = () => {

  const [activeVideos, setActiveVideos] = useState({
    video1: false,
    video2: false,
    video3: false
  });

  
  const handleVideoClick = (videoKey) => {
    setActiveVideos(prev => ({ ...prev, [videoKey]: true }));
  };

  return (
    <div className="home-contendor">
      <div className="home-imagenes">
        <div className="home-logo">
          <img src="logoIna.png" alt="Logo" loading="lazy" />
        </div>

        <Swiper
          modules={[Autoplay, EffectFade]}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop
          effect="fade"
          speed={1000}
          className="img"
        >
          <SwiperSlide>
            <img src="fondo1.webp" alt="Fondo 1" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="fondo2.webp" alt="Fondo 2" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="fondo3.webp" alt="Fondo 3" loading="lazy" />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="separador">
        <img
          className="fotoSeparador"
          src="txt_copy_pc.png"
          alt="Banner Inazuma Eleven"
          loading="lazy"
        />
      </div>

      <div className="home-videos">

        <div className="trailer">
          {!activeVideos.video1 ? (
            <div
              className="video-thumbnail"
              onClick={() => handleVideoClick('video1')}
            >
              <img
                src="https://img.youtube.com/vi/s9UO6I9qSQs/maxresdefault.jpg"
                alt="Modo Historia"
                loading="lazy"
              />
              <div className="play-button">
                <img src="icn_play.png" alt="Play" />
              </div>
            </div>
          ) : (
            <iframe
              src="https://www.youtube.com/embed/s9UO6I9qSQs?autoplay=1&rel=0&modestbranding=1"
              title="Trailer 1"
              allowFullScreen
              allow="autoplay"
            ></iframe>
          )}
          <h2 style={{color: "white"}}>Modo Historia</h2>
        </div>


        <div className="trailer">
          {!activeVideos.video2 ? (
            <div
              className="video-thumbnail"
              onClick={() => handleVideoClick('video2')}
            >
              <img
                src="https://img.youtube.com/vi/3LcMY6e8Voo/maxresdefault.jpg"
                alt="Modo Crónicas"
                loading="lazy"
              />
              <div className="play-button">
                <img src="icn_play.png" alt="Play" />
              </div>
            </div>
          ) : (
            <iframe
              src="https://www.youtube.com/embed/3LcMY6e8Voo?autoplay=1&rel=0&modestbranding=1"
              title="Trailer 2"
              allowFullScreen
              allow="autoplay"
            ></iframe>
          )}
          <h2 style={{color: "white"}}>Modo Crónicas</h2>
        </div>


        <div className="trailer">
          {!activeVideos.video3 ? (
            <div
              className="video-thumbnail"
              onClick={() => handleVideoClick('video3')}
            >
              <img
                src="https://img.youtube.com/vi/1n8XcE8HZL4/maxresdefault.jpg"
                alt="Modo Multijugador"
                loading="lazy"
              />
              <div className="play-button">
                <img src="icn_play.png" alt="Play" />
              </div>
            </div>
          ) : (
            <iframe
              src="https://www.youtube.com/embed/1n8XcE8HZL4?autoplay=1&rel=0&modestbranding=1"
              title="Trailer 3"
              allowFullScreen
              allow="autoplay"
            ></iframe>
          )}
          <h2 style={{color: "white"}}>Modo Multijugador</h2>
        </div>
      </div>

      <footer className="final">
        <div>

          <h5></h5>

        </div>
      </footer>

    </div>
  );
};
export default Home;