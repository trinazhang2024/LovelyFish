import React from "react";
import './Carousel.css'; // 引入 Carousel 的样式

function Carousel() {
    return (
        <div id="carouselExampleIndicators" className="carousel slide">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="/assets/uploads/banner_1.jpg" className="d-block w-100" alt="Slide 1" />
                </div>
                <div className="carousel-item">
                    <img src="/assets/uploads/banner_2.jpg" className="d-block w-100" alt="Slide 2" />
                </div>
                <div className="carousel-item">
                    <img src="/assets/uploads/banner_3.jpg" className="d-block w-100" alt="Slide 3" />
                </div>
                <div className="carousel-item">
                    <img src="/assets/uploads/banner_4.jpg" className="d-block w-100" alt="Slide 4" />
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default Carousel;