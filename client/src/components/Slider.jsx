import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";

const slides = [
    "img2.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide3.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide4.png",
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/gallery/slide2.png",



];

const SliderPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    const goToSlide = (index) => {
        const slideWidth = sliderRef.current?.clientWidth || 0;
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
        }
        setCurrentSlide(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        goToSlide(currentSlide);
    }, [currentSlide]);

    return (
        <div className="flex flex-col items-center ">
            <div className="w-full max-w-6xl h-90 overflow-hidden relative rounded-lg">
                <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    ref={sliderRef}
                >
                    {slides.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-90 object-cover flex-shrink-0"
                        />
                    ))}
                </div>
            </div>
            <div className="flex items-center mt-5 space-x-2">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-300 ${index === currentSlide ? "bg-black" : "bg-black/20"
                            }`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SliderPage;
