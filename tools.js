document.addEventListener('DOMContentLoaded', () => {

    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');
    const toolCategories = document.querySelectorAll('.tool-category');
    const toolCards = document.querySelectorAll('.tool-link-card');

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

    // --- 2. Animated Category Opening (Slide-in) ---

    // Initial setting for staggered animated entrance
    toolCategories.forEach((category, index) => {
        category.style.opacity = 0;
        category.style.transform = 'translateX(-50px)';
        
        // Staggered fade and slide in
        setTimeout(() => {
            category.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            category.style.opacity = 1;
            category.style.transform = 'translateX(0)';
        }, 100 + index * 200);
    });

    // --- 3. Ripple Interactions & Smooth Icon Hover Animations ---

    // Since the smooth icon hover animation is largely handled by CSS (color/scale changes),
    // we focus here on the **ripple interactions**.

    toolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ripple effect logic
            const rect = card.getBoundingClientRect();
            
            // Check if the click event is available
            const clientX = e.clientX || rect.left + rect.width / 2;
            const clientY = e.clientY || rect.top + rect.height / 2;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const maxDim = Math.max(rect.width, rect.height);
            const size = maxDim * 2; 

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-tool');
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x - size / 2}px`;
            ripple.style.top = `${y - size / 2}px`;
            
            // Append ripple to the card
            card.appendChild(ripple);

            // Clean up the ripple element after the animation finishes
            setTimeout(() => {
                ripple.remove();
            }, 500); // Matches CSS animation time
        });
    });

});