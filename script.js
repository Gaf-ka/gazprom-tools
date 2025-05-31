// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
}

// Stats counter animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize stats counter when in view
const statNumbers = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.stats');

function checkStatsInView() {
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isInView = (rect.top <= window.innerHeight && rect.bottom >= 0);
    
    if (isInView) {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            animateValue(stat, 0, target, 2000);
        });
        // Remove event listener after animation
        window.removeEventListener('scroll', checkStatsInView);
    }
}

// Add scroll event listener
window.addEventListener('scroll', checkStatsInView);

// Check on initial load
document.addEventListener('DOMContentLoaded', checkStatsInView);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav && mainNav.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });
});

// File upload handler for charts and diagrams
document.querySelectorAll('.file-upload').forEach(upload => {
    upload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const fileName = document.getElementById('file-name');
        if (fileName) {
            fileName.textContent = file.name;
        }
        
        // Here you would process the file and update the chart
        // This is a placeholder for actual file processing logic
        console.log('File selected:', file.name);
    });
});

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
        
        this.addEventListener('mouseleave', () => {
            tooltip.remove();
        }, { once: true });
    });
});