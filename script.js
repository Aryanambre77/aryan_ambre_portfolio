document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  
  // Preloader timeline
  gsap.to(".progress-bar", {
    width: "100%",
    duration: prefersReduced ? 0.1 : 2,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(".preloader", {
        opacity: 0,
        scale: 0.9,
        duration: prefersReduced ? 0.2 : 1,
        ease: "power2.inOut",
        onComplete: () => {
          const preloader = document.querySelector(".preloader");
          if (preloader) preloader.style.display = "none";
          gsap.from(".reveal-on-load, main, header", {
            opacity: 0,
            y: 30,
            filter: "blur(6px)",
            duration: prefersReduced ? 0.2 : 1,
            stagger: 0.08,
            ease: "power3.out"
          });
        }
      });
    }
  });

  // Locomotive Scroll
  const scrollContainer = document.querySelector("#scroll-container");
  const loco = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    multiplier: 1.05,
    lerp: 0.08
  });

  loco.on("scroll", ScrollTrigger.update);
  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      return arguments.length ? loco.scrollTo(value, { duration: 0, disableLerp: true }) : loco.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: scrollContainer.style.transform ? "transform" : "fixed"
  });

  ScrollTrigger.addEventListener("refresh", () => loco.update());
  ScrollTrigger.refresh();

  // Smooth anchor navigation
  const scrollLinks = document.querySelectorAll("[data-scroll-to]");
  scrollLinks.forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        loco.scrollTo(targetId, { offset: -80, duration: prefersReduced ? 0 : 800 });
        if (typeof mobileDrawer !== "undefined" && mobileDrawer) {
          mobileDrawer.classList.remove("open");
        }
      }
    });
  });

  // Mobile drawer
  const navToggle = document.querySelector(".nav-toggle");
  const mobileDrawer = document.querySelector(".mobile-drawer");
  const drawerClose = document.querySelector(".drawer-close");
  if (mobileDrawer && navToggle && drawerClose) {
    navToggle.addEventListener("click", () => mobileDrawer.classList.add("open"));
    drawerClose.addEventListener("click", () => mobileDrawer.classList.remove("open"));
  }

  // Active nav state
  document.querySelectorAll("section[id]").forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      scroller: scrollContainer,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActiveNav(section.id),
      onEnterBack: () => setActiveNav(section.id)
    });
  });

  function setActiveNav(id) {
    document.querySelectorAll(".nav-links a").forEach(a => {
      a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`);
    });
  }

  // Hero animations
  gsap.fromTo(".hero-title", { opacity: 0, y: 50, filter: "blur(10px)" }, {
    opacity: 1,
    y: 0,
    filter: "blur(0)",
    duration: prefersReduced ? 0.3 : 1.1,
    ease: "power3.out"
  });
  gsap.from(".hero-cta", {
    opacity: 0,
    y: 24,
    duration: prefersReduced ? 0.2 : 0.8,
    delay: 0.2,
    ease: "power2.out",
    stagger: 0.05
  });

  // Hover pulse for CTAs
  const ctas = document.querySelectorAll(".btn-primary");
  ctas.forEach(btn => {
    btn.addEventListener("mouseenter", () => gsap.to(btn, { scale: 1.04, duration: 0.2 }));
    btn.addEventListener("mouseleave", () => gsap.to(btn, { scale: 1.0, duration: 0.2 }));
  });

  // Floating background elements
  gsap.to(".glow-orb", { y: -20, duration: 3, repeat: -1, yoyo: true, ease: "power1.inOut" });

  // About reveal
  gsap.from(".about-wrap", {
    scrollTrigger: { trigger: ".about", scroller: scrollContainer, start: "top 75%" },
    opacity: 0,
    y: 40,
    filter: "blur(8px)",
    duration: prefersReduced ? 0.2 : 1
  });
  gsap.from(".skill-icon", {
    scrollTrigger: { trigger: ".skills", scroller: scrollContainer, start: "top 80%" },
    opacity: 0,
    y: 24,
    stagger: 0.06,
    duration: prefersReduced ? 0.15 : 0.6
  });

  // Experience reveal
  gsap.utils.toArray(".exp-item").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, scroller: scrollContainer, start: "top 85%" },
      opacity: 0,
      y: 40,
      filter: "blur(8px)",
      duration: prefersReduced ? 0.15 : 0.7,
      delay: i * 0.05
    });
  });

  // Education reveal
  gsap.utils.toArray(".edu-item").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, scroller: scrollContainer, start: "top 85%" },
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
      duration: prefersReduced ? 0.2 : 0.8,
      delay: i * 0.05
    });
  });

  // Projects
  gsap.from(".project-card", {
    scrollTrigger: { trigger: ".projects", scroller: scrollContainer, start: "top 70%" },
    opacity: 0,
    y: 40,
    scale: 0.96,
    stagger: 0.08,
    ease: "power2.out",
    duration: prefersReduced ? 0.2 : 0.7
  });

  const projectStrip = document.querySelector(".project-strip");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");

const scrollAmount = 400; 

rightBtn.addEventListener("click", () => {
  projectStrip.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

leftBtn.addEventListener("click", () => {
  projectStrip.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

function updateArrowVisibility() {
  const maxScroll = projectStrip.scrollWidth - projectStrip.clientWidth;
  leftBtn.style.opacity = projectStrip.scrollLeft <= 0 ? "0.3" : "1";
  rightBtn.style.opacity = projectStrip.scrollLeft >= maxScroll - 1 ? "0.3" : "1";
}

projectStrip.addEventListener("scroll", updateArrowVisibility);
window.addEventListener("resize", updateArrowVisibility);
updateArrowVisibility();
  
  // Certifications
  gsap.from(".cert-item", {
    scrollTrigger: { trigger: ".certifications", scroller: scrollContainer, start: "top 80%" },
    opacity: 0,
    y: 30,
    filter: "blur(6px)",
    stagger: 0.05,
    duration: prefersReduced ? 0.2 : 0.6
  });

    // // Contact inputs
    // gsap.from(".contact .input, .contact .textarea", {
    //   scrollTrigger: { trigger: ".contact", scroller: scrollContainer, start: "top 75%" },
    //   opacity: 0,
    //   x: -30,
    //   stagger: 0.06
    // });

    // // Project card click
    // document.querySelectorAll(".project-card[data-link]").forEach(card => {
    //   card.addEventListener("click", () => {
    //     const url = card.getAttribute("data-link");
    //     if (url) window.open(url, "_blank", "noreferrer");
    //   });
    // });

    // // Contact form (send via EmailJS)
    // const form = document.querySelector("#contact-form");
    // const feedback = document.querySelector(".form-feedback");

    // // Initialize EmailJS if available (replace 'YOUR_USER_ID' with the actual user id)
    // try {
    //   if (window.emailjs) {
    //     emailjs.init("YOUR_EMAILJS_USER_ID"); // <-- replace this with your EmailJS user ID
    //   }
    // } catch (err) {
    //   // ignore if SDK not loaded
    // }

    // // Contact form submit — send via Formspree (form action already configured)
    // form?.addEventListener("submit", (e) => {
    //   e.preventDefault();
    //   const name = String(form.querySelector('input[name="name"]').value || "").trim();
    //   const email = String(form.querySelector('input[name="email"]').value || "").trim();
    //   const message = String(form.querySelector('textarea[name="message"]').value || "").trim();
      
    //   if (!name || !email || !message) {
    //     feedback.textContent = "Please fill all fields.";
    //     return;
    //   }

    //   feedback.textContent = "Sending message...";

    //   // Submit form to Formspree via fetch
    //   const formData = new FormData(form);
    //   fetch(form.getAttribute('action'), {
    //     method: 'POST',
    //     body: formData,
    //     headers: {
    //       'Accept': 'application/json'
    //     }
    //   })
    //   .then(response => {
    //     if (response.ok) {
    //       feedback.textContent = 'Message sent — thank you!';
    //       gsap.fromTo(feedback, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    //       form.reset();
    //     } else {
    //       feedback.textContent = 'Failed to send. Please try again.';
    //     }
    //   })
    //   .catch(err => {
    //     console.error('Form submission error:', err);
    //     feedback.textContent = 'Error sending message. Please try again.';
    //   });
    // });

    // Inputs animation (kept)
gsap.from(".contact .input, .contact .textarea", {
  scrollTrigger: { trigger: ".contact", scroller: scrollContainer, start: "top 75%" },
  opacity: 0,
  x: -30,
  stagger: 0.06
});

// Project card click (kept)
document.querySelectorAll(".project-card[data-link]").forEach(card => {
  card.addEventListener("click", () => {
    const url = card.getAttribute("data-link");
    if (url) window.open(url, "_blank", "noreferrer");
  });
});

// Contact form submit — Formspree
const form = document.querySelector("#contact-form");
const feedback = document.querySelector(".form-feedback");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  if (!name || !email || !message) {
    feedback.textContent = "Please fill all fields.";
    return;
  }

  feedback.textContent = "Sending message...";
  try {
    const res = await fetch(form.action, { method: "POST", body: fd, headers: { Accept: "application/json" } });
    if (res.ok) {
      feedback.textContent = "Message sent — thank you!";
      gsap.fromTo(feedback, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
      form.reset();
    } else {
      feedback.textContent = "Failed to send. Please try again.";
    }
  } catch (err) {
    console.error("Form submission error:", err);
    feedback.textContent = "Error sending message. Please try again.";
  }
});

/* ===== Cursor-reactive lighting on the right meta panel ===== */
const meta = document.getElementById("contactMeta");
if (meta) {
  const setPos = (e) => {
    const r = meta.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - r.left, r.width));
    const y = Math.max(0, Math.min(e.clientY - r.top, r.height));
    meta.style.setProperty("--mx", x + "px");
    meta.style.setProperty("--my", y + "px");
  };
  meta.addEventListener("pointermove", setPos);
  meta.addEventListener("pointerenter", setPos);
}

/* ===== Rotating micro-tagline (optional) ===== */
(() => {
  const el = document.getElementById("microTagline");
  if (!el) return;
  const quotes = [
    "Turning raw data into real insights.",
    "Always building, always visualizing.",
    "Let’s make numbers tell stories."
  ];
  let i = 0;
  setInterval(() => {
    gsap.to(el, { opacity: 0, y: 6, duration: 0.25, onComplete: () => {
      i = (i + 1) % quotes.length;
      el.textContent = quotes[i];
      gsap.to(el, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
    }});
  }, 4200);
})();

// Animate the signature text (Aryan Ambre)
gsap.fromTo("#signatureName",
  { opacity: 0, scale: 0.9, y: 20 },
  { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.8 }
);

  });

