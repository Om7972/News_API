/**
 * Home page specific functionality
 * Handles category switching, infinite scroll, and view toggles
 */

document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.home-page')) {
    initializeHomePage();
  }
});

/**
 * Initialize home page functionality
 */
function initializeHomePage() {
  setupCategoryPills();
  setupViewToggles();
  setupInfiniteScroll();
  setupCardHoverEffects();
}

/**
 * Setup category pills
 */
function setupCategoryPills() {
  const categoryPills = document.querySelectorAll('.category-pill');

  categoryPills.forEach(pill => {
    pill.addEventListener('click', function() {
      const category = this.dataset.category;

      // Update active state
      categoryPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');

      // Load category news
      loadCategoryNews(category);
    });
  });
}

/**
 * Load news for specific category
 * @param {string} category - News category
 */
async function loadCategoryNews(category) {
  const newsGrid = document.getElementById('newsGrid');
  const loadingSkeleton = document.getElementById('loadingSkeleton');

  if (!newsGrid || !loadingSkeleton) return;

  try {
    // Show loading
    newsGrid.classList.add('hidden');
    loadingSkeleton.classList.remove('hidden');

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('category', category);
    window.history.pushState({}, '', url);

    // Fetch news
    const response = await fetch(`/load-more?category=${category}&page=1`);
    const data = await response.json();

    if (data.success) {
      renderNewsArticles(data.articles);
    } else {
      throw new Error('Failed to load news');
    }
  } catch (error) {
    console.error('Error loading category news:', error);
    showToast('Failed to load news. Please try again.', 'error');
  } finally {
    // Hide loading
    loadingSkeleton.classList.add('hidden');
    newsGrid.classList.remove('hidden');
  }
}

/**
 * Setup view toggles (grid/list)
 */
function setupViewToggles() {
  const gridView = document.getElementById('gridView');
  const listView = document.getElementById('listView');
  const newsGrid = document.getElementById('newsGrid');

  if (!gridView || !listView || !newsGrid) return;

  gridView.addEventListener('click', function() {
    newsGrid.classList.remove('list-view');
    gridView.classList.add('active');
    listView.classList.remove('active');
    localStorage.setItem('viewMode', 'grid');
  });

  listView.addEventListener('click', function() {
    newsGrid.classList.add('list-view');
    listView.classList.add('active');
    gridView.classList.remove('active');
    localStorage.setItem('viewMode', 'list');
  });

  // Load saved view mode
  const savedViewMode = localStorage.getItem('viewMode') || 'grid';
  if (savedViewMode === 'list') {
    listView.click();
  }
}

/**
 * Setup infinite scroll
 */
function setupInfiniteScroll() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!loadMoreBtn) return;

  let currentPage = 1;
  let isLoading = false;

  loadMoreBtn.addEventListener('click', async function() {
    if (isLoading) return;

    isLoading = true;
    loadMoreBtn.classList.add('loading');

    try {
      currentPage++;
      const category = window.currentCategory || 'general';
      const country = window.currentCountry || 'us';

      const response = await fetch(`/load-more?category=${category}&country=${country}&page=${currentPage}`);
      const data = await response.json();

      if (data.success && data.articles.length > 0) {
        appendNewsArticles(data.articles);

        if (data.articles.length < 10) {
          // No more articles
          loadMoreBtn.style.display = 'none';
        }
      } else {
        // No more articles
        loadMoreBtn.style.display = 'none';
        showToast('No more articles to load', 'info');
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
      showToast('Failed to load more articles', 'error');
    } finally {
      isLoading = false;
      loadMoreBtn.classList.remove('loading');
    }
  });
}

/**
 * Setup card hover effects
 */
function setupCardHoverEffects() {
  const newsCards = document.querySelectorAll('.news-card');

  newsCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) rotateX(5deg)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) rotateX(0)';
    });
  });
}

/**
 * Render news articles
 * @param {Array} articles - Articles array
 */
function renderNewsArticles(articles) {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  newsGrid.innerHTML = articles.map(article => createArticleHTML(article)).join('');
  setupCardHoverEffects();
}

/**
 * Append news articles
 * @param {Array} articles - Articles array
 */
function appendNewsArticles(articles) {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  const fragment = document.createDocumentFragment();
  articles.forEach(article => {
    const articleElement = document.createElement('div');
    articleElement.innerHTML = createArticleHTML(article);
    fragment.appendChild(articleElement.firstElementChild);
  });

  newsGrid.appendChild(fragment);
  setupCardHoverEffects();
}

/**
 * Create HTML for article card
 * @param {Object} article - Article data
 * @returns {string} HTML string
 */
function createArticleHTML(article) {
  return `
    <article class="news-card">
      <div class="card-image">
        <img
          src="${article.urlToImage || '/images/placeholder.jpg'}"
          alt="${article.title}"
          loading="lazy"
          onerror="this.src='/images/placeholder.jpg'"
        >
        <div class="card-overlay">
          <button class="bookmark-btn card-bookmark" data-article='${JSON.stringify(article).replace(/'/g, "&apos;")}'>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="card-source">${article.source.name}</span>
          <span class="card-date">${new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <h3 class="card-title">
          <a href="/article?url=${encodeURIComponent(article.url)}">${article.title}</a>
        </h3>
        <p class="card-description">${article.description || 'No description available.'}</p>
        <div class="card-actions">
          <a href="/article?url=${encodeURIComponent(article.url)}" class="read-more-btn">
            Read More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type
 */
function showToast(message, type = 'info') {
  if (window.showToast) {
    window.showToast(message, type);
  }
}