import React from "react";
import Footer from '../Footer/Footer'
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="wrapper">
      <main className="content">{children}</main>
      <Footer /> 
    </div>
  );
};

export default Layout;
