import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext"; // Get user info and logout function
import { useCart } from "../../contexts/CartContext"; // Get cart total quantity
import { FaShoppingCart } from "react-icons/fa";
import './Navbar.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState(""); // Controlled search input
  const navigate = useNavigate();

  const { user, logout } = useUser(); // User context: user info and logout function
  const { totalQuantity } = useCart(); // Cart context: total items in cart

  /**
   * Handle search form submission
   * Navigate to /search?q=<encoded query>
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear input after search
    }
  };

  /**
   * Handle logout
   * Calls logout from UserContext, then navigate to home
   */
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout(); // Clear user session
      navigate('/');  // Redirect to homepage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src="/assets/images/logo.png" alt="Logo" />
        </Link>

        {/* Hamburger toggle for mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links and search */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto">
            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>

            {/* Products dropdown */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" to="/products" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Products
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/products/waterpumps">Water Pumps</Link></li>
                <li><Link className="dropdown-item" to="/products/filters">Filters</Link></li>
                <li><Link className="dropdown-item" to="/products/wavemakers">Wave Makers</Link></li>
                <li><Link className="dropdown-item" to="/products/airpumps">Air Pumps</Link></li>
                <li><Link className="dropdown-item" to="/products/heaters">Heaters</Link></li>
                <li><Link className="dropdown-item" to="/products/filtration">Filtration</Link></li>
                <li><Link className="dropdown-item" to="/products/ledlights">Led Lights</Link></li>
                <li><Link className="dropdown-item" to="/products/spongefoams">Foams and Sponge Filters</Link></li>
                <li><Link className="dropdown-item" to="/products/other">Others</Link></li>
              </ul>
            </li>

            {/* Other pages */}
            <li className="nav-item"><Link className="nav-link" to="/new-arrivals">New Arrivals</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/clearance">Clearance</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
          </ul>

          {/* Search form */}
          <form className="d-flex" onSubmit={handleSearch}>
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search" 
              aria-label="Search" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button className="btn btn-outline-success btn-sm" type="submit" disabled={!searchQuery.trim()}>
              Search
            </button>
          </form>

          {/* User login/logout */}
          <ul className="navbar-nav">
            {user ? (
              <>
                {/* Welcome message */}
                <li className="nav-item">
                  <span className="nav-link">Welcome, {user.name || user.email || 'User'}</span>
                </li>

                {/* Settings dropdown */}
                <li className="nav-item dropdown settings-dropdown">
                  <span className="nav-link dropdown-toggle">Settings</span>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>

          {/* Cart icon */}
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
