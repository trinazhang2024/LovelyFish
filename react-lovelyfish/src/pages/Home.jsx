import React from "react";
import Carousel from "../components/Carousel/Carousel";
import DiscountNew from "../components/DiscountNew/DiscountNew";
import Recommend from "../components/Recommend/Recommend";
import ProductList from '../components/ProductList/ProductList';
import productsByCategory from '../data/data'; // 引入产品数据

function Home() {
    return (
        <div>
            <Carousel />
            <DiscountNew />
            <Recommend />
            {/* 传递 limit={true}，表示限制显示4个产品 */}
            <ProductList products={productsByCategory} limit={true} />
        </div>
    );
}

export default Home;