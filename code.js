document.addEventListener('DOMContentLoaded', () => {

    const editor = document.getElementById('code-editor');
    const langSelector = document.getElementById('language-selector');
    const runBtn = document.getElementById('run-btn');
    const outputScreen = document.getElementById('output-screen');
    const errorConsole = document.getElementById('error-console');
    const outputWrapper = document.getElementById('output-screen-wrapper');

    // --- 1. Navigation and Transition Handlers (General Rules) ---

    const homeBtn = document.getElementById('home-btn');
    const backBtn = document.getElementById('back-btn');

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

    // --- 2. Code Execution Logic ---

    // Animation Trigger
    function triggerAnimation() {
        outputWrapper.classList.remove('screen-active');
        // Force reflow/repaint to restart the animation
        void outputWrapper.offsetWidth; 
        outputWrapper.classList.add('screen-active');
    }

    function showError(message) {
        errorConsole.textContent = `Error: ${message}`;
        errorConsole.classList.remove('hidden');
    }

    function clearError() {
        errorConsole.classList.add('hidden');
    }

    function runCode() {
        clearError();
        triggerAnimation();

        const code = editor.value;
        const language = langSelector.value;
        const iframeDoc = outputScreen.contentWindow.document;

        // Clear previous output
        iframeDoc.open();
        iframeDoc.write('');
        iframeDoc.close();
        
        try {
            switch (language) {
                case 'html':
                    // If HTML, write the entire content to the iframe
                    iframeDoc.open();
                    iframeDoc.write(code);
                    iframeDoc.close();
                    break;

                case 'css':
                    // If CSS, wrap it in style tags and inject into the iframe head
                    iframeDoc.open();
                    iframeDoc.write(`<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>CSS Output</h1><p>The CSS below has been applied to this default content.</p></body></html>`);
                    iframeDoc.close();
                    break;
                
                case 'javascript':
                    // If JavaScript, inject a basic HTML structure and run the script
                    iframeDoc.open();
                    iframeDoc.write(`
                        <!DOCTYPE html>
                        <html>
                        <body>
                            <p id="output-js">JavaScript Output:</p>
                            <script>
                                // Capture console output to display on the page
                                const originalConsoleLog = console.log;
                                console.log = (...args) => {
                                    document.getElementById('output-js').innerHTML += '<br>' + args.join(' ');
                                    originalConsoleLog(...args);
                                };
                                try {
                                    ${code}
                                } catch (e) {
                                    document.getElementById('output-js').innerHTML += '<br><span style="color: red;">JS Error: ' + e.message + '</span>';
                                }
                            </script>
                        </body>
                        </html>
                    `);
                    iframeDoc.close();
                    break;
                
                case 'python':
                    // Basic Python (using Pyodide or simple evaluation notes)
                    // NOTE: Pyodide is required for in-browser Python execution. 
                    // This function assumes the Pyodide environment is set up.
                    // For a true sandbox, you would check if Pyodide is loaded and execute:
                    /*
                    if (window.pyodide) {
                        const output = window.pyodide.runPython(code);
                        iframeDoc.open();
                        iframeDoc.write(`Python Output:<pre>${output}</pre>`);
                        iframeDoc.close();
                    } else {
                        showError("Python execution requires the Pyodide library. Please load it in the HTML.");
                    }
                    */
                    // Fallback for demonstration without Pyodide load:
                    showError("Python execution environment not fully configured in this sandbox. Requires Pyodide.");
                    break;
            }
        } catch (e) {
            showError(`General Execution Error: ${e.message}`);
        }
    }

    // --- 3. Event Listeners ---
    runBtn.addEventListener('click', runCode);

    // Optional: Run code on Ctrl+Enter
    editor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
        }
    });

    // Optional: Populate with a default example on load
    langSelector.addEventListener('change', () => {
        const lang = langSelector.value;
        let defaultCode = '';
        if (lang === 'html') {
            defaultCode = '<h1>Hello Ederstone Code!</h1>\n<p style="color: blue;">Welcome to the HTML Sandbox.</p>';
        } else if (lang === 'css') {
            defaultCode = 'body { background-color: #222; }\nh1 { color: orange; text-shadow: 0 0 5px red; }';
        } else if (lang === 'javascript') {
            defaultCode = 'function greeting() {\n  let msg = "Code executed successfully!";\n  console.log(msg);\n}\ngreeting();\n// Try changing console.log to alert() or document.write() for different results.';
        } else if (lang === 'python') {
            defaultCode = 'def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a)\n        a, b = b, a + b\n\nfibonacci(5)';
        }
        editor.value = defaultCode;
    });

    // Initialize with a default example
    langSelector.dispatchEvent(new Event('change'));

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