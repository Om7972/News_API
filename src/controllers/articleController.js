const newsService = require('../services/newsService');

/**
 * Article Controller - Handles individual article pages
 */
class ArticleController {
  /**
   * Render article details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  constructor() {
    this.show = this.show.bind(this);
    this.calculateReadingTime = this.calculateReadingTime.bind(this);
    this.getUserPreferences = this.getUserPreferences.bind(this);
  }

  /**
   * Render article details page
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async show(req, res) {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).render('error', {
          title: 'Invalid Request',
          message: 'Article URL is required',
          layout: false
        });
      }

      // Use searchNews (everything endpoint) instead of fetchNews (top-headlines)
      // Searching by URL is tricky, so we'll try to find it, but the everything endpoint is better for specific retrieval
      const articles = await newsService.searchNews(url);

      let article = null;
      // The search might return multiple results matching terms in the URL
      // We try to find an exact match on URL, otherwise take the first one if it looks relevant?
      // Actually, searching by full URL in 'q' usually works in NewsAPI
      if (articles && articles.length > 0) {
        article = articles.find(a => a.url === url) || articles[0];
      }

      if (!article) {
        // Fallback: Create a wrapper for the external content
        // Parse domain from URL for source name
        let sourceName = 'External Source';
        try {
          const urlObj = new URL(url);
          sourceName = urlObj.hostname.replace('www.', '');
        } catch (e) { }

        article = {
          title: 'External Article',
          description: 'This is an external article. Click below to read the full story at the source.',
          url: url,
          urlToImage: '/images/placeholder.jpg',
          source: { name: sourceName },
          publishedAt: new Date().toISOString(),
          content: 'Full content available at source.'
        };
      }

      // Calculate reading time
      const readingTime = this.calculateReadingTime(article.content || article.description || '');

      // Get related articles
      const relatedArticles = await newsService.fetchNews({
        category: 'general',
        pageSize: 4
      });

      res.render('article', {
        title: article.title,
        article,
        readingTime,
        relatedArticles,
        userPreferences: this.getUserPreferences(req),
        currentPage: 'article'
      });
    } catch (error) {
      console.error('Article controller error:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load article. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: false
      });
    }
  }

  /**
   * Calculate estimated reading time
   * @param {string} content - Article content
   * @returns {number} Reading time in minutes
   */
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
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

module.exports = new ArticleController();