const express = require('express')
const router = express.Router()
const groupsController = require('../controllers/groupsController')
// const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')   
    .post(groupsController.createNewGroup)
    .get(groupsController.getAllGroups)
    .patch(groupsController.updateGroup)
    .delete(groupsController.deleteGroup)
router.route('/:id')
    .get(groupsController.getGroup)

module.exports = router