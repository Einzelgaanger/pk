// Blog Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true
    });

    // Blog Posts Data (In real application, this would come from an API)
    const blogPosts = [
        {
            id: 1,
            title: "Youth Empowerment Through Forex Trading",
            excerpt: "How we're creating financial independence for Starehe youth...",
            category: "forex",
            image: "assets/images/kplogo.png",
            date: "June 10, 2024",
            readTime: "4 min read"
        },
        // Add more blog posts...
    ];

    // DOM Elements
    const postsGrid = document.getElementById('postsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    let currentPage = 1;
    const postsPerPage = 6;
    let filteredPosts = [...blogPosts];

    // Initialize Posts
    displayPosts();

    // Search Functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            filteredPosts = blogPosts.filter(post => 
                post.title.toLowerCase().includes(searchTerm) ||
                post.excerpt.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            displayPosts(true);
        }, 300);
    });

    // Category Filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            filteredPosts = category === 'all' 
                ? [...blogPosts]
                : blogPosts.filter(post => post.category === category);
            
            currentPage = 1;
            displayPosts(true);
        });
    });

    // Load More Functionality
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        displayPosts();
    });

    // Display Posts Function
    function displayPosts(reset = false) {
        if (reset) {
            postsGrid.innerHTML = '';
        }

        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const paginatedPosts = filteredPosts.slice(start, end);

        paginatedPosts.forEach(post => {
            const postElement = createPostElement(post);
            postsGrid.appendChild(postElement);
        });

        // Show/Hide Load More button
        loadMoreBtn.style.display = end >= filteredPosts.length ? 'none' : 'block';
    }

    // Create Post Element
    function createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.setAttribute('data-aos', 'fade-up');

        article.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
                <div class="category">${post.category}</div>
            </div>
            <div class="post-content">
                <div class="meta">
                    <span class="date">${post.date}</span>
                    <span class="read-time">${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="blog-post.html?id=${post.id}" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;

        return article;
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you for subscribing!', 'success');
            newsletterForm.reset();
        }, 1000);
    });

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    const navbar = document.querySelector('.navbar');
    const filter = document.querySelector('.blog-filter');
    
    // Update filter position based on navbar height
    function updateFilterPosition() {
        const navHeight = navbar.offsetHeight;
        filter.style.top = `${navHeight}px`;
        
        // Update filter width to match container
        const container = document.querySelector('.container');
        if (container) {
            const containerWidth = container.offsetWidth;
            filter.style.width = `${containerWidth}px`;
            filter.style.left = `${(window.innerWidth - containerWidth) / 2}px`;
        }
    }
    
    // Update on scroll for navbar transitions
    window.addEventListener('scroll', () => {
        updateFilterPosition();
    });
    
    // Update on resize
    window.addEventListener('resize', () => {
        updateFilterPosition();
    });
    
    // Initial position
    updateFilterPosition();

    // Add resize observer for container width changes
    const containerObserver = new ResizeObserver(updateFilterPosition);
    const container = document.querySelector('.container');
    if (container) {
        containerObserver.observe(container);
    }
});

// Update scroll handling for filter
let lastScroll = window.pageYOffset;
const blogFilter = document.querySelector('.blog-filter');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    const navHeight = navbar.offsetHeight;
    
    // Show/hide filter based on scroll direction
    if (currentScroll > lastScroll && currentScroll > navHeight) {
        blogFilter.classList.add('hidden');
    } else {
        blogFilter.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
    
    // Update filter position
    updateFilterPosition();
});

// Update filter position function
function updateFilterPosition() {
    const navbar = document.querySelector('.navbar');
    const filter = document.querySelector('.blog-filter');
    const container = document.querySelector('.container');
    
    if (filter && navbar && container) {
        const navHeight = navbar.offsetHeight;
        filter.style.top = `${navHeight}px`;
        
        // Center the filter container
        const containerRect = container.getBoundingClientRect();
        filter.style.width = `100%`;
        const filterContainer = filter.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.style.maxWidth = `${containerRect.width}px`;
        }
    }
}

// Elements
const categoryButtons = document.querySelectorAll('.category-btn');
const postsGrid = document.querySelector('.posts-grid');
const loadMoreBtn = document.querySelector('.load-more button');

// Sample blog posts data (in real app, this would come from an API)
const posts = [
    {
        category: 'Technology',
        image: 'assets/images/blog/post2.jpg',
        date: 'June 10, 2024',
        readTime: '4 min',
        title: 'Digital Literacy Program Expands to More Schools',
        excerpt: 'Bringing technology education to more students across Starehe...',
        views: '645',
        comments: '28'
    },
    {
        category: 'Community',
        image: 'assets/images/blog/post3.jpg',
        date: 'June 8, 2024',
        readTime: '6 min',
        title: 'Community Clean-up Initiative Launches',
        excerpt: 'Residents come together for environmental conservation...',
        views: '789',
        comments: '35'
    },
    {
        category: 'Education',
        image: 'assets/images/blog/post4.jpg',
        date: 'June 5, 2024',
        readTime: '3 min',
        title: 'Scholarship Program Benefits 100 Students',
        excerpt: 'Supporting bright minds in their academic journey...',
        views: '923',
        comments: '41'
    }
    // Add more posts as needed
];

let currentPage = 1;
const postsPerPage = 6;
let currentCategory = 'All';

// Category filtering
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update current category
        currentCategory = button.textContent;
        currentPage = 1;

        // Filter and render posts
        filterAndRenderPosts();
    });
});

// Filter and render posts
function filterAndRenderPosts() {
    // Clear existing posts
    postsGrid.innerHTML = '';

    // Filter posts by category
    let filteredPosts = posts;
    if (currentCategory !== 'All') {
        filteredPosts = posts.filter(post => post.category === currentCategory);
    }

    // Get posts for current page
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    // Render posts
    postsToShow.forEach(post => {
        const postCard = createPostCard(post);
        postsGrid.appendChild(postCard);
    });

    // Update load more button visibility
    loadMoreBtn.style.display = endIndex >= filteredPosts.length ? 'none' : 'block';
}

// Create post card element
function createPostCard(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.innerHTML = `
        <div class="post-image">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <div class="post-category">${post.category}</div>
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span class="date"><i class="far fa-calendar"></i> ${post.date}</span>
                <span class="read-time"><i class="far fa-clock"></i> ${post.readTime}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="post-footer">
                <a href="blog-post.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                <div class="post-stats">
                    <span><i class="far fa-eye"></i> ${post.views}</span>
                    <span><i class="far fa-comment"></i> ${post.comments}</span>
                </div>
            </div>
        </div>
    `;
    return article;
}

// Load more functionality
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    filterAndRenderPosts();
});

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        showNotification('Successfully subscribed to newsletter!', 'success');
        newsletterForm.reset();
    } catch (error) {
        showNotification('Failed to subscribe. Please try again.', 'error');
    }
});

// Initial render
filterAndRenderPosts();

// Update scroll handling for filter
let lastScroll = window.pageYOffset;
const blogFilter = document.querySelector('.blog-filter');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    const navHeight = navbar.offsetHeight;
    
    // Show/hide filter based on scroll direction
    if (currentScroll > lastScroll && currentScroll > navHeight) {
        blogFilter.classList.add('hidden');
    } else {
        blogFilter.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
    
    // Update filter position
    updateFilterPosition();
});

// Update filter position function
function updateFilterPosition() {
    const navbar = document.querySelector('.navbar');
    const filter = document.querySelector('.blog-filter');
    const container = document.querySelector('.container');
    
    if (filter && navbar && container) {
        const navHeight = navbar.offsetHeight;
        filter.style.top = `${navHeight}px`;
        
        // Center the filter container
        const containerRect = container.getBoundingClientRect();
        filter.style.width = `100%`;
        const filterContainer = filter.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.style.maxWidth = `${containerRect.width}px`;
        }
    }
} 