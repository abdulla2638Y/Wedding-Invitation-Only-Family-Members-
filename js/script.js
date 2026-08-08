document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  // Basic content
  $("heroNames").innerHTML = `${INVITATION.bride.name} <span>&amp;</span> ${INVITATION.groom.name}`;
  $("footerNames").textContent = `${INVITATION.bride.name} & ${INVITATION.groom.name}`;
  $("heroDate").textContent = INVITATION.displayDate;
  $("brideName").textContent = INVITATION.bride.name;
  $("groomName").textContent = INVITATION.groom.name;
  $("brideCardName").textContent = INVITATION.bride.name;
  $("groomCardName").textContent = INVITATION.groom.name;
  $("brideRelation").textContent = INVITATION.bride.relation;
  $("groomRelation").textContent = INVITATION.groom.relation;
  $("bridePhoto").src = INVITATION.bride.photo;
  $("groomPhoto").src = INVITATION.groom.photo;
  $("introText").textContent = INVITATION.intro;
  $("venueName").textContent = INVITATION.venue.name;
  $("venueAddress").textContent = INVITATION.venue.address;
  $("mapBtn").href = INVITATION.venue.maps;
  $("year").textContent = new Date().getFullYear();

  // Monogram
  $("monogram").textContent =
    `${INVITATION.bride.name[0]} & ${INVITATION.groom.name[0]}`;

  // Events
  const eventsList = $("eventsList");
  INVITATION.events.forEach(event => {
    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-icon">${event.icon}</div>
      <h3>${event.title}</h3>
      <p class="event-meta">${event.date} • ${event.time}</p>
      <p><strong>${event.venue}</strong></p>
      <p>${event.note}</p>
    `;
    eventsList.appendChild(card);
  });

  // Gallery
  const gallery = $("gallery");
  INVITATION.gallery.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `Wedding memory ${index + 1}`;
    img.loading = "lazy";
    gallery.appendChild(img);
  });

  // WhatsApp
  const waText = encodeURIComponent(INVITATION.whatsappMessage);
  $("whatsappBtn").href =
    `https://wa.me/${INVITATION.whatsappNumber}?text=${waText}`;

  // Countdown
  const target = new Date(INVITATION.date).getTime();
  function updateCountdown() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    $("days").textContent = String(days).padStart(2, "0");
    $("hours").textContent = String(hours).padStart(2, "0");
    $("minutes").textContent = String(minutes).padStart(2, "0");
    $("seconds").textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scratch/reveal canvas
  const canvas = $("scratchCanvas");
  const ctx = canvas.getContext("2d");
  let scratching = false;
  let revealed = false;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#d2ad68");
    gradient.addColorStop(.5, "#a87837");
    gradient.addColorStop(1, "#e1c485");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(65,30,10,.22)";
    ctx.font = "600 12px Montserrat, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2);
    ctx.font = "28px serif";
    ctx.fillText("✦", rect.width / 2, rect.height / 2 - 28);
    revealed = false;
  }

  function scratch(e) {
    if (revealed) return;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
  }

  function checkReveal() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 40) transparent++;
    }
    const ratio = transparent / (pixels.length / 4);
    if (ratio > 0.48) {
      revealed = true;
      canvas.style.opacity = "0";
      canvas.style.pointerEvents = "none";
    }
  }

  canvas.addEventListener("mousedown", () => scratching = true);
  window.addEventListener("mouseup", () => scratching = false);
  canvas.addEventListener("mousemove", e => { if (scratching) scratch(e); });
  canvas.addEventListener("touchstart", e => { scratching = true; scratch(e); }, {passive:true});
  canvas.addEventListener("touchmove", e => { if (scratching) scratch(e); }, {passive:true});
  canvas.addEventListener("touchend", () => scratching = false);
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  $("openInvite").addEventListener("click", () => {
    canvas.style.opacity = "0";
    canvas.style.pointerEvents = "none";
    $("home").scrollIntoView({behavior: "smooth"});
  });

  // Music
  const audio = $("weddingMusic");
  const musicBtn = $("musicBtn");
  let musicStarted = false;

  musicBtn.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        musicStarted = true;
        musicBtn.classList.add("playing");
        musicBtn.textContent = "❚❚";
      } else {
        audio.pause();
        musicBtn.classList.remove("playing");
        musicBtn.textContent = "♫";
      }
    } catch {
      alert("Add your MP3 file as assets/music/wedding-music.mp3 first.");
    }
  });

  // Share
  $("shareBtn").addEventListener("click", async () => {
    const shareData = {
      title: `${INVITATION.bride.name} & ${INVITATION.groom.name} — Wedding Invitation`,
      text: INVITATION.whatsappMessage,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Invitation link copied!");
      } catch {
        alert("Copy this page URL and share it on WhatsApp.");
      }
    }
  });

  // Reveal sections on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, {threshold: .12});

  document.querySelectorAll(".hidden-section").forEach(section => observer.observe(section));

  // Loader
  setTimeout(() => $("loader").classList.add("hide"), 500);
});
