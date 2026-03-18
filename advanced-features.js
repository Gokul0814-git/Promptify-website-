/* ============================================================================
   ADVANCED FEATURES LIBRARY - Promptify Frontend
   ============================================================================
   Comprehensive collection of all major enhancement features:
   - Scroll progress bar
   - Floating back-to-top button
   - Dual particle system with connections
   - 3D card transforms
   - Parallax scrolling
   - Glitch effects
   - Magnetic buttons
   - Hero glow pulse
   - Animated counters
   - Auto-rotating testimonials
   - Scroll-triggered animations
   - Performance optimizations
   ============================================================================ */

(function() {
  'use strict';

  // ============================================================================
  // 1. SCROLL PROGRESS BAR
  // ============================================================================
  function initScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    const updateProgressBar = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', throttle(updateProgressBar, 16), { passive: true });
    updateProgressBar();
  }

  // ============================================================================
  // 2. FLOATING BACK-TO-TOP BUTTON
  // ============================================================================
  function initBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m-7-7l7-7 7 7"/></svg>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', throttle(toggleBackToTop, 16), { passive: true });
  }

  // ============================================================================
  // 3. DUAL PARTICLE SYSTEM WITH CONNECTION LINES
  // ============================================================================
  function initDualParticleSystem() {
    const container = document.createElement('div');
    container.className = 'particle-canvas-container';
    document.body.insertBefore(container, document.body.firstChild);

    // Create two canvas layers
    const canvas1 = document.createElement('canvas');
    const canvas2 = document.createElement('canvas');
    canvas1.className = 'particle-canvas layer-1';
    canvas2.className = 'particle-canvas layer-2';
    container.appendChild(canvas1);
    container.appendChild(canvas2);

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    // Set canvas sizes
    const resizeCanvases = () => {
      canvas1.width = window.innerWidth;
      canvas1.height = window.innerHeight;
      canvas2.width = window.innerWidth;
      canvas2.height = window.innerHeight;
    };
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // Particle class
    class Particle {
      constructor(x, y, radius, velocityX, velocityY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
      }

      update() {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Wrap around screen edges
        if (this.x - this.radius < 0 || this.x + this.radius > canvas1.width) {
          this.velocityX *= -1;
          this.x = Math.max(this.radius, Math.min(canvas1.width - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas1.height) {
          this.velocityY *= -1;
          this.y = Math.max(this.radius, Math.min(canvas1.height - this.radius, this.y));
        }
      }

      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
      }
    }

    // Create particles for layer 1 (blue theme)
    const particles1 = [];
    for (let i = 0; i < 90; i++) {
      const particle = new Particle(
        Math.random() * canvas1.width,
        Math.random() * canvas1.height,
        Math.random() * 1.5 + 0.5,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.2,
        `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.3})`
      );
      particles1.push(particle);
    }

    // Create particles for layer 2 (purple theme)
    const particles2 = [];
    for (let i = 0; i < 60; i++) {
      const particle = new Particle(
        Math.random() * canvas2.width,
        Math.random() * canvas2.height,
        Math.random() * 1.5 + 0.5,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        `rgba(139, 92, 246, ${Math.random() * 0.5 + 0.3})`
      );
      particles2.push(particle);
    }

    // Draw connection lines
    const drawConnections = (particles, context, maxDistance = 120) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3;
            context.strokeStyle = context.fillStyle.replace('0.3', opacity);
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.lineWidth = 0.5;
            context.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      // Clear canvases
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

      // Update and draw layer 1
      particles1.forEach(particle => {
        particle.update();
        particle.draw(ctx1);
      });
      drawConnections(particles1, ctx1);

      // Update and draw layer 2
      particles2.forEach(particle => {
        particle.update();
        particle.draw(ctx2);
      });
      drawConnections(particles2, ctx2);

      requestAnimationFrame(animate);
    };

    animate();
  }

  // ============================================================================
  // 4. 3D CARD TRANSFORMS WITH HOVER EFFECTS
  // ============================================================================
  function init3DCardTransforms() {
    const cards = document.querySelectorAll('.pricing-card, .blog-card, .gallery-item, .feature-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((centerX - x) / centerX) * 8;

        card.style.transform = `
          perspective(1200px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(1.02)
        `;
        card.style.transition = 'none';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
        card.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.2, 1)';
      });
    });
  }

  // ============================================================================
  // 5. PARALLAX SCROLLING EFFECTS
  // ============================================================================
  function initParallaxScrolling() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    const updateParallax = () => {
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const yPos = window.scrollY * speed;
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', throttle(updateParallax, 16), { passive: true });
  }

  // ============================================================================
  // 6. ENHANCED GLITCH TITLE EFFECTS
  // ============================================================================
  function initGlitchEffects() {
    const glitchTitle = document.querySelector('.hero-title');

    if (glitchTitle) {
      glitchTitle.setAttribute('data-text', glitchTitle.textContent);

      // Periodic glitch animation
      setInterval(() => {
        glitchTitle.style.animation = 'none';
        setTimeout(() => {
          glitchTitle.style.animation = 'glitch-anim 0.3s ease-in-out';
        }, 10);
      }, 5000);
    }
  }

  // ============================================================================
  // 7. MAGNETIC BUTTON EFFECTS
  // ============================================================================
  function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('button, .btn-try-free, .btn-get-started, .btn-pricing');

    magneticButtons.forEach(button => {
      let magnetX = 0;
      let magnetY = 0;

      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        magnetX = (e.clientX - centerX) * 0.3;
        magnetY = (e.clientY - centerY) * 0.3;

        button.style.transform = `translate(${magnetX}px, ${magnetY}px) scale(1.05)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  // ============================================================================
  // 8. HERO GLOW PULSE EFFECT
  // ============================================================================
  function initHeroGlowPulse() {
    const hero = document.querySelector('.hero-image-wrapper');

    if (hero) {
      const glow = document.createElement('div');
      glow.className = 'hero-glow-pulse';
      hero.appendChild(glow);
    }
  }

  // ============================================================================
  // 9. ANIMATED COUNTERS
  // ============================================================================
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const animateCounter = (element) => {
      const target = parseInt(element.getAttribute('data-count'));
      let current = 0;
      const increment = target / 100;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current).toLocaleString();
          setTimeout(updateCounter, 30);
        } else {
          element.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    };

    // Use Intersection Observer to animate when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  }

  // ============================================================================
  // 10. AUTO-ROTATING TESTIMONIALS
  // ============================================================================
  function initAutoRotatingTestimonials() {
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (!testimonialContainer) return;

    const testimonials = testimonialContainer.querySelectorAll('.testimonial-item');
    if (testimonials.length === 0) return;

    let currentIndex = 0;

    const rotate = () => {
      testimonials.forEach((item, index) => {
        item.classList.remove('active');
        if (index === currentIndex) {
          item.classList.add('active');
        }
      });
      currentIndex = (currentIndex + 1) % testimonials.length;
    };

    // Rotate every 5 seconds
    setInterval(rotate, 5000);
    rotate(); // Initial call
  }

  // ============================================================================
  // 11. SCROLL-TRIGGERED ANIMATIONS (REVEAL ON SCROLL)
  // ============================================================================
  function initScrollTriggeredAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal], .pricing-card, .blog-card, .gallery-item, .feature-card, .contact-info-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(element => observer.observe(element));
  }

  // ============================================================================
  // 12. RIPPLE EFFECT ON CLICK
  // ============================================================================
  function initRippleEffects() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, .clickable');
      if (!target) return;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      target.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      initScrollProgressBar();
      initBackToTopButton();
      initDualParticleSystem();
      init3DCardTransforms();
      initParallaxScrolling();
      initGlitchEffects();
      initMagneticButtons();
      initHeroGlowPulse();
      initAnimatedCounters();
      initAutoRotatingTestimonials();
      initScrollTriggeredAnimations();
      initRippleEffects();
    }, 100);
  });

  // Fallback if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollProgressBar();
      initBackToTopButton();
      initDualParticleSystem();
      init3DCardTransforms();
      initParallaxScrolling();
      initGlitchEffects();
      initMagneticButtons();
      initHeroGlowPulse();
      initAnimatedCounters();
      initAutoRotatingTestimonials();
      initScrollTriggeredAnimations();
      initRippleEffects();
    });
  } else {
    initScrollProgressBar();
    initBackToTopButton();
    initDualParticleSystem();
    init3DCardTransforms();
    initParallaxScrolling();
    initGlitchEffects();
    initMagneticButtons();
    initHeroGlowPulse();
    initAnimatedCounters();
    initAutoRotatingTestimonials();
    initScrollTriggeredAnimations();
    initRippleEffects();
  }

})();
