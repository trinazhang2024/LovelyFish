// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel/Carousel";
import DiscountNew from "../components/DiscountNew/DiscountNew";
import Recommend from "../components/Recommend/Recommend";
import ProductList from '../components/ProductList/ProductList';
import Reviews from "../components/Reviews/Reviews";
import {useCart} from '../contexts/CartContext'
import api from '../API/axios';

function Home() {
    const [products, setProducts] = useState([]);
    const { addToCart, addingIds } = useCart();      // ✅ 拿到cart方法和状态

    useEffect(() => {
        api.get('/Product')
            .then((res) => {
                setProducts(res.data.items);
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
            <ProductList 
               products={products} 
               limit={true}
               addToCart={addToCart} 
               addingIds={addingIds} />
            <Reviews /> 
        </div>
    );
}

export default Home;
