const Group = require('../models/Group')
const User = require('../models/User')

// @desc Create new group
// @route POST /groups
// @access Private
const createNewGroup = async (req, res) => {
    const { user, numero, name } = req.body

    // Confirm data
    if (!user || !numero || !name) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate name
    const duplicate = await Group.findOne({ name }).collation({ locale: 'fr', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate group name' })
    }

    // Create and store the new user 
    const group = await Group.create({ user, numero, name })

    if (group) { // Created 
        return res.status(201).json({ message: 'New group created' })
    } else {
        return res.status(400).json({ message: 'Invalid group data received' })
    }

}


// @desc Get all groups 
// @route GET /groups
// @access Private
const getAllGroups = async (req, res) => {
    // Get all groups from MongoDB
    const groups = await Group.find().lean()

    // If no groups 
    if (!groups?.length) {
        return res.status(400).json({ message: 'No groups found' })
    }

    // // Add username to each group before sending the response 
    // // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // // You could also do this with a for...of loop
    // const groupsWithUser = await Promise.all(groups.map(async (group) => {
    //     const user = await User.findById(group.user).lean().exec()
    //     return { ...group, username: user.username }
    // }))

    // res.json(groupsWithUser)
    return res.status(200).json(groups)
}


// @desc Get all groups 
// @route GET /groups/groupeId
// @access Private
const getGroup = async (req, res) => {
    const id = await req.params.id
    const groupe = await Group.findById(id).exec()

    if (groupe.length == 0) { res.status(404).fson( {message: "Group not found"}) }

    return res.json(groupe);
}


// @desc Update a group
// @route PATCH /groups
// @access Private
const updateGroup = async (req, res) => {
    const { id, name} = req.body
 
    // Confirm data
    if (!id || !name ) {
        return res.status(400).json({ message: 'All kis fields are required' })
    }

    // Confirm group exists to update
    const group = await Group.findById(id).exec()

    if (!group) {
        return res.status(400).json({ message: 'Group not found' })
    }

    // Check for duplicate name
    const duplicate = await Group.findOne({ name }).collation({ locale: 'fr', strength: 2 }).lean().exec()

    // Allow renaming of the original group 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate group name' })
    }

    
    group.name = name

    const updatedGroup = await group.save()

    res.json(`'${updatedGroup.name}' updated`)
}


// @desc Delete a group
// @route DELETE /groups
// @access Private
const deleteGroup = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Group ID required' })
    }

    // Confirm group exists to delete 
    const group = await Group.findById(id).exec()

    if (!group) {
        return res.status(400).json({ message: 'Group not found' })
    }

    const result = await group.deleteOne()

    const reply = `Group '${result.name}' with ID ${result._id} deleted`

    res.json(reply)
}


module.exports = {
    getAllGroups,
    createNewGroup,
    getGroup,
    updateGroup,
    deleteGroup
}