const express = require('express');
require("../connection")
const router = express();
//display all the products
router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false})
    }
    res.status(200).send(categoryList)
})
//filtering of products by id
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ success: false, message: 'The category with the given ID not exists'})
    }
    res.status(200).send(category)
})
//filtering of products by category
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
    })

    category = await category.save();

    if(!category)
    return res.status(404).send('Category cannot be created')
    res.send(category);
})
//filtering by id and update it
router.put('/:id',  async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }, { 
        new: true 
    })

    if (!category)
        return res.status(404).send('Category cannot be created')
    res.send(category);
})
//find the product by id an delete
router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200).json({ success: true, message: 'Category deleted successfully'})
        } else {
            return res.status(404).json({ success: false, message: 'Category cannot find'})
        }
    }).catch (err=>{
        return res.status(400).json({ success: false, error: err})
    })
})

module.exports = router;