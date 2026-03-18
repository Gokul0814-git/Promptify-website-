/**
 * ADVANCED CURSOR ANIMATIONS
 * ==========================
 * Professional cursor effects and tracking animations
 * - Glowing cursor with smooth tracking
 * - Particle trails on movement
 * - Interactive button hover effects
 * - Zero discrepancies in performance
 */

class AdvancedCursorSystem {
    constructor() {
        this.cursor = null;
        this.cursorTrail = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.particles = [];
        this.isMoving = false;
        this.moveTimeout = null;
        this.particleCount = 0;
        this.maxParticles = 200;
        
        // Performance throttling
        this.lastTrailTime = 0;
        this.trailInterval = 20; // ms between trail particles
        
        this.init();
    }

    init() {
        // Create cursor DOM elements
        this.createCursorElements();
        
        // Attach event listeners
        this.attachEventListeners();
        
        // Start animation loop
        this.startAnimationLoop();
        
        // Preload particle styles
        this.injectParticleStyles();
    }

    createCursorElements() {
        // Main cursor dot
        this.cursor = document.createElement('div');
        this.cursor.className = 'advanced-cursor';
        this.cursor.innerHTML = `
            <div class="cursor-core"></div>
            <div class="cursor-ring"></div>
            <div class="cursor-glow"></div>
        `;
        document.body.appendChild(this.cursor);

        // Trail container
        this.cursorTrail = document.createElement('div');
        this.cursorTrail.className = 'cursor-trail-container';
        document.body.appendChild(this.cursorTrail);

        // Hide default cursor
        document.documentElement.style.cursor = 'none';
    }

    attachEventListeners() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
        document.addEventListener('mouseenter', () => this.showCursor());
        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('mousedown', () => this.handleMouseDown());
        document.addEventListener('mouseup', () => this.handleMouseUp());

        // Interactive elements
        this.attachInteractiveListeners();
    }

    attachInteractiveListeners() {
        // Buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseenter', () => this.expandCursor());
            btn.addEventListener('mouseleave', () => this.shrinkCursor());
        });

        // Links
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => this.expandCursor());
            link.addEventListener('mouseleave', () => this.shrinkCursor());
        });

        // Input fields
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('mouseenter', () => this.transformCursorToText());
            input.addEventListener('mouseleave', () => this.transformCursorToDefault());
        });
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Calculate movement velocity
        const dx = this.mouseX - this.lastX;
        const dy = this.mouseY - this.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Create trail particles based on movement speed
        const now = Date.now();
        if (now - this.lastTrailTime > this.trailInterval && distance > 2) {
            this.createTrailParticle(this.lastX, this.lastY, distance);
            this.lastTrailTime = now;
        }

        this.lastX = this.mouseX;
        this.lastY = this.mouseY;

        // Reset movement timeout
        clearTimeout(this.moveTimeout);
        this.isMoving = true;
        this.cursor.classList.add('moving');

        this.moveTimeout = setTimeout(() => {
            this.isMoving = false;
            this.cursor.classList.remove('moving');
        }, 150);
    }

    createTrailParticle(x, y, speed) {
        if (this.particleCount >= this.maxParticles) {
            return; // Limit particle count for performance
        }

        const particle = document.createElement('div');
        particle.className = 'cursor-trail-particle';
        
        // Random size based on speed
        const size = 2 + Math.random() * (Math.min(speed, 10) / 2);
        const opacity = Math.min(1, speed / 8);
        
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
        `;

        this.cursorTrail.appendChild(particle);
        this.particleCount++;

        // Animate and remove
        const duration = 400 + Math.random() * 200;
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: opacity
            },
            { 
                transform: `translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 40 - 20}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => {
            particle.remove();
            this.particleCount--;
        }, duration);
    }

    expandCursor() {
        if (this.cursor) {
            this.cursor.classList.add('expanded');
            this.cursor.classList.add('hover-active');
        }
    }

    shrinkCursor() {
        if (this.cursor) {
            this.cursor.classList.remove('expanded');
            this.cursor.classList.remove('hover-active');
        }
    }

    transformCursorToText() {
        if (this.cursor) {
            this.cursor.classList.add('text-mode');
        }
    }

    transformCursorToDefault() {
        if (this.cursor) {
            this.cursor.classList.remove('text-mode');
        }
    }

    handleMouseDown() {
        if (this.cursor) {
            this.cursor.classList.add('clicked');
            // Create click particles
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    this.createClickParticle(this.mouseX, this.mouseY);
                }, i * 30);
            }
        }
    }

    handleMouseUp() {
        if (this.cursor) {
            this.cursor.classList.remove('clicked');
        }
    }

    createClickParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-click-particle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 30;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
        `;

        this.cursorTrail.appendChild(particle);

        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            { 
                transform: `translate(${tx}px, ${ty}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        });

        setTimeout(() => particle.remove(), 600);
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.cursor) {
                this.cursor.style.transform = `translate(${this.mouseX - 8}px, ${this.mouseY - 8}px)`;
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    showCursor() {
        if (this.cursor) {
            this.cursor.style.display = 'block';
        }
    }

    hideCursor() {
        if (this.cursor) {
            this.cursor.style.display = 'none';
        }
    }

    injectParticleStyles() {
        // Styles are in CSS file, but add any dynamic styles here if needed
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFade {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Public method to customize particle count
    setMaxParticles(count) {
        this.maxParticles = Math.max(50, Math.min(500, count));
    }

    // Public method to toggle cursor effects
    toggleEffects(enabled) {
        if (enabled) {
            document.documentElement.style.cursor = 'none';
        } else {
            document.documentElement.style.cursor = 'auto';
            if (this.cursor) this.cursor.style.display = 'none';
        }
    }

    // Performance report
    getPerformanceMetrics() {
        return {
            activeParticles: this.particleCount,
            maxParticles: this.maxParticles,
            isMoving: this.isMoving,
            totalParticlesCreated: this.particles.length
        };
    }
}

// Initialize cursor system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cursorSystem = new AdvancedCursorSystem();
    
    // Optional: Log initialization
    console.log('✨ Advanced Cursor System initialized');
});

// Enable performance monitoring in development
if (window.location.hostname === 'localhost') {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'p' && e.ctrlKey) {
            const metrics = window.cursorSystem?.getPerformanceMetrics();
            console.table(metrics);
        }
    });
}
