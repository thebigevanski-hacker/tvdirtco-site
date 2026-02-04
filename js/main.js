// main.js

// Show the selected page section
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-content');
    const links = document.querySelectorAll('.nav-link');

    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    // Update active nav link
    links.forEach(link => {
        if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Optional: smooth scroll to sections if needed
document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const pageId = link.getAttribute('onclick').match(/'(.+)'/)[1];
        showPage(pageId);
    });
});

// Initialize default page
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
});