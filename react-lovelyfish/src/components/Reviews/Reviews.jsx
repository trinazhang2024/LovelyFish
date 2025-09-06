import React, { useState, useEffect, useRef } from "react";
import './Reviews.css';

// Sample reviews data
const reviews = [
  { id: 1, name: "Alice", rating: 5, avatar: "https://i.pravatar.cc/60?img=1", content: "Amazing products! The quality exceeded my expectations." },
  { id: 2, name: "Bob", rating: 4, avatar: "https://i.pravatar.cc/60?img=2", content: "Good experience, fast shipping, will buy again." },
  { id: 3, name: "Charlie", rating: 5, avatar: "https://i.pravatar.cc/60?img=3", content: "Customer service was super helpful. Highly recommend!" },
  { id: 4, name: "Diana", rating: 5, avatar: "https://i.pravatar.cc/60?img=4", content: "Love it! Will definitely purchase more items from here." },
];

// Component to display star rating
function StarRating({ rating }) {
  return (
    <span className="stars">
      {Array.from({ length: rating }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="#f5a623" width="16" height="16">
          <polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7"/>
        </svg>
      ))}
    </span>
  );
}

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0); // Current review index
  const touchStartX = useRef(0); // Track touch start X for swipe


  // Auto carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length); // Move to next review
    }, 4000); // every 4 seconds
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  // Manual navigation
  const prevReview = () => {
    setCurrentIndex((currentIndex - 1 + reviews.length) % reviews.length); // Previous review
  };
  const nextReview = () => {
    setCurrentIndex((currentIndex + 1) % reviews.length); // Next review
  };

  // Touch/swipe events for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX; // Store initial touch X
  };
  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) prevReview();  // Swipe right: previous review
    else if (deltaX < -50) nextReview(); // Swipe left: next review
  };

  return (
    <section className="reviews-section"
             onTouchStart={handleTouchStart}
             onTouchEnd={handleTouchEnd}>

      {/* Decorative wave */}
      <div className="reviews-wave"></div>

      {/* Section title */}
      <h2 className="reviews-title">What Our Customers Say</h2>

      {/* Carousel container */}
      <div className="reviews-carousel">
        {reviews.map((r, i) => (
          <div
            key={r.id}
            className={`review-card ${i === currentIndex ? "active" : "inactive"}`}
          >
            {/* Review header: avatar + name + rating */}
            <div className="review-header">
              <img src={r.avatar} alt={r.name} className="review-avatar" />
              <div>
                <p className="review-name">{r.name}</p>
                <StarRating rating={r.rating} />
              </div>
            </div>

            {/* Review content */}
            <p className="review-content">"{r.content}"</p>
          </div>
        ))}
      </div>

      {/* Carousel navigation buttons */}
      <button className="carousel-btn left" onClick={prevReview}>❮</button>
      <button className="carousel-btn right" onClick={nextReview}>❯</button>
    </section>
  );
}
