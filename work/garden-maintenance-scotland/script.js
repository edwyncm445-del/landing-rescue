/* Landing Rescue — Garden Maintenance Scotland design concept
   Interactive controls only. Does not transmit, persist, or process leads. */
(() => {
  'use strict';
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const serviceSelect = document.getElementById('demo-service');
  const areaField = document.getElementById('demo-area');
  const form = document.getElementById('estimate-form');
  const feedback = document.getElementById('form-result');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function closeMenu() {
    mobileMenu.hidden = true;
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
  function openMenu() {
    mobileMenu.hidden = false;
    menuButton.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
  }
  menuButton.addEventListener('click', () => {
    mobileMenu.hidden ? openMenu() : closeMenu();
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  function goToForm() {
    document.getElementById('estimate').scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  }
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const serviceCards = [...document.querySelectorAll('[data-category]')];
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(b => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      serviceCards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    });
  });
  document.querySelectorAll('[data-service]').forEach(button => {
    button.addEventListener('click', () => {
      serviceSelect.value = button.dataset.service;
      feedback.hidden = true;
      goToForm();
    });
  });
  document.querySelectorAll('[data-area]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-area]').forEach(b => {
        b.classList.toggle('is-active', b === button);
      });
      areaField.value = button.dataset.area;
      feedback.hidden = true;
      goToForm();
    });
  });
  ['input','change'].forEach(eventName => {
    form.addEventListener(eventName, () => { feedback.hidden = true; });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const category = serviceSelect.value || 'your chosen service';
    feedback.textContent = 'Demo complete: a customer would now see a confirmation for ' +
      category + '. This is an independent portfolio preview. No information has been ' +
      'sent to Garden Maintenance Scotland, Landing Rescue, or any server, and nothing ' +
      'has been stored. For a real enquiry, use the official company contact details on this page.';
    feedback.hidden = false;
    feedback.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block:'nearest'});
  });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();