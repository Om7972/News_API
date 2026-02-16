# 📰 NewsAPI Web App

A modern, responsive news aggregator web application built with Node.js, Express.js, and EJS templating. Features a beautiful glassmorphism UI, advanced search capabilities, bookmarking, and real-time news from NewsAPI.org.

![NewsAPI App](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-339933?style=for-the-badge&logo=ejs&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful backdrop blur effects and modern aesthetics
- **Dark/Light Theme**: Automatic theme switching with user preference persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Micro-interactions and transitions throughout

### 📰 News Features
- **Real-time News**: Live news feed from NewsAPI.org
- **Category Browsing**: News organized by categories (Business, Technology, Sports, etc.)
- **Advanced Search**: Full-text search with relevance sorting
- **Article Details**: Full article view with sharing capabilities
- **Infinite Scroll**: Load more articles without page refresh

### 👤 User Features
- **Bookmarking**: Save favorite articles for later reading
- **Reading History**: Track recently viewed articles
- **Search History**: Quick access to previous searches
- **Offline Support**: Cached articles for offline reading

### ⚡ Performance & Security
- **Caching**: Intelligent caching for faster load times
- **Compression**: Gzip compression for optimized delivery
- **Rate Limiting**: API rate limiting for security
- **Input Sanitization**: XSS protection and data validation
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- NewsAPI.org API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/newsapi-web-app.git
   cd newsapi-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your NewsAPI key:
   ```env
   NEWS_API_KEY=your_newsapi_key_here
   NODE_ENV=development
   PORT=3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── app.js                 # Main Express application
├── controllers/           # Route controllers
│   ├── homeController.js
│   ├── articleController.js
│   ├── bookmarkController.js
│   ├── categoryController.js
│   └── searchController.js
├── routes/                # Express routes
│   ├── home.js
│   ├── article.js
│   ├── bookmarks.js
│   ├── categories.js
│   └── search.js
├── services/              # Business logic services
│   └── newsService.js
├── middleware/            # Custom middleware
│   └── errorHandler.js
├── views/                 # EJS templates
│   ├── layout.ejs
│   ├── home.ejs
│   ├── article.ejs
│   ├── bookmarks.ejs
│   ├── categories.ejs
│   ├── search.ejs
│   └── 404.ejs
└── public/                # Static assets
    ├── css/
    │   └── style.css
    └── js/
        ├── main.js
        ├── theme.js
        ├── search.js
        ├── bookmarks.js
        └── home.js
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests (when implemented)
npm test

# Lint code
npm run lint
```

### Development Setup

1. **Install development dependencies**
   ```bash
   npm install --save-dev nodemon
   ```

2. **Start development server with auto-reload**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEWS_API_KEY` | Your NewsAPI.org API key | Required |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `CACHE_TTL` | Cache time-to-live in seconds | 300 |

### NewsAPI Configuration

The app uses NewsAPI.org for news data. Get your free API key at [newsapi.org](https://newsapi.org).

## 🎨 Customization

### Themes
The app supports custom themes. Modify CSS custom properties in `src/public/css/style.css`:

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --background-color: #your-color;
  /* ... */
}
```

### Categories
Add or modify news categories in `src/controllers/categoryController.js`:

```javascript
const categories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology'
];
```

## 🚀 Deployment

### Heroku Deployment

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NEWS_API_KEY=your_api_key
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t newsapi-app .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 -e NEWS_API_KEY=your_api_key newsapi-app
   ```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org) for providing the news data
- [Express.js](https://expressjs.com) for the web framework
- [EJS](https://ejs.co) for templating
- Icons from [Lucide](https://lucide.dev)

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check the [documentation](docs/)
- Contact: your-email@example.com

---

**Made with ❤️ by [Your Name]**

⭐ Star this repo if you found it helpful!