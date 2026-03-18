/* Promptify - script.js
   - Smooth scroll
   - Prompt enhancement (placeholder AI logic)
   - Enhancement percentage animation
   - Rocket launch + particle trail (canvas)
   - Custom cursor with small trailing particles
*/
(function(){
  const $ = s => document.querySelector(s);

  // Smooth scroll for nav and CTA
  function initSmoothScroll(){
    document.querySelectorAll('[data-scroll], .nav-link').forEach(el=>{
      if (el) {
        el.addEventListener('click', e=>{
          const target = el.dataset.scroll || el.getAttribute('href');
          if(!target || !target.startsWith('#')) return;
          e.preventDefault();
          const node = document.querySelector(target);
          if(node) node.scrollIntoView({behavior:'smooth',block:'start'});
        });
      }
    });
  }

  // Local enhancement algorithm (5-step). Replace this with your LLM call.
  function enhanceWithRules(input){
    let text = (input||'').trim();
    if(!text) return '';

    // 1) Add action prefix if missing
    if(!/^(create|generate|write|design|build|develop)/i.test(text)){
      text = 'Generate: ' + text;
    }

    // 2) Remove immediate repeated words
    text = text.replace(/\b(\w+)\s+\1\b/gi,'$1');

    // 3) Replace vague terms
    const map = {good:'high-quality', nice:'professional', stuff:'relevant content', thing:'item'};
    Object.keys(map).forEach(k=>{ text = text.replace(new RegExp('\\b'+k+'\\b','gi'), map[k]); });

    // 4) Add requested output format if none specified
    if(!/(format|as|in|output|json|yaml)/i.test(text)){
      text += ' Provide the output in a clear, labeled format with examples where relevant.';
    }

    // 5) Improve structure: break into lines for clarity
    const sentences = text.split(/(?<=[\.\?\!])\s+/);
    if(sentences.length > 1){ text = sentences.join('\n'); }

    // final polish
    text = text.replace(/\bi\b/g,'I');
    return text;
  }

  // Percentage calculation per spec
  function calculatePercentage(original, enhanced){
    if(!original || original.length === 0) return 0;
    const diff = enhanced.length - original.length;
    let percentage = (diff / original.length) * 100;
    percentage = Math.max(-50, Math.min(200, percentage));
    return Math.round(Math.abs(percentage));
  }

  // Animate numeric counter
  function animateNumber(el, from, to, duration=700){
    const start = performance.now();
    function step(ts){
      const t = Math.min(1,(ts-start)/duration);
      const v = Math.round(from + (to-from)*t);
      el.textContent = v + '%';
      if(t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Rocket trail canvas implementation
  function RocketTrail(canvas){
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.particles = []; this.resize();
    window.addEventListener('resize', ()=>this.resize());
  }
  RocketTrail.prototype.resize = function(){ this.canvas.width = this.canvas.clientWidth; this.canvas.height = this.canvas.clientHeight; };
  RocketTrail.prototype.spawn = function(x,y){
    for(let i=0;i<20;i++){ this.particles.push({x,y,vx:(Math.random()-0.5)*2.4,vy:-Math.random()*3-0.6,age:0,life:Math.random()*60+30,size:Math.random()*2+0.7,color:`rgba(255,200,120,${0.6+Math.random()*0.4})`}); }
    if(!this.raf) this.loop();
  };
  RocketTrail.prototype.loop = function(){
    this.raf = requestAnimationFrame(()=>this.loop());
    const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height; ctx.clearRect(0,0,w,h);
    this.particles = this.particles.filter(p=>p.age < p.life);
    this.particles.forEach(p=>{ p.age++; p.x += p.vx; p.y += p.vy; p.vy += 0.03; ctx.globalAlpha = 1 - (p.age/p.life); ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); });
    ctx.globalAlpha = 1;
  };

  let rocketTrailInstance = null;
  function launchRocket(){
    const rocket = $('#rocket'); const canvas = $('#rocketTrail');
    if(!rocket || !canvas) return;
    // animate rocket element
    rocket.classList.remove('rocket-launch'); void rocket.offsetWidth; rocket.classList.add('rocket-launch');
    // spawn particles roughly at bottom-center of canvas
    const rect = canvas.getBoundingClientRect(); const x = rect.width/2, y = rect.height*0.8;
    const rt = rocketTrailInstance; if(rt){
      const interval = setInterval(()=>{ rt.spawn(x + (Math.random()*10-5), y + (Math.random()*6-3)); }, 60);
      setTimeout(()=>clearInterval(interval), 800);
    }
  }

  // Clipboard helper
  function copyToClipboard(text){ if(!text) return Promise.resolve(); if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text); const ta = document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return Promise.resolve(); }

  // Custom cursor and subtle trails
  function initCustomCursor(){
    document.body.classList.add('hide-native-cursor');
    const cursor = $('#cursor'); if(!cursor) return;
    window.addEventListener('mousemove', e=>{ cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; // small transient dot
      const d = document.createElement('div'); d.style.position='fixed'; d.style.pointerEvents='none'; d.style.left=(e.clientX + (Math.random()*8-4))+'px'; d.style.top=(e.clientY + (Math.random()*8-4))+'px'; d.style.width='6px'; d.style.height='6px'; d.style.borderRadius='50%'; d.style.background='rgba(255,255,255,0.12)'; d.style.zIndex=9998; d.style.transition='opacity 320ms linear'; document.body.appendChild(d); setTimeout(()=>d.style.opacity='0',20); setTimeout(()=>d.remove(),360);
    });
    window.addEventListener('touchstart', e=>{ if(e.touches && e.touches[0]){ const t=e.touches[0]; cursor.style.left=t.clientX+'px'; cursor.style.top=t.clientY+'px'; } },{passive:true});
  }

  // Engine UI wiring
  function initEngineUI(){
    // Skip if AI bot is present (it has its own enhancement system)
    if (document.getElementById('promptify-bot')) {
      console.log('AI bot detected, skipping legacy engine UI');
      return;
    }
    
    const input = document.getElementById('inputPrompt');
    const output = document.getElementById('outputPrompt');
    const enhanceBtn = document.getElementById('enhanceBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const charCount = document.getElementById('charCount');
    const percentEl = document.getElementById('percentVal');
    if(!input || !output || !enhanceBtn) return;
    input.addEventListener('input', ()=>{ charCount.textContent = `${input.value.length} / ${input.maxLength}`; });


        enhanceBtn.addEventListener('click', async ()=>{
            const orig = input.value.trim();
            if(!orig){
                input.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:360});
                return;
            }
            enhanceBtn.disabled = true;
            enhanceBtn.textContent = 'Enhancing...';
            let enhanced = '';
            let pct = 0;
            try {
                // Try backend API first
                const resp = await fetch('http://localhost:3000/api/enhance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: orig })
                });
                const data = await resp.json();
                if (resp.ok && data.enhancedPrompt) {
                    enhanced = data.enhancedPrompt;
                } else {
                    throw new Error(data.error || 'No enhanced prompt');
                }
            } catch (err) {
                // Fallback to local enhancement if backend fails
                console.error('Backend enhance failed:', err);
                enhanced = enhanceWithRules(orig);
            }
            output.value = enhanced;
            pct = calculatePercentage(orig, enhanced);
            animateNumber(percentEl, 0, pct, 800);
            launchRocket();
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = 'Enhance Prompt';
        });

    copyBtn.addEventListener('click', ()=>{ copyToClipboard(output.value).then(()=>{ copyBtn.textContent='✓ Copied!'; setTimeout(()=>copyBtn.textContent='Copy Output',1400); }); });
    clearBtn.addEventListener('click', ()=>{ input.value=''; output.value=''; charCount.textContent='0 / 2000'; percentEl.textContent='0%'; });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // Wait for partials to be loaded before checking login state
    document.addEventListener('partialsLoaded', function() {
      // Check login state and show username if logged in
      const username = localStorage.getItem('promptify.username');
      const nav = document.querySelector('nav');
      const navUserArea = document.getElementById('navUserArea');
      
      if (username && navUserArea) {
        // Update the user section
        navUserArea.innerHTML = `
          <span class="username-display">👤 ${username}</span>
          <button id="logoutBtn" class="logout-btn">Logout</button>
        `;
        
        // Style the elements
        const usernameDisplay = navUserArea.querySelector('.username-display');
        const logoutBtn = navUserArea.querySelector('#logoutBtn');
        
        if (usernameDisplay) {
          usernameDisplay.style.color = '#4a90e2';
          usernameDisplay.style.fontWeight = '500';
          usernameDisplay.style.fontSize = '0.95rem';
        }
        
        if (logoutBtn) {
          logoutBtn.style.padding = '6px 14px';
          logoutBtn.style.background = '#ff4d4f';
          logoutBtn.style.color = 'white';
          logoutBtn.style.border = 'none';
          logoutBtn.style.borderRadius = '4px';
          logoutBtn.style.cursor = 'pointer';
          logoutBtn.style.transition = 'all 0.3s';
          logoutBtn.style.fontSize = '0.85rem';
          
          logoutBtn.addEventListener('mouseover', () => {
            logoutBtn.style.background = '#ff7875';
            logoutBtn.style.transform = 'translateY(-1px)';
          });
          
          logoutBtn.addEventListener('mouseout', () => {
            logoutBtn.style.background = '#ff4d4f';
            logoutBtn.style.transform = 'translateY(0)';
          });
          
          logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('promptify.username');
            window.location.href = '/login.html';
          });
        }
        
        // Ensure nav has proper layout
        if (nav) {
          nav.style.display = 'flex';
          nav.style.justifyContent = 'space-between';
          nav.style.alignItems = 'center';
          nav.style.padding = '0 20px';
          nav.style.width = '100%';
          nav.style.boxSizing = 'border-box';
          
          // Style the navigation links container
          const navLinks = nav.querySelector('ul');
          if (navLinks) {
            navLinks.style.display = 'flex';
            navLinks.style.gap = '20px';
            navLinks.style.margin = '0';
            navLinks.style.padding = '0';
            navLinks.style.listStyle = 'none';
          }
        }
      } else if (!username && !window.location.pathname.endsWith('login.html') && 
                !window.location.pathname.endsWith('signup.html')) {
        window.location.href = '/login.html';
        return;
      }
    });
    
    initSmoothScroll(); initCustomCursor(); initEngineUI();
    const canvas = document.getElementById('rocketTrail'); if(canvas){ rocketTrailInstance = new RocketTrail(canvas); canvas.style.opacity=0; canvas.style.transition='opacity 220ms'; }
  });

  // Expose for debugging
  window.promptify = { enhanceWithRules, calculatePercentage };

  // Initialize Chart.js for AI Users Growth
  const chartCtx = document.getElementById('aiUsersChart');
  if (chartCtx) {
    // Data for AI model users over the past 10 years (in millions)
    const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const users = [5, 12, 25, 45, 80, 150, 280, 500, 850, 1200, 1800];

    new Chart(chartCtx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: 'AI Model Users (Millions)',
          data: users,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(59, 130, 246, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#E2E8F0',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#3B82F6',
            bodyColor: '#E2E8F0',
            borderColor: '#3B82F6',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#94A3B8',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(59, 130, 246, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#94A3B8',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(59, 130, 246, 0.1)'
            }
          }
        }
      }
    });
  }

  // Create intersection observer for scroll animations
  let observer;
  try {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target && entry.target.classList) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animate-in');
          }
        }
      });
    }, { threshold: 0.1 });
  } catch (error) {
    console.error('Error creating observer:', error);
    observer = null;
  }

  // Add null checks for elements before processing
  const elementsToAnimate = document.querySelectorAll('.pricing-card, .blog-card, .faq-item, .gallery-item, .contact-info-card');
  elementsToAnimate.forEach(el => {
    if (el && el.classList) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      if (observer) {
        observer.observe(el);
      }
    }
  });
});

// Stagger animation for pricing cards
const pricingCards = document.querySelectorAll('.pricing-card');
if (pricingCards) {
    pricingCards.forEach((card, index) => {
        if (card) {
            card.style.transitionDelay = `${index * 0.1}s`;
        }
    });
}

// Floating tags animation enhancement
const blogCards = document.querySelectorAll('.blog-card');
if (blogCards) {
    blogCards.forEach((card, index) => {
        if (card) {
            card.style.transitionDelay = `${index * 0.15}s`;
        }
    });
}

// Floating tags animation enhancement
const tags = document.querySelectorAll('.tag');
if (tags) {
    tags.forEach((tag, index) => {
        if (tag) {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.1) translateY(-5px)';
                tag.style.transition = 'all 0.3s ease';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
            });
        }
    });
}

// Button click handlers with ripple effect
document.querySelectorAll('.btn-get-started, .btn-try-free, .btn-pricing, .btn-submit').forEach(button => {
    if (button) {
        button.addEventListener('click', function(e) {
            // Only proceed if the button doesn't have the 'btn-generate' class
            if (this.classList.contains('btn-generate')) return;
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Get position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
});

// Handle generate button clicks separately
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-generate');
    if (!btn) return;
    
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Generating…';
    
    // Simulate API call with random delay
    setTimeout(() => {
        // Removed chat message generation code
        btn.textContent = originalText;
        btn.disabled = false;
    }, 900 + Math.random() * 1800);
});

// simple HTML escape
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// --- Prompt enhancement algorithm (client-side, heuristic/template-based) ---
function enhancePrompt(input) {
    const templates = [
        'Write a {length} {format} about {topic} in a {tone} tone, include {details}.',
        'Create a {length} {format} for {topic} that mentions {details}, uses a {tone} voice, and includes examples.',
        'Produce a {format} (about {length}) on {topic} — be {tone}, include {details}, and end with a call-to-action.'
    ];

    const topics = extractTopic(input);
    const length = pick(['150 words', '200 words', 'short paragraph', '3 bullet points']);
    const format = pick(['paragraph', 'marketing blurb', 'blog intro', 'tweet thread']);
    const tone = pick(['friendly', 'professional', 'conversational', 'authoritative']);
    const details = pick(['examples', 'statistics', 'step-by-step tips', 'use cases']);
    const tpl = pick(templates);
    const enhanced = tpl.replace('{topic}', topics).replace('{length}', length).replace('{format}', format).replace('{tone}', tone).replace('{details}', details);
    // sprinkle variability
    return enhanced + '\n\n// Enhancement seed: ' + Math.abs(hash(enhanced)).toString(36).slice(0,6);
}

function extractTopic(input) {
    // naive extraction: look for quoted phrase or first noun-ish run
    const m = input.match(/"([^"]+)"|'([^']+)'/);
    if (m) return m[1] || m[2];
    // fallback: return the whole input trimmed
    return input.split(/[\.\?\!]/)[0];
}

function pick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

function hash(s) { // simple DJB2
    let h=5381; for (let i=0;i<s.length;i++) h=((h<<5)+h)+s.charCodeAt(i); return h;
}

// Fake generator that expands the enhanced prompt into a plausible output
function generateFromPrompt(enhanced) {
    // create variable adjectives and sentences from enhanced prompt tokens
    const adj = ['innovative','practical','clear','engaging','actionable'];
    const ammo = pick(adj);
    const intro = 'Here is an enhanced version based on your request:';
    const body = `${intro} ${enhanced.split('\n')[0]}. This version emphasizes ${ammo} advice and provides concrete examples to help you implement the idea quickly.`;
    const cta = '\n\nCall-to-action: Try this prompt directly in your AI tool and iterate.';
    // add small random unique suffix
    const suffix = '\n\n// uid:' + Math.random().toString(36).slice(2,9);
    return body + cta + suffix;
}

// --- Auto-launch rocket option (auto once per session) ---
const btnLaunchRocket = document.getElementById('btnLaunchRocket');
if (btnLaunchRocket) btnLaunchRocket.addEventListener('click', launchRocket);

// Auto-launch once per first visit (optional) -- respects localStorage
try {
    const launched = localStorage.getItem('promptify.rocket.launched');
    if (!launched) {
        // small delay so page loads visually
        setTimeout(() => { launchRocket(); localStorage.setItem('promptify.rocket.launched', '1'); }, 1400);
    }
} catch (err) { /* ignore storage errors */ }

// --- Service worker registration (basic offline caching) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('ServiceWorker registered', reg);
        }).catch(err => {
            console.log('ServiceWorker register failed', err);
        });
    });
}

// --- Performance tweak: reduce rocket particles on low-end devices ---
function isLowEndDevice() {
    try {
        const cores = navigator.hardwareConcurrency || 2;
        return cores <= 2 || /Mobi|Android/i.test(navigator.userAgent);
    } catch { return false; }
}

// Patch original launchRocket to respect low-end devices by capping particleCount
const _originalLaunch = launchRocket;
function launchRocket() {
    if (isLowEndDevice()) {
        // spawn fewer particles for low-end devices
        const originalSpawn = window.__ROCKET_PARTICLE_COUNT || 12;
        window.__ROCKET_PARTICLE_COUNT = 6;
        _originalLaunch();
        // restore after
        window.__ROCKET_PARTICLE_COUNT = originalSpawn;
    } else {
        _originalLaunch();
    }
}

// --- 3D tilt / magnetic card interaction for pricing and blog cards ---
(function() {
    const selectors = ['.pricing-card', '.blog-card'];
    const cards = Array.from(document.querySelectorAll(selectors.join(',')));
    if (!cards.length) return;

    // helper: whether to enable interactive tilt (disable on touch/low-power)
    const enableInteraction = (() => {
        if (window.matchMedia('(pointer: coarse)').matches) return false;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
        return true;
    })();

    function rafThrottle(fn) {
        let raf = null;
        return function(...args) {
            if (raf) return;
            raf = requestAnimationFrame(() => { fn.apply(this, args); raf = null; });
        };
    }

    function handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const x = (e.clientX - cx) / (rect.width/2);
        const y = (e.clientY - cy) / (rect.height/2);
        const rotateX = (-y * 8).toFixed(2);
        const rotateY = (x * 10).toFixed(2);
        const tilt = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transform = `translateY(-8px) ${tilt} scale(1.01)`;
        const inner = card.querySelector('.card-inner');
        if (inner) inner.style.transform = `translateZ(18px)`;
    }

    function reset(card) {
        card.style.transform = '';
        const inner = card.querySelector('.card-inner');
        if (inner) inner.style.transform = '';
    }

    if (enableInteraction) {
        cards.forEach(card => {
            // ensure there's an inner wrapper for parallax; if not, create one
            if (!card.querySelector('.card-inner')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'card-inner';
                while (card.firstChild) wrapper.appendChild(card.firstChild);
                card.appendChild(wrapper);
            }

            const onMove = rafThrottle((e) => handleMove(e, card));
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseenter', () => {
                if (card) card.classList.add('tilt-active');
            });
            card.addEventListener('mouseleave', () => { 
                reset(card); 
                if (card) card.classList.remove('tilt-active'); 
            });
        });
    }
})();


// --- Rocket launch interaction and trail particles ---
const rocket = document.querySelector('.hero-rocket');
const heroWrapper = document.querySelector('.hero-image-wrapper');
if (rocket && heroWrapper) {
    // make keyboard-accessible
    rocket.classList.add('clickable');
    rocket.tabIndex = 0;
    rocket.setAttribute('role', 'button');

    rocket.addEventListener('click', (e) => {
        launchRocket();
    });

    rocket.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            launchRocket();
        }
    });
}

function launchRocket() {
    if (!rocket || rocket.classList.contains('launching')) return;
    // start rocket animation (CSS handles the movement)
    rocket.classList.add('launching');

    // add small engine glow element if not present
    if (!rocket.querySelector('.engine-glow')) {
        const glow = document.createElement('div');
        glow.className = 'engine-glow';
        rocket.appendChild(glow);
    }

    // create trail container
    const trailContainer = document.createElement('div');
    trailContainer.className = 'trail-container';
    heroWrapper.appendChild(trailContainer);

    // spawn particles with varied delays/directions
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('span');
        p.className = 'rocket-trail';

        // random-ish start position near bottom-left of the rocket
        const left = 12 + Math.random() * 20; // percent
        const top = 60 + Math.random() * 20; // percent
        p.style.left = left + '%';
        p.style.top = top + '%';

        // vary duration and delay for organic feel
        const dur = 900 + Math.random() * 900;
        const delay = Math.random() * 120;
        p.style.animationDuration = dur + 'ms';
        p.style.animationDelay = delay + 'ms';

        // slightly vary color/opacity per particle
        const r = 255;
        const g = 150 + Math.floor(Math.random() * 80);
        const b = 70 + Math.floor(Math.random() * 80);
        const a = 0.9 - Math.random() * 0.4;
        p.style.background = `radial-gradient(circle at 30% 30%, rgba(${r},${g},${b},${a}), rgba(${Math.max(r-140,120)},${Math.max(g-40,90)},${Math.max(b-10,60)},${Math.max(a-0.2,0.35)}))`;

        trailContainer.appendChild(p);

        // cleanup when animation completes
        p.addEventListener('animationend', () => p.remove());
    }

    // stop the launch state after the rocket animation duration (match CSS 2200ms)
    setTimeout(() => {
        rocket.classList.remove('launching');
        if (trailContainer.parentNode) trailContainer.remove();
    }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    const promptTextEl = document.querySelector('.prompt-text');
    const copyBtn = document.querySelector('.btn-copy');
    const tryBtn = document.querySelector('.btn-try-free.small');

    if (promptTextEl) {
        const samplePrompt = `You are an expert prompt engineer. Given the user input, produce a concise and clear instruction for an LLM to generate a marketing headline that is catchy and action-oriented.`;
        typeToElement(promptTextEl, samplePrompt, 35, true);
    }

    if (copyBtn && promptTextEl) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(promptTextEl.textContent);
                copyBtn.textContent = 'Copied';
                setTimeout(() => copyBtn.textContent = 'Copy', 1500);
            } catch (err) {
                alert('Unable to copy.');
            }
        });
    }

    if (tryBtn) {
        tryBtn.addEventListener('click', () => {
            // Small demo action: scroll to contact or open a quick modal -- for now highlight contact
            const contact = document.querySelector('#contact');
            if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Rocket launch trigger and robotic micro-interactions
(function() {
    const rocket = document.querySelector('.hero-rocket');
    const cta = document.querySelector('.btn-get-started');
    const microTargets = document.querySelectorAll('.nav-link, .tag, .btn-get-started');

    // Add robotic class to a few interactive elements for micro-interactions
    microTargets.forEach(el => {
        if (el) el.classList.add('robotic');
    });

    function launchRocket() {
        if (!rocket) return;
        // restart animation by removing class then forcing reflow
        rocket.classList.remove('launching');
        // ensure visible for animation
        void rocket.offsetWidth;
        rocket.classList.add('launching');

        // remove class after animation completes (match duration in CSS)
        setTimeout(() => {
            rocket.classList.remove('launching');
        }, 2400);
    }

    // Launch on main CTA click
    cta?.addEventListener('click', (e) => {
        // preserve existing behavior
        launchRocket();
    });

    // Also launch on small try button
    document.querySelectorAll('.btn-try-free.small').forEach(b => {
        if (b) b.addEventListener('click', launchRocket);
    });
})();
