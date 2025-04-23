import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ items = [] }) => {
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop the slides
    speed: 500, // Transition speed in ms
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay interval in ms (3 seconds)
    pauseOnHover: true, // Pause autoplay on hover
    arrows: true, // Show navigation arrows (can be styled or hidden if needed)
    // You can customize arrows using prevArrow and nextArrow properties if desired
    // Responsive settings can be added here if needed
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       infinite: true,
    //       dots: true
    //     }
    //   },
    //   // Add more breakpoints as needed
    // ]
  };

  if (!items || items.length === 0) {
    // Optionally return a placeholder or null if no items
    return null; // Or a placeholder div
  }

  return (
    // It's good practice to wrap the slider in a div for styling control
    <div className="w-full slick-container">
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item._id || item.id} className="relative h-64 md:h-80 lg:h-96 focus:outline-none"> {/* Adjust height as needed */}
            {/* Image container */}
            <div className="absolute inset-0">
              <img
                src={item.imageUrl}
                alt={item.title || 'Carousel Image'}
                className="w-full h-full object-cover" // Ensure image covers the area
                onError={(e) => { e.target.style.display = 'none'; /* Hide image on error */ }}
              />
              {/* Optional: Fallback background if image fails */}
              <div className="absolute inset-0 bg-gray-200 -z-10"></div>
            </div>

            {/* Overlay with Text and Link (Optional) */}
            {(item.title || item.description || item.link) && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                  {item.description && <p className="text-white text-md md:text-lg mb-4 hidden sm:block">{item.description}</p>} { /* Hide description on small screens */}
                  {item.link && (
                    <Link
                        to={item.link} // Assuming item.link is a valid route or external URL
                        className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors duration-300"
                        target={item.link.startsWith('http') ? '_blank' : '_self'} // Open external links in new tab
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      了解更多
                    </Link>
                  )}
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel; 