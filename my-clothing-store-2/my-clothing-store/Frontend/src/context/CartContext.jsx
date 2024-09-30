// src/context/CartContext.jsx
import React, { createContext, useState } from "react";
import axios from 'axios';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const initialCart = JSON.parse(localStorage.getItem("cart")) || [];
  const [cartItems, setCartItems] = useState(initialCart);

  // const addToCart = async(product, quantity = 1) => {
  //   const API_URL = 'http://localhost:3000/api/v1';
  //   setCartItems((prevItems) => {
  //     const existing = prevItems.find((item) => item.id === product.id);
  //     let updatedCart;
  //     console.log("items in cart",item)
  //     if (existing) {
  //       updatedCart = prevItems.map((item) =>
  //         item.id === product.id
  //           ? { ...item, quantity: item.quantity + quantity }
  //           : item
  //       );
  //       console.log("quantity",item.quantity);// ypu can insert here the api for updating the quantity of the product
  //     } else {
  //       updatedCart = [...prevItems, { ...product, quantity }];// add another order item in the cart
  //     }
  //     const { image, ...productWithoutImage } = product;
  //     const data = await axios.post(`${API_URL}/orders/cart`,{productWithoutImage,quantity});
  //     localStorage.setItem("cart", JSON.stringify(updatedCart));
  //     return updatedCart;
  //   });
  // };

  const addToCart = async (product, quantity = 1) => {
  //   const API_URL = 'http://localhost:3000/api/v1';
  
  //   try {
  //     // We'll use a promise to get the updated cart
  //     sessionStorage.getitem('user');
  //     console.log("user",user);
  //     const updatedCart = await new Promise((resolve) => {
  //       setCartItems((prevItems) => {
  //         const existing = prevItems.find((item) => item.id === product.id);
  //         let newCart;
  
  //         if (existing) {
  //           newCart = prevItems.map((item) =>
  //             item.id === product.id
  //               ? { ...item, quantity: item.quantity + quantity }
  //               : item
  //           );
  //           console.log("quantity", existing.quantity + quantity);
  //         } else {
  //           newCart = [...prevItems, { ...product, quantity }];
  //         }
  
  //         resolve(newCart); // Resolve the promise with the new cart
  //         return newCart; // Return for setCartItems
  //       });
  //     });
  
  //     // Now we can use the updated cart
  //     console.log("items in cart", updatedCart);
  
  //     // Prepare the data for the API call
  //     const { image, ...productWithoutImage } = product;
  //     const data={quantity: updatedCart.find(item => item.id === product.id)?.quantity || quantity,productWithoutImage}
  //     // Make the API call
  //     const response = await axios.post(`${API_URL}/orders/cart`, data);
  
  //     // Update localStorage
  //     localStorage.setItem("cart", JSON.stringify(updatedCart));
  
  //     // You can return the API response or the updated cart if needed
  //     return response.data;
  
  //   } catch (error) {
  //     console.error("Error adding to cart:", error);
  //     throw error; // Re-throw the error so it can be handled by the caller if needed
  //   }
  // };
//   const API_URL = 'http://localhost:3000/api/v1';
//   try {
//     const updatedCart = await new Promise((resolve) => {
//       setCartItems((prevItems) => {
//         const existing = prevItems.find((item) => item.id === product.id);
//         let newCart;

//         if (existing) {
//           newCart = prevItems.map((item) =>
//             item.id === product.id
//               ? { ...item, quantity: item.quantity + quantity }
//               : item
//           );
//         } else {
//           newCart = [...prevItems, { ...product, quantity }];
//         }

//         resolve(newCart);
//         return newCart;
//       });
//     });

//     console.log("items in cart", updatedCart);

//     // Prepare the data for the API call
//     const { image, ...productWithoutImage } = product;
//     const cartItems = [{
//       quantity: updatedCart.find(item => item.id === product.id)?.quantity || quantity,
//       product: productWithoutImage,
//       name:product.name,
//       price:product.price,
      
//       user : user.email
//     }];

//     // Make the API call
//     const response = await axios.post(`${API_URL}/orders/cart`, { cartItems });

//     localStorage.setItem("cart", JSON.stringify(updatedCart));

//     return response.data;

//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     throw error;
//   }
// };
const API_URL = 'http://localhost:9000/api/v1';
const user=JSON.parse(sessionStorage.getItem('user'));
      console.log("user",user);
  
try {
  const updatedCart = await new Promise((resolve) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        // call here api of update 
      } else {
        newCart = [...prevItems, { ...product, quantity }];
      //call here pai of post
      }
      resolve(newCart);
      return newCart;
    });
  });

  //console.log("items in cart", updatedCart);

  // Prepare the data for the API call
  const { image, ...productWithoutImage } = product;
  const updatedItem = updatedCart.find(item => item.id === product.id);
  const itemQuantity = updatedItem ? updatedItem.quantity : quantity;
  const totalPrice = itemQuantity * product.price;

  const cartItems ={
    product: product.id,
    quantity: itemQuantity,
    name: product.name,
    price: product.price,
    totalPrice: totalPrice,  // Add the calculated total price
    user: user.email
  };
  console.log("cartItems",cartItems);
  // Make the API call
  const response = await axios.post(`${API_URL}/orders/cart`, cartItems );
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  return response.data;
} catch (error) {
  console.error("Error adding to cart:", error);
  throw error;
}
};

  // const removeFromCart = async(productId) => {
  //   setCartItems((prevItems) => {// you can insert the remove api 
  //     const updatedCart = prevItems.filter((item) => item.id !== productId);
  //     console.log("updatedcart",updatedCart);
  //     const data = await axios.delete(`${API_URL}/orders/delete-cart/${updatedCart.id}`)
  //     localStorage.setItem("cart", JSON.stringify(updatedCart));
  //     return updatedCart;
  //   });
  // };

  const removeFromCart = async (productId) => {
    const API_URL = 'http://localhost:9000/api/v1';
    console.log("pid",productId);
    const user=JSON.parse(sessionStorage.getItem('user'));
    console.log("user",user.email);
    const body={user:user.email};
    console.log("bo",body);
    try {
      // First, update the local state
      const updatedCart = await new Promise((resolve) => {
        setCartItems((prevItems) => {
          const newCart = prevItems.filter((item) => item.id !== productId);
          resolve(newCart);
          return newCart;
        });
      });
        console.log("updatedcart", updatedCart);
              // Then, make the API call
      if (updatedCart.length > 0) {
        const response = await axios.post(`${API_URL}/orders/deletecart/${productId}`,body)
        console.log("Delete response:", response.data);
      }   
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
      console.error("Error removing item from cart:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const clearCart = () => {
    setCartItems([]);// you can dleete the whole cart from here 
    localStorage.removeItem("cart");
  };
const reviewCart=()=>{
  
}
  const updateQuantity = (productId, quantity) => {// uodating the quantity of the products
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
