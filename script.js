/* ========================================
   UBUNTU UNITY — Script
   Pure JS: theme, 3D effects, animations
   ======================================== */

(function () {
  'use strict';

  /* ===== THEME TOGGLE ===== */
  var html = document.documentElement;
  var toggle = document.getElementById('themeToggle');

  function getTheme() {
    var s = localStorage.getItem('uu-theme');
    return s || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('uu-theme', t);
    toggle.innerHTML = t === 'dark' ? '&#9788;' : '&#9790;';
  }
  setTheme(getTheme());
  toggle.addEventListener('click', function () {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ===== MOBILE MENU ===== */
  var mobMenu = document.getElementById('mobMenu');
  var mobileBtn = document.getElementById('mobileBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', function () {
      mobMenu.classList.toggle('open');
    });
  }
  window.closeMob = function () {
    mobMenu.classList.remove('open');
  };

  /* ===== TYPING EFFECT ===== */
  var phrases = ['Reborn.', 'Unbroken.', 'Timeless.', 'Yours.', 'Purple.', 'Legendary.'];
  var phraseIdx = 0, charIdx = 0, isDeleting = false;
  var typedEl = document.getElementById('typedText');
  if (typedEl) {
    function typeLoop() {
      var current = phrases[phraseIdx];
      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) { isDeleting = true; setTimeout(typeLoop, 2200); return; }
        setTimeout(typeLoop, 90);
      } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
        setTimeout(typeLoop, 50);
      }
    }
    typeLoop();
  }

  /* ===== FAQ ACCORDION ===== */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ===== SCROLL REVEAL ===== */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('vis'); });
  }

  /* ===== ANIMATED COUNTERS ===== */
  var counted = false;
  function animateCounters() {
    if (counted) return;
    var statEls = document.querySelectorAll('.stat-num[data-count]');
    if (statEls.length === 0) return;
    var firstStat = statEls[0];
    var rect = firstStat.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;
    counted = true;
    statEls.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'));
      var duration = 1200;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }
  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  /* ===== BACK TO TOP ===== */
  var btt = document.getElementById('btt');
  window.addEventListener('scroll', function () {
    if (btt) btt.classList.toggle('show', window.scrollY > 500);
    var nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
  if (btt) btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ===== NAV ACTIVE STATE ===== */
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && navLinks.length > 0) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var a = document.querySelector('.nav-links a[href="#' + e.target.id + '"]');
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.2, rootMargin: '-60px 0px -50% 0px' });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ===== RESPONSIVE TIMELINE ===== */
  function checkLayout() {
    var g = document.getElementById('aboutGrid');
    if (g) g.style.gridTemplateColumns = window.innerWidth < 768 ? '1fr' : '1fr 1fr';
  }
  checkLayout();
  window.addEventListener('resize', checkLayout);

  /* ===== 3D LAPTOP PARALLAX (HERO) ===== */
  var laptopWrap = document.querySelector('.hero-laptop');
  if (laptopWrap) {
    var heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rotateY = x * 12;
      var rotateX = -y * 8 + 8;
      laptopWrap.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });
    heroSection.addEventListener('mouseleave', function () {
      laptopWrap.style.transform = 'rotateX(8deg) rotateY(-3deg)';
      laptopWrap.style.transition = 'transform 0.6s ease';
      setTimeout(function () { laptopWrap.style.transition = 'transform 0.15s ease-out'; }, 600);
    });
  }

  /* ===== 3D SHOWCASE CARDS (DESKTOP) ===== */
  var showcaseCards = document.querySelectorAll('.showcase-card');
  showcaseCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var rotateY = x * 10;
      var rotateX = -y * 10;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.35s ease';
      setTimeout(function () { card.style.transition = 'transform 0.15s ease-out, box-shadow 0.35s ease'; }, 500);
    });
  });

  /* ===== CONFETTI ===== */
  var confettiCanvas = document.getElementById('confettiCanvas');
  var cCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  var confettiPieces = [];
  var confettiRunning = false;

  function resizeConfetti() {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  }
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);

  function launchConfetti() {
    if (!cCtx) return;
    confettiPieces = [];
    var colors = ['#6366F1', '#818CF8', '#A5B4FC', '#F59E0B', '#2EA047', '#fff'];
    for (var i = 0; i < 120; i++) {
      confettiPieces.push({
        x: window.innerWidth / 2 + ((Math.random() - 0.5) * 200),
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -18 - 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.3,
        opacity: 1
      });
    }
    if (!confettiRunning) { confettiRunning = true; animateConfetti(); }
  }

  function animateConfetti() {
    if (!cCtx || !confettiCanvas) return;
    cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    var alive = false;
    for (var i = 0; i < confettiPieces.length; i++) {
      var p = confettiPieces[i];
      p.x += p.vx; p.vy += p.gravity; p.y += p.vy;
      p.rotation += p.rotSpeed; p.opacity -= 0.005;
      if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) continue;
      alive = true;
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate(p.rotation * Math.PI / 180);
      cCtx.globalAlpha = Math.max(0, p.opacity);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      cCtx.restore();
    }
    if (alive) requestAnimationFrame(animateConfetti);
    else { confettiRunning = false; cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
  }

  /* ===== EASTER EGG (TRIPLE CLICK BRAND) ===== */
  var clickCount = 0, lastClickTime = 0;
  var navBrand = document.getElementById('navBrand');
  if (navBrand) {
    navBrand.addEventListener('click', function (e) {
      e.preventDefault();
      var now = Date.now();
      if (now - lastClickTime > 800) clickCount = 0;
      clickCount++; lastClickTime = now;
      if (clickCount === 3) {
        launchConfetti();
        showToast('You found the Ubuntu Unity easter egg! The Unity of Friends sends its regards.');
        clickCount = 0;
      } else if (clickCount === 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ===== SPARKLE ON CLICK ===== */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.btn-purple, .nav-logo, .team-av, .tip-n, .showcase-card')) {
        for (var i = 0; i < 6; i++) {
          var sp = document.createElement('div');
          sp.className = 'sparkle';
          sp.style.left = (e.clientX + ((Math.random() - 0.5) * 40)) + 'px';
          sp.style.top = (e.clientY + ((Math.random() - 0.5) * 40)) + 'px';
          sp.style.background = Math.random() > 0.5 ? 'var(--purple)' : 'var(--purple-light)';
          sp.style.width = sp.style.height = (Math.random() * 5 + 3) + 'px';
          document.body.appendChild(sp);
          setTimeout(function (el) { el.remove(); }, 700, sp);
        }
      }
    });
  }

  /* ===== TOAST ===== */
  var toastTimeout;
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () { t.classList.remove('show'); }, 4000);
  }
  window.showToast = showToast;

  /* ===== KONAMI CODE ===== */
  var konamiSeq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], konamiIdx = 0;
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        launchConfetti();
        showToast('Konami code activated! Wobbly windows would be proud.');
        konamiIdx = 0;
      }
    } else { konamiIdx = 0; }
  });

  /* ===== TAG CLICK ===== */
  document.querySelectorAll('.tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      showToast('You clicked "' + tag.textContent + '" — that\'s a great topic!');
      tag.style.transform = 'translateY(-2px) scale(1.15)';
      setTimeout(function () { tag.style.transform = ''; }, 300);
    });
  });

})();
