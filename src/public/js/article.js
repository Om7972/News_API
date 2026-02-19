/**
 * Article page specific functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    setupShareButtons();
    setupOriginalArticleLink();
});

function setupShareButtons() {
    const whatsappBtn = document.getElementById('shareWhatsApp');
    const twitterBtn = document.getElementById('shareTwitter');
    const copyLinkBtn = document.getElementById('copyLink');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', shareOnWhatsApp);
    }

    if (twitterBtn) {
        twitterBtn.addEventListener('click', shareOnTwitter);
    }

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copyLink);
    }
}

function getArticleTitle() {
    const titleElement = document.querySelector('.article-title');
    return titleElement ? titleElement.textContent.trim() : document.title;
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(getArticleTitle());
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(getArticleTitle());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            if (window.showToast) {
                window.showToast('Link copied to clipboard!', 'success');
            }
        })
        .catch(() => {
            if (window.showToast) {
                window.showToast('Failed to copy link', 'error');
            }
        });
}

function setupOriginalArticleLink() {
    const link = document.querySelector('.read-original-btn');
    if (link) {
        // Add rel="noopener noreferrer" for security on target="_blank"
        link.rel = "noopener noreferrer";
    }
}
