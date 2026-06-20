/* =============================================
   Ceylon Escapes — script.js  (fixed & merged)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     NAVBAR — scroll effect
     FIX: moved inside DOMContentLoaded so
     querySelector is guaranteed to find the element
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set correct state on load
  }

  /* ─────────────────────────────────────────────
     HAMBURGER MENU
     FIX 1: use getElementById (same as HTML) instead
             of querySelector to always get the right element
     FIX 2: toggle hamburger.classList 'open' so CSS
             handles the animation (not inline styles)
     FIX 3: add a backdrop overlay that closes menu on tap
     FIX 4: close menu when any nav link is clicked
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Create backdrop overlay
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
    navOverlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ─────────────────────────────────────────────
     ACTIVE NAV LINK
     NOTE: HTML already sets .active via class="active"
     on each page, so this only fills in any gaps
     (e.g. if class was accidentally omitted)
  ───────────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─────────────────────────────────────────────
     FADE-IN ON SCROLL
  ───────────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ─────────────────────────────────────────────
     COUNTER ANIMATION (hero stats)
     Uses requestAnimationFrame for smooth easing
  ───────────────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, parseInt(entry.target.dataset.count, 10));
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statsObserver.observe(el));
  }

  /* ─────────────────────────────────────────────
     DESTINATION FILTER BUTTONS
  ───────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destCards  = document.querySelectorAll('.dest-full-card');

  if (filterBtns.length && destCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        destCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     BOOKING FORM
     FIX: checkbox validation — checkboxes have
     value="on" so !f.value.trim() always passes.
     Must check f.checked instead.
  ───────────────────────────────────────────── */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fields = this.querySelectorAll('[required]');
      let valid = true;

      fields.forEach(f => {
        f.style.borderColor = '';
        // FIX: handle checkbox separately
        const empty = f.type === 'checkbox' ? !f.checked : !f.value.trim();
        if (empty) { f.style.borderColor = '#c0392b'; valid = false; }
      });

      const msg = document.getElementById('bookingMsg');
      if (valid) {
        msg.className = 'form-message success';
        msg.textContent = '✓ Booking request sent! Our team will contact you within 24 hours.';
        this.reset();
        setTimeout(() => { msg.className = 'form-message'; msg.textContent = ''; }, 5000);
      } else {
        msg.className = 'form-message error';
        msg.textContent = '✗ Please fill in all required fields.';
        setTimeout(() => { msg.className = 'form-message'; msg.textContent = ''; }, 3500);
      }
    });
  }

  /* ─────────────────────────────────────────────
     LOGIN FORM
  ───────────────────────────────────────────── */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('email')?.value.trim();
      const pass  = document.getElementById('password')?.value;
      const msg   = document.getElementById('loginMsg');

      if (!email || !pass) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Please enter your email and password.';
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Please enter a valid email address.';
        return;
      }
      msg.className = 'form-message success';
      msg.textContent = '✓ Login successful! Redirecting…';
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    });
  }

  /* ─────────────────────────────────────────────
     REGISTER FORM
  ───────────────────────────────────────────── */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const pass    = document.getElementById('regPassword')?.value;
      const confirm = document.getElementById('regConfirm')?.value;
      const msg     = document.getElementById('registerMsg');

      if (pass !== confirm) {
        msg.className = 'form-message error';
        msg.textContent = '✗ Passwords do not match.';
        if (document.getElementById('regConfirm')) {
          document.getElementById('regConfirm').style.borderColor = '#c0392b';
        }
        return;
      }
      msg.className = 'form-message success';
      msg.textContent = '✓ Account created successfully! Redirecting…';
      setTimeout(() => { window.location.href = 'index.html'; }, 1800);
    });
  }

  /* ─────────────────────────────────────────────
     AUTH TOGGLE (login ↔ register panes)
  ───────────────────────────────────────────── */
  const showRegister = document.getElementById('showRegister');
  const showLogin    = document.getElementById('showLogin');
  const loginPane    = document.getElementById('loginPane');
  const registerPane = document.getElementById('registerPane');

  if (showRegister && loginPane && registerPane) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginPane.style.display    = 'none';
      registerPane.style.display = 'block';
    });
  }
  if (showLogin && loginPane && registerPane) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerPane.style.display = 'none';
      loginPane.style.display    = 'block';
    });
  }

  /* ─────────────────────────────────────────────
     NEWSLETTER FORMS
     FIX: querySelectorAll instead of querySelector
     so ALL newsletter forms on the page work,
     not just the first one
  ───────────────────────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        const btn  = this.querySelector('button');
        const orig = btn ? btn.textContent : '';
        input.value = '';
        if (btn) {
          btn.textContent = '✓ Subscribed!';
          btn.style.background = '#16a34a';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
          }, 3000);
        }
      }
    });
  });

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL for anchor links
     FIX: guard against href="#" (empty hash)
     which causes querySelector('#') to throw
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return; // FIX: skip empty anchors
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

}); // end DOMContentLoaded


/* ─────────────────────────────────────────────
   CURRENCY CONVERTER WIDGET
   FIX 1: TreeWalker regex lastIndex bug —
           create a fresh RegExp per test instead
           of reusing the stateful /g regex
   FIX 2: outside-click handler scoped to widget
           only, so it no longer conflicts with
           the hamburger outside-click logic
───────────────────────────────────────────── */
(function initCurrencyConverter() {
  const CURRENCIES = [
    { code: 'USD', symbol: '$',   name: 'US Dollar',         flag: '🇺🇸', rate: 1 },
    { code: 'EUR', symbol: '€',   name: 'Euro',              flag: '🇪🇺', rate: 0.92 },
    { code: 'GBP', symbol: '£',   name: 'British Pound',     flag: '🇬🇧', rate: 0.79 },
    { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar', flag: '🇦🇺', rate: 1.53 },
    { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar',   flag: '🇨🇦', rate: 1.36 },
    { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar',  flag: '🇸🇬', rate: 1.34 },
    { code: 'INR', symbol: '₹',   name: 'Indian Rupee',      flag: '🇮🇳', rate: 83.2 },
    { code: 'JPY', symbol: '¥',   name: 'Japanese Yen',      flag: '🇯🇵', rate: 149.5 },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc',       flag: '🇨🇭', rate: 0.90 },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham',        flag: '🇦🇪', rate: 3.67 },
    { code: 'LKR', symbol: 'Rs',  name: 'Sri Lanka Rupee',   flag: '🇱🇰', rate: 302 },
    { code: 'MYR', symbol: 'RM',  name: 'Malaysian Ringgit', flag: '🇲🇾', rate: 4.72 },
  ];

  let activeCurrency = CURRENCIES[0];
  let liveRates = null;

  async function fetchLiveRates() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data && data.rates) {
        liveRates = data.rates;
        CURRENCIES.forEach(c => { if (liveRates[c.code]) c.rate = liveRates[c.code]; });
        updateRateDisplay();
        applyConversion(activeCurrency);
      }
    } catch (_) { /* silently fall back to hardcoded rates */ }
  }

  // FIX: use a fresh RegExp each time instead of a stateful /g one
  // The old code tested `priceRegex.test(node.textContent)` with a /g flag,
  // advancing lastIndex, so every other matching node was skipped.
  function scanAndTagPrices() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentNode;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(tag)) return NodeFilter.FILTER_REJECT;
          if (parent.closest('.currency-widget, .wa-float')) return NodeFilter.FILTER_REJECT;
          // FIX: new RegExp each call — no shared lastIndex state
          return /\$\d/.test(node.textContent)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent || parent.querySelector('.price-value')) return;
      const text     = textNode.textContent;
      const fragment = document.createDocumentFragment();
      let lastIdx    = 0;
      let match;
      // FIX: local regex (no /g state leaking between calls)
      const re = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g;
      while ((match = re.exec(text)) !== null) {
        if (match.index > lastIdx) {
          fragment.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
        }
        const usdVal = parseFloat(match[1].replace(/,/g, ''));
        if (usdVal >= 5) {
          const span = document.createElement('span');
          span.className   = 'price-value';
          span.dataset.usd = usdVal;
          span.textContent = match[0];
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(match[0]));
        }
        lastIdx = re.lastIndex;
      }
      if (lastIdx < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIdx)));
      parent.replaceChild(fragment, textNode);
    });
  }

  function applyConversion(currency) {
    document.querySelectorAll('.price-value').forEach(span => {
      const usd       = parseFloat(span.dataset.usd);
      const converted = usd * currency.rate;
      let formatted;
      if (converted >= 1000)     formatted = currency.symbol + Math.round(converted).toLocaleString();
      else if (converted < 10)   formatted = currency.symbol + converted.toFixed(2);
      else                       formatted = currency.symbol + Math.round(converted).toLocaleString();
      span.textContent   = formatted;
      span.style.color      = currency.code === 'USD' ? '' : 'var(--primary)';
      span.style.fontWeight = currency.code === 'USD' ? '' : '700';
    });
  }

  function updateRateDisplay() {
    const el  = document.getElementById('currencyRateDisplay');
    const src = document.getElementById('currencyRateSource');
    if (!el) return;
    el.innerHTML = activeCurrency.code === 'USD'
      ? '<strong>Base currency: USD</strong>'
      : `<strong>1 USD = ${activeCurrency.rate.toFixed(activeCurrency.rate < 10 ? 4 : 2)} ${activeCurrency.code}</strong>`;
    if (src) src.textContent = liveRates ? '✓ Live rate from open.er-api.com' : 'Approximate rate (offline)';
  }

  function updateToggleBtn() {
    const btn = document.getElementById('currencyToggleBtn');
    if (!btn) return;
    const flagEl  = btn.querySelector('.currency-flag');
    const labelEl = btn.querySelector('.currency-label');
    if (flagEl)  flagEl.textContent  = activeCurrency.flag;
    if (labelEl) labelEl.textContent = activeCurrency.code;
  }

  function updatePills() {
    document.querySelectorAll('.currency-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.code === activeCurrency.code);
    });
  }

  function setCurrency(code) {
    const found = CURRENCIES.find(c => c.code === code);
    if (!found) return;
    activeCurrency = found;
    applyConversion(activeCurrency);
    updateRateDisplay();
    updateToggleBtn();
    updatePills();
    const sel = document.getElementById('currencySelect');
    if (sel) sel.value = code;
  }

  // Build widget HTML
  const quickPills  = ['USD', 'EUR', 'GBP', 'AUD', 'SGD', 'LKR'];
  const pillsHTML   = quickPills.map(code => {
    const c = CURRENCIES.find(x => x.code === code);
    return `<button class="currency-pill${code === 'USD' ? ' active' : ''}" data-code="${code}">${c.flag} ${code}</button>`;
  }).join('');
  const optionsHTML = CURRENCIES.map(c =>
    `<option value="${c.code}">${c.flag} ${c.code} — ${c.name}</option>`
  ).join('');

  const widget = document.createElement('div');
  widget.className = 'currency-widget';
  widget.innerHTML = `
    <div class="currency-panel" id="currencyPanel">
      <div class="currency-panel-header">
        <h4>💱 Currency Converter</h4>
        <button class="currency-panel-close" id="currencyClose">✕</button>
      </div>
      <div class="currency-panel-body">
        <span class="currency-select-label">Display prices in</span>
        <select class="currency-select" id="currencySelect">${optionsHTML}</select>
        <div class="currency-quick-pills">${pillsHTML}</div>
        <div class="currency-rate-display">
          <strong id="currencyRateDisplay">Base currency: USD</strong>
          <span class="rate-source" id="currencyRateSource">Loading live rates…</span>
        </div>
      </div>
    </div>
    <button class="currency-toggle-btn" id="currencyToggleBtn" title="Change currency">
      <span class="currency-flag">🇺🇸</span>
      <span class="currency-label">USD</span>
      <span>▲ Change</span>
    </button>
  `;
  document.body.appendChild(widget);

  document.getElementById('currencyToggleBtn').addEventListener('click', (e) => {
    e.stopPropagation(); // prevent document click from immediately closing
    document.getElementById('currencyPanel').classList.toggle('open');
  });
  document.getElementById('currencyClose').addEventListener('click', () => {
    document.getElementById('currencyPanel').classList.remove('open');
  });
  document.getElementById('currencySelect').addEventListener('change', (e) => {
    setCurrency(e.target.value);
  });
  document.querySelectorAll('.currency-pill').forEach(pill => {
    pill.addEventListener('click', () => setCurrency(pill.dataset.code));
  });

  // FIX: scoped outside-click — only targets currency widget,
  // no longer conflicts with hamburger's outside-click handler
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('currencyPanel');
    const btn   = document.getElementById('currencyToggleBtn');
    if (panel && btn && !widget.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  scanAndTagPrices();
  fetchLiveRates();
})();


/* ─────────────────────────────────────────────
   WHATSAPP FLOATING BUTTON
   FIX: track whether user manually closed the
   bubble; don't re-show it on mouseenter if
   they already dismissed it
───────────────────────────────────────────── */
(function injectWhatsApp() {
  const WA_NUMBER  = '94704459015';
  const WA_MESSAGE = encodeURIComponent('Hi! I\'m interested in a Sri Lanka tour. Can you help me plan my trip?');

  const float = document.createElement('div');
  float.className = 'wa-float';
  float.innerHTML = `
    <div class="wa-bubble" id="waBubble">
      <button class="wa-close" id="waClose" title="Close">✕</button>
      <strong>💬 Chat with us!</strong>
      We're online now. Ask us anything about your Sri Lanka trip — we reply instantly.
    </div>
    <a class="wa-btn" href="https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}" target="_blank" rel="noopener" id="waBtn" title="Chat on WhatsApp">
      <div class="wa-pulse"></div>
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.523 5.83L0 24l6.335-1.507A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.017-1.382l-.36-.214-3.732.888.921-3.618-.235-.372A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
      </svg>
    </a>
  `;
  document.body.appendChild(float);

  // FIX: track whether user dismissed the bubble
  let bubbleDismissed = false;

  setTimeout(() => {
    const bubble = document.getElementById('waBubble');
    if (bubble && !bubbleDismissed) bubble.classList.add('visible');
  }, 3000);

  const closeBtn = document.getElementById('waClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      bubbleDismissed = true; // FIX: remember user closed it
      const bubble = document.getElementById('waBubble');
      if (bubble) bubble.classList.remove('visible');
    });
  }

  const waBtn = document.getElementById('waBtn');
  if (waBtn) {
    waBtn.addEventListener('mouseenter', () => {
      // FIX: only re-show if user hasn't dismissed it
      if (!bubbleDismissed) {
        const bubble = document.getElementById('waBubble');
        if (bubble) bubble.classList.add('visible');
      }
    });
  }
})();
