const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

/**
 * Home Routes
 */

// GET / - Home page with trending news
router.get('/', homeController.index);

// GET /load-more - API endpoint for infinite scroll
router.get('/load-more', homeController.loadMore);

module.exports = router;