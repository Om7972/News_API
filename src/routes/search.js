const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/**
 * Search Routes
 */

// GET /search - Search results page
router.get('/', searchController.index);

// GET /search/suggestions - Search suggestions API
router.get('/suggestions', searchController.suggestions);

module.exports = router;