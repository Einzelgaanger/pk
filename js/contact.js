document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize map if Mapbox is loaded
    if (mapboxgl) {
        initMap();
    }

    // Initialize form handling
    initContactForm();

    // Get Directions button
    document.getElementById('getDirections').addEventListener('click', () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=-1.2921,36.8219`);
    });

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    const formGroups = document.querySelectorAll('.form-group');

    // Add focus effects
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (input) {
            input.addEventListener('focus', () => {
                group.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                group.classList.remove('focused');
                if (input.value) {
                    group.classList.add('filled');
                } else {
                    group.classList.remove('filled');
                }
            });
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : `${x[1]} ${x[2]}${x[3] ? ` ${x[3]}` : ''}`;
    });
});

// Initialize Mapbox Map
function initMap() {
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    
    const map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [36.8219, -1.2921], // Nairobi coordinates
        zoom: 13
    });

    // Add marker for office location
    const marker = new mapboxgl.Marker({
        color: '#bb0000'
    })
    .setLngLat([36.8219, -1.2921])
    .addTo(map);

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button during submission
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            // Simulate API call (replace with actual endpoint)
            await submitFormData(data);
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            // Show error message
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
}

// Form Submission Function
async function submitFormData(data) {
    // Replace with actual API endpoint
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to submit form');
    }

    return response.json();
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Form Validation
function validateForm() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    
    if (input.required && !value) {
        setError(input, 'This field is required');
        return false;
    }

    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setError(input, 'Please enter a valid email address');
            return false;
        }
    }

    if (input.type === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(value)) {
            setError(input, 'Please enter a valid phone number');
            return false;
        }
    }

    clearError(input);
    return true;
}

function setError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    let errorMessage = formGroup.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        formGroup.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
} 