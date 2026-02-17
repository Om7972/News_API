const newsService = require('../services/newsService');

/**
 * Category Controller - Handles category-specific news pages
 */
class CategoryController {
  /**
   * Render category page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  constructor() {
    this.show = this.show.bind(this);
    this.index = this.index.bind(this);
    this.getUserPreferences = this.getUserPreferences.bind(this);
  }

  /**
   * Render category page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async show(req, res) {
    try {
      const { category } = req.params;
      const { country = 'us', page = 1 } = req.query;

      // Validate category
      const validCategories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
      if (!validCategories.includes(category)) {
        return res.status(404).render('404', {
          title: 'Category Not Found',
          message: `Category "${category}" does not exist.`,
          layout: false
        });
      }

      // Fetch category news
      const articles = await newsService.fetchNews({
        category,
        country,
        page,
        pageSize: 20
      });

      res.render('category', {
        title: `${this.capitalizeFirst(category)} News`,
        category,
        articles,
        currentPage: 'categories',
        currentCountry: country,
        userPreferences: this.getUserPreferences(req)
      });
    } catch (error) {
      console.error('Category controller error:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load category news.',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: false
      });
    }
  }

  /**
   * Get all categories with their data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async index(req, res) {
    try {
      const categories = [
        { name: 'business', displayName: 'Business', icon: '💼' },
        { name: 'entertainment', displayName: 'Entertainment', icon: '🎬' },
        { name: 'general', displayName: 'General', icon: '📰' },
        { name: 'health', displayName: 'Health', icon: '🏥' },
        { name: 'science', displayName: 'Science', icon: '🔬' },
        { name: 'sports', displayName: 'Sports', icon: '⚽' },
        { name: 'technology', displayName: 'Technology', icon: '💻' }
      ];

      // Fetch a few articles for each category (for preview)
      const categoriesWithNews = await Promise.all(
        categories.map(async (cat) => {
          try {
            const articles = await newsService.fetchNews({
              category: cat.name,
              pageSize: 3
            });
            return { ...cat, articles };
          } catch (error) {
            return { ...cat, articles: [] };
          }
        })
      );

      res.render('categories', {
        title: 'News Categories',
        categories: categoriesWithNews,
        userPreferences: this.getUserPreferences(req),
        currentPage: 'categories'
      });
    } catch (error) {
      console.error('Categories controller error:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load categories.',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: false
      });
    }
  }

  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

module.exports = new CategoryController();