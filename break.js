document.addEventListener('DOMContentLoaded', () => {

    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');
    const fireworksContainer = document.getElementById('fireworks-container');
    const linkCards = document.querySelectorAll('.link-card');

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

    // --- 2. Interactive Ripple Effect on Click ---

    // Function to generate a fun, random accent color
    function getRandomFunColor() {
        const colors = [
            '#ff416c', // Accent Red
            '#ffc141', // Accent Yellow
            '#2ecc71', // Accent Green
            '#00ffff', // Cyan
            '#ff00ff'  // Magenta
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    linkCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ripple effect logic
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const maxDim = Math.max(rect.width, rect.height);
            const size = maxDim * 2; 

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-break');
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x - size / 2}px`;
            ripple.style.top = `${y - size / 2}px`;
            
            // Apply the randomized fun color
            ripple.style.backgroundColor = getRandomFunColor();
            
            card.appendChild(ripple);

            // Clean up the ripple element after the animation finishes
            setTimeout(() => {
                ripple.remove();
            }, 500); // Matches CSS animation time
        });
    });


    // --- 3. Fireworks Animation (Continuous Bursts) ---

    const MAX_FIREWORKS = 8;
    const FIREWORK_LIFESPAN = 5000; // 5 seconds (matches CSS animation duration)

    function createFirework() {
        if (fireworksContainer.childElementCount >= MAX_FIREWORKS) {
            // Limit the number of concurrent fireworks
            fireworksContainer.firstChild.remove(); 
        }

        const particle = document.createElement('div');
        particle.classList.add('firework-particle');

        // Random starting position (x) and general area (y)
        const startX = Math.random() * 100;
        const startY = Math.random() * 20 + 80; // Start higher up (80vh to 100vh)
        
        // Randomize the end position to make the burst scatter
        const endX = startX + (Math.random() * 40 - 20); // +/- 20vw scatter
        const endY = startY + (Math.random() * 40 - 20); // +/- 20vh scatter

        const color = getRandomFunColor();

        // Use CSS variables to pass random values to the keyframes
        particle.style.setProperty('--x', `${startX}vw`);
        particle.style.setProperty('--y', `${startY}vh`);
        particle.style.setProperty('--x-end', `${endX}vw`);
        particle.style.setProperty('--y-end', `${endY}vh`);
        particle.style.setProperty('--color', color);
        particle.style.animationDelay = `${Math.random() * 2}s`; // Stagger delays

        fireworksContainer.appendChild(particle);

        // Clean up the particle after its animation
        setTimeout(() => {
            particle.remove();
        }, FIREWORK_LIFESPAN + 100);
    }

    // Start a continuous loop of creating fireworks
    function launchFireworkLoop() {
        createFirework();
        // Launch a new firework particle every 1 to 3 seconds
        const delay = Math.random() * 2000 + 1000; 
        setTimeout(launchFireworkLoop, delay);
    }

    launchFireworkLoop();

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