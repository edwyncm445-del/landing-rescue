/* Wren — concept site interactions */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* header state */
  var head = document.querySelector(".wren-head");
  if (head) {
    var onScroll = function () { head.classList.toggle("is-scrolled", window.scrollY > 30); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* mobile menu */
  var toggle = document.querySelector(".wren-toggle");
  var menu = document.querySelector(".wren-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) { var f = menu.querySelector("a"); if (f) f.focus(); }
      else { toggle.focus(); }
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  /* menu tabs */
  var tabs = document.querySelectorAll(".menu-tabs button");
  var panels = document.querySelectorAll(".menu-panel");
  var photo = document.getElementById("menu-photo-img");
  var caption = document.getElementById("menu-photo-cap");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
      tab.setAttribute("aria-selected", "true");
      var target = tab.getAttribute("data-panel");
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.id === target);
      });
      if (photo) {
        var src = tab.getAttribute("data-photo");
        if (src && !reduceMotion) {
          photo.style.opacity = "0";
          setTimeout(function () {
            photo.src = src;
            photo.onload = function () { photo.style.opacity = "1"; };
          }, 160);
        } else if (src) {
          photo.src = src;
        }
      }
      if (caption) caption.textContent = tab.getAttribute("data-caption") || "";
    });
  });

  /* reveals */
  var els = document.querySelectorAll(".reveal");
  if (els.length && !reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("is-in"); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
  // concept banner height -> CSS var (banner may wrap to two lines on small screens)
  var banner = document.querySelector(".concept-banner");
  function setBannerH() {
    if (banner) document.documentElement.style.setProperty("--banner-h", banner.offsetHeight + "px");
  }
  setBannerH();
  window.addEventListener("resize", setBannerH);

})();
