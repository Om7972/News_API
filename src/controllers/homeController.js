const newsService = require('../services/newsService');

/**
 * Home Controller - Handles home page and main news display
 */
class HomeController {
  constructor() {
    this.index = this.index.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.getUserPreferences = this.getUserPreferences.bind(this);
  }

  /**
   * Render home page with trending news
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async index(req, res) {
    try {
      const { category = 'general', country = 'us' } = req.query;

      // Fetch trending news
      const articles = await newsService.fetchNews({
        category,
        country,
        pageSize: 20
      });

      // Get featured article (first one)
      const featuredArticle = articles[0];
      const regularArticles = articles.slice(1);

      res.render('home', {
        title: 'Latest News - Stay Informed',
        featuredArticle,
        articles: regularArticles,
        currentCategory: category,
        currentCountry: country,
        userPreferences: this.getUserPreferences(req),
        currentPage: 'home'
      });
    } catch (error) {
      console.error('Home controller error:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load news. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: false
      });
    }
  }

  /**
   * API endpoint for infinite scroll
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async loadMore(req, res) {
    try {
      const { category = 'general', country = 'us', page = 1 } = req.query;
      const pageSize = 10;

      const articles = await newsService.fetchNews({
        category,
        country,
        page,
        pageSize
      });

      res.json({
        success: true,
        articles,
        hasMore: articles.length === pageSize
      });
    } catch (error) {
      console.error('Load more error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to load more articles'
      });
    }
  }

  /**
   * Get user preferences from cookies/localStorage
   * @param {Object} req - Express request object
   * @returns {Object} User preferences
   */
  getUserPreferences(req) {
    // In a real app, this would come from user session/database
    // For now, return defaults
    return {
      theme: 'light',
      defaultCategory: 'general',
      defaultCountry: 'us'
    };
  }
}



module.exports = new HomeController();