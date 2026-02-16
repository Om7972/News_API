/**
 * Bookmark Controller - Handles user bookmarks
 * Note: In a real app, this would use a database
 * For now, we'll simulate with in-memory storage
 */
class BookmarkController {
  constructor() {
    // In-memory storage for demo purposes
    this.bookmarks = new Map();
  }

  /**
   * Render bookmarks page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async index(req, res) {
    try {
      // In a real app, get user ID from session
      const userId = this.getUserId(req);
      const userBookmarks = this.bookmarks.get(userId) || [];

      res.render('bookmarks', {
        title: 'My Bookmarks',
        bookmarks: userBookmarks,
        userPreferences: this.getUserPreferences(req)
      });
    } catch (error) {
      console.error('Bookmark controller error:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load bookmarks.',
        error: process.env.NODE_ENV === 'development' ? error : {}
      });
    }
  }

  /**
   * Add article to bookmarks
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async add(req, res) {
    try {
      const { article } = req.body;
      const userId = this.getUserId(req);

      if (!article) {
        return res.status(400).json({
          success: false,
          message: 'Article data is required'
        });
      }

      // Get user's bookmarks
      const userBookmarks = this.bookmarks.get(userId) || [];

      // Check if already bookmarked
      const exists = userBookmarks.some(b => b.url === article.url);
      if (exists) {
        return res.json({
          success: false,
          message: 'Article already bookmarked'
        });
      }

      // Add bookmark with timestamp
      const bookmark = {
        ...article,
        bookmarkedAt: new Date().toISOString()
      };

      userBookmarks.push(bookmark);
      this.bookmarks.set(userId, userBookmarks);

      res.json({
        success: true,
        message: 'Article bookmarked successfully',
        bookmarksCount: userBookmarks.length
      });
    } catch (error) {
      console.error('Add bookmark error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bookmark article'
      });
    }
  }

  /**
   * Remove article from bookmarks
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async remove(req, res) {
    try {
      const { url } = req.body;
      const userId = this.getUserId(req);

      const userBookmarks = this.bookmarks.get(userId) || [];
      const filteredBookmarks = userBookmarks.filter(b => b.url !== url);

      this.bookmarks.set(userId, filteredBookmarks);

      res.json({
        success: true,
        message: 'Bookmark removed successfully',
        bookmarksCount: filteredBookmarks.length
      });
    } catch (error) {
      console.error('Remove bookmark error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove bookmark'
      });
    }
  }

  /**
   * Check if article is bookmarked
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async check(req, res) {
    try {
      const { url } = req.query;
      const userId = this.getUserId(req);

      const userBookmarks = this.bookmarks.get(userId) || [];
      const isBookmarked = userBookmarks.some(b => b.url === url);

      res.json({
        success: true,
        isBookmarked
      });
    } catch (error) {
      console.error('Check bookmark error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check bookmark status'
      });
    }
  }

  /**
   * Get user ID (simulated)
   * @param {Object} req - Express request object
   * @returns {string} User ID
   */
  getUserId(req) {
    // In a real app, this would come from session/auth
    return req.ip || 'anonymous';
  }

  /**
   * Get user preferences
   * @param {Object} req - Express request object
   * @returns {Object} User preferences
   */
  getUserPreferences(req) {
    return {
      theme: 'light',
      defaultCategory: 'general',
      defaultCountry: 'us'
    };
  }
}

module.exports = new BookmarkController();