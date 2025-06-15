
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
// PDF Editor functionality
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация инструментов, если они есть на странице
    if (document.getElementById('pdfEditor')) {
        initPdfEditor();
    }
    
    if (document.getElementById('wordEditor')) {
        initWordEditor();
    }
});

function initPdfEditor() {
    // Здесь будет код для инициализации PDF редактора
    console.log('PDF Editor initialized');
}

function initWordEditor() {
    // Здесь будет код для инициализации Word редактора
    console.log('Word Editor initialized');
}

// Drag and drop для всех инструментов
document.querySelectorAll('.file-upload-area').forEach(area => {
    area.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.backgroundColor = 'var(--primary-light)';
    });
    
    area.addEventListener('dragleave', function() {
        this.style.borderColor = '#ccc';
        this.style.backgroundColor = 'transparent';
    });
    
    area.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ccc';
        this.style.backgroundColor = 'transparent';
        
        const fileInput = this.querySelector('input[type="file"]');
        if (fileInput && e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });
});