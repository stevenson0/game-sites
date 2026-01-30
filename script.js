// ====== UTIL: Smooth scroll to target ======
function smoothScrollTo(targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// ====== NAV: Smooth scroll from buttons & links ======
function setupSmoothScroll() {
  // Buttons with data-scroll-to
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll-to");
      smoothScrollTo(target);
    });
  });

  // Header nav links (override default anchor jump)
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        smoothScrollTo(href);
      });
    }
  });
}

// ====== NAV: Active state based on scroll ======
function setupNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActive() {
    let currentId = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 130 && rect.bottom >= 130) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  updateActive();
  window.addEventListener("scroll", updateActive);
}

// ====== GAMES SCROLL REVEAL ANIMATION ======
// ====== GAMES SCROLL REVEAL ANIMATION (GSAP) ======
function setupGamesScrollReveal() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP not loaded, falling back to CSS transitions");
    // Fallback: simple class toggle
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('active', entry.isIntersecting));
    }, { threshold: 0.3 });
    document.querySelectorAll('.game-scroll-item').forEach(el => observer.observe(el));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const gameItems = document.querySelectorAll('.game-scroll-item');

  gameItems.forEach((item, i) => {
    // Animate info side
    gsap.fromTo(item.querySelector('.game-info-side'),
      { opacity: 0, x: -100 },
      {
        opacity: 1, x: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate visual side
    gsap.fromTo(item.querySelector('.game-visual-side'),
      { opacity: 0, x: 100, scale: 0.9 },
      {
        opacity: 1, x: 0, scale: 1,
        duration: 1,
        delay: 0.2, // slight lag behind text
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "top 30%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

// ====== SECTION REVEAL ANIMATION ======
function setupSectionReveal() {
  const observed = document.querySelectorAll(".section-observe");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observed.forEach((section) => observer.observe(section));
}

// ====== SLIDE-IN ANIMATIONS (Bottom, Left, Right) ======
function setupSlideInAnimations() {
  const slideElements = document.querySelectorAll('.slide-in-bottom, .slide-in-left, .slide-in-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Don't unobserve so animation can repeat if element leaves and re-enters
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  slideElements.forEach((element) => observer.observe(element));
}

// ====== HERO ANIMATIONS ON LOAD ======
function setupHeroAnimations() {
  // Trigger hero animations immediately on page load
  setTimeout(() => {
    const heroImage = document.querySelector('.hero-visual.slide-in-left');
    const heroContent = document.querySelector('.hero-content.slide-in-bottom');

    if (heroImage) {
      heroImage.classList.add('visible');
      console.log('Hero image animated');
    }
    if (heroContent) {
      heroContent.classList.add('visible');
      console.log('Hero content animated');
    }
  }, 200);
}

// ====== MODAL FOR GAME DETAILS ======
function setupGameModal() {
  const modal = document.getElementById("game-modal");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalGenre = document.getElementById("modal-genre");
  const modalDesc = document.getElementById("modal-desc");
  const modalPlayBtn = document.getElementById("modal-play-btn");
  const modalStatus = document.getElementById("modal-status");

  if (!modal) return;

  // Game data for modal
  const gamesData = [
    {
      title: "Cyber Runner",
      genre: "Endless Runner // Arcade",
      desc: "Dash through neon alleys, dodge drones, and hack gates in a fast-paced futuristic runner. Neon-soaked rooftops, tight jumps and split-second decisions."
    },
    {
      title: "Starforge Tactics",
      genre: "Tactical // Strategy",
      desc: "Command a small fleet, outsmart enemy AI, and bend gravity to your advantage. Turn-based battles in deep space with reactive enemy behavior."
    },
    {
      title: "Pixel Dungeons",
      genre: "Roguelike // Puzzle",
      desc: "Minimalist dungeon crawler where every move counts and every room is a tiny puzzle. Procedural levels, permadeath, and tight, readable combat."
    }
  ];

  function openModal(gameIndex) {
    const game = gamesData[gameIndex];

    modalTitle.textContent = game.title;
    modalGenre.textContent = game.genre;
    modalDesc.textContent = game.desc;

    modalStatus.textContent =
      "Later you'll replace this with a real link to your game page or build.";

    modal.classList.add("visible");
  }

  function closeModal() {
    modal.classList.remove("visible");
  }

  // Open modal when clicking any "More Info" button in games section
  document.querySelectorAll(".game-scroll-item .details-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const gameItem = btn.closest(".game-scroll-item");
      const gameIndex = parseInt(gameItem.dataset.gameIndex);
      openModal(gameIndex);
    });
  });

  // Mock "Play" behavior in modal
  modalPlayBtn.addEventListener("click", () => {
    modalPlayBtn.disabled = true;
    modalPlayBtn.textContent = "Loading...";
    modalStatus.textContent = "Pretending to load your game build...";

    setTimeout(() => {
      modalStatus.textContent =
        "This is where a new tab or embedded game would appear.";
      modalPlayBtn.disabled = false;
      modalPlayBtn.textContent = "Play (Mock)";
    }, 1200);
  });

  // Close events
  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("visible")) {
      closeModal();
    }
  });
}

// ====== GAME "PLAY" BUTTONS (Mock) ======
function setupGamePlayButtons() {
  // Game data for play buttons
  const gamesData = [
    "Cyber Runner",
    "Starforge Tactics",
    "Pixel Dungeons"
  ];

  document.querySelectorAll(".game-scroll-item .play-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const gameItem = btn.closest(".game-scroll-item");
      const gameIndex = parseInt(gameItem.dataset.gameIndex);
      const title = gamesData[gameIndex];

      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = "Launching...";

      // In the future you can redirect to your game's URL here:
      // window.open("https://your-game-link", "_blank");

      setTimeout(() => {
        alert(
          `This is a placeholder.\nLater you'll open the real build for "${title}".`
        );
        btn.disabled = false;
        btn.textContent = originalText;
      }, 900);
    });
  });
}

// ====== CONTACT FORM (simple fake handler) ======
function setupContactForm() {
  const form = document.querySelector(".contact-form-terminal");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const button = form.querySelector('.terminal-button');
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    const outputDiv = form.querySelector('.terminal-output');
    const outputMessage = form.querySelector('.output-message');

    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    button.disabled = true;

    // Simulate sending
    setTimeout(() => {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      button.disabled = false;

      // Show success message
      outputMessage.textContent = 'Transmission successful! Message received. Will respond soon.';
      outputDiv.style.display = 'block';

      // Reset form
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        outputDiv.style.display = 'none';
      }, 5000);
    }, 2000);
  });
}

// ====== BACK TO TOP BUTTON ======
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ====== FOOTER YEAR ======
function setCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (!yearSpan) return;
  yearSpan.textContent = new Date().getFullYear();
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM Content Loaded - Initializing...');

  setupSmoothScroll();
  setupNavHighlight();
  setupSectionReveal();
  setupSlideInAnimations(); // Add slide-in animations
  setupHeroAnimations(); // Add hero animations on load
  setupGamesScrollReveal(); // Add the new games scroll animation
  setupGameModal();
  setupGamePlayButtons();
  setupContactForm();
  setupBackToTop(); // Add back to top functionality
  setCurrentYear();


  // Add loaded class to body as fallback
  setTimeout(() => {
    document.body.classList.add('loaded');
    console.log('Fallback loaded class added');
  }, 2000);
});
// =========================================
// MATRIX-STYLE NEON PARTICLE BACKGROUND (REMOVED)
// =========================================
// Code removed for performance
// =========================================
// 3D TILT HOVER EFFECT FOR GAME CARDS (REMOVED)
// =========================================
// Code removed for performance. Native CSS hover is sufficient.

// =========================================
// HERO TYPING ANIMATION (TERMINAL STYLE)
// =========================================
(function () {
  const el = document.getElementById("typewriter");
  const cursor = document.querySelector(".cursor");
  if (!el || !cursor) return;

  // Only animate the FIRST time user loads the page
  const alreadyShown = sessionStorage.getItem("heroTyped");

  const lines = [
    "> Initializing system...",
    "> Loading assets...",
    "> Welcome to Your Game Universe"
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let typingSpeed = 50; // ms per character

  function typeLine() {
    if (lineIndex >= lines.length) {
      cursor.textContent = "_"; // final form
      sessionStorage.setItem("heroTyped", "yes");
      return;
    }

    let currentLine = lines[lineIndex];

    // Type character by character
    el.textContent = currentLine.substring(0, charIndex);

    charIndex++;

    if (charIndex <= currentLine.length) {
      setTimeout(typeLine, typingSpeed);
    } else {
      // Move to next line after a small delay
      setTimeout(() => {
        el.textContent += "\n"; // next line
        lineIndex++;
        charIndex = 0;
        typeLine();
      }, 500);
    }
  }

  if (alreadyShown) {
    // Show instantly (skip typing animation)
    el.textContent = "> Welcome to Your Game Universe";
    cursor.textContent = "_";
  } else {
    // Start typewriter effect
    typeLine();
  }
})();

// =========================================
// PORTAL LOADER CONTROL (REMOVED)
// =========================================
// Loader removed for instant access.

// =========================================
// HOLOGRAM DISTORTION RANDOM FLICKER (REMOVED)
// =========================================
// Removed to reduce repaint/reflow operations.

// =========================================
// DECRYPTION MINI-GAME LOGIC (GAMIFICATION)
// =========================================


// =========================================
// ADVANCED ANIMATIONS (GSAP REPLACEMENTS)
// =========================================

// 1. MAGNETIC BUTTONS (REMOVED)
function setupMagneticButtons() {
  // Removed to improve mouse interactivity performance
}

// 2. TEXT SCRAMBLE / DECODE EFFECT
function setupTextScramble() {
  if (typeof gsap === "undefined") return;
  // Ensure TextPlugin is registered if using it, 
  // but we can also do a manual scramble for a lighter feel if plugin fails
  if (gsap.plugins.TextPlugin) gsap.registerPlugin(TextPlugin);

  // Targets: Section Headers
  const headings = document.querySelectorAll('.section-header h2, .hero-title span#typewriter');

  headings.forEach(heading => {
    const originalText = heading.textContent.trim() || "NeoArcade";
    if (!originalText) return;

    // Create a ScrollTrigger for each
    ScrollTrigger.create({
      trigger: heading,
      start: "top 85%",
      onEnter: () => {
        // Scramble animation
        gsap.to(heading, {
          duration: 1.5,
          text: {
            value: originalText,
            delimiter: "",
            scrambleText: {
              text: originalText,
              chars: "01", // Binary style scramble
              revealDelay: 0.1,
              speed: 0.3
            }
          },
          ease: "none"
        });
      }
    });
  });
}

// 3. HERO PARALLAX (Subtle Mouse Movement)
function setupHeroParallax() {
  const heroSection = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  const heroContent = document.querySelector('.hero-content');

  if (!heroSection || !heroVisual || typeof gsap === "undefined") return;

  heroSection.addEventListener('mousemove', (e) => {
    const xNorm = (e.clientX / window.innerWidth) - 0.5;
    const yNorm = (e.clientY / window.innerHeight) - 0.5;

    // Move visual opposite to mouse
    gsap.to(heroVisual, {
      x: xNorm * -30,
      y: yNorm * -30,
      rotationY: xNorm * 10,
      rotationX: yNorm * -10,
      duration: 1,
      ease: "power2.out"
    });

    // Move content slightly (parallax depth)
    gsap.to(heroContent, {
      x: xNorm * -10,
      y: yNorm * -10,
      duration: 1,
      ease: "power2.out"
    });
  });
}

// 4. ELASTIC SKILL BARS
function setupSkillBarAnimations() {
  if (typeof gsap === "undefined") return;

  const bars = document.querySelectorAll('.progress-fill');

  bars.forEach(bar => {
    // Read the inline style width (e.g. "90%")
    const finalWidth = bar.style.width || "0%";

    // Reset to 0 initially
    gsap.set(bar, { width: "0%" });

    gsap.to(bar, {
      width: finalWidth,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: bar,
        start: "top 85%"
      }
    });
  });
}

// Init New Animations
document.addEventListener("DOMContentLoaded", () => {
  // Wait for libraries to load
  setTimeout(() => {
    setupDecryptionGame();
    setupMagneticButtons();
    setupTextScramble();
    setupHeroParallax();
    setupSkillBarAnimations();
  }, 100);
});

