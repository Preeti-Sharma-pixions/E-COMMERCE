const express = require('express');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
require("../connection")
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success:false})
    }
    res.send(userList);
})

router.get ('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ success: false, message: 'The user with the given ID not exists' })
    }
    res.status(200).send(user)
    
})
//using this to register the user into the database
router.post('/register', async (req, res) => {
    // Create a new user object
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
        
    });

    try {
        // Save user to the database
       let user = await newUser.save();
        if (!user) return res.status(500).send('User cannot be created');

        // Send the created user as the response
        res.status(201).send(user);
    } catch (error) {
        // Catch any errors during saving
        return res.status(500).send('Error: ' + error.message);
    }
});
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'User deleted successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'User cannot find' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email})

    if(!user) {
        return res.status(400).send('User with given Email not found');
    }
    if(user && bcrypt.compareSync(req.body.password ,user.password)) {
       
       res.status(200).send({user: user.email, userId: user._id});
    } else {
     res.status(400).send('Password is mismatch');
    }

})

// router.get('/get/count', async (req, res) => {
//     const userCount = await User.countDocuments({});//changes made here (count) => count-replace this with {}
//     if (!userCount) {
//         res.status(500), json({ success: false })
//     }
//     res.status(200).send({
//         userCount: userCount
//     });
// })

module.exports = router;