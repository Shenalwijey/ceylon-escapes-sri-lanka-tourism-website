/* =============================================
   Sri Lanka Tourism - Main JavaScript
   ============================================= */

// ── Navbar scroll effect ──────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ── Mobile hamburger menu ─────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ── Active nav link ───────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Scroll fade-in animations ─────────────────
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));
}

// ── Counter animation (hero stats) ───────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value.toLocaleString() + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNumbers = document.querySelectorAll('.stat-number[data-count]');
if (statNumbers.length) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count));
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statsObserver.observe(el));
}

// ── Destination filter buttons ────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const destCards = document.querySelectorAll('.dest-full-card');

if (filterBtns.length && destCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      destCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ── Booking form validation ───────────────────
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fields = this.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(f => {
      f.style.borderColor = '';
      if (!f.value.trim()) {
        f.style.borderColor = '#c0392b';
        valid = false;
      }
    });

    const msg = document.getElementById('bookingMsg');
    if (valid) {
      msg.className = 'form-message success';
      msg.textContent = '✓ Booking request sent! Our team will contact you within 24 hours.';
      this.reset();
      setTimeout(() => { msg.className = 'form-message'; }, 5000);
    } else {
      msg.className = 'form-message error';
      msg.textContent = '✗ Please fill in all required fields.';
      setTimeout(() => { msg.className = 'form-message'; }, 3500);
    }
  });
}

// ── Login form ────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const msg = document.getElementById('loginMsg');

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

    // Simulate login — replace with real auth
    msg.className = 'form-message success';
    msg.textContent = '✓ Login successful! Redirecting…';
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
}

// ── Register form ─────────────────────────────
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const pass = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const msg = document.getElementById('registerMsg');

    if (pass !== confirm) {
      msg.className = 'form-message error';
      msg.textContent = '✗ Passwords do not match.';
      return;
    }
    msg.className = 'form-message success';
    msg.textContent = '✓ Account created successfully! Redirecting…';
    setTimeout(() => { window.location.href = 'index.html'; }, 1800);
  });
}

// ── Auth toggle (login ↔ register) ────────────
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginPane = document.getElementById('loginPane');
const registerPane = document.getElementById('registerPane');

if (showRegister && loginPane && registerPane) {
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginPane.style.display = 'none';
    registerPane.style.display = 'block';
  });
}
if (showLogin && loginPane && registerPane) {
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerPane.style.display = 'none';
    loginPane.style.display = 'block';
  });
}

// ── Newsletter form ───────────────────────────
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = this.querySelector('input');
    if (input && input.value.trim()) {
      input.value = '';
      const btn = this.querySelector('button');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        setTimeout(() => { btn.textContent = orig; }, 3000);
      }
    }
  });
}

// ── Smooth scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Currency Converter Widget ─────────────────
(function initCurrencyConverter() {
  const CURRENCIES = [
    { code: 'USD', symbol: '$',  name: 'US Dollar',        flag: '🇺🇸', rate: 1 },
    { code: 'EUR', symbol: '€',  name: 'Euro',             flag: '🇪🇺', rate: 0.92 },
    { code: 'GBP', symbol: '£',  name: 'British Pound',    flag: '🇬🇧', rate: 0.79 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar',flag: '🇦🇺', rate: 1.53 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',  flag: '🇨🇦', rate: 1.36 },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.34 },
    { code: 'INR', symbol: '₹',  name: 'Indian Rupee',     flag: '🇮🇳', rate: 83.2 },
    { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',     flag: '🇯🇵', rate: 149.5 },
    { code: 'CHF', symbol: 'CHF',name: 'Swiss Franc',      flag: '🇨🇭', rate: 0.90 },
    { code: 'AED', symbol: 'AED',name: 'UAE Dirham',       flag: '🇦🇪', rate: 3.67 },
    { code: 'LKR', symbol: 'Rs', name: 'Sri Lanka Rupee',  flag: '🇱🇰', rate: 302 },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit',flag: '🇲🇾', rate: 4.72 },
  ];

  let activeCurrency = CURRENCIES[0];
  let liveRates = null;

  // Attempt to fetch live rates (free, no API key required)
  async function fetchLiveRates() {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data && data.rates) {
        liveRates = data.rates;
        CURRENCIES.forEach(c => {
          if (liveRates[c.code]) c.rate = liveRates[c.code];
        });
        updateRateDisplay();
        applyConversion(activeCurrency);
      }
    } catch (_) {
      // Silently fall back to hardcoded rates
    }
  }

  // Scan DOM for price text patterns and wrap them
  function scanAndTagPrices() {
    const priceRegex = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentNode;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(tag)) return NodeFilter.FILTER_REJECT;
          if (parent.classList && parent.classList.contains('currency-widget')) return NodeFilter.FILTER_REJECT;
          if (parent.classList && parent.classList.contains('wa-float')) return NodeFilter.FILTER_REJECT;
          if (priceRegex.test(node.textContent)) { priceRegex.lastIndex = 0; return NodeFilter.FILTER_ACCEPT; }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent || parent.querySelector('.price-value')) return;
      const text = textNode.textContent;
      const fragment = document.createDocumentFragment();
      let lastIdx = 0;
      let match;
      const re = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)/g;
      while ((match = re.exec(text)) !== null) {
        if (match.index > lastIdx) {
          fragment.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
        }
        const rawNum = match[1].replace(/,/g, '');
        const usdVal = parseFloat(rawNum);
        if (usdVal >= 5) {
          const span = document.createElement('span');
          span.className = 'price-value';
          span.dataset.usd = usdVal;
          span.textContent = match[0];
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(match[0]));
        }
        lastIdx = re.lastIndex;
      }
      if (lastIdx < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIdx)));
      if (fragment.childNodes.length > 0) parent.replaceChild(fragment, textNode);
    });
  }

  // Apply the selected currency to all tagged price spans
  function applyConversion(currency) {
    document.querySelectorAll('.price-value').forEach(span => {
      const usd = parseFloat(span.dataset.usd);
      const converted = usd * currency.rate;
      let formatted;
      if (converted >= 1000) {
        formatted = currency.symbol + Math.round(converted).toLocaleString();
      } else if (converted < 10) {
        formatted = currency.symbol + converted.toFixed(2);
      } else {
        formatted = currency.symbol + Math.round(converted).toLocaleString();
      }
      span.textContent = formatted;
      span.style.color = currency.code === 'USD' ? '' : 'var(--primary)';
      span.style.fontWeight = currency.code === 'USD' ? '' : '700';
    });
  }

  function updateRateDisplay() {
    const el = document.getElementById('currencyRateDisplay');
    const src = document.getElementById('currencyRateSource');
    if (!el) return;
    if (activeCurrency.code === 'USD') {
      el.innerHTML = '<strong>Base currency: USD</strong>';
    } else {
      el.innerHTML = `<strong>1 USD = ${activeCurrency.rate.toFixed(activeCurrency.rate < 10 ? 4 : 2)} ${activeCurrency.code}</strong>`;
    }
    if (src) src.textContent = liveRates ? '✓ Live rate from open.er-api.com' : 'Approximate rate (offline)';
  }

  function updateToggleBtn() {
    const btn = document.getElementById('currencyToggleBtn');
    if (!btn) return;
    const flagEl = btn.querySelector('.currency-flag');
    const labelEl = btn.querySelector('.currency-label');
    if (flagEl) flagEl.textContent = activeCurrency.flag;
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
  const quickPills = ['USD', 'EUR', 'GBP', 'AUD', 'SGD', 'LKR'];
  const pillsHTML = quickPills.map(code => {
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
        <select class="currency-select" id="currencySelect">
          ${optionsHTML}
        </select>
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

  // Events
  document.getElementById('currencyToggleBtn').addEventListener('click', () => {
    document.getElementById('currencyPanel').classList.toggle('open');
  });

  document.getElementById('currencyClose').addEventListener('click', () => {
    document.getElementById('currencyPanel').classList.remove('open');
  });

  document.getElementById('currencySelect').addEventListener('change', (e) => {
    setCurrency(e.target.value);
  });

  document.querySelectorAll('.currency-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      setCurrency(pill.dataset.code);
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('currencyPanel');
    const btn = document.getElementById('currencyToggleBtn');
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Init: scan prices, fetch live rates
  scanAndTagPrices();
  fetchLiveRates();
})();

// ── WhatsApp floating button ──────────────────
(function injectWhatsApp() {
  const WA_NUMBER = '94704459015';
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

  // Show bubble after 3 seconds
  setTimeout(() => {
    const bubble = document.getElementById('waBubble');
    if (bubble) bubble.classList.add('visible');
  }, 3000);

  // Close bubble
  const closeBtn = document.getElementById('waClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const bubble = document.getElementById('waBubble');
      if (bubble) bubble.classList.remove('visible');
    });
  }

  // Re-show bubble when hovering the button (after it was closed)
  const waBtn = document.getElementById('waBtn');
  if (waBtn) {
    waBtn.addEventListener('mouseenter', () => {
      const bubble = document.getElementById('waBubble');
      if (bubble) bubble.classList.add('visible');
    });
  }
})();
