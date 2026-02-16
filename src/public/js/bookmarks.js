/**
 * Bookmark functionality for NewsHub
 * Handles adding, removing, and managing bookmarks
 */

document.addEventListener('DOMContentLoaded', function() {
  initializeBookmarks();
});

/**
 * Initialize bookmark functionality
 */
function initializeBookmarks() {
  setupBookmarkButtons();
}

/**
 * Setup bookmark buttons
 */
function setupBookmarkButtons() {
  const bookmarkButtons = document.querySelectorAll('.bookmark-btn');

  bookmarkButtons.forEach(button => {
    button.addEventListener('click', handleBookmarkClick);
  });
}

/**
 * Handle bookmark button click
 * @param {Event} e - Click event
 */
async function handleBookmarkClick(e) {
  e.preventDefault();
  e.stopPropagation();

  const button = e.currentTarget;
  const articleData = button.dataset.article;

  if (!articleData) return;

  try {
    const article = JSON.parse(articleData);

    // Check if already bookmarked
    const isBookmarked = await checkBookmarkStatus(article.url);

    if (isBookmarked) {
      await removeBookmark(article.url);
      updateBookmarkButton(button, false);
      showToast('Article removed from bookmarks', 'info');
    } else {
      await addBookmark(article);
      updateBookmarkButton(button, true);
      showToast('Article added to bookmarks!', 'success');
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    showToast('Failed to update bookmark', 'error');
  }
}

/**
 * Add article to bookmarks
 * @param {Object} article - Article data
 */
async function addBookmark(article) {
  try {
    const response = await fetch('/bookmarks/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to add bookmark');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Remove article from bookmarks
 * @param {string} url - Article URL
 */
async function removeBookmark(url) {
  try {
    const response = await fetch('/bookmarks/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to remove bookmark');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Check if article is bookmarked
 * @param {string} url - Article URL
 * @returns {boolean} Bookmark status
 */
async function checkBookmarkStatus(url) {
  try {
    const response = await fetch(`/bookmarks/check?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.isBookmarked || false;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
}

/**
 * Update bookmark button appearance
 * @param {Element} button - Bookmark button element
 * @param {boolean} isBookmarked - Whether article is bookmarked
 */
function updateBookmarkButton(button, isBookmarked) {
  const svg = button.querySelector('svg');
  if (!svg) return;

  if (isBookmarked) {
    button.classList.add('bookmarked');
    svg.innerHTML = `
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" fill="currentColor"/>
    `;
  } else {
    button.classList.remove('bookmarked');
    svg.innerHTML = `
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
    `;
  }
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

/**
 * Get user's bookmarks (localStorage fallback)
 * @returns {Array} Bookmarks array
 */
function getLocalBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('bookmarks')) || [];
  } catch (error) {
    return [];
  }
}

/**
 * Save bookmarks to localStorage
 * @param {Array} bookmarks - Bookmarks array
 */
function saveLocalBookmarks(bookmarks) {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Error saving bookmarks:', error);
  }
}

// Export functions for global use
window.bookmarkUtils = {
  addBookmark,
  removeBookmark,
  checkBookmarkStatus,
  getLocalBookmarks,
  saveLocalBookmarks
};