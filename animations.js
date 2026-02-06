/**
 * Portfolio Animations - Stunning Effects System
 * Uses Framer Motion for advanced animations
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollAnimations();
    initMagneticButtons();
    initTypingEffect();
    initTiltCards();
    initGlowEffects();
    initMobileMenu();
    initSmoothScroll();
    initScrollIndicator();
});

// ============================================
// PARTICLE SYSTEM - Floating Stars/Dots
// ============================================
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.6;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.2,
            hue: Math.random() > 0.5 ? 45 : 195 // Gold or Cyan
        };
    }

    function initParticleArray() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle with glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsla(${p.hue}, 80%, 60%, 0.5)`;
            ctx.fill();
        });

        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resize();
    });

    resize();
    initParticleArray();
    animateParticles();
}

// ============================================
// SCROLL ANIMATIONS - Reveal on Scroll
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on element position
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll(`
        .hero-content,
        .terminal-frame,
        .highlight-card,
        .cta-card,
        .project-card,
        .skill-tag,
        .skills-block,
        .text-block,
        .value-item,
        .contact-item,
        .contact-panel,
        .page-hero-content > div,
        .page-hero-card,
        .cp-link
    `);

    animateElements.forEach((el, index) => {
        el.classList.add('animate-hidden');
        el.dataset.delay = index % 8; // Stagger in groups
        observer.observe(el);
    });
}

// ============================================
// MAGNETIC BUTTONS - Cursor Attraction
// ============================================
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.btn, .nav-link, .logo');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// TYPING EFFECT - Terminal Animation
// ============================================
function initTypingEffect() {
    const terminalName = document.querySelector('.terminal-name');
    const terminalRole = document.querySelector('.terminal-role');
    const terminalLine = document.querySelector('.terminal-line');
    
    if (!terminalName) return;

    const nameText = terminalName.textContent;
    const roleText = terminalRole ? terminalRole.textContent : '';
    
    terminalName.textContent = '';
    terminalName.style.borderRight = '3px solid var(--accent)';
    if (terminalRole) terminalRole.style.opacity = '0';

    let i = 0;
    function typeWriter() {
        if (i < nameText.length) {
            terminalName.textContent += nameText.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        } else {
            terminalName.style.borderRight = 'none';
            terminalName.classList.add('typing-done');
            // Animate in role text
            if (terminalRole) {
                terminalRole.style.transition = 'opacity 0.5s ease';
                terminalRole.style.opacity = '1';
            }
        }
    }

    // Start typing after intro is dismissed or after a delay
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            setTimeout(typeWriter, 500);
        });
    } else {
        setTimeout(typeWriter, 300);
    }
}

// ============================================
// 3D TILT CARDS - Perspective on Hover
// ============================================
function initTiltCards() {
    const cards = document.querySelectorAll('.project-card, .highlight-card, .page-hero-card, .text-block, .skills-block');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ============================================
// GLOW EFFECTS - Enhanced Hover States
// ============================================
function initGlowEffects() {
    // Add glow container for buttons
    const buttons = document.querySelectorAll('.primary-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 0 30px rgba(245, 200, 107, 0.6), 0 15px 30px rgba(245, 200, 107, 0.3)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = '0 12px 24px rgba(245, 200, 107, 0.25)';
        });
    });

    // Skill tags glow effect
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.boxShadow = '0 0 20px rgba(245, 200, 107, 0.4), inset 0 0 20px rgba(245, 200, 107, 0.1)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.boxShadow = 'none';
        });
    });
}

// ============================================
// MOBILE MENU - Toggle Navigation
// ============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (!menuBtn || !navList) return;

    menuBtn.addEventListener('click', () => {
        navList.classList.toggle('mobile-active');
        menuBtn.classList.toggle('is-active');
        
        // Animate icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking on a link
    navList.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('mobile-active');
            menuBtn.classList.remove('is-active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

// ============================================
// SMOOTH SCROLL - Enhanced Scrolling
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SCROLL INDICATOR - Bouncing Arrow
// ============================================
function initScrollIndicator() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Create scroll indicator if it doesn't exist
    if (!document.querySelector('.scroll-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
        hero.appendChild(indicator);
    }

    // Hide on scroll
    window.addEventListener('scroll', () => {
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            indicator.style.opacity = window.scrollY > 100 ? '0' : '1';
        }
    });
}

// ============================================
// AURORA BACKGROUND ANIMATION
// ============================================
function initAuroraBackground() {
    const aurora = document.createElement('div');
    aurora.className = 'aurora-bg';
    document.body.prepend(aurora);
}

// Call aurora init
initAuroraBackground();

// ============================================
// INTRO SCREEN ENHANCEMENT
// ============================================
const introScreen = document.getElementById('intro-screen');
const enterBtn = document.getElementById('enter-btn');

if (introScreen && enterBtn) {
    // Add loading animation to button
    enterBtn.addEventListener('click', () => {
        enterBtn.innerHTML = '<span class="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>';
        enterBtn.disabled = true;
        
        setTimeout(() => {
            introScreen.classList.add('is-hidden');
            document.body.classList.remove('intro-active');
            
            // Trigger hero animations
            document.querySelectorAll('.hero .animate-hidden').forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, i * 150);
            });
        }, 800);
    });
}

// ============================================
// COUNTER ANIMATION - Animate Numbers
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// ============================================
// CURSOR TRAIL EFFECT (Optional - for extra flair)
// ============================================
function initCursorTrail() {
    const trail = [];
    const trailLength = 8;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i}px;
            height: ${8 - i}px;
            background: rgba(245, 200, 107, ${0.6 - i * 0.07});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0, mouseY = 0;
    const positions = [];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.forEach(dot => dot.style.opacity = '1');
    });

    document.addEventListener('mouseleave', () => {
        trail.forEach(dot => dot.style.opacity = '0');
    });

    function animate() {
        positions.unshift({ x: mouseX, y: mouseY });
        if (positions.length > trailLength) positions.pop();

        trail.forEach((dot, index) => {
            const pos = positions[index] || positions[positions.length - 1];
            if (pos) {
                dot.style.left = pos.x + 'px';
                dot.style.top = pos.y + 'px';
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Uncomment to enable cursor trail
// initCursorTrail();

console.log('✨ Portfolio animations initialized!');
