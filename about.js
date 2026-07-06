document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Navigation Handlers (General Rules) --- */

    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');

    homeBtn.addEventListener('click', () => {
        // Smooth transition when navigating to HOME
        document.body.style.opacity = 0;
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300); // 300ms transition
    });

    backBtn.addEventListener('click', () => {
        // Back button logic with fallback (General Rule)
        if (window.history.length > 2) {
            window.history.back();
        } else {
            // Fallback: go to home if the user landed directly
            console.log("No substantial history found, navigating to HOME.");
            homeBtn.click();
        }
    });
    
    // Smooth transition on page load
    document.body.style.transition = 'opacity 0.3s ease-in';
    document.body.style.opacity = 1;


    /* --- 2. Background Animation: Rain Generation --- */

    const MAX_DROPS = 100; // Number of raindrops to create
    const body = document.body;

    for (let i = 0; i < MAX_DROPS; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        
        // Randomize initial position, size, duration, and delay
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.width = `${Math.random() * 1 + 1}px`; // 1px to 2px
        drop.style.animationDuration = `${Math.random() * 1 + 0.7}s`; // 0.7s to 1.7s
        drop.style.animationDelay = `${Math.random() * 5}s`; // Stagger the start
        
        body.appendChild(drop);
    }


    /* --- 3. Background Animation: Thunder Flash Effect --- */

    const thunderOverlay = document.createElement('div');
    thunderOverlay.classList.add('thunder-overlay');
    body.appendChild(thunderOverlay);

    function triggerThunder() {
        // Randomize intensity slightly
        const intensity = Math.random() * 0.4 + 0.5; // 0.5 to 0.9
        
        // Add animation and custom property for intensity
        thunderOverlay.style.setProperty('--thunder-flash-intensity', intensity);
        thunderOverlay.style.animation = 'thunder-flash 0.5s ease-out';
        
        // Remove animation class after it finishes to allow re-triggering
        setTimeout(() => {
            thunderOverlay.style.animation = 'none';
        }, 500);

        // Schedule the next thunder flash (random timer)
        const nextFlashTime = Math.random() * 10000 + 5000; // 5 seconds to 15 seconds
        setTimeout(triggerThunder, nextFlashTime);
    }

    // Start the thunder cycle after a short initial delay
    setTimeout(triggerThunder, 2000);


    /* --- 4. Interactive Ripple Effect on Click --- */

    // Function to generate a random smoke-like gradient color (gray, purple, blue)
    function getRandomSmokeColor() {
        const colors = [
            '#3a4750', // Gray/Cloud
            '#594a61', // Muted Purple
            '#4a5c61', // Dark Blue-Gray
            '#6e7f80'  // Light Slate
        ];
        // Select two random colors and blend them for the gradient
        const color1 = colors[Math.floor(Math.random() * colors.length)];
        const color2 = colors[Math.floor(Math.random() * colors.length)];
        
        // Return a semi-transparent linear gradient
        return `linear-gradient(135deg, ${color1}AA, ${color2}AA)`;
    }

    // Attach the ripple handler to the entire document body
    document.body.addEventListener('click', (e) => {
        // Only apply ripple to main content, not the fixed nav
        if (e.target.closest('#fixed-nav')) return;

        const target = e.target.closest('.profile-section') || document.body;
        
        // Create a dedicated container for ripples inside the target if it doesn't exist
        let rippleContainer = target.querySelector('.ripple-container');
        if (!rippleContainer) {
            rippleContainer = document.createElement('div');
            rippleContainer.classList.add('ripple-container');
            target.style.position = 'relative'; // Ensure target is positioned for absolute ripple
            target.appendChild(rippleContainer);
        }

        const rect = target.getBoundingClientRect();
        
        // Calculate click position relative to the target element (x, y)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate the maximum dimension to ensure the ripple fully covers the element
        const maxDim = Math.max(rect.width, rect.height);
        const size = maxDim * 2; // Make it large enough to grow outward (scale 4 in CSS)

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        ripple.style.width = ripple.style.height = `${size}px`;
        
        // Position the ripple centered on the click point
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;
        
        // Apply the randomized smoke-like gradient color
        ripple.style.background = getRandomSmokeColor();

        rippleContainer.appendChild(ripple);

        // Clean up the ripple element after the animation finishes
        const rippleTime = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ripple-time')) * 1000;
        
        setTimeout(() => {
            ripple.remove();
        }, rippleTime);
    });

});


// --- NEW FUNCTION: Full Screen Mode Toggle ---
function toggleFullScreen() {
    const doc = document.documentElement;
    const navBar = document.getElementById('fixed-nav');
    
    // 1. Toggle Full Screen API
    if (!document.fullscreenElement) {
        if (doc.requestFullscreen) {
            doc.requestFullscreen();
        } else if (doc.webkitRequestFullscreen) { /* Safari */
            doc.webkitRequestFullscreen();
        } else if (doc.msRequestFullscreen) { /* IE11 */
            doc.msRequestFullscreen();
        }
        
        // 2. Hide the navigation bar element
        if (navBar) {
            navBar.style.display = 'none';
        }
        
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }

        // 3. Show the navigation bar element again
        if (navBar) {
            navBar.style.display = 'flex'; // Restore original display
        }
    }
}

// Attach the function to a new 'FULL SCREEN' button (assuming you add one in the HTML)
document.addEventListener('DOMContentLoaded', () => {
    // ... Existing DOMContentLoaded code ...
    
    // Find the new button and attach the handler
    const fullScreenBtn = document.getElementById('fullscreen-btn');
    if (fullScreenBtn) {
        fullScreenBtn.addEventListener('click', toggleFullScreen);
    }
});