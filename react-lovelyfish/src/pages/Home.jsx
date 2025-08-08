// src/pages/Home.js
import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel/Carousel";
import DiscountNew from "../components/DiscountNew/DiscountNew";
import Recommend from "../components/Recommend/Recommend";
import ProductList from '../components/ProductList/ProductList';
import axios from 'axios';

function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7148/api/Product')
            .then((response) => {
                setProducts(response.data);
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
        </div>
    );
}

export default Home;
