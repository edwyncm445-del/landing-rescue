/* Landing Rescue — main.js
   Mobile nav, header state, scroll reveals, live clock,
   package pre-selection and the enquiry form logic. */
(function () {
  "use strict";

  var CONFIG = window.LR_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header scroll state ---------- */
  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () {
      head.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      menu.classList.toggle("is-active", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
      }
    });
  }

  /* ---------- scroll reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- live UK clock (footer) ---------- */
  var clock = document.querySelector("[data-clock]");
  if (clock) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      });
    } catch (e) { fmt = null; }
    var tick = function () {
      var d = new Date();
      clock.textContent = fmt ? fmt.format(d) : d.toLocaleTimeString("en-GB");
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- package pre-selection ---------- */
  document.querySelectorAll("[data-package]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-package");
      var radio = document.querySelector('input[name="package"][value="' + value + '"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
      var target = document.getElementById("contact");
      if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      var first = document.getElementById("f-name");
      if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
    });
  });

  /* ---------- enquiry form ---------- */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var successPanel = document.getElementById("form-success");
  var email = CONFIG.contactEmail || "hello@landingrescue.co.uk";

  var validators = {
    "f-name": function (v) { return v.trim().length >= 2 || "Please tell us your name."; },
    "f-email": function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.";
    },
    "f-business": function (v) { return v.trim().length >= 2 || "Please tell us your business name."; },
    "f-url": function (v) {
      if (!v.trim()) return true; /* optional */
      try {
        var u = new URL(v.trim());
        return (u.protocol === "http:" || u.protocol === "https:") || "Please enter a full URL, e.g. https://yourbusiness.co.uk";
      } catch (e) {
        return "Please enter a full URL, e.g. https://yourbusiness.co.uk";
      }
    },
    "f-improve": function (v) { return v.trim().length >= 10 || "A sentence or two helps us scope the rescue (10+ characters)."; },
    "f-goal": function (v) { return v.trim().length >= 2 || "Please tell us your main goal."; }
  };

  var setFieldState = function (input, message) {
    var field = input.closest(".field");
    if (!field) return;
    var err = field.querySelector(".field-error");
    if (message === true || message == null) {
      field.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      if (err) err.textContent = "";
    } else {
      field.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      if (err) err.textContent = message;
    }
  };

  var validateInput = function (input) {
    var fn = validators[input.id];
    if (!fn) return true;
    var result = fn(input.value);
    setFieldState(input, result);
    return result === true;
  };

  Object.keys(validators).forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("blur", function () { validateInput(input); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validateInput(input);
    });
  });

  var setStatus = function (kind, message) {
    if (!status) return;
    status.className = "form-status" + (kind ? " is-" + kind : "");
    status.textContent = message || "";
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    setStatus("", "");

    var allValid = true;
    var firstBad = null;
    Object.keys(validators).forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      var ok = validateInput(input);
      if (!ok && !firstBad) firstBad = input;
      allValid = allValid && ok;
    });

    var pkg = form.querySelector('input[name="package"]:checked');
    if (!pkg) {
      allValid = false;
      setStatus("error", "Please choose a package — or pick “Not sure yet”.");
    }

    if (!allValid) {
      if (firstBad) firstBad.focus();
      return;
    }

    /* honeypot — silently drop bots */
    var hp = form.querySelector('input[name="website"]');
    if (hp && hp.value) { showSuccess(); return; }

    var endpoint = (CONFIG.enquiryEndpoint || "").trim();
    if (!endpoint) {
      /* Not connected: say so honestly, offer a mailto fallback. */
      var subject = encodeURIComponent("Website rescue enquiry — " + document.getElementById("f-business").value.trim());
      var body = encodeURIComponent(
        "Name: " + document.getElementById("f-name").value.trim() + "\n" +
        "Email: " + document.getElementById("f-email").value.trim() + "\n" +
        "Business: " + document.getElementById("f-business").value.trim() + "\n" +
        "Website: " + (document.getElementById("f-url").value.trim() || "—") + "\n" +
        "Package: " + (pkg ? pkg.value : "—") + "\n\n" +
        "What to improve:\n" + document.getElementById("f-improve").value.trim() + "\n\n" +
        "Main goal:\n" + document.getElementById("f-goal").value.trim()
      );
      setStatus("error", "");
      var mailP = document.getElementById("form-notconnected");
      if (mailP) {
        mailP.hidden = false;
        var mailA = mailP.querySelector("a");
        if (mailA) mailA.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
      }
      if (status) {
        status.className = "form-status";
        status.textContent = "This form isn't connected to an inbox yet — nothing has been sent. Use the email link below to reach us directly.";
      }
      return;
    }

    /* Connected: POST the enquiry as JSON. */
    form.classList.add("form-pending");
    setStatus("", "Sending your enquiry…");

    var data = {
      name: document.getElementById("f-name").value.trim(),
      email: document.getElementById("f-email").value.trim(),
      business: document.getElementById("f-business").value.trim(),
      website: document.getElementById("f-url").value.trim(),
      package: pkg ? pkg.value : "",
      improvements: document.getElementById("f-improve").value.trim(),
      goal: document.getElementById("f-goal").value.trim()
    };

    fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) {
      form.classList.remove("form-pending");
      if (res.ok) {
        showSuccess();
      } else {
        setStatus("error", "Something went wrong sending your enquiry (" + res.status + "). Please try again, or email " + email + ".");
      }
    }).catch(function () {
      form.classList.remove("form-pending");
      setStatus("error", "We couldn't reach the form service. Please try again, or email " + email + ".");
    });
  });

  function showSuccess() {
    form.hidden = true;
    if (successPanel) {
      successPanel.classList.add("is-visible");
      successPanel.setAttribute("tabindex", "-1");
      successPanel.focus();
    }
  }

  /* reset / send another */
  var again = document.getElementById("form-again");
  if (again) {
    again.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      if (successPanel) successPanel.classList.remove("is-visible");
      setStatus("", "");
      var first = document.getElementById("f-name");
      if (first) first.focus();
    });
  }
})();
