const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

/**
 * Article Routes
 */

// GET /article - Article details page
router.get('/', articleController.show);

module.exports = router;