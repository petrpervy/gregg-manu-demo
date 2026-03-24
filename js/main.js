/* ===================================
   GREG'S MANUFACTURING - Main JS
   Gallery, Mobile Nav, Scroll Animations, Filter/Sort
   =================================== */

// === MOBILE NAV TOGGLE ===
(function() {
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('.navbar-nav');
  var body = document.body;

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      body.classList.toggle('nav-open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        body.classList.remove('nav-open');
      });
    });

    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        body.classList.remove('nav-open');
      }
    });
  }
})();


// === SCROLL ANIMATIONS (Fade-in on scroll with stagger support) ===
(function() {
  var animElements = document.querySelectorAll('.animate-on-scroll');
  if (animElements.length === 0) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.dataset.delay || 0);
        if (delay > 0) {
          setTimeout(function() {
            entry.target.classList.add('animated');
          }, delay);
        } else {
          entry.target.classList.add('animated');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animElements.forEach(function(el) {
    observer.observe(el);
  });
})();

// === PARALLAX — Full-width photo strip ===
(function() {
  var strip = document.querySelector('.home-fullwidth-img');
  if (!strip) return;
  var img = strip.querySelector('img');
  if (!img) return;

  function onScroll() {
    var rect = strip.getBoundingClientRect();
    var visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!visible) return;
    var centerOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
    img.style.transform = 'translateY(' + (centerOffset * 0.18).toFixed(1) + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// === HOMEPAGE GALLERY SLIDER ===
(function() {
  var gallery = document.querySelector('.our-product-gallery');
  if (!gallery) return;

  var prevBtn = gallery.querySelector('.gallery-prev');
  var nextBtn = gallery.querySelector('.gallery-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      gallery.style.opacity = '0.96';
      setTimeout(function() { gallery.style.opacity = '1'; }, 180);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      gallery.style.opacity = '0.96';
      setTimeout(function() { gallery.style.opacity = '1'; }, 180);
    });
  }
})();


// === SHOP PAGE: FILTER & SORT ===
(function() {
  var filterItems = document.querySelectorAll('.filter-list li');
  var productCards = document.querySelectorAll('.product-grid-card');
  var sortSelect = document.querySelector('.sort-bar select');
  var filterToggles = document.querySelectorAll('.filter-header');

  // Filter toggle (expand/collapse)
  filterToggles.forEach(function(header) {
    header.addEventListener('click', function() {
      var toggle = header.querySelector('.filter-toggle');
      var list = header.nextElementSibling;
      if (list && list.classList.contains('filter-list')) {
        list.classList.toggle('collapsed');
        toggle.textContent = list.classList.contains('collapsed') ? '+' : '\u2014';
      }
    });
  });

  // Category filter using data-category attributes
  var categoryMap = {
    'all': null,
    'manufactured wood': 'manufactured',
    'canadacorebox': 'corebox',
    'dimensional lumber': 'dimensional',
    'moulding & millwork': 'moulding',
    'rough cut timbers': 'rough-timbers',
    'rough cut lumber': 'rough-lumber',
    'pallets': 'pallets'
  };

  function applyFilter(dataCategory) {
    productCards.forEach(function(card) {
      if (dataCategory === null || dataCategory === undefined) {
        card.style.display = '';
      } else {
        card.style.display = card.getAttribute('data-category') === dataCategory ? '' : 'none';
      }
    });
  }

  if (filterItems.length > 0 && productCards.length > 0) {
    filterItems.forEach(function(item) {
      item.addEventListener('click', function() {
        filterItems.forEach(function(fi) { fi.classList.remove('active'); });
        item.classList.add('active');

        var categoryText = item.textContent.trim().toLowerCase();
        var dataCategory = categoryMap[categoryText];
        applyFilter(dataCategory);
      });
    });

    // Apply default filter on page load based on URL hash or active filter
    var hash = window.location.hash.replace('#', '').toLowerCase();
    var hashCategoryMap = {
      'manufactured': 'manufactured',
      'dimensional': 'dimensional',
      'moulding': 'moulding',
      'corebox': 'corebox',
      'pallets': 'pallets',
      'rough-lumber': 'rough-lumber',
      'rough-timbers': 'rough-timbers'
    };

    if (hash && hashCategoryMap[hash]) {
      // URL hash takes priority — find matching filter item and activate it
      var targetCategory = hashCategoryMap[hash];
      filterItems.forEach(function(fi) { fi.classList.remove('active'); });
      filterItems.forEach(function(fi) {
        var text = fi.textContent.trim().toLowerCase();
        if (categoryMap[text] === targetCategory) fi.classList.add('active');
      });
      applyFilter(targetCategory);
    } else {
      // Default: apply whatever filter is marked .active in HTML
      var activeItem = document.querySelector('.filter-list li.active');
      if (activeItem) {
        var activeCat = categoryMap[activeItem.textContent.trim().toLowerCase()];
        if (activeCat) applyFilter(activeCat);
      }
    }
  }

  // Sort
  if (sortSelect && productCards.length > 0) {
    sortSelect.addEventListener('change', function() {
      var grid = document.querySelector('.product-grid');
      if (!grid) return;

      var cards = Array.from(productCards);
      var sortVal = sortSelect.value;

      cards.sort(function(a, b) {
        var nameA = a.querySelector('h3').textContent;
        var nameB = b.querySelector('h3').textContent;
        var priceA = parseFloat(a.querySelector('.price').textContent.replace('$',''));
        var priceB = parseFloat(b.querySelector('.price').textContent.replace('$',''));

        if (sortVal === 'Price: Low to High') return priceA - priceB;
        if (sortVal === 'Price: High to Low') return priceB - priceA;
        if (sortVal === 'Name: A to Z') return nameA.localeCompare(nameB);
        if (sortVal === 'Name: Z to A') return nameB.localeCompare(nameA);
        return 0;
      });

      cards.forEach(function(card) { grid.appendChild(card); });
    });
  }
})();


// === CONTACT FORM HANDLING (Formspree) ===
(function() {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  var btn = form.querySelector('.send-btn');
  var successMsg = form.querySelector('.form-success');
  var errorMsg = form.querySelector('.form-error');

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        if (successMsg) successMsg.style.display = 'block';
        form.reset();
        btn.textContent = 'Sent ✓';
        btn.style.background = '#4a7c3f';
        setTimeout(function() {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        return response.json().then(function(data) {
          throw new Error(data.error || 'Server error');
        });
      }
    })
    .catch(function() {
      if (errorMsg) errorMsg.style.display = 'block';
      btn.textContent = originalText;
      btn.disabled = false;
    });
  });
})();


// === TESTIMONIAL CAROUSEL ===
(function() {
  var slides = document.querySelectorAll('.testimonial-slide');
  var prevBtn = document.querySelector('.testimonial-prev');
  var nextBtn = document.querySelector('.testimonial-next');
  if (slides.length === 0) return;

  var current = 0;

  function showSlide(index) {
    slides.forEach(function(s) { s.classList.remove('active'); });
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', function() { showSlide(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { showSlide(current + 1); });

  // Auto-advance every 6 seconds
  setInterval(function() { showSlide(current + 1); }, 6000);
})();


// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
