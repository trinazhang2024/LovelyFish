import React,{ useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import CartIcon from '../Cart/CartIcon';
import './Navbar.css'; // 引入 Navbar 的样式

function Navbar() {
    const [searchQuery,setSearchQuery] = useState("")
    const navigate = useNavigate()
    const handleSearch = (e)=>{
        e.preventDefault();
        if(searchQuery.trim()){
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/assets/images/logo.png" alt="Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        {/* 产品分类下拉菜单 */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="/products" role="button" data-bs-toggle="dropdown" aria-expanded="false">产品列表</Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/products/pumps">
                                        潜水泵
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/heaters">
                                        加热棒
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/filters">
                                        过滤器
                                    </Link>
                                </li>
                            </ul>
                        </li>
                                                           
                        <li className="nav-item">
                            <Link className="nav-link" to="/new-arrivals">新到产品</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/discount">限时折扣</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">关于我们</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact Us</Link>
                        </li>
                    </ul>
                    {/* 搜索表单 */}
                    <form className="d-flex" onSubmit={handleSearch}>
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                        <button className="btn btn-outline-success" type="submit" disabled={!searchQuery.trim()}>Search</button>
                    </form>
                </div>
            </div>
            <CartIcon />
        </nav>
    );
}

export default Navbar;