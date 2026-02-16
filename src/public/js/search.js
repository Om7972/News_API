/**
 * Search functionality for NewsHub
 * Handles live search, suggestions, and search history
 */

document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
});

/**
 * Initialize search functionality
 */
function initializeSearch() {
  setupNavSearch();
  setupSearchSuggestions();
  loadSearchHistory();
}

/**
 * Setup navigation search
 */
function setupNavSearch() {
  const navSearchInput = document.getElementById('navSearchInput');
  const navSearchBtn = document.getElementById('navSearchBtn');

  if (!navSearchInput || !navSearchBtn) return;

  // Search button click
  navSearchBtn.addEventListener('click', performSearch);

  // Enter key press
  navSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Live search with debounce
  const debouncedSearch = window.debounce ? window.debounce(showSearchSuggestions, 300) : showSearchSuggestions;
  navSearchInput.addEventListener('input', debouncedSearch);
}

/**
 * Perform search
 */
function performSearch() {
  const navSearchInput = document.getElementById('navSearchInput');
  if (!navSearchInput) return;

  const query = navSearchInput.value.trim();
  if (query) {
    // Save to search history
    saveToSearchHistory(query);

    // Navigate to search page
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  }
}

/**
 * Setup search suggestions
 */
function setupSearchSuggestions() {
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (!searchSuggestions) return;

  // Close suggestions when clicking outside
  document.addEventListener('click', function(e) {
    const navSearchInput = document.getElementById('navSearchInput');
    if (!navSearchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
      searchSuggestions.classList.remove('show');
    }
  });
}

/**
 * Show search suggestions
 */
async function showSearchSuggestions() {
  const navSearchInput = document.getElementById('navSearchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');

  if (!navSearchInput || !searchSuggestions) return;

  const query = navSearchInput.value.trim();

  if (query.length < 2) {
    searchSuggestions.classList.remove('show');
    return;
  }

  try {
    // Get suggestions from API
    const response = await fetch(`/search/suggestions?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.suggestions && data.suggestions.length > 0) {
      renderSuggestions(data.suggestions, query);
      searchSuggestions.classList.add('show');
    } else {
      searchSuggestions.classList.remove('show');
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    searchSuggestions.classList.remove('show');
  }
}

/**
 * Render search suggestions
 * @param {Array} suggestions - Array of suggestions
 * @param {string} query - Current query
 */
function renderSuggestions(suggestions, query) {
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (!searchSuggestions) return;

  searchSuggestions.innerHTML = suggestions.map(suggestion => `
    <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <span>${highlightMatch(suggestion, query)}</span>
    </div>
  `).join('');
}

/**
 * Highlight matching text in suggestion
 * @param {string} text - Full text
 * @param {string} query - Query to highlight
 * @returns {string} HTML with highlighted text
 */
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Select a suggestion
 * @param {string} suggestion - Selected suggestion
 */
function selectSuggestion(suggestion) {
  const navSearchInput = document.getElementById('navSearchInput');
  if (navSearchInput) {
    navSearchInput.value = suggestion;
    performSearch();
  }
}

/**
 * Load search history from localStorage
 */
function loadSearchHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // Limit to last 10 searches
    const recentHistory = history.slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(recentHistory));
  } catch (error) {
    console.error('Error loading search history:', error);
  }
}

/**
 * Save query to search history
 * @param {string} query - Search query
 */
function saveToSearchHistory(query) {
  try {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Remove if already exists
    const filteredHistory = history.filter(item => item !== query);

    // Add to beginning
    filteredHistory.unshift(query);

    // Limit to 10 items
    const limitedHistory = filteredHistory.slice(0, 10);

    localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

/**
 * Get search history
 * @returns {Array} Search history
 */
function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
  } catch (error) {
    return [];
  }
}

// Export functions for global use
window.searchUtils = {
  performSearch,
  getSearchHistory,
  saveToSearchHistory
};