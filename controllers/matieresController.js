const Matiere = require('../models/Matiere')
const User = require('../models/User')
const Category = require('../models/Category')
const Group = require('../models/Group')
const { find } = require('../models/Matiere')

// @desc Create new matiere
// @route POST /matieres
// @access Private
const createNewMatiere = async (req, res) => {
    const {user, group, category, designation } = req.body
    // groups = await Group.find().lean()
    // const categories = await Category.find().lean()

    // Confirm data
    if (!user || !group || !category || !designation) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await Matiere.findOne({ designation }).collation({ locale: 'fr', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate designation matiere' })
    }

    // Create and store the new user 
    const matiere = await Matiere.create({user, group, category, designation })

    if (matiere) { // Created 
        return res.status(201).json({ message: 'New matiere created' })
    } else {
        return res.status(400).json({ message: 'Invalid matiere data received' })
    }

}


// @desc Get all matieres 
// @route GET /matieres
// @access Private
const getAllMatieres = async (req, res) => {
    // Get all matieres from MongoDB
    const matieres = await Matiere.find().lean()

    // If no matieres 
    if (!matieres?.length) {
        return res.status(400).json({ message: 'No matieres found' })
    }

    // Add username to each matiere before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const matieresWithUser = await Promise.all(matieres.map(async (matiere) => {
        const user = await User.findById(matiere.user).lean().exec()
        const cat = await Category.findById(matiere.category).lean().exec()
        const group = await Group.findById(matiere.group).lean().exec()
        return { ...matiere, username: user.username, categorie: cat.name, codeCat:cat.numero, codeGroup: group.numero }
    }))

    res.json(matieresWithUser)
}

// @desc Update a matiere
// @route PATCH /matieres
// @access Private
const updateMatiere = async (req, res) => {
    const { id, designation, numero, group, category, completed } = req.body
 
    // Confirm data
    if (!id || !designation || !numero || !group || !category || !completed) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm matiere exists to update
    const matiere = await Matiere.findById(id).exec()

    if (!matiere) {
        return res.status(400).json({ message: 'Matiere not found' })
    }

    // Check for duplicate designation
    const duplicate = await Matiere.findOne({ designation }).collation({ locale: 'fr', strength: 2 }).lean().exec()

    // Allow renaming of the original matiere 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate matiere designation' })
    }

    
    matiere.designation = designation

    const updatedMatiere = await matiere.save()

    res.json(`'${updatedMatiere.designation}' updated`)
}


// @desc Delete a matiere
// @route DELETE /matieres
// @access Private
const deleteMatiere = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Matiere ID required' })
    }

    // Confirm matiere exists to delete 
    const matiere = await Matiere.findById(id).exec()

    if (!matiere) {
        return res.status(400).json({ message: 'Matiere not found' })
    }

    const result = await matiere.deleteOne()

    const reply = `Matiere: '${result.numero}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllMatieres,
    createNewMatiere,
    updateMatiere,
    deleteMatiere
}