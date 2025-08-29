// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel/Carousel";
import DiscountNew from "../components/DiscountNew/DiscountNew";
import Recommend from "../components/Recommend/Recommend";
import ProductList from '../components/ProductList/ProductList';
import Reviews from "../components/Reviews/Reviews";
import api from '../API/axios';

function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/Product')
            .then((response) => {
                setProducts(response.data.items);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div>
            <Carousel />
            <DiscountNew />
            <Recommend />
            <ProductList products={products} limit={true} />
            <Reviews /> 
        </div>
    );
}

export default Home;
