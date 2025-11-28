document.addEventListener('DOMContentLoaded', () => {

    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const projectCards = document.querySelectorAll('.project-card');

    // --- 1. Navigation and Transition Handlers (General Rules) ---

    // Smooth transition function
    function animateTransition(targetUrl) {
        document.body.style.opacity = 0; 
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 400); 
    }
    
    // Page load transition
    document.body.style.transition = 'opacity 0.4s ease-in-out';
    document.body.style.opacity = 1;

    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        animateTransition('index.html');
    });

    backBtn.addEventListener('click', () => {
        if (window.history.length > 2) {
            window.history.back();
        } else {
            console.log("No substantial history found, navigating to HOME.");
            animateTransition('index.html');
        }
    });

    // --- 2. Filtering Ideas ---

    difficultyFilter.addEventListener('change', (e) => {
        const selectedDifficulty = e.target.value;
        filterProjects(selectedDifficulty);
    });

    function filterProjects(filter) {
        projectCards.forEach(card => {
            const cardDifficulty = card.getAttribute('data-difficulty');
            const shouldShow = filter === 'all' || cardDifficulty === filter;

            if (shouldShow) {
                // Show card (remove filter class)
                card.classList.remove('filtered');
                card.style.height = ''; // Reset height for content
                card.style.padding = '20px';
                card.style.margin = '0 0 20px 0';
                card.style.opacity = 1;
            } else {
                // Hide card (add filter class, use timeout to ensure animation happens)
                card.style.height = '0';
                card.style.padding = '0';
                card.style.margin = '0';
                card.style.opacity = 0;
                // Add the class after the transition starts so CSS can fully hide it
                setTimeout(() => {
                    card.classList.add('filtered');
                }, 500); 
            }
        });
    }

    // --- 3. Animating Cards (Expanding Details) ---

    document.getElementById('project-ideas-list').addEventListener('click', (e) => {
        const expandBtn = e.target.closest('.expand-btn');
        if (!expandBtn) return;

        const cardBody = expandBtn.closest('.card-body');
        const detailsContent = cardBody.querySelector('.details-content');
        const icon = expandBtn.querySelector('i');

        if (detailsContent.classList.contains('hidden')) {
            // Expand
            detailsContent.style.maxHeight = detailsContent.scrollHeight + "px"; // Calculate required height
            detailsContent.classList.remove('hidden');
            expandBtn.innerHTML = '<i class="fas fa-minus-circle"></i> Hide Details';
            icon.classList.replace('fa-plus-circle', 'fa-minus-circle');
            
            // Add a temporary animation class to the card for a subtle 'pop'
            const card = expandBtn.closest('.project-card');
            card.style.transition = 'transform 0.1s ease';
            card.style.transform = 'scale(1.01)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
                card.style.transition = 'all 0.3s ease'; // Restore original transition
            }, 100);

        } else {
            // Collapse
            detailsContent.style.maxHeight = '0'; // Collapse transition
            // Use timeout for transition before adding 'hidden'
            setTimeout(() => {
                detailsContent.classList.add('hidden');
            }, 300); 

            expandBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Expand Details';
            icon.classList.replace('fa-minus-circle', 'fa-plus-circle');
        }
    });

    // Initial setup: ensure details are hidden and transitions are set
    document.querySelectorAll('.details-content').forEach(details => {
        details.style.maxHeight = '0';
        details.style.overflow = 'hidden';
        details.style.transition = 'max-height 0.3s ease-in-out';
    });

});