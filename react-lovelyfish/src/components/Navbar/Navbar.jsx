import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'; // 引入 Navbar 的样式

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <img src="/assets/images/logo.png" alt="Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">产品列表</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/new">新到产品</Link>
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
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;