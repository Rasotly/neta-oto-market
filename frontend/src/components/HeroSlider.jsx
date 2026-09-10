import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "2026 Model Civic Body Kitleri Geldi!",
    description: "Aracınıza yepyeni bir görünüm kazandıracak orijinal ve yan sanayi gövde kitleri stoklarımızda.",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600",
    cta: "Hemen İncele"
  },
  {
    id: 2,
    title: "Yeni Nesil Multimedya Sistemleri",
    description: "Android Auto ve Apple CarPlay destekli, yüksek çözünürlüklü dokunmatik ekranlar ile yolculuklarınız daha keyifli.",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1600",
    cta: "Ürünleri Gör"
  },
  {
    id: 3,
    title: "Kaliteli Led Far Dönüşümleri",
    description: "Gece görüşünüzü mükemmelleştiren, yüksek aydınlatma gücüne sahip özel far ampulleri ve setleri.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1600",
    cta: "Aydınlatmaları Keşfet"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content-container">
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <button className="btn btn-primary cta-btn">{slide.cta}</button>
            </div>
          </div>
        </div>
      ))}
      
      <button className="slider-btn prev-btn" onClick={prevSlide}>
        <ChevronLeft size={32} />
      </button>
      <button className="slider-btn next-btn" onClick={nextSlide}>
        <ChevronRight size={32} />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
