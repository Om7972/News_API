const newsService = require('../services/newsService');

/**
 * Search Controller - Handles search functionality
 */
class SearchController {
  /**
   * Render search results page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  constructor() {
    this.index = this.index.bind(this);
    this.suggestions = this.suggestions.bind(this);
    this.getUserPreferences = this.getUserPreferences.bind(this);
    this.saveSearchHistory = this.saveSearchHistory.bind(this);
    this.getSearchHistory = this.getSearchHistory.bind(this);
  }

  /**
   * Render search results page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async index(req, res) {
    try {
      const { q: query, sortBy = 'publishedAt', page = 1 } = req.query;

      if (!query || query.trim() === '') {
        return res.render('search', {
          title: 'Search News',
          query: '',
          articles: [],
          sortBy,
          currentPage: 'search',
          totalResults: 0,
          userPreferences: this.getUserPreferences(req)
        });
      }

      // Search news
      const articles = await newsService.searchNews(query.trim(), {
        sortBy,
        page,
        pageSize: 20
      });

      // Save to search history (simulated)
      this.saveSearchHistory(req, query.trim());

      res.render('search', {
        title: `Search Results for "${query}"`,
        query: query.trim(),
        articles,
        sortBy,
        currentPage: 'search',
        totalResults: articles.length,
        userPreferences: this.getUserPreferences(req)
      });
    } catch (error) {
      console.error('Search controller error:', error);
      res.status(500).render('error', {
        title: 'Search Error',
        message: 'Failed to perform search. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: false
      });
    }
  }

  /**
   * API endpoint for live search suggestions
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async suggestions(req, res) {
    try {
      const { q: query } = req.query;

      if (!query || query.length < 2) {
        return res.json({ suggestions: [] });
      }

      // Get search history
      const history = this.getSearchHistory(req);
      const filteredHistory = history.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      res.json({
        suggestions: filteredHistory
      });
    } catch (error) {
      console.error('Search suggestions error:', error);
      res.status(500).json({ suggestions: [] });
    }
  }

  /**
   * Get search history (simulated)
   * @param {Object} req - Express request object
   * @returns {Array} Search history
   */
  getSearchHistory(req) {
    // In a real app, this would come from database/session
    return ['COVID-19', 'Election', 'Technology', 'Sports', 'Weather'];
  }

  /**
   * Save search to history (simulated)
   * @param {Object} req - Express request object
   * @param {string} query - Search query
   */
  saveSearchHistory(req, query) {
    // In a real app, save to database
    console.log(`Search saved: ${query}`);
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

module.exports = new SearchController();