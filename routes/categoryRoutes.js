const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoriesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')   
    .post(categoryController.createNewCategory)
    .get(categoryController.getAllCategorys)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory)

module.exports = router