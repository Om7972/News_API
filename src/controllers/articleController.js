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
  async show(req, res) {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).render('error', {
          title: 'Invalid Request',
          message: 'Article URL is required'
        });
      }

      // In a real app, you'd fetch the specific article
      // For now, we'll search for it or use a placeholder
      const articles = await newsService.fetchNews({ q: url, pageSize: 1 });
      const article = articles.find(a => a.url === url) || {
        title: 'Article Not Found',
        description: 'The requested article could not be found.',
        url: url,
        urlToImage: '/images/placeholder.jpg',
        source: { name: 'Unknown' },
        publishedAt: new Date().toISOString(),
        content: 'Content not available.'
      };

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
        userPreferences: this.getUserPreferences(req)
      });
    } catch (error) {
      console.error('Article controller error:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load article. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error : {}
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