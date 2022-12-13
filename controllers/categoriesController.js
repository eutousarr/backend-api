const Category = require('../models/Category')
const User = require('../models/User')

// @desc Create new category
// @route POST /categories
// @access Private
const createNewCategory = async (req, res) => {
    const { numero, name, user } = req.body

    // Confirm data
    if (!numero || !name) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await Category.findOne({ name }).collation({ locale: 'fr', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate category name' })
    }

    // Create and store the new user 
    const category = await Category.create({ numero, name, user })

    if (category) { // Created 
        return res.status(201).json({ message: 'New category created' })
    } else {
        return res.status(400).json({ message: 'Invalid category data received' })
    }

}

// @desc Get all categorys 
// @route GET /categories
// @access Private
const getAllCategorys = async (req, res) => {
    // Get all categorys from MongoDB
    const categorys = await Category.find().lean()

    // If no categorys 
    if (!categorys?.length) {
        return res.status(400).json({ message: 'No category found' })
    }

    // Add username to each category before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const categorysWithUser = await Promise.all(categorys.map(async (category) => {
        const user = await User.findById(category.user).lean().exec()
        return { ...category, username: user.username }
    }))

    res.json(categorysWithUser)
}

// @desc Update a category
// @route PATCH /categories
// @access Private
const updateCategory = async (req, res) => {
    const { id, numero, name, completed, validedBy } = req.body
    
    // Confirm data
    if (!id || !numero || !name) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm category exists to update
    const category = await Category.findById(id).exec()

    if (!category) {
        return res.status(400).json({ message: 'Category not found' })
    }

    // Check for duplicate name
    const duplicate = await Category.findOne({ name }).collation({ locale: 'fr', strength: 2 }).lean().exec()

    // Allow renaming of the original category 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate category name' })
    }

    category.name = name
    category.numero = numero
    category.completed = completed
    category.validedBy = validedBy
    
        await category.save()

    const updatedCategory = await category.save()

    res.json(`'${updatedCategory.name}' updated`)
}

// @desc Delete a category
// @route DELETE /categorys
// @access Private
const deleteCategory = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Category ID required' })
    }

    // Confirm category exists to delete 
    const category = await Category.findById(id).exec()

    if (!category) {
        return res.status(400).json({ message: 'Category not found' })
    }

    const result = await category.deleteOne()

    const reply = `Category '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}
module.exports = {
    getAllCategorys,
    createNewCategory,
    updateCategory,
    deleteCategory
}