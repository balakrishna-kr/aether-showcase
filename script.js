/**
 * AETHERIS SHOWCASE - INTERACTIVE LOGIC & CONTROLLERS
 * Handles themes, dynamic typing, glassmorphism lab, filters, modals & toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initDynamicRoles();
  initHeaderScroll();
  initMobileNav();
  initMetricsCounter();
  initGlassLab();
  initProjectFilters();
  initProjectModal();
  initContactForm();
});

/* ==========================================================================
   1. THEME & PALETTE SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  const body = document.body;

  // Restore saved theme if any
  const savedTheme = localStorage.getItem('aetheris-theme') || 'cyan';
  setTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      setTheme(color);
      showToast(`Palette switched to ${color.toUpperCase()} glow`);
    });
  });

  function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('aetheris-theme', theme);

    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === theme);
    });
  }
}

/* ==========================================================================
   2. DYNAMIC ROLES TYPER
   ========================================================================== */
function initDynamicRoles() {
  const roleElement = document.getElementById('role-cycler');
  if (!roleElement) return;

  const roles = [
    'Full-Stack Architecture',
    'Creative UI & Motion Design',
    'Distributed Cloud Backends',
    'AI Systems & WebGL Tooling',
    'High-Performance Web Apps'
  ];

  let currentIdx = 0;

  setInterval(() => {
    roleElement.style.opacity = '0';
    roleElement.style.transform = 'translateY(8px)';

    setTimeout(() => {
      currentIdx = (currentIdx + 1) % roles.length;
      roleElement.textContent = roles[currentIdx];
      roleElement.style.opacity = '1';
      roleElement.style.transform = 'translateY(0)';
    }, 280);
  }, 3200);
}

/* ==========================================================================
   3. HEADER SCROLL EFFECT & ACTIVE LINKS
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close when link clicked
  navLinks.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/* ==========================================================================
   5. METRICS ANIMATED COUNTER
   ========================================================================== */
function initMetricsCounter() {
  const metricItems = document.querySelectorAll('.metric-num');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricItems.forEach(item => {
          const target = parseInt(item.dataset.target, 10);
          const suffix = item.textContent.replace(/[0-9]/g, '');
          let count = 0;
          const duration = 1600;
          const increment = target / (duration / 25);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              item.textContent = target + suffix;
              clearInterval(timer);
            } else {
              item.textContent = Math.floor(count) + suffix;
            }
          }, 25);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsBar = document.querySelector('.metrics-bar');
  if (metricsBar) observer.observe(metricsBar);
}

/* ==========================================================================
   6. INTERACTIVE GLASSMORPHISM LAB
   ========================================================================== */
function initGlassLab() {
  const blurSlider = document.getElementById('blur-slider');
  const opacitySlider = document.getElementById('opacity-slider');
  const borderSlider = document.getElementById('border-slider');
  const glowSlider = document.getElementById('glow-slider');

  const blurVal = document.getElementById('blur-val');
  const opacityVal = document.getElementById('opacity-val');
  const borderVal = document.getElementById('border-val');
  const glowVal = document.getElementById('glow-val');

  const previewCard = document.getElementById('lab-preview-card');
  const liveCssSnippet = document.getElementById('live-css-snippet');
  const copyBtn = document.getElementById('copy-css-btn');
  const resetBtn = document.getElementById('lab-reset-btn');

  if (!previewCard) return;

  function updateLab() {
    const blur = blurSlider.value;
    const opacity = opacitySlider.value;
    const radius = borderSlider.value;
    const glow = glowSlider.value;

    blurVal.textContent = `${blur}px`;
    opacityVal.textContent = opacity;
    borderVal.textContent = `${radius}px`;
    glowVal.textContent = `${glow}px`;

    // Apply live styling to the card
    previewCard.style.backdropFilter = `blur(${blur}px)`;
    previewCard.style.webkitBackdropFilter = `blur(${blur}px)`;
    previewCard.style.backgroundColor = `rgba(14, 19, 31, ${opacity})`;
    previewCard.style.borderRadius = `${radius}px`;
    previewCard.style.boxShadow = `0 10px 30px rgba(0,0,0,0.45), 0 0 ${glow}px var(--primary-accent-glow)`;

    // Generate formatted CSS code
    const cssCode = `.glass-card {
  background: rgba(14, 19, 31, ${opacity});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: ${radius}px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 0 ${glow}px var(--glow-color);
}`;

    liveCssSnippet.textContent = cssCode;
  }

  [blurSlider, opacitySlider, borderSlider, glowSlider].forEach(slider => {
    slider.addEventListener('input', updateLab);
  });

  resetBtn.addEventListener('click', () => {
    blurSlider.value = 16;
    opacitySlider.value = 0.45;
    borderSlider.value = 20;
    glowSlider.value = 24;
    updateLab();
    showToast('Lab values reset to standard preset');
  });

  copyBtn.addEventListener('click', () => {
    const code = liveCssSnippet.textContent;
    navigator.clipboard.writeText(code).then(() => {
      showToast('CSS snippet copied to clipboard! 📋');
    }).catch(() => {
      showToast('Unable to copy automatically');
    });
  });

  updateLab();
}

/* ==========================================================================
   7. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   8. PROJECT DETAIL MODAL
   ========================================================================== */
const projectData = {
  pulseaudio: {
    title: 'PulseAudio Visualizer & Audio Engine',
    category: 'Interactive Web Audio & GLSL Shaders',
    description: 'An advanced frequency analyzer that decodes audio inputs in real-time using the HTML5 Web Audio API and maps frequency bins into smooth 3D particle vortexes using custom GLSL fragment shaders.',
    architecture: [
      'Zero external build dependencies for lightning execution',
      'High-resolution Fourier transform (FFT) analysis pipeline',
      'Interactive canvas control surface with customizable audio filters'
    ],
    tech: ['Web Audio API', 'HTML5 Canvas', 'GLSL Shaders', 'Web Workers'],
    github: 'https://github.com/balakrishna-kr'
  },
  custservice: {
    title: 'Customer Service Intelligence Platform',
    category: 'Full-Stack Architecture & Workflows',
    description: 'An automated incident handling and operational dashboard built with modern React, Node.js, and relational database persistence. Provides agents with real-time websocket updates, smart routing, and ticket lifecycle telemetry.',
    architecture: [
      'Event-driven pub/sub architecture for instant ticket dispatches',
      'Role-based Access Control (RBAC) and audit trail logging',
      'RESTful endpoints with sub-50ms latency guarantees'
    ],
    tech: ['React / Next.js', 'Node.js', 'Express', 'PostgreSQL', 'WebSockets'],
    github: 'https://github.com/balakrishna-kr/customer-service-frontend'
  },
  comicportfolio: {
    title: 'Comic-Style Dynamic Portfolio Engine',
    category: 'Creative Frontend & Visual Interaction',
    description: 'A whimsical yet structured interactive portfolio layout influenced by graphic novel aesthetics. Features custom panel grids, responsive narrative storytelling, and halftone gradient styling.',
    architecture: [
      'Pure CSS layout transitions without heavy external UI packages',
      'Accessible keyboard navigation across comic panels',
      'Adaptive light/dark ink schemes with high contrast modes'
    ],
    tech: ['HTML5', 'CSS Grid', 'Custom SVGs', 'Vanilla JavaScript'],
    github: 'https://github.com/balakrishna-kr/Comic-Style-Portfolio-Website'
  },
  oauthsso: {
    title: 'Secure OAuth 2.0 & SSO Auth Gateway',
    category: 'Cloud Identity & Microservices',
    description: 'Production-ready authentication provider supporting Google Identity Services, OAuth 2.0 authorization code flow, cryptographic token validation, and hardened session storage.',
    architecture: [
      'Cryptographically signed JWT bearer token management',
      'CORS security middleware and rate-limiting safeguards',
      'Direct enterprise Single Sign-On (SSO) readiness'
    ],
    tech: ['OAuth 2.0', 'JWT', 'Node.js', 'Express', 'Cybersecurity'],
    github: 'https://github.com/balakrishna-kr/google-auth'
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  if (!modal || !modalContent) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const pKey = trigger.dataset.project;
      const data = projectData[pKey];
      if (!data) return;

      modalContent.innerHTML = `
        <div class="modal-badge">${data.category}</div>
        <h2 style="font-size: 1.6rem; margin: 0.5rem 0 1rem; color: #fff;">${data.title}</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.65;">${data.description}</p>
        
        <h4 style="color: var(--primary-accent); margin-bottom: 0.6rem; font-size: 1rem;">Key Highlights & Architecture:</h4>
        <ul style="color: var(--text-muted); margin-left: 1.2rem; margin-bottom: 1.8rem; font-size: 0.95rem;">
          ${data.architecture.map(item => `<li style="margin-bottom: 0.4rem;">${item}</li>`).join('')}
        </ul>

        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
          ${data.tech.map(t => `<span class="tag" style="background: var(--bg-surface-elevated);">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 1rem;">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">View on GitHub</a>
          <button class="btn btn-outline btn-sm modal-dismiss">Close Preview</button>
        </div>
      `;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');

      modalContent.querySelector('.modal-dismiss').addEventListener('click', closeModal);
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   9. CONTACT FORM CONTROLLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('send-msg-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Transmitting Message...</span>`;
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.style.opacity = '1';
      submitBtn.disabled = false;
      showToast('⚡ Message sent successfully! I will reply shortly.');
    }, 900);
  });
}

/* ==========================================================================
   10. FLOATING TOAST SYSTEM
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
