import React,{ useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext"
import { FaShoppingCart } from "react-icons/fa";
//import CartIcon from '../Cart/CartIcon';
import './Navbar.css'; 

function Navbar() {
    const [searchQuery,setSearchQuery] = useState("")
    const navigate = useNavigate()
    
    // 从 UserContext 拿到当前用户信息和登出函数
    const { user, logout } = useUser();
    
    // 处理搜索表单提交，跳转到搜索结果页
    const handleSearch = (e)=>{
        e.preventDefault();
        if(searchQuery.trim()){
            // URL编码，防止特殊字符破坏URL
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(""); // 搜索后清空输入框
        }
    }

    //增加了 handleLogout 函数，调用 logout() 清理状态后，马上用 navigate('/') 跳到首页。
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
          await logout();    // 调用 UserContext 的异步 logout 函数，清理状态和调用后端
          navigate('/');     // 登出成功后跳转首页
        } catch (error) {
          // 可根据需要展示错误信息
          console.error("Logout failed:", error);
        }
      };

    const { totalQuantity } = useCart();
    

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/assets/images/logo.png" alt="Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        {/* Category Selection Dropdown */}
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="/products" role="button" data-bs-toggle="dropdown" aria-expanded="false">Products</Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/products/waterpumps">
                                        Water Pumps
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/filters">
                                        Filters
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/wavemakers">
                                        Wave Makers
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/airpumps">
                                        Air Pumps
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/heaters">
                                        Heaters
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/filtration">
                                        Filtration
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/ledlights">
                                        Led Lights
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/spongefoams">
                                        Foams and Sponge Filters
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/products/other">
                                        Others
                                    </Link>
                                </li>
                            </ul>
                        </li>
                                                           
                        <li className="nav-item">
                            <Link className="nav-link" to="/new-arrivals">New Arrivals</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/clearance">Clearance</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact Us</Link>
                        </li>
                    </ul>
                    {/* Search Form */}
                    <form className="d-flex" onSubmit={handleSearch}>
                        <input 
                           className="form-control me-2" 
                           type="search" 
                           placeholder="Search" 
                           aria-label="Search" 
                           value={searchQuery} 
                           onChange={(e)=>setSearchQuery(e.target.value)}/>
                        <button className="btn btn-outline-success btn-sm" type="submit" disabled={!searchQuery.trim()}>Search</button>
                        
                    </form>
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    {/* 如果没有 name，显示 email，否则显示“User” */}
                                    <span className="nav-link">Welcome, {user.name || user.email || 'User'}</span>
                                </li>

                                <li className="nav-item dropdown settings-dropdown">
                                    <span className="nav-link dropdown-toggle">
                                        Settings
                                    </span>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link className="dropdown-item" to="/profile">Profile</Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/orders">Orders</Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                     {/* 购物车图标 */}
                    <Link to="/cart" className="cart-icon">
                        <FaShoppingCart size={20} />
                        {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
                    </Link>
                </div>
            </div>           
        </nav>
    );
}

export default Navbar;