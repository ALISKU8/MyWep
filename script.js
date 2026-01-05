document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // --- Page Transitions ---
    const overlay = document.getElementById('transition-overlay');

    // 1. Check for Entrance Transition (New Page Load)
    const transitionColor = sessionStorage.getItem('transitionColor');
    if (transitionColor && overlay) {
        // Set initial state for entrance
        overlay.style.background = transitionColor;
        overlay.style.opacity = '1';
        overlay.style.transition = 'none'; // Instant set
        
        // Force reflow
        void overlay.offsetWidth;

        // Start Fade Out
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.8s ease-in-out';
            overlay.style.opacity = '0';
        }, 50);

        // Clear storage
        sessionStorage.removeItem('transitionColor');
    }

    // 2. Handle Exit Transitions (Link Clicks)
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Handle Internal Links
            if (href.startsWith('#')) {
                e.preventDefault();
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }

            // Handle External/Page Links
            if (href.endsWith('.html') || href === '/' || href.includes('index.html')) { // Added index.html check
                e.preventDefault();
                
                // Color Logic
                if (overlay) {
                    let color = '#020617'; // Default
                    if (href.includes('mepco.html')) {
                        color = '#f59e0b'; // MEPCO Orange
                    } else if (href.includes('jeddah_uni.html')) {
                        color = '#0ea5e9'; // Uni Blue
                    } else if (href.includes('yaqadh.html')) {
                        color = '#a855f7'; // Yaqadh Purple
                    }

                    // Save color for next page
                    sessionStorage.setItem('transitionColor', color);

                    // Animate Exit
                    overlay.style.transition = 'opacity 0.8s ease-in-out';
                    overlay.style.background = color;
                    overlay.classList.add('active'); // CSS handles opacity: 1
                    overlay.style.opacity = '1';

                    setTimeout(() => {
                        window.location.href = href;
                    }, 800); // Matches CSS transition duration
                } else {
                    window.location.href = href;
                }
            }
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Particle Animation (Calm & Slow) ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
        resizeCanvas();

        const mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor(x, y, dx, dy, size, color) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

                // Mouse interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    if (mouse.x < this.x && this.x < canvas.width - 10) this.x += 1;
                    if (mouse.x > this.x && this.x > 10) this.x -= 1;
                    if (mouse.y < this.y && this.y < canvas.height - 10) this.y += 1;
                    if (mouse.y > this.y && this.y > 10) this.y -= 1;
                }

                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 10000; // Density
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 0.5;
                let x = (Math.random() * (innerWidth - size * 2) + size * 2);
                let y = (Math.random() * (innerHeight - size * 2) + size * 2);
                let dx = (Math.random() * 0.2) - 0.1; // Very slow speed
                let dy = (Math.random() * 0.2) - 0.1;
                let color = 'rgba(56, 189, 248, 0.5)';

                particlesArray.push(new Particle(x, y, dx, dy, size, color));
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/9) * (canvas.height/9)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(56, 189, 248,' + opacityValue * 0.2 + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        initParticles();
        animateParticles();
    }

    // --- Countdown Timer (Jan 18, 2026) ---
    const countdownContainer = document.getElementById('countdown');
    if (countdownContainer) {
        const targetDate = new Date("Jan 18, 2026 00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                // Timer Expired
                countdownContainer.style.display = 'none';
                const badge = document.querySelector('.coming-soon-badge-small');
                if (badge) {
                    badge.textContent = "AVAILABLE NOW";
                    badge.style.borderColor = "#22c55e"; // Green
                    badge.style.color = "#22c55e";
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days.toString().padStart(2, '0');
            document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
            document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
        };

        setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }
});
