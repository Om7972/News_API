const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Function to fetch news from NewsAPI
async function fetchNews(query = '', category = '') {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    // Fallback to sample data
    const sampleData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'sample.json'), 'utf8'));
    return sampleData.articles;
  }

  let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
  } else if (category) {
    url += `&category=${category}`;
  }

  try {
    const response = await axios.get(url);
    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error.message);
    // Fallback to sample data on error
    const sampleData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'sample.json'), 'utf8'));
    return sampleData.articles;
  }
}

// Route for home page
app.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.q || '';
    const category = req.query.category || '';
    const articles = await fetchNews(searchQuery, category);

    // Render the index template
    const indexContent = await new Promise((resolve, reject) => {
      app.render('index', {
        articles,
        searchQuery,
        category,
        title: 'Top News Headlines'
      }, (err, html) => {
        if (err) reject(err);
        else resolve(html);
      });
    });

    // Render the layout with the index content
    res.render('layout', {
      body: indexContent,
      searchQuery,
      category,
      title: 'Top News Headlines'
    });
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});