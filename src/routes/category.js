const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * Category Routes
 */

// GET /categories - All categories page
router.get('/', categoryController.index);

// GET /categories/:category - Specific category page
router.get('/:category', categoryController.show);

module.exports = router;