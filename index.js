document.addEventListener('DOMContentLoaded', () => {
    const currentTimeSpan = document.getElementById('current-time');
    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');
    const navButtons = document.querySelectorAll('.nav-button');

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

    // Function to handle the animated transition (Fade/Slide/Scale - using Fade here)
    function animateTransition(targetUrl) {
        // Fade out
        document.body.style.opacity = 0; 
        
        // Wait for the transition to finish before navigating
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 400); // Wait 400ms (matches CSS transition time)
    }

    // Apply transition to all navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default navigation
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
        // Check if there is history beyond the current page and the initial landing page
        if (window.history.length > 2) { 
            window.history.back();
        } else {
            // Fallback: reload home page if the user landed directly
            console.log("No substantial history found, reloading HOME.");
            animateTransition('index.html');
        }
    });

});