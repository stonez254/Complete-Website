// --- NEW FUNCTION: Full Screen Mode Toggle (Placed outside DOMContentLoaded for global access/clarity) ---
function toggleFullScreen() {
    const doc = document.documentElement;
    const navBar = document.getElementById('fixed-nav');
    
    // 1. Check if we are currently in full screen mode
    if (!document.fullscreenElement) {
        // Request Full Screen
        if (doc.requestFullscreen) {
            doc.requestFullscreen();
        } else if (doc.webkitRequestFullscreen) { /* Safari */
            doc.webkitRequestFullscreen();
        } else if (doc.msRequestFullscreen) { /* IE11 */
            doc.msRequestFullscreen();
        }
        
        // 2. Hide the navigation bar element while in full screen
        if (navBar) {
            navBar.style.display = 'none';
        }
        
    } else {
        // Exit Full Screen
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

// --- MAIN INITIALIZATION BLOCK ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Selectors
    const currentTimeSpan = document.getElementById('current-time');
    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');
    const navButtons = document.querySelectorAll('.nav-button');
    // CONSOLIDATED: Selector for the new Full Screen Button
    const fullScreenBtn = document.getElementById('fullscreen-btn'); 

    // --- 1. Real-Time Clock Update ---

    function updateClock() {
        const now = new Date();
        
        // Format the time as HH:MM:SS (24-hour clock)
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        currentTimeSpan.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Update the clock immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);


    // --- 2. Navigation Handlers (Smooth Transitions & Back Button) ---
    
    // Set up the smooth transition style globally (used for fade effect)
    document.body.style.transition = 'opacity 0.4s ease-in-out';
    document.body.style.opacity = 1; // Make page visible on load

    // Function to handle the animated transition
    function animateTransition(targetUrl) {
        // Fade out
        document.body.style.opacity = 0; 
        
        // Wait for the transition to finish before navigating
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 400); // Wait 400ms (matches CSS transition time)
    }

    // Apply transition to all main navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetUrl = button.getAttribute('href');
            animateTransition(targetUrl);
        });
    });

    // Handle the fixed navigation buttons
    homeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        animateTransition('index.html');
    });

    backBtn.addEventListener('click', () => {
        // Back button logic with fallback (General Rule)
        if (window.history.length > 2) { 
            window.history.back();
        } else {
            // Fallback: reload home page
            console.log("No substantial history found, reloading HOME.");
            animateTransition('index.html');
        }
    });
    
    // --- 3. Full Screen Button Handler (CONSOLIDATED) ---
    if (fullScreenBtn) {
        fullScreenBtn.addEventListener('click', toggleFullScreen);
    }
});