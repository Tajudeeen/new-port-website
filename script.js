(function () {
  /* ── Navbar scroll ── */
  const navbar = document.getElementById("navbar");
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    },
    { passive: true },
  );

  /* ── Mobile nav ── */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("nav-mobile");
  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileNav.classList.remove("open"));
  });

  /* ── Active nav link ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a, .nav-mobile a");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + entry.target.id,
            );
          });
        }
      });
    },
    { threshold: 0.4 },
  );
  sections.forEach((s) => observer.observe(s));

  /* ── Reveal on scroll ── */
  const reveals = document.querySelectorAll(".reveal");
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  reveals.forEach((el) => revealObs.observe(el));

  /* ── Skill bar animation ── */
  const skillFills = document.querySelectorAll(".skill-fill");
  const skillObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width = target.getAttribute("data-width");
          setTimeout(() => {
            target.style.width = width + "%";
          }, 200);
          skillObs.unobserve(target);
        }
      });
    },
    { threshold: 0.5 },
  );
  skillFills.forEach((el) => skillObs.observe(el));

  /* ── Contact form ── */
  const submitBtn = document.getElementById("form-submit");
  submitBtn.addEventListener("click", () => {
    const fname = document.getElementById("fname").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!fname || !email || !message) {
      submitBtn.textContent = "Please fill in required fields";
      submitBtn.style.background = "rgba(239,68,68,0.3)";
      setTimeout(() => {
        submitBtn.textContent = "Send Message →";
        submitBtn.style.background = "";
      }, 2500);
      return;
    }
    submitBtn.textContent = "Message Sent ✓";
    submitBtn.style.background = "linear-gradient(135deg, #059669, #34d399)";
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = "Send Message →";
      submitBtn.style.background = "";
      submitBtn.disabled = false;
      ["fname", "lname", "email", "subject", "message"].forEach((id) => {
        document.getElementById(id).value = "";
      });
    }, 3500);
  });

  /* ── Smooth hash nav ── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#") return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
