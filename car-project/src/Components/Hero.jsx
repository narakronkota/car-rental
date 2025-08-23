import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import ReactPlayer from "react-player";
import Modal from "react-modal";
import { FiPlayCircle } from "react-icons/fi";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1676288176869-b2e1c6bea1a4?q=80&w=1170&auto=format&fit=crop",
    title: "A Luxury Cars",
    subtitle: "EXPLORE ALL CAR.",
    video: "https://www.youtube.com/watch?v=t0i_DT81oqk",
  },
  {
    image: "https://images.unsplash.com/photo-1599599054812-1fee22d625e1?q=80&w=1170&auto=format&fit=crop",
    title: "Relax by the Ocean",
    subtitle: "Wake up with the sound of waves.",
    video: "https://youtu.be/t0i_DT81oqk?si=9p8zig_p2qzxl1Bj",
  },
  {
    image: "https://images.unsplash.com/photo-1696280683320-ff9f7d1dd169?q=80&w=627&auto=format&fit=crop",
    title: "Modern City Vibes",
    subtitle: "Stay in the heart of everything.",
    video: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  },
];

Modal.setAppElement("#root");

export default function Hero() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  const openModal = (videoUrl) => {
    setCurrentVideo(videoUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentVideo("");
  };

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="slide"
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${s.image})` }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10" />
            {/* Text + ปุ่มวิดีโอ */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                {s.title}
              </h1>
              <p className="mt-4 text-base md:text-5xl opacity-90">{s.subtitle}</p>
              <button
                onClick={() => openModal(s.video)}
                className="mt-6 text-6xl text-white hover:text-red-500 transition-colors"
              >
                <FiPlayCircle />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Modal วิดีโอ */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4"
        overlayClassName="fixed inset-0 bg-black/50 z-40"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
        >
          &times;
        </button>
        <ReactPlayer
          url={currentVideo}
          playing={true}       // ✅ Auto play
          controls
          width="80vw"
          height="45vw"
        />
      </Modal>
    </section>
  );
}
