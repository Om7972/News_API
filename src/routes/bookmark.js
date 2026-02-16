const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');

/**
 * Bookmark Routes
 */

// GET /bookmarks - Bookmarks page
router.get('/', bookmarkController.index);

// POST /bookmarks/add - Add bookmark
router.post('/add', bookmarkController.add);

// POST /bookmarks/remove - Remove bookmark
router.post('/remove', bookmarkController.remove);

// GET /bookmarks/check - Check if bookmarked
router.get('/check', bookmarkController.check);

module.exports = router;