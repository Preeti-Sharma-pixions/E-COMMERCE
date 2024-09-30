const express = require('express');
require("../connection")
const router = express.Router();

const Order = require('../models/order');
const OrderItem = require('../models/order-item');
//finding the orders
// router.get('/', async (req, res) => {
//     const orderList = await Order.find()
//     .populate('user' ,'name').sort({'dateOrdered':-1})
//     .populate({ 
//         path: 'orderItems', populate: { 
//             path: 'product', populate: 'category'}
//     });

//     if (!orderList) {
//         res.status(500).json({ success: false })
//     }
//     res.send(orderList)
// })
//finding orders by id 
// router.get('/:id', async (req, res) => {
//     const order = await Order.findById(req.params.id).populate('name', 'user');

//     if (!order) {
//         res.status(500).json({ success: false })
//     }
//     res.send(order)
// })
//for cart items
// router.post('/cart', async (req, res) => {
//     // Create a new user object
//     let cartItem = new OrderItem({
//         product:req.body.product,
//         name: req.body.name,
//         price:req.body.price,
//         quantity:req.body.quantity ,
//         totalPrice:req.body.totalPrice,
//         user:req.body.user
//     });
//     try {
//         console.log("product id",cartItems.product);
//         const orderItem = await OrderItem.findById(cartItems.user);
//         console.log("orderitem",orderItem);
//         if(orderItem!==null && user === orderItem.email){
//          cart
//         console.log("cartitem",cart);
//         }
//         else{


//         }
//         // Save user to the database
//        let cart = await cartItem.save();
//         if (!cart) return res.status(500).send('cart item  cannot be created');

//         // Send the created user as the response
//         res.status(201).send(cartItem);
//     } catch (error) {
//         // Catch any errors during saving
//         return res.status(500).send('Error: ' + error.message);
//     }
// });
router.post('/cart', async (req, res) => {
    try {
        const { product, name, price, quantity, totalPrice, user } = req.body;

        // First, try to find an existing cart item for this product and user
        let existingCartItem = await OrderItem.findOne({ product: product, user: user });

        if (existingCartItem) {
            // If the item exists, update the quantity and total price
            existingCartItem.quantity = quantity;
            existingCartItem.totalPrice += totalPrice;
            
            // Save the updated cart item
            const updatedCartItem = await existingCartItem.save();
            
            console.log("Updated cart item:", updatedCartItem);
            res.status(200).send(updatedCartItem);
        } else {
            // If the item doesn't exist, create a new cart item
            let newCartItem = new OrderItem({
                product,
                name,
                price,
                quantity,
                totalPrice,
                user
            });

            // Save the new cart item
            const savedCartItem = await newCartItem.save();

            console.log("New cart item created:", savedCartItem);
            res.status(201).send(savedCartItem);
        }
    } catch (error) {
        console.error('Error processing cart item:', error);
        res.status(500).send('Error: ' + error.message);
    }
});
router.get('/cart', async (req, res) => {
    // Create a new user object
    const cart = await OrderItem.find()
    try{
    if (!cart || cart.length === 0) {
        return res.status(404).json({ success: false, message: 'No cart found' });
    }
    res.status(200).send(cart);
} catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
}
})
//posting request
router.post('/', async (req, res) => {
   
    const orderItemsIds = Promise.all(req.body.orderItems.map( async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a+ b , 0 );

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })

    order = await order.save();

    if (!order)
        return res.status(404).send('Order cannot be created')
    res.send(order);
})
//updating id an update
// router.put('/:id', async (req, res) => {
//     const order = await Order.findByIdAndUpdate(req.params.id, {
//         status: req.body.status,
//     }, {
//         new: true
//     })

//     if (!order)
//         return res.status(404).send('Order cannot be created')
//     res.send(order);
// })
//deleting by id
// router.delete('/delete-cart/:id', (req, res) => {
//     OrderItem.findByIdAndRemove(req.params.id).then(async order => {
//         if (order) {
//             await OrderItem.map(async orderItem =>{
//                 await OrderItem.findByIdAndRemove(orderItem)
//             })
//             return res.status(200).json({ success: true, message: 'Order deleted successfully' })
//         } else {
//             return res.status(404).json({ success: false, message: 'Order cannot find' })
//         }
//     }).catch(err => {
//         return res.status(400).json({ success: false, error: err })
//     })
// })
///orders/delete-cart/

router.post('/deletecart/:productId', async (req, res) => {
    const { productId } = req.params;
    const user=req.body.user;
    console.log("user",user);
console.log("productId",productId);
    try {
        // Find the order item by productId
        const cartItem = await OrderItem.findOneAndDelete({ productId ,user});
   console.log("orderitems",cartItem);
        if (cartItem) {
            return res.status(200).json({ success: true, message: 'Order item deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'Order item not found' });
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
});



//getting count of orders
router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count);
    if (!orderCount) {
        res.status(500), json({ success: false })
    }
    res.status(200).send({
        orderCount: orderCount
    });
})
//getting total sales
router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id: null, totalsales:{ $sum :'$totalPrice'}}}
    ])

    if (!totalSales){
        return res.status(400).send('the order sales cannot be generated')
    }
    res.send({ totalsales: totalSales.pop().totalsales})
})
//getting user by userid
router.get('/get/usersorders/:userid', async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid})
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }
    res.send(userOrderList)
})

module.exports = router;