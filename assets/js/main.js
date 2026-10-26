/* ═══ Archana & Gokul · Wedding Invitation · main.js ═══ */
(function () {
  "use strict";

  /* ── Wedding date/time from the invitation card ──
     8 November 2026, muhurtham between 11:45 AM and 12:15 PM (Asia/Kolkata) */
  var WEDDING_ISO = "2026-11-08T11:45:00+05:30";
  var WEDDING_DATE = new Date(WEDDING_ISO);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (id) { return document.getElementById(id); };

  /* ── Opening screen ── */
  var opening = $("opening");
  var page = $("page");
  var soundToggle = $("soundToggle");

  function openInvitation() {
    if (!opening || opening.classList.contains("closing-anim")) return;
    opening.classList.add("closing-anim");
    page.hidden = false;
    requestAnimationFrame(function () { page.classList.add("is-visible"); });
    soundToggle.hidden = false;
    setTimeout(function () { opening.remove(); }, 1200);
    window.dispatchEvent(new Event("page-opened"));
  }
  var openBtn = $("openInvitation");
  if (openBtn) openBtn.addEventListener("click", openInvitation);
  if (opening) {
    opening.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvitation(); }
    });
  }

  /* ── Countdown (Asia/Kolkata encoded in the ISO string) ── */
  var cdDays = $("cdDays"), cdHours = $("cdHours"), cdMins = $("cdMins"), cdSecs = $("cdSecs"), cdDone = $("cdDone");
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    if (!cdDays) return;
    var diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) {
      document.querySelector(".countdown").hidden = true;
      cdDone.hidden = false;
      return;
    }
    var s = Math.floor(diff / 1000);
    cdDays.textContent = pad(Math.floor(s / 86400));
    cdHours.textContent = pad(Math.floor((s % 86400) / 3600));
    cdMins.textContent = pad(Math.floor((s % 3600) / 60));
    cdSecs.textContent = pad(s % 60);
  }
  if (cdDays) { tick(); setInterval(tick, 1000); }

  /* ── Pre-wedding film ── */
  var frame = $("filmFrame"), film = $("filmVideo"), playBtn = $("filmPlay"), pauseBtn = $("filmPause");
  if (film && frame) {
    playBtn.addEventListener("click", function () {
      frame.classList.add("is-playing");
      var p = film.play();
      if (p && p.catch) p.catch(function () { frame.classList.remove("is-playing"); });
    });
    pauseBtn.addEventListener("click", function () {
      film.pause();
      frame.classList.remove("is-playing");
    });
    film.addEventListener("ended", function () { frame.classList.remove("is-playing"); });
    film.addEventListener("error", function () {
      frame.innerHTML = '<p style="color:#faf6ef;padding:2rem;text-align:center">The film could not be played here. <a style="color:#e6c98f" href="assets/video/prewedding-film.mp4">Download it instead</a>.</p>';
    });
  }

  /* ── Lightbox gallery ── */
  var galleryImgs = [
    { src: "assets/img/hero.webp", alt: "Archana and Gokul beneath the stone pavilion, wide view" },
    { src: "assets/img/walk.webp", alt: "Walking hand in hand toward the pavilion" },
    { src: "assets/img/lean.webp", alt: "Leaning together on the pavilion plinth" },
    { src: "assets/img/steps-gaze.webp", alt: "Seated on the steps, gazing at each other" },
    { src: "assets/img/closeup.webp", alt: "A joyful close-up of the couple" },
    { src: "assets/img/chin.webp", alt: "A tender moment between the couple" },
    { src: "assets/img/plinth.webp", alt: "The couple on the pavilion plinth" },
    { src: "assets/img/lowangle.webp", alt: "Low-angle view of the pavilion and the couple" },
    { src: "assets/img/dance-bw.webp", alt: "Dancing beneath the arches, in black and white" },
    { src: "assets/img/silhouette.webp", alt: "Dancing in silhouette inside the pavilion" },
    { src: "assets/img/steps-casual.webp", alt: "Relaxed together on the pavilion steps" }
  ];
  var lightbox = $("lightbox"), lbImg = $("lbImg"), lbCount = $("lbCount");
  var lbIndex = 0, lastFocus = null;

  function showLb(i) {
    lbIndex = (i + galleryImgs.length) % galleryImgs.length;
    var item = galleryImgs[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCount.textContent = (lbIndex + 1) + " / " + galleryImgs.length;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    showLb(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    $("lbClose").focus();
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  Array.prototype.forEach.call(document.querySelectorAll(".g-item"), function (btn) {
    btn.addEventListener("click", function () { openLb(parseInt(btn.dataset.index, 10) || 0); });
  });
  $("lbClose").addEventListener("click", closeLb);
  $("lbPrev").addEventListener("click", function () { showLb(lbIndex - 1); });
  $("lbNext").addEventListener("click", function () { showLb(lbIndex + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  lightbox.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") showLb(lbIndex - 1);
    if (e.key === "ArrowRight") showLb(lbIndex + 1);
  });
  /* touch swipe */
  var touchX = null;
  lightbox.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) showLb(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* ── Invitation card viewer ── */
  var cardViewer = $("cardViewer");
  $("openCard").addEventListener("click", function () {
    lastFocus = document.activeElement;
    cardViewer.hidden = false;
    document.body.style.overflow = "hidden";
    $("cardClose").focus();
  });
  $("cardClose").addEventListener("click", function () {
    cardViewer.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  });
  cardViewer.addEventListener("click", function (e) { if (e.target === cardViewer) $("cardClose").click(); });

  /* global escape for both dialogs */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!lightbox.hidden) closeLb();
    if (!cardViewer.hidden) $("cardClose").click();
  });

  /* ── Toast ── */
  var toast = $("toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(function () { toast.hidden = true; }, 3200);
  }

  /* ── Share invitation ── */
  $("shareBtn").addEventListener("click", function () {
    var shareData = {
      title: "Archana & Gokul — Wedding Invitation",
      text: "Join us for the wedding of Archana & Gokul — Sunday, 8 November 2026, NSS Karayogam Hall, Chirakkadavu East.",
      url: location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareData.text + " " + shareData.url).then(function () {
        showToast("Invitation link copied ✓");
      }, function () { showToast("Could not copy — please copy the address bar link."); });
    } else {
      showToast("Copy this page's link to share the invitation.");
    }
  });

  /* ── Replay film from the closing section ── */
  $("replayBtn").addEventListener("click", function () {
    var target = $("film");
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setTimeout(function () {
      if (film && !frame.classList.contains("is-playing")) playBtn.click();
    }, reduceMotion ? 100 : 900);
  });

  /* ── RSVP via WhatsApp (no backend; nothing is stored) ── */
  var PHONE = "919400719579";
  var rsvpForm = $("rsvpForm");
  rsvpForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("rsvpName").value.trim();
    var guests = parseInt($("rsvpGuests").value, 10);
    var err = $("rsvpError");
    if (!name || !guests || guests < 1 || guests > 20) {
      err.hidden = false;
      return;
    }
    err.hidden = true;
    var attending = rsvpForm.querySelector('input[name="attending"]:checked').value;
    var note = $("rsvpNote").value.trim();
    var msg =
      "Namaskaram 🙏 RSVP for Archana & Gokul's wedding (8 Nov 2026)\n" +
      "Name: " + name + "\n" +
      "Guests: " + guests + "\n" +
      "Attendance: " + attending +
      (note ? "\nNote: " + note : "");
    var url = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
    showToast("Opening WhatsApp with your reply…");
  });

  /* ── Ambient music toggle (only starts on user tap; silent until audio exists) ── */
  var audio = null;
  soundToggle.addEventListener("click", function () {
    if (!audio) {
      audio = new Audio("assets/audio/ambient.mp3");
      audio.loop = true;
      audio.volume = 0.5;
    }
    if (soundToggle.getAttribute("aria-pressed") === "true") {
      audio.pause();
      soundToggle.setAttribute("aria-pressed", "false");
      soundToggle.setAttribute("aria-label", "Play ambient music");
    } else {
      audio.play().then(function () {
        soundToggle.setAttribute("aria-pressed", "true");
        soundToggle.setAttribute("aria-label", "Pause ambient music");
      }).catch(function () {
        showToast("Music will be available at the venue ♪");
      });
    }
  });

  /* ── Scroll reveal ── */
  var revealEls = document.querySelectorAll(".page .reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
})();
