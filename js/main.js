/* ============================================================
   DAROU KARIM TRADING — main.js
   Script principal — Vanilla JS ES6+
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. BARRE DE NAVIGATION : effet de défilement
     ────────────────────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // état initial
  }


  /* ──────────────────────────────────────────────────────────
     2. MENU HAMBURGER (mobile)
     ────────────────────────────────────────────────────────── */
  const hamburger   = document.querySelector('.hamburger');
  const navMobile   = document.querySelector('.nav-mobile');
  const navOverlay  = document.querySelector('.nav-overlay');
  const mobileClose = document.querySelector('.nav-mobile__close');

  const openMenu = () => {
    hamburger?.classList.add('active');
    navMobile?.classList.add('open');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger?.classList.remove('active');
    navMobile?.classList.remove('open');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  navOverlay?.addEventListener('click', closeMenu);

  // Fermer le menu au clic sur un lien
  document.querySelectorAll('.nav-mobile__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer avec la touche Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ──────────────────────────────────────────────────────────
     3. LIEN ACTIF DANS LA NAVIGATION
     ────────────────────────────────────────────────────────── */
  const setActiveLinks = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const allNavLinks = [
      ...document.querySelectorAll('.navbar__link'),
      ...document.querySelectorAll('.nav-mobile__link'),
    ];

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive =
        href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html');

      link.classList.toggle('active', isActive);
    });
  };

  setActiveLinks();


  /* ──────────────────────────────────────────────────────────
     4. DÉFILEMENT FLUIDE (ancres internes)
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height'), 10) || 70;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    });
  });


  /* ──────────────────────────────────────────────────────────
     5. ANIMATIONS AU DÉFILEMENT — Intersection Observer API
     ────────────────────────────────────────────────────────── */
  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Délai cascadé pour les groupes d'éléments
        const delay = entry.target.dataset.delay || index * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay, 10));
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px',
  });

  document.querySelectorAll('.fade-up, .fade-in, .fade-left, .fade-right')
    .forEach(el => animateOnScroll.observe(el));


  /* ──────────────────────────────────────────────────────────
     6. COMPTEURS ANIMÉS (statistiques)
     ────────────────────────────────────────────────────────── */
  /**
   * Anime un compteur de 0 à la valeur cible.
   * @param {HTMLElement} el — Élément portant data-target et optionnellement data-suffix/data-prefix
   */
  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const suffix   = el.getAttribute('data-suffix')  || '';
    const prefix   = el.getAttribute('data-prefix')  || '';
    const duration = 2000; // ms
    const fps      = 60;
    const totalSteps = (duration / 1000) * fps;
    let step = 0;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const update = () => {
      step++;
      const progress = easeOutQuart(Math.min(step / totalSteps, 1));
      const current  = Math.floor(progress * target);
      el.textContent = prefix + current + suffix;

      if (step < totalSteps) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-target]')
    .forEach(el => counterObserver.observe(el));


  /* ──────────────────────────────────────────────────────────
     7. ACCORDÉON FAQ
     ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item     = question.closest('.faq-item');
      const isOpen   = item.classList.contains('open');
      const allItems = document.querySelectorAll('.faq-item');

      // Fermer tous les autres
      allItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);

      // Accessibilité
      question.setAttribute('aria-expanded', (!isOpen).toString());
    });

    // Initialiser aria-expanded
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');

    // Clavier
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });


  /* ──────────────────────────────────────────────────────────
     8. FORMULAIRE DE CONTACT
     ────────────────────────────────────────────────────────── */
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    const submitBtn    = contactForm.querySelector('[type="submit"]');
    const successMsg   = contactForm.querySelector('.form-success');
    const originalText = submitBtn ? submitBtn.textContent : '';

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm(contactForm)) return;

      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Envoi en cours…';
      }

      // Simulation d'envoi (remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1400));

      if (submitBtn) {
        submitBtn.disabled    = false;
        submitBtn.textContent = originalText;
      }

      contactForm.reset();
      clearFormErrors(contactForm);

      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => successMsg.classList.remove('show'), 7000);
      }
    });
  }

  /**
   * Validation simple du formulaire
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  const validateForm = (form) => {
    let valid = true;
    clearFormErrors(form);

    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        showFieldError(field, 'Ce champ est obligatoire.');
        valid = false;
      }
    });

    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      showFieldError(emailField, 'Adresse e-mail invalide.');
      valid = false;
    }

    return valid;
  };

  const showFieldError = (field, message) => {
    field.style.borderColor = '#e53e3e';
    const err = document.createElement('span');
    err.className    = 'field-error';
    err.textContent  = message;
    err.style.cssText = 'display:block;font-size:0.78rem;color:#e53e3e;margin-top:4px;';
    field.parentNode.appendChild(err);
  };

  const clearFormErrors = (form) => {
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('[style*="border-color"]').forEach(el => el.style.borderColor = '');
  };


  /* ──────────────────────────────────────────────────────────
     9. BOUTON RETOUR EN HAUT
     ────────────────────────────────────────────────────────── */
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ──────────────────────────────────────────────────────────
     10. MISE EN ÉVIDENCE DE LA SECTION ACTIVE (scroll spy)
     ────────────────────────────────────────────────────────── */
  const sections     = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.navbar__link[href^="#"]');

  if (sections.length > 0 && desktopLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(section => sectionObserver.observe(section));
  }


  /* ──────────────────────────────────────────────────────────
     11. ANIMATION "TYPEWRITER" sur le titre hero (optionnelle)
     ────────────────────────────────────────────────────────── */
  // Désactivé par défaut — décommenter pour activer
  /*
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    const originalHTML = heroTitle.innerHTML;
    // ... implémentation typewriter ici
  }
  */


  /* ──────────────────────────────────────────────────────────
     12. LAZY LOADING des images (si présentes)
     ────────────────────────────────────────────────────────── */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src     = img.dataset.src;
      img.loading = 'lazy';
    });
  } else {
    // Polyfill minimal via IntersectionObserver
    const lazyObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          obs.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
  }


  /* ──────────────────────────────────────────────────────────
     13. INDICATEUR D'ANNÉE dans le footer
     ────────────────────────────────────────────────────────── */
  const yearSpan = document.querySelector('[data-year]');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

}); // fin DOMContentLoaded
