/* =========================================================
   UNDANGAN PERNIKAHAN DIGITAL — Arnol & Linda
   script.js
   ========================================================= */

/* ---------------------------------------------------------
   1) KONFIGURASI JSONBIN (ucapan/doa dari semua tamu)
   ---------------------------------------------------------
   Agar setiap ucapan yang dikirim tamu terlihat oleh SEMUA
   tamu lain (bukan hanya di HP masing-masing), buat 1 Bin
   di jsonbin.io yang dipakai bersama:

   1. Daftar / login di https://jsonbin.io
   2. Klik "Create Bin", isi nilai awal:  []
   3. Simpan, lalu salin "Bin ID" dan "X-Master-Key" (Secret Key)
      dari menu API Keys akun Anda.
   4. Tempel keduanya di bawah ini.
   5. (Opsional) Set bin ke "Public" agar GET tidak perlu key.

   Selama JSONBIN_BIN_ID / JSONBIN_API_KEY di bawah ini kosong,
   ucapan akan otomatis disimpan sementara di localStorage browser
   masing-masing (hanya terlihat di perangkat itu) sebagai fallback.
   Karena keduanya sudah diisi, ucapan sekarang tersimpan bersama
   di JSONBin dan bisa dilihat dari perangkat/browser mana pun.
------------------------------------------------------------ */
const JSONBIN_BIN_ID   = "6a6da7c2da38895dfeabb4ff";
const JSONBIN_API_KEY  = "$2a$10$nou5c3yZntdxwBqnGEEOvuCkZpg9GT4CfSp1IXgNhJpKQzhxI8NYO";
const JSONBIN_BASE     = "https://api.jsonbin.io/v3/b/";

const jsonbinReady = () =>
  Boolean(JSONBIN_BIN_ID && JSONBIN_BIN_ID.trim() && JSONBIN_API_KEY && JSONBIN_API_KEY.trim());

/* ---------------------------------------------------------
   2) TANGGAL & LOKASI ACARA
------------------------------------------------------------ */
// Akad / Pemberkatan Nikah — dipakai untuk hitung mundur
const AKAD_DATETIME = "2026-09-04T08:00:00+08:00"; // WITA

const LOKASI_AKAD    = "Gereja GMIT Sonaf Damai Haunobenak, Desa Haunobenak, Kolbano";
const LOKASI_RESEPSI = "Desa Haunobenak, Kecamatan Kolbano";

/* =========================================================
   HUJAN SALJU (dekoratif)
   ========================================================= */
(function initSnowfall(){
  let container = document.getElementById("snowfall");

  // Jaga-jaga: jika index.html yang dipakai belum memiliki elemen
  // #snowfall (versi lama), buat sendiri kontainernya di sini.
  if (!container){
    container = document.createElement("div");
    container.id = "snowfall";
    container.className = "snowfall";
    container.setAttribute("aria-hidden", "true");
    const stage = document.getElementById("stage") || document.body;
    stage.insertBefore(container, stage.firstChild);
  }

  const isSmallScreen = window.innerWidth < 480;
  const count = isSmallScreen ? 32 : 45;

  for (let i = 0; i < count; i++){
    const flake = document.createElement("div");
    flake.className = "snowflake";

    const size = (Math.random() * 4 + 2).toFixed(1);       // 2px - 6px
    const left = (Math.random() * 100).toFixed(1);          // 0% - 100%
    const duration = (Math.random() * 10 + 9).toFixed(1);    // 9s - 19s jatuh
    const swayDuration = (Math.random() * 3 + 2).toFixed(1); // 2s - 5s goyang
    const sway = (Math.random() * 14 + 6).toFixed(0);        // 6px - 20px
    const delay = (Math.random() * -20).toFixed(1);          // mulai acak, tidak serentak
    const opacity = (Math.random() * 0.5 + 0.35).toFixed(2); // 0.35 - 0.85

    flake.style.setProperty("--sf-size", `${size}px`);
    flake.style.setProperty("--sf-left", `${left}%`);
    flake.style.setProperty("--sf-duration", `${duration}s`);
    flake.style.setProperty("--sf-sway-duration", `${swayDuration}s`);
    flake.style.setProperty("--sf-sway", `${sway}px`);
    flake.style.setProperty("--sf-delay", `${delay}s`);
    flake.style.setProperty("--sf-opacity", opacity);

    const dot = document.createElement("span");
    dot.className = "flake-dot";
    flake.appendChild(dot);
    container.appendChild(flake);
  }
})();

/* =========================================================
   NAMA TAMU DARI QUERY PARAM (?to=Nama+Tamu)
   ========================================================= */
(function initGuestName(){
  const params = new URLSearchParams(window.location.search);
  const to = params.get("to");
  const el = document.getElementById("guest-name");
  if (to && el) {
    el.textContent = decodeURIComponent(to.replace(/\+/g, " "));
  }
})();

/* =========================================================
   LINK PETA LOKASI (Google Maps search)
   ========================================================= */
(function initMapLinks(){
  const akad = document.getElementById("map-akad");
  const resepsi = document.getElementById("map-resepsi");
  if (akad) akad.href = "https://www.google.com/maps/search/" + encodeURIComponent(LOKASI_AKAD);
  if (resepsi) resepsi.href = "https://www.google.com/maps/search/" + encodeURIComponent(LOKASI_RESEPSI);
})();

/* =========================================================
   OPENING SCREEN — TIRAI TERBUKA
   ========================================================= */
(function initOpening(){
  const btn = document.getElementById("btn-open");
  const opening = document.getElementById("opening");
  const curtain = document.getElementById("curtain");
  const navdots = document.getElementById("navdots");
  const musicToggle = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-audio");

  const FADE_MS = 500;     // durasi opening screen memudar
  const CURTAIN_MS = 1400; // durasi animasi tirai terbuka (samakan dengan CSS)

  btn.addEventListener("click", () => {
    btn.disabled = true;

    // Coba putar musik latar (dipicu oleh interaksi pengguna)
    audio.volume = 0.85;
    audio.play().then(() => {
      musicToggle.classList.add("playing");
    }).catch(() => {
      /* Autoplay diblokir browser — tamu bisa memutar manual */
    });

    // 1) Opening screen memudar, menampakkan tirai yang masih tertutup
    opening.classList.add("fade-out");

    setTimeout(() => {
      opening.classList.add("hidden");

      // 2) Tirai mulai terbuka
      curtain.classList.add("open");

      // 3) Setelah tirai selesai terbuka, tampilkan navigasi & lepas kunci scroll
      setTimeout(() => {
        curtain.classList.add("hidden");
        document.body.classList.remove("locked");
        navdots.classList.remove("hidden");
        musicToggle.classList.remove("hidden");
      }, CURTAIN_MS + 100);

    }, FADE_MS);
  });
})();

/* =========================================================
   TOMBOL MUSIK
   ========================================================= */
(function initMusicToggle(){
  const toggle = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-audio");

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => toggle.classList.add("playing"));
    } else {
      audio.pause();
      toggle.classList.remove("playing");
    }
  });
})();

/* =========================================================
   HITUNG MUNDUR (COUNTDOWN)
   ========================================================= */
(function initCountdown(){
  const target = new Date(AKAD_DATETIME).getTime();
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");

  function pad(n){ return String(n).padStart(2, "0"); }

  function tick(){
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0){
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMins.textContent = "00";
      elSecs.textContent = "00";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* =========================================================
   GALERI FOTO (Foto1.jpg ... Foto10.jpg) + LIGHTBOX
   ========================================================= */
(function initGallery(){
  const grid = document.getElementById("gallery-grid");
  const total = 10;
  const files = [];

  for (let i = 1; i <= total; i++){
    const src = `Foto${i}.jpg`;
    files.push(src);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.index = i - 1;
    btn.innerHTML = `<img src="${src}" alt="Momen kebersamaan Arnol & Linda ${i}" loading="lazy">`;
    grid.appendChild(btn);
  }

  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lb-image");
  const lbClose = document.getElementById("lb-close");
  const lbPrev = document.getElementById("lb-prev");
  const lbNext = document.getElementById("lb-next");
  let current = 0;

  function openLightbox(index){
    current = index;
    lbImage.src = files[current];
    lbImage.alt = `Momen kebersamaan Arnol & Linda ${current + 1}`;
    lightbox.classList.remove("hidden");
  }
  function closeLightbox(){ lightbox.classList.add("hidden"); }
  function step(delta){
    current = (current + delta + files.length) % files.length;
    lbImage.src = files[current];
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    openLightbox(Number(btn.dataset.index));
  });
  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", () => step(-1));
  lbNext.addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
})();

/* =========================================================
   NAVIGASI TITIK (scrollspy)
   ========================================================= */
(function initNavDots(){
  const dots = document.querySelectorAll(".navdots button");
  const sections = ["home","pengantin","acara","galeri","ucapan"]
    .map(id => document.getElementById(id));

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        dots.forEach(d => d.classList.toggle("active", d.dataset.target === entry.target.id));
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => { if (sec) observer.observe(sec); });
})();

/* =========================================================
   UCAPAN & DOA — via JSONBin (bersama semua tamu)
   ========================================================= */
(function initWishes(){
  const form = document.getElementById("wish-form");
  const nameInput = document.getElementById("wish-name");
  const statusInput = document.getElementById("wish-status");
  const messageInput = document.getElementById("wish-message");
  const submitBtn = document.getElementById("wish-submit");
  const list = document.getElementById("wish-list");

  const LOCAL_KEY = "undangan_arnol_linda_ucapan";

  function getLocalWishes(){
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; }
    catch { return []; }
  }
  function setLocalWishes(wishes){
    localStorage.setItem(LOCAL_KEY, JSON.stringify(wishes));
  }

  async function fetchWishes(){
    if (!jsonbinReady()) return getLocalWishes();

    const res = await fetch(JSONBIN_BASE + JSONBIN_BIN_ID + "/latest", {
      headers: { "X-Master-Key": JSONBIN_API_KEY }
    });
    if (!res.ok) throw new Error("Gagal memuat ucapan");
    const data = await res.json();
    return Array.isArray(data.record) ? data.record : [];
  }

  async function saveWishes(wishes){
    if (!jsonbinReady()) { setLocalWishes(wishes); return; }

    const res = await fetch(JSONBIN_BASE + JSONBIN_BIN_ID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY
      },
      body: JSON.stringify(wishes)
    });
    if (!res.ok) throw new Error("Gagal mengirim ucapan");
  }

  function escapeHtml(str){
    return str.replace(/[&<>"']/g, (c) => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[c]));
  }

  function renderWishes(wishes){
    if (!wishes.length){
      list.innerHTML = '<p class="wish-empty">Jadilah yang pertama mengirimkan ucapan &amp; doa.</p>';
      return;
    }
    list.innerHTML = wishes.slice().reverse().map(w => `
      <div class="wish-item">
        <span class="wish-name">${escapeHtml(w.name)}</span>
        <span class="wish-status">${escapeHtml(w.status)}</span>
        <p class="wish-msg">${escapeHtml(w.message)}</p>
      </div>
    `).join("");
  }

  async function loadWishes(){
    try {
      const wishes = await fetchWishes();
      renderWishes(wishes);
      return wishes;
    } catch (err){
      list.innerHTML = '<p class="wish-empty">Ucapan belum dapat dimuat. Coba muat ulang halaman.</p>';
      return [];
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newWish = {
      name: nameInput.value.trim(),
      status: statusInput.value,
      message: messageInput.value.trim(),
      time: new Date().toISOString()
    };
    if (!newWish.name || !newWish.status || !newWish.message) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";

    try {
      const current = await fetchWishes();
      current.push(newWish);
      await saveWishes(current);
      renderWishes(current);
      form.reset();
    } catch (err){
      alert("Maaf, ucapan gagal terkirim. Silakan coba lagi.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim Ucapan";
    }
  });

  loadWishes();
})();
