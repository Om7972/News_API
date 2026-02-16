/**
 * Theme management for NewsHub
 * Handles dark/light mode switching and persistence
 */

document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
});

/**
 * Initialize theme system
 */
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  // Theme toggle event listener
  themeToggle.addEventListener('click', toggleTheme);
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  setTheme(newTheme);
  showThemeToast(newTheme);
}

/**
 * Set the theme
 * @param {string} theme - Theme to set ('light' or 'dark')
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  // Update theme toggle icon
  updateThemeIcon(theme);
}

/**
 * Update theme toggle icon
 * @param {string} theme - Current theme
 */
function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const lightIcon = themeToggle.querySelector('.light-icon');
  const darkIcon = themeToggle.querySelector('.dark-icon');

  if (theme === 'light') {
    lightIcon.style.display = 'block';
    darkIcon.style.display = 'none';
  } else {
    lightIcon.style.display = 'none';
    darkIcon.style.display = 'block';
  }
}

/**
 * Show theme change toast
 * @param {string} theme - New theme
 */
function showThemeToast(theme) {
  const themeName = theme === 'light' ? 'Light' : 'Dark';
  const message = `${themeName} mode activated`;

  if (window.showToast) {
    window.showToast(message, 'info');
  }
}

/**
 * Get current theme
 * @returns {string} Current theme
 */
function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Check if dark mode is active
 * @returns {boolean} True if dark mode is active
 */
function isDarkMode() {
  return getCurrentTheme() === 'dark';
}

// Export functions for use in other scripts
window.themeUtils = {
  setTheme,
  getCurrentTheme,
  isDarkMode,
  toggleTheme
};