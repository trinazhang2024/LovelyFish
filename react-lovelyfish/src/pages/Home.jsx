// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel/Carousel";
import DiscountNew from "../components/DiscountNew/DiscountNew";
import Recommend from "../components/Recommend/Recommend";
import ProductList from '../components/ProductList/ProductList';
import Reviews from "../components/Reviews/Reviews";
import { useCart } from '../contexts/CartContext';
import api from '../API/axios';

function Home() {
    const [products, setProducts] = useState([]); // State to store fetched products
    const { addToCart, addingIds } = useCart();   // Get cart methods and currently adding IDs

    // Fetch products from backend on component mount
    useEffect(() => {
        api.get('/Product')
            .then((res) => {
                setProducts(res.data.items); // Store fetched product list
            })
            .catch((error) => {
                console.error('Error fetching products:', error); // Log any fetch errors
            });
    }, []);

    return (
        <div>
            {/* Carousel banner component */}
            <Carousel />

            {/* Discount or new arrivals section */}
            <DiscountNew />

            {/* Recommended products section */}
            <Recommend />

            {/* Product list component */}
            <ProductList 
               products={products}   // Pass the fetched products
               limit={true}          // Limit the number of products displayed
               addToCart={addToCart} // Pass function to add products to cart
               addingIds={addingIds} // Pass IDs of products currently being added
            />

            {/* Customer reviews section */}
            <Reviews /> 
        </div>
    );
}

export default Home;
