// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import ReviewCart from "../pages/ReviewCart";
import Register from "../pages/Register"; 
import Header from "../components/Header";

const AppRoutes = () => {
  return (
    <>
    <Header />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/review" element={<ReviewCart/>}/>
      {/* <Route path="/login" element={<Login />} /> */}
      {/* Add more routes as needed */}
    </Routes>
    </>
  );
};

export default AppRoutes;
