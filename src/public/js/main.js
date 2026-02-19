/**
 * Main JavaScript file for NewsHub
 * Handles common functionality across all pages
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
  setupBackToTop();
  setupMobileMenu();
  setupSmoothScrolling();
  setupLazyLoading();
  setupGlobalHandlers();
}

/**
 * Setup global event handlers (images, back buttons)
 */
function setupGlobalHandlers() {
  // Global error handler for images (capture phase)
  document.addEventListener('error', function (e) {
    if (e.target.tagName.toLowerCase() === 'img') {
      // Avoid infinite loop if placeholder fails
      if (e.target.src.includes('placeholder.jpg')) return;

      e.target.src = '/images/placeholder.jpg';
      e.target.alt = 'Image not found';
    }
  }, true);

  // Back buttons
  const backBtns = document.querySelectorAll('[data-action="back"]');
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.history.back();
    });
  });
}

/**
 * Setup back to top button
 */
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');

  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Scroll to top when clicked
  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!mobileMenuToggle || !mobileMenu) return;

  mobileMenuToggle.addEventListener('click', function () {
    mobileMenu.classList.toggle('show');

    // Animate hamburger icon
    const lines = mobileMenuToggle.querySelectorAll('.hamburger-line');
    if (mobileMenu.classList.contains('show')) {
      lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('show');
      resetHamburgerIcon();
    }
  });
}

/**
 * Reset hamburger icon to default state
 */
function resetHamburgerIcon() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  if (!mobileMenuToggle) return;

  const lines = mobileMenuToggle.querySelectorAll('.hamburger-line');
  lines[0].style.transform = 'none';
  lines[1].style.opacity = '1';
  lines[2].style.transform = 'none';
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, info)
 */
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.innerText = '×';
  closeBtn.addEventListener('click', () => {
    if (toast.parentElement) toast.remove();
  });
  toast.appendChild(closeBtn);

  toastContainer.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);

  // Add slide-in animation
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Global utility functions
window.showToast = showToast;
window.debounce = debounce;
window.throttle = throttle;