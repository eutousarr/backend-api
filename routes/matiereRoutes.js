const express = require('express')
const router = express.Router()
const matieresController = require('../controllers/matieresController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')   
.get(matieresController.getAllMatieres)
.post(matieresController.createNewMatiere)
.patch(matieresController.updateMatiere)
.delete(matieresController.deleteMatiere)

module.exports = router