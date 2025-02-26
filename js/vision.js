document.addEventListener('DOMContentLoaded', function() {
    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // Stats Counter Animation
    const stats = document.querySelectorAll('.number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        entry.target.textContent = Math.floor(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        entry.target.textContent = target;
                    }
                };

                requestAnimationFrame(updateCount);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    // Interactive Map
    const map = document.querySelector('#map');
    if (map) {
        const projects = [
            {
                title: 'Digital Hub',
                location: [36.8219, -1.2921],
                description: 'Youth Technology and Innovation Center'
            },
            // Add more project locations
        ];

        // Initialize map with project markers
        projects.forEach(project => {
            const marker = document.createElement('div');
            marker.className = 'map-marker';
            marker.addEventListener('click', () => showProjectDetails(project));
            // Add marker to map
        });
    }

    // Project Details Modal
    function showProjectDetails(project) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <button class="close-modal">&times;</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }
}); 