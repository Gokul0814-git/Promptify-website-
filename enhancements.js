/* enhancements.js
   Large additive interaction library for Promptify frontend.
   - Advanced particle layer (canvas)
   - Cursor follower
   - Magnetic buttons
   - Hero ribbon animation helpers
   - Chat scaffolding hints for LLM integration
   - Utility performance helpers (throttle/raf)

   This file is designed to be additive: it sets up elements if present and
   never removes or rewrites existing markup. Many functions are defensive.
*/

(() => {
  'use strict';

  // Utilities
  function qs(sel, ctx=document) { return ctx.querySelector(sel); }
  function qsa(sel, ctx=document) { return Array.from((ctx||document).querySelectorAll(sel)); }
  function on(el, ev, fn) { if (!el) return; el.addEventListener(ev, fn); }
  function throttleRAF(fn) { let busy=false; return (...args) => { if (busy) return; busy=true; requestAnimationFrame(()=>{ fn(...args); busy=false; }); }; }

  // ---------------------- Tech Background Animations ----------------------
  function setupTechBackground() {
    const bgContainer = document.createElement('div');
    bgContainer.className = 'tech-bg-container';
    bgContainer.id = 'techBgEnhancements';
    document.body.insertBefore(bgContainer, document.body.firstChild);

    // Floating code blocks
    const codeSnippets = ['const ai =', 'fn.enhance()', 'async prompt', 'await response', 'yield result', 'return data'];
    for (let i = 0; i < 6; i++) {
      const block = document.createElement('div');
      block.className = 'floating-code-block';
      block.innerText = codeSnippets[i];
      block.style.left = Math.random() * 100 + '%';
      block.style.top = Math.random() * 100 + '%';
      block.style.animationDelay = (i * 0.8) + 's';
      block.style.animationDuration = (4 + Math.random() * 2) + 's';
      bgContainer.appendChild(block);
    }

    // Orbiting particles
    for (let i = 0; i < 4; i++) {
      const orbit = document.createElement('div');
      orbit.className = 'tech-orbit';
      orbit.style.left = (25 + i * 25) + '%';
      orbit.style.top = (20 + i * 15) + '%';
      orbit.style.animationDelay = (i * -1.5) + 's';
      bgContainer.appendChild(orbit);
    }

    // Moving diagonal lines
    for (let i = 0; i < 5; i++) {
      const line = document.createElement('div');
      line.className = 'tech-line';
      line.style.left = (i * 20) + '%';
      line.style.top = (i * 15) + '%';
      line.style.animationDelay = (i * -2) + 's';
      bgContainer.appendChild(line);
    }

    // Floating circles with pulses
    for (let i = 0; i < 3; i++) {
      const circle = document.createElement('div');
      circle.className = 'tech-pulse-circle';
      circle.style.left = (15 + i * 35) + '%';
      circle.style.top = (70 + Math.random() * 20) + '%';
      circle.style.animationDelay = (i * -1.2) + 's';
      bgContainer.appendChild(circle);
    }
  }
  setupTechBackground();

  // ---------------------- Particle Canvas Layer ----------------------
  function setupParticleLayer() {
    // create two canvas layers for depth
    const container = document.createElement('div');
    container.className = 'particle-layer';
    container.style.zIndex = '1';
    document.body.appendChild(container);

    const canv = document.createElement('canvas');
    const canv2 = document.createElement('canvas');
    canv.style.position = canv2.style.position = 'absolute';
    canv.style.inset = canv2.style.inset = '0';
    container.appendChild(canv2);
    container.appendChild(canv);

    const ctx = canv.getContext('2d');
    const ctx2 = canv2.getContext('2d');

    let w = canv.width = canv2.width = window.innerWidth;
    let h = canv.height = canv2.height = window.innerHeight;

    window.addEventListener('resize', throttleRAF(()=>{
      w = canv.width = canv2.width = window.innerWidth; h = canv.height = canv2.height = window.innerHeight;
    }));

    function rand(min,max){ return Math.random()*(max-min)+min; }
    function makeParticles(n, depth) {
      const arr = [];
      for (let i=0;i<n;i++) arr.push({ x: Math.random()*w, y: Math.random()*h, vx: rand(-0.2,0.8), vy: rand(-0.2,0.8), s: rand(1, depth?3:2), depth });
      return arr;
    }

    let particles = makeParticles(90, 1);
    let particles2 = makeParticles(60, 0.6);

    function tick() {
      ctx.clearRect(0,0,w,h);
      ctx2.clearRect(0,0,w,h);
      // layer 1
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x = w; if (p.x>w) p.x = 0; if (p.y<0) p.y = h; if (p.y>h) p.y = 0;
        ctx.beginPath(); ctx.fillStyle = 'rgba(59,130,246,0.12)'; ctx.arc(p.x,p.y,p.s,0,Math.PI*2); ctx.fill();
      });
      // layer 2 (closer, slightly larger)
      particles2.forEach(p=>{
        p.x += p.vx*1.4; p.y += p.vy*1.2;
        if (p.x<0) p.x = w; if (p.x>w) p.x = 0; if (p.y<0) p.y = h; if (p.y>h) p.y = 0;
        ctx2.beginPath(); ctx2.fillStyle = 'rgba(139,92,246,0.09)'; ctx2.arc(p.x,p.y,p.s*1.2,0,Math.PI*2); ctx2.fill();
      });

      // occasional connection lines between close particles in layer 1
      for (let i=0;i<particles.length;i++){
        for (let j=i+1;j<i+6 && j<particles.length;j++){
          const a = particles[i], b = particles[j];
          const dx = a.x-b.x, dy = a.y-b.y; const d = Math.sqrt(dx*dx+dy*dy);
          if (d<120){ ctx.beginPath(); ctx.strokeStyle = 'rgba(59,130,246,' + (0.08*(1-d/120)) +')'; ctx.lineWidth = 1; ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
        }
      }

      requestAnimationFrame(tick);
    }
    tick();
  }

  // initialize particles deferred to allow page paint
  setTimeout(()=>{ try{ setupParticleLayer(); }catch(e){console.warn('particles init fail',e);} }, 400);

  // ---------------------- Magnetic Buttons ----------------------
  function initMagnetic(selector='.btn-magnetic'){
    const els = qsa(selector);
    els.forEach(el => {
      const strength = parseFloat(el.dataset.magStrength) || 20;
      const onMove = throttleRAF(function(e){
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width/2);
        const dy = e.clientY - (rect.top + rect.height/2);
        const dist = Math.sqrt(dx*dx+dy*dy);
        const max = Math.max(rect.width, rect.height);
        const force = Math.min(1, (max - dist)/max);
        const tx = (dx/rect.width) * strength * force;
        const ty = (dy/rect.height) * (strength*0.5) * force;
        el.style.transform = `translate(${tx}px, ${ty}px) scale(${1+0.01*force})`;
      });
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', () => { el.style.transform=''; });
    });
  }
  initMagnetic();

  // ---------------------- Hero code ribbon disabled ----------------------
  // Code ribbon removed per user request

  // ---------------------- Glitch title activation ----------------------
  (function(){
    const heroTitle = qs('.hero-title');
    if (!heroTitle) return;
    heroTitle.classList.add('glitch');
    heroTitle.setAttribute('data-text', heroTitle.textContent);
    // occasional micro-glitch
    setInterval(()=>{ heroTitle.classList.toggle('glitch'); }, 4200);
  })();

  // ---------------------- Chat scaffolding for LLM integration ----------------------
  // This provides a safe client-side API that will call /api/generate if configured.
  async function callLLM(prompt){
    // Prefer server proxy endpoint if available
    try{
      const resp = await fetch('/api/generate', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt})
      });
      if (!resp.ok) throw new Error('proxy error');
      const data = await resp.json();
      return data.output || data.text || JSON.stringify(data);
    }catch(e){
      // fallback: run local generator simulation
      return generateLocally(prompt);
    }
  }

  function generateLocally(prompt){
    // small, deterministic pseudo-generation to keep outputs unique and plausible
    const suffix = Math.random().toString(36).slice(2,8);
    return `Local-generated output for prompt:\n${prompt}\n\nUID:${suffix}`;
  }

  // Hook chat generate buttons to LLM call if used (works with enhancements.js generated buttons)
  // Removed chat message generation code

  // ---------------------- Smooth entrance for many enhanced elements ----------------------
  function revealOnScroll(){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) ent.target.classList.add('enhance-visible');
      });
    }, { threshold: 0.12 });
    qsa('.pricing-card, .blog-card, .gallery-item, .contact-info-card, .hero-code-ribbon').forEach(el=>{ el.classList.add('enhance-hidden'); observer.observe(el); });
  }
  setTimeout(revealOnScroll, 600);

  // ---------------------- Perf: disable heavy effects on low-end devices ----------------------
  (function(){
    try{
      const cores = navigator.hardwareConcurrency || 2;
      if (cores <= 2 || /Mobi|Android/i.test(navigator.userAgent)){
        // reduce particle counts and hide some layers
        const pl = qs('.particle-layer'); if (pl) pl.style.opacity = '0.6';
        const cursor = qs('#enhCursor'); if (cursor) cursor.style.display = 'none';
      }
    }catch(e){}
  })();

  // ---------------------- Accessibility small helpers ----------------------
  // Allow pressing 'L' to toggle the loading overlay for demos
  document.addEventListener('keydown', (e)=>{ if (e.key.toLowerCase() === 'l' && !e.metaKey && !e.ctrlKey) { const overlay = qs('#loadingOverlay'); if (overlay) overlay.classList.toggle('hidden'); } });

  // Export some functions for console usage/debugging
  window.__PromptifyEnh = { callLLM, generateLocally };

})();
