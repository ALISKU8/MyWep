document.addEventListener('DOMContentLoaded', () => {
    // 1. Safety Check: Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
        return; 
    }

    // 2. Create Cursor Elements (SVG Arrow)
    // Main Arrow (Instant)
    const cursorMain = document.createElement('div');
    cursorMain.classList.add('cursor-main');
    cursorMain.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="white"/>
        </svg>
    `;
    
    // Ghost Arrow (Trailing)
    const cursorGhost = document.createElement('div');
    cursorGhost.classList.add('cursor-ghost');
    cursorGhost.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" stroke="white" stroke-width="1"/>
        </svg>
    `;

    document.body.appendChild(cursorMain);
    document.body.appendChild(cursorGhost);

    // 3. Movement Logic
    let mouseX = 0;
    let mouseY = 0;
    let ghostX = 0;
    let ghostY = 0;

    // Main follows mouse instantly
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Offset to align tip of arrow with pointer (standard behavior)
        cursorMain.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        
        // Make sure cursor is visible once mouse moves
        cursorMain.style.opacity = '1';
        cursorGhost.style.opacity = '1';
    });

    // Ghost follows with Lerp
    const animateGhost = () => {
        const speed = 0.12; // Trailing speed
        
        ghostX += (mouseX - ghostX) * speed;
        ghostY += (mouseY - ghostY) * speed;
        
        cursorGhost.style.transform = `translate(${ghostX}px, ${ghostY}px)`;
        
        requestAnimationFrame(animateGhost);
    };
    animateGhost();

    // 4. Interaction Logic (Hover Effects)
    const interactiveSelectors = [
        'a', 
        'button', 
        '.btn', 
        '.action-pill', 
        'input', 
        'textarea', 
        '.nav-item', 
        '.social-tile', 
        '.experience-card', 
        '.bento-item', 
        '.gb-btn',
        '.secret-card',
        '.back-btn',
        '.ali-logo'
    ];

    const interactiveElements = document.querySelectorAll(interactiveSelectors.join(','));

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorMain.classList.add('active');
            cursorGhost.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorMain.classList.remove('active');
            cursorGhost.classList.remove('active');
        });
    });
});
