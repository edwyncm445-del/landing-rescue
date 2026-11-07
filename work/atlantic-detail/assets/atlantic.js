/* Atlantic Detail — concept site interactions */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var head = document.querySelector(".ad-head");
  if (head) {
    var onScroll = function () { head.classList.toggle("is-scrolled", window.scrollY > 30); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var toggle = document.querySelector(".ad-toggle");
  var menu = document.querySelector(".ad-menu");
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

  /* service pre-selection */
  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var sel = document.getElementById("ad-service");
      if (sel) sel.value = link.getAttribute("data-service");
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

  /* demo booking form */
  var form = document.getElementById("ad-form");
  if (form) {
    var status = document.getElementById("ad-status");
    var demo = document.getElementById("ad-demo");
    var checks = {
      "ad-name": function (v) { return v.trim().length >= 2 || "Please tell us your name."; },
      "ad-email": function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.";
      },
      "ad-vehicle": function (v) { return v.trim().length >= 3 || "What do you drive?"; },
      "ad-service": function (v) { return v !== "" || "Please choose a service."; },
      "ad-msg": function (v) { return v.trim().length >= 10 || "A sentence or two helps us scope the work."; }
    };
    var setState = function (input, msg) {
      var f = input.closest(".ad-field");
      var err = f.querySelector(".ad-field-error");
      if (msg === true) {
        f.classList.remove("has-error");
        input.removeAttribute("aria-invalid");
        if (err) err.textContent = "";
      } else {
        f.classList.add("has-error");
        input.setAttribute("aria-invalid", "true");
        if (err) err.textContent = msg;
      }
    };
    Object.keys(checks).forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      input.addEventListener("blur", function () { setState(input, checks[id](input.value)); });
      input.addEventListener("input", function () {
        if (input.closest(".ad-field").classList.contains("has-error")) setState(input, checks[id](input.value));
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      Object.keys(checks).forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        var r = checks[id](input.value);
        setState(input, r);
        if (r !== true) { ok = false; if (!firstBad) firstBad = input; }
      });
      if (!ok) {
        if (status) { status.className = "ad-status is-error"; status.textContent = "A couple of fields need attention."; }
        if (firstBad) firstBad.focus();
        return;
      }
      form.hidden = true;
      if (status) { status.className = "ad-status"; status.textContent = ""; }
      if (demo) {
        demo.classList.add("is-visible");
        demo.focus();
      }
    });
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
