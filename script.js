/* ============================================================
   Tajudeen Isah — portfolio interactions
   Vanilla JS, no dependencies, no build step.
   ============================================================ */
(function () {
  'use strict';

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ── Mobile nav ── */
  var navToggle = $('#navToggle');
  var siteNav = $('#siteNav');

  function closeNav() {
    if (!siteNav) return;
    siteNav.classList.remove('is-open');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    }
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    siteNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ── Scroll progress rail ── */
  var rail = $('#scrollRail');
  var ticking = false;

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (rail) rail.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0).toFixed(2) + '%';
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  /* ── Active nav link ── */
  var sections = $$('main section[id]');
  var navLinkFor = {};
  $$('.site-nav a').forEach(function (a) {
    navLinkFor[a.getAttribute('href').replace('#', '')] = a;
  });

  if ('IntersectionObserver' in window && sections.length) {
    var navObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinkFor[entry.target.id];
          if (!link || !entry.isIntersecting) return;
          $$('.site-nav a').forEach(function (a) {
            a.classList.remove('is-active');
          });
          link.classList.add('is-active');
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach(function (s) {
      navObs.observe(s);
    });
  }

  /* ── Reveal on scroll ── */
  var revealTargets = $$(
    '.hero-copy, .hero-console, .category-card, .agent-card, .principles article,' +
      ' .stack-card, .timeline li, .contact-copy, .contact-panel, .search-panel',
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
    });

    var revealObs = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          setTimeout(
            function () {
              el.classList.add('is-visible');
            },
            Math.min(i * 60, 240),
          );
          obs.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    revealTargets.forEach(function (el) {
      revealObs.observe(el);
    });
  }

  /* ── Project filtering ── */
  var filterBtns = $$('.filter-actions .button');
  var cards = $$('#projectGrid .agent-card');
  var emptyState = $('#emptyState');
  var filterNote = $('#filterNote');
  var total = cards.length;

  var labels = {
    all: 'all',
    defi: 'DeFi',
    agents: 'agent',
    risk: 'risk',
    product: 'product',
  };

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      var shown = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
        var match = filter === 'all' || tags.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (emptyState) emptyState.hidden = shown !== 0;

      if (filterNote) {
        filterNote.textContent =
          filter === 'all'
            ? 'Showing all ' + total + ' projects.'
            : 'Showing ' + shown + ' of ' + total + ' projects in ' + labels[filter] + '.';
      }
    });
  });

  /* ── Contact form: validate, then hand off to the mail client ──
     Note: this is a static site with no backend, so it cannot send mail
     itself. It composes a mailto: instead of faking a "sent" state.     */
  var form = $('#contactForm');

  function setError(input, message) {
    var wrap = input.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('has-error', !!message);
    var slot = $('.field-error', wrap);
    if (slot) slot.textContent = message || '';
  }

  function validate(input) {
    var value = input.value.trim();

    if (!value) {
      setError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(input, 'Enter a valid email address.');
      return false;
    }
    if (input.id === 'cMessage' && value.length < 12) {
      setError(input, 'A little more detail helps (12+ characters).');
      return false;
    }

    setError(input, '');
    return true;
  }

  if (form) {
    var inputs = $$('input, textarea', form);

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validate(input);
      });
      input.addEventListener('input', function () {
        var wrap = input.closest('.field');
        if (wrap && wrap.classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      inputs.forEach(function (input) {
        if (!validate(input)) valid = false;
      });

      if (!valid) {
        var firstBad = $('.field.has-error input, .field.has-error textarea', form);
        if (firstBad) firstBad.focus();
        return;
      }

      var body =
        'Name: ' +
        $('#cName').value.trim() +
        '\nEmail: ' +
        $('#cEmail').value.trim() +
        '\n\n' +
        $('#cMessage').value.trim();

      var href =
        'mailto:tajudeenowoeteniyan@gmail.com' +
        '?subject=' +
        encodeURIComponent('[Portfolio] ' + $('#cSubject').value.trim()) +
        '&body=' +
        encodeURIComponent(body);

      window.location.href = href;

      var btn = $('#submitBtn');
      if (btn) {
        var original = btn.textContent;
        btn.textContent = 'Opening your mail app…';
        setTimeout(function () {
          btn.textContent = original;
        }, 3500);
      }
    });
  }

  /* ── Live public repo count, with the static value as fallback ── */
  var statRepos = $('#statRepos');
  if (statRepos && window.fetch) {
    fetch('https://api.github.com/users/Tajudeeen')
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data && typeof data.public_repos === 'number') {
          statRepos.textContent = String(data.public_repos);
        }
      })
      .catch(function () {
        /* keep the server-rendered number */
      });
  }

  /* ── Footer year ── */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
