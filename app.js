const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes from the src folder
const homeRoutes = require('./src/routes/home');
const articleRoutes = require('./src/routes/article');
const bookmarkRoutes = require('./src/routes/bookmark');
const categoryRoutes = require('./src/routes/category');
const searchRoutes = require('./src/routes/search');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Compression
app.use(compression());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (served from src/public)
app.use(express.static(path.join(__dirname, 'src', 'public')));

const expressLayouts = require('express-ejs-layouts');

// ... (imports)

// View engine (views in src/views)
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Mount routes
app.use('/', homeRoutes);
app.use('/article', articleRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/categories', categoryRoutes);
app.use('/search', searchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    currentPage: '404'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 News API App running on http://localhost:${PORT}`);
});

module.exports = app;