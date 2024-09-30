// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import Input from "../components/common/Input";
import formatPrice from "../utils/formatPrice";
import Button from "../components/common/Button";
import { validateEmail } from "../utils/validators"; // Removed unused import

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });
console.log("cart items",cartItems)
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value
    setForm({ ...form, [name]: value }); // Update state based on name
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!form.address) newErrors.address = "Address is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // In a real app, you'd process the order here
      setOrderPlaced(true);
      clearCart();
    }
  };

  if (orderPlaced) {
    return (
      <div>
        <h2>Thank You for Your Purchase!</h2>
        <p>Your order has been placed successfully.</p>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <h2>Your Cart is Empty</h2>
        <Button onClick={() => navigate("/")}>Go to Products</Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Checkout</h2>
      <h3 style={{ color: "#6fcaac" }}>Total: {formatPrice(totalPrice)}</h3>
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name" // Ensure name prop is passed
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        <Input
          label="Email"
          name="email" // Ensure name prop is passed
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="you@example.com"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <Input
          label="Address"
          name="address" // Ensure name prop is passed
          value={form.address}
          onChange={handleChange}
          placeholder="Your shipping address"
        />
        {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
        <Button type="submit">Proceeed to pay</Button>
      </form>
    </div>
  );
};

export default Checkout;
