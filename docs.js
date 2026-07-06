document.addEventListener('DOMContentLoaded', () => {

    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');
    const scrollOverlay = document.getElementById('scroll-wave-overlay');
    const docCategories = document.querySelectorAll('.doc-category');

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

    // --- 2. Floating Panel Enhancements (Animated Transitions) ---

    // Function to add a slide-in animation on load
    docCategories.forEach((category, index) => {
        // Apply initial hidden state (optional, relying on CSS transition default)
        category.style.opacity = 0;
        category.style.transform = 'translateY(20px)';
        
        // Staggered fade and slide in
        setTimeout(() => {
            category.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s';
            category.style.opacity = 1;
            category.style.transform = 'translateY(0)';
        }, 100 + index * 150);
    });

    // --- 3. Ripple-on-Scroll Effect (Waves or Distortions) ---

    function updateScrollWave() {
        // Calculate scroll progress (0 to 1)
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        
        if (scrollHeight === 0) return; // Prevent division by zero
        
        const scrollRatio = scrolled / scrollHeight; 

        // --- Effect Logic: Apply a visual distortion based on scroll ---
        
        // 1. **Transform Rotation (Movement/Glitch)**: Rotate the overlay slightly
        const rotation = scrollRatio * 360 * 0.1; // Max 36 degrees of rotation
        
        // 2. **Scale Distortion (Warping/Ripple)**: Scale slightly as user scrolls
        const scale = 1 + scrollRatio * 0.05; // Max 5% scale increase

        // 3. **Hue Shift (Color change)**: Shift the overlay color
        const hueShift = scrollRatio * 180; // Shift hue by max 180 degrees

        // Apply styles to the overlay
        scrollOverlay.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        scrollOverlay.style.filter = `hue-rotate(${hueShift}deg)`;
        
        // Apply a subtle change to the main body background/filter for a full-page distortion feel
        document.body.style.filter = `blur(${scrollRatio * 0.5}px)`; // Max 0.5px blur
        document.body.style.transition = 'filter 0.1s linear';
    }

    // Attach the function to the scroll event
    window.addEventListener('scroll', updateScrollWave);

    // Initial call to set the state
    updateScrollWave();
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