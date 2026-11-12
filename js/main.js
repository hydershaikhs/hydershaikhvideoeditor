/**
 * Hyder Shaikh — Professional Video Editor Portfolio
 * Interactive Systems: Custom Cursor, Scroll Reveal, Before/After Slider,
 * Lightbox Modal, Pricing Calculator, Web Audio FX & Toast.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initCustomCursor();
  initScrollReveal();
  initBeforeAfterSlider();
  initProjectFilters();
  initPricingCalculator();
  initSoundEffects();
});

/* -------------------------------------------------------------
 * 1. Navbar Scroll Effect
 * ----------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('py-2.5', 'bg-white/95', 'shadow-md');
      navbar.classList.remove('py-3.5', 'bg-white/90');
    } else {
      navbar.classList.add('py-3.5', 'bg-white/90');
      navbar.classList.remove('py-2.5', 'bg-white/95', 'shadow-md');
    }
  });
}

/* -------------------------------------------------------------
 * 2. Mobile Menu Toggle
 * ----------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    playClickSFX();
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      menuIcon.classList.replace('ph-list', 'ph-x');
    } else {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.replace('ph-x', 'ph-list');
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.replace('ph-x', 'ph-list');
    });
  });
}

/* -------------------------------------------------------------
 * 3. Custom Smooth Glowing Cursor Follower (Desktop Only)
 * ----------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor || window.innerWidth < 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp loop
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Expand cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .project-card, #before-after-container');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/* -------------------------------------------------------------
 * 4. IntersectionObserver for Smooth Scroll Reveals
 * ----------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------
 * 5. Interactive Before & After Color Grading Comparison Slider
 * ----------------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.getElementById('before-after-container');
  const beforeClip = document.getElementById('before-clip');
  const handle = document.getElementById('slider-handle');

  if (!container || !beforeClip || !handle) return;

  let isDragging = false;

  const setSliderPosition = (xPos) => {
    const rect = container.getBoundingClientRect();
    let position = (xPos - rect.left) / rect.width;

    if (position < 0) position = 0;
    if (position > 1) position = 1;

    const percent = position * 100;
    beforeClip.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
  };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
    playClickSFX();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });
}

/* -------------------------------------------------------------
 * 6. Project Category Filtering
 * ----------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSFX();

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.classList.add('text-slate-600');
      });
      btn.classList.add('active');
      btn.classList.remove('text-slate-600');

      const filterValue = btn.getAttribute('data-filter');

      projects.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 7. Video Lightbox Modal System
 * ----------------------------------------------------------- */
const projectMediaData = {
  showreel: {
    title: "Hyder Shaikh — 2026 Director's Showreel",
    desc: "A compilation of commercial TVCs, high-retention YouTube edits, and cinematic color grades. Rendered in 4K ProRes.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  commercial1: {
    title: "Chronos 'Obsidian Horizon' — Luxury Watch TVC",
    desc: "3D camera tracking, dynamic macro zooms, custom timepiece foley sound effects, and deep velvet color grading.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  youtube1: {
    title: "The Rise & Fall of Fast Fashion — Documentary Edit",
    desc: "Magnates Media style 22-minute documentary edit featuring 2.5D map parallax, newspaper animations, and 82% retention.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  reels1: {
    title: "SaaS Founder Viral Hook Campaign (30 Reels)",
    desc: "High-retention 9:16 vertical edits featuring kinetic pop-in text, sound whooshes, and visual pattern interrupts.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  color1: {
    title: "'Echoes of Neon' — Cyber Noir Film Color Pass",
    desc: "Node-based DaVinci Resolve Studio color grading from flat Sony S-Log3 to Kodak 2383 35mm film emulation.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  music1: {
    title: "Velvet Mirage — Official Music Video",
    desc: "Fast rhythmic cutting, beat-matched transitions, optical speed ramping, and rotoscoped light leaks.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4"
  },
  fitness1: {
    title: "Apex Apparel 'Relentless' — High ROAS Ad Campaign",
    desc: "High-energy commercial cut with bass drops, audio sidechaining, and conversion-focused framing.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  }
};

window.openVideoModal = function(key) {
  playClickSFX();
  const modal = document.getElementById('video-modal');
  const titleEl = document.getElementById('modal-video-title');
  const descEl = document.getElementById('modal-video-desc');
  const videoEl = document.getElementById('modal-video-element');

  const data = projectMediaData[key] || projectMediaData.showreel;

  titleEl.textContent = data.title;
  descEl.textContent = data.desc;
  videoEl.src = data.videoUrl;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  videoEl.play().catch(() => {});
};

window.closeVideoModal = function() {
  playClickSFX();
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('modal-video-element');

  videoEl.pause();
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideoModal();
});

document.getElementById('video-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'video-modal') closeVideoModal();
});

/* -------------------------------------------------------------
 * 8. Interactive Pricing & Estimate Calculator
 * ----------------------------------------------------------- */
function initPricingCalculator() {
  const typeSelect = document.getElementById('calc-type');
  const qtyInput = document.getElementById('calc-qty');
  const speedSelect = document.getElementById('calc-speed');
  const totalDisplay = document.getElementById('calc-total');

  if (!typeSelect || !qtyInput || !speedSelect || !totalDisplay) return;

  const calculate = () => {
    const type = typeSelect.value;
    const qty = Math.max(1, parseInt(qtyInput.value) || 1);
    const speed = speedSelect.value;

    let baseRate = 350;
    if (type === 'reel') baseRate = 65;
    if (type === 'commercial') baseRate = 750;

    let total = baseRate * qty;

    if (qty >= 5 && qty < 10) total *= 0.90;
    else if (qty >= 10) total *= 0.80;

    if (speed === 'rush') total *= 1.35;

    totalDisplay.textContent = `$${Math.round(total).toLocaleString()} USD`;
  };

  typeSelect.addEventListener('change', calculate);
  qtyInput.addEventListener('input', calculate);
  speedSelect.addEventListener('change', calculate);

  calculate();
}

window.orderViaWhatsApp = function() {
  playClickSFX();
  const type = document.getElementById('calc-type')?.selectedOptions[0]?.text || "Video Editing";
  const qty = document.getElementById('calc-qty')?.value || "1";
  const speed = document.getElementById('calc-speed')?.selectedOptions[0]?.text || "Standard";
  const total = document.getElementById('calc-total')?.textContent || "$350 USD";

  const message = `Hi Hyder! I checked your portfolio calculator.%0A%0A*Project:* ${encodeURIComponent(type)}%0A*Quantity:* ${qty} video(s)%0A*Turnaround:* ${encodeURIComponent(speed)}%0A*Estimated Total:* ${encodeURIComponent(total)}%0A%0AI'd like to discuss starting this project with you!`;
  
  window.open(`https://wa.me/?text=${message}`, '_blank');
};

/* -------------------------------------------------------------
 * 9. Copy Email & Toast System
 * ----------------------------------------------------------- */
window.copyEmail = function() {
  playClickSFX();
  const email = document.getElementById('email-text')?.textContent || 'hydershaikh.edits@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email copied to clipboard: " + email);
  }).catch(() => {
    showToast("Email: " + email);
  });
};

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
}

/* -------------------------------------------------------------
 * 10. Form Submission
 * ----------------------------------------------------------- */
window.handleFormSubmit = function(event) {
  event.preventDefault();
  playClickSFX();

  showToast("Thank you! Your project brief has been received.");
  event.target.reset();
};

/* -------------------------------------------------------------
 * 11. Web Audio API Subtle Click SFX
 * ----------------------------------------------------------- */
let audioCtx = null;
let sfxEnabled = true;

function initSoundEffects() {
  const toggleBtn = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    if (sfxEnabled) {
      sfxIcon.classList.replace('ph-speaker-simple-slash', 'ph-speaker-simple-high');
      toggleBtn.classList.remove('opacity-50');
      playClickSFX();
      showToast("Audio FX Enabled");
    } else {
      sfxIcon.classList.replace('ph-speaker-simple-high', 'ph-speaker-simple-slash');
      toggleBtn.classList.add('opacity-50');
      showToast("Audio FX Muted");
    }
  });
}

function playClickSFX() {
  if (!sfxEnabled) return;

  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (err) {
    // Graceful fallback
  }
}
