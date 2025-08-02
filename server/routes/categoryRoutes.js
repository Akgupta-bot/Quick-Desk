// routes/categoryRoutes.js

const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/userController');

const router = express.Router();

// This route is for any authenticated user to fetch the list of categories
// so they can be displayed in a dropdown when creating a ticket.
router.get(
    '/',
    authController.protect, // Ensures user is logged in
    categoryController.getAllCategories
);


// All routes below this point are protected and restricted to Admins only.
router.use(authController.protect, authController.restrictTo('Admin'));

router.post(
    '/',
    categoryController.createCategory
);

router
    .route('/:id')
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;
