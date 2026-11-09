/* Garden Maintenance Scotland — independent Landing Rescue design study.
 * Portfolio demonstration only: no leads are transmitted or stored.
 * Controls: navigation, gallery filters, image viewing, form preview, area shortcuts.
 */
(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const goTo = (selector) => {
    const target = $(selector);
    if (target) target.scrollIntoView({behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start'});
  };

  const menuButton = $('#menu-button');
  const menu = $('#mobile-menu');
  if (menuButton && menu) {
    const setMenu = (opened) => {
      menu.hidden = !opened;
      menuButton.setAttribute('aria-expanded', String(opened));
      menuButton.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', opened);
    };
    menuButton.addEventListener('click', () => setMenu(menu.hidden));
    $$('a', menu).forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setMenu(false);
    });
    document.addEventListener('click', event => {
      if (!menu.hidden && !event.target.closest('.site-header')) setMenu(false);
    });
  }

  const serviceInput = $('#enquiry-service');
  const areaInput = $('#enquiry-area');
  const formMessage = $('#form-message');
  $$('[data-service]').forEach(button => {
    button.addEventListener('click', () => {
      if (serviceInput) serviceInput.value = button.dataset.service || '';
      if (formMessage) formMessage.hidden = true;
      goTo('#contact');
    });
  });
  $$('[data-area]').forEach(button => {
    button.addEventListener('click', () => {
      $$('[data-area]').forEach(other => {
        const chosen = other === button;
        other.classList.toggle('is-active', chosen);
        other.setAttribute('aria-pressed', String(chosen));
      });
      if (areaInput) areaInput.value = button.dataset.area || '';
      if (formMessage) formMessage.hidden = true;
      goTo('#contact');
    });
  });

  // Filter real stock-photo inspiration; never call them completed company projects.
  const filters = $$('[data-gallery-filter]');
  const cards = $$('[data-category]');
  filters.forEach(filter => filter.addEventListener('click', () => {
    const value = filter.dataset.galleryFilter;
    filters.forEach(other => {
      const selected = other === filter;
      other.classList.toggle('is-active', selected);
      other.setAttribute('aria-pressed', String(selected));
    });
    cards.forEach(card => {
      const matches = value === 'all' || card.dataset.category === value;
      card.hidden = !matches;
    });
  }));

  const dialog = $('#photo-dialog');
  const dialogImage = $('#photo-dialog-image');
  const dialogCaption = $('#photo-dialog-caption');
  let previousFocus = null;
  if (dialog && dialogImage && dialogCaption) {
    $$('.gallery-open').forEach(button => button.addEventListener('click', () => {
      const img = $('img', button);
      if (!img) return;
      previousFocus = document.activeElement;
      dialogImage.src = img.currentSrc || img.src;
      dialogImage.alt = img.alt;
      dialogCaption.textContent = button.dataset.caption || img.alt;
      if (typeof dialog.showModal === 'function') dialog.showModal();
    }));
    const closeDialog = () => {
      if (dialog.open) dialog.close();
    };
    $('.dialog-close', dialog)?.addEventListener('click', closeDialog);
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeDialog();
    });
    dialog.addEventListener('close', () => previousFocus?.focus());
  }

  // Demonstration form. No fetch, XMLHttpRequest, sendBeacon or storage.
  const form = $('#enquiry-form');
  if (form && formMessage) {
    form.addEventListener('input', () => { formMessage.hidden = true; });
    form.addEventListener('change', () => { formMessage.hidden = true; });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const chosenService = serviceInput?.value || 'the selected service';
      formMessage.hidden = false;
      formMessage.innerHTML = '';
      const strong = document.createElement('strong');
      strong.textContent = 'Demo complete — nothing has been sent.';
      const explanation = document.createElement('span');
      explanation.textContent = ' You selected ' + chosenService + '. On an approved client website, this is where an actual enquiry would be submitted securely. This concept does not transmit or store your details. For a real quote, use the company’s official website linked below.';
      formMessage.append(strong, explanation);
      formMessage.scrollIntoView({behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest'});
    });
  }

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();