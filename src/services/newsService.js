const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600 });

class NewsService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
  }

  /**
   * Fetch news from NewsAPI with caching
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Articles array
   */
  async fetchNews(params = {}) {
    const cacheKey = JSON.stringify(params);
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('📋 Serving from cache');
      return cachedData;
    }

    try {
      const queryParams = {
        apiKey: this.apiKey,
        ...params
      };

      // Remove undefined values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: queryParams,
        timeout: 10000
      });

      if (response.data.status === 'ok') {
        const articles = response.data.articles || [];
        cache.set(cacheKey, articles);
        console.log('📰 Fetched fresh news data');
        return articles;
      } else {
        throw new Error(response.data.message || 'API Error');
      }
    } catch (error) {
      console.error('❌ News API Error:', error.message);

      // Return cached data if available, even if expired
      if (cachedData) {
        console.log('📋 Serving stale cache due to API error');
        return cachedData;
      }

      // Fallback to sample data
      return this.getSampleData();
    }
  }

  /**
   * Search news articles
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise<Array>} Articles array
   */
  async searchNews(query, params = {}) {
    const cacheKey = `search_${query}_${JSON.stringify(params)}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const queryParams = {
        q: query,
        apiKey: this.apiKey,
        sortBy: params.sortBy || 'publishedAt',
        ...params
      };

      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: queryParams,
        timeout: 10000
      });

      if (response.data.status === 'ok') {
        const articles = response.data.articles || [];
        cache.set(cacheKey, articles);
        return articles;
      } else {
        throw new Error(response.data.message || 'Search API Error');
      }
    } catch (error) {
      console.error('❌ Search API Error:', error.message);
      return [];
    }
  }

  /**
   * Get sample data for fallback
   * @returns {Array} Sample articles
   */
  getSampleData() {
    try {
      const fs = require('fs');
      const path = require('path');
      const samplePath = path.join(__dirname, '../data/sample.json');
      const data = fs.readFileSync(samplePath, 'utf8');
      return JSON.parse(data).articles || [];
    } catch (error) {
      console.error('❌ Error loading sample data:', error.message);
      return [];
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    cache.flushAll();
    console.log('🧹 Cache cleared');
  }

  /**
   * Get cache stats
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return cache.getStats();
  }
}

module.exports = new NewsService();