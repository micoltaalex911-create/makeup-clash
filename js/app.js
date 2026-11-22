// js/app.js - Makeup Clash Completo: Sonido Web Audio, Temporizador, Capas y 10 Rivales
document.addEventListener("DOMContentLoaded", () => {
  const screenEstudio = document.getElementById("screen-estudio");
  const screenBatalla = document.getElementById("screen-batalla");
  const navTabs = document.querySelectorAll(".nav-tab");
  const startBattleBtn = document.getElementById("start-battle-btn");
  const backToStudioBtn = document.getElementById("back-to-studio-btn");

  const hudCoins = document.getElementById("hud-coins");
  const hudGems = document.getElementById("hud-gems");
  const hudStars = document.getElementById("hud-stars");
  const hudLevel = document.getElementById("hud-level");
  const trophyProgressText = document.getElementById("trophy-progress-text");

  // ==================== MOTOR DE SONIDO + MÚSICA ESTILO FINAL DE NIVEL ====================
  const SoundEngine = (() => {
    let ctx = null;
    let bgmTimer = null;
    let stepIndex = 0;

    // Melodía alegre y ascendente estilo final de nivel / celebración retro
    const victoryLoopNotes = [
      { freq: 392.00, dur: 0.14 }, // G4
      { freq: 523.25, dur: 0.14 }, // C5
      { freq: 659.25, dur: 0.14 }, // E5
      { freq: 783.99, dur: 0.22 }, // G5
      { freq: 659.25, dur: 0.14 }, // E5
      { freq: 783.99, dur: 0.28 }, // G5
      { freq: 587.33, dur: 0.14 }, // D5
      { freq: 698.46, dur: 0.14 }, // F5
      { freq: 880.00, dur: 0.14 }, // A5
      { freq: 1046.50, dur: 0.26 }, // C6
      { freq: 880.00, dur: 0.14 }, // A5
      { freq: 783.99, dur: 0.28 }  // G5
    ];

    function getContext() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) ctx = new AudioCtx();
      }
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
      return ctx;
    }

    function playTone(freq, type, duration, delay = 0, volume = 0.14) {
      if (!gameState.soundOn) return;
      const audioCtx = getContext();
      if (!audioCtx) return;

      const now = audioCtx.currentTime + delay;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    function startBackgroundMusic() {
      if (!gameState.soundOn) return;
      const audioCtx = getContext();
      if (!audioCtx || bgmTimer) return;

      bgmTimer = setInterval(() => {
        if (!gameState.soundOn) {
          stopBackgroundMusic();
          return;
        }
        const note = victoryLoopNotes[stepIndex % victoryLoopNotes.length];
        playTone(note.freq, "square", note.dur, 0, 0.022);
        playTone(note.freq / 2, "triangle", note.dur * 1.1, 0, 0.03);
        stepIndex += 1;
      }, 240);
    }

    function stopBackgroundMusic() {
      if (bgmTimer) {
        clearInterval(bgmTimer);
        bgmTimer = null;
      }
    }

    return {
      ensureMusic() {
        if (gameState.soundOn) startBackgroundMusic();
      },
      toggleMusic() {
        if (gameState.soundOn) {
          startBackgroundMusic();
        } else {
          stopBackgroundMusic();
        }
      },
      click() {
        this.ensureMusic();
        playTone(620, "sine", 0.09, 0, 0.1);
      },
      sparkle() {
        this.ensureMusic();
        playTone(784, "triangle", 0.14, 0, 0.12);
        playTone(1046.5, "sine", 0.18, 0.06, 0.12);
        playTone(1318.5, "sine", 0.24, 0.12, 0.1);
      },
      hair() {
        this.ensureMusic();
        playTone(440, "sine", 0.12, 0, 0.12);
        playTone(659.25, "triangle", 0.18, 0.06, 0.12);
      },
      clean() {
        this.ensureMusic();
        playTone(520, "sine", 0.1, 0, 0.1);
        playTone(360, "sine", 0.15, 0.06, 0.1);
      },
      tick() {
        playTone(880, "sine", 0.05, 0, 0.06);
      },
      win() {
        this.ensureMusic();
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((n, i) => playTone(n, "triangle", 0.25, i * 0.1, 0.16));
      },
      lose() {
        this.ensureMusic();
        playTone(440, "sawtooth", 0.2, 0, 0.08);
        playTone(349.23, "sawtooth", 0.3, 0.16, 0.08);
      }
    };
  })();

  // ==================== PARTÍCULAS VISUALES ====================
  function spawnSparkles(x, y, symbol = "✨") {
    const fxLayer = document.getElementById("fx-layer");
    if (!fxLayer) return;
    const symbols = [symbol, "💖", "⭐", "✨"];
    for (let i = 0; i < 5; i++) {
      const el = document.createElement("span");
      el.className = "fx-sparkle";
      el.textContent = symbols[i % symbols.length];
      el.style.left = `${x + (Math.random() * 50 - 25)}px`;
      el.style.top = `${y + (Math.random() * 30 - 15)}px`;
      fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }

  // ==================== PEINADOS (RUTAS EXACTAS DE ASSETS) ====================
  const hairConfigs = [
    {
      item: "pelo-10",
      label: "Estilo 1",
      gain: 0.8,
      candidates: [
        "assets/pelo(10)_transparente_v2.png",
        "assets/pelo%20(10)_transparente_v2.png",
        "assets/pelo(10)_transparente.png",
        "assets/pelo(10).png"
      ]
    },
    {
      item: "pelo-11",
      label: "Estilo 2",
      gain: 0.8,
      candidates: [
        "assets/pelo(11)_transparente_v2.png.jpeg",
        "assets/pelo%20(11)_transparente_v2.png.jpeg",
        "assets/pelo(11)_transparente_v2.png"
      ]
    },
    {
      item: "pelo-12",
      label: "Estilo 3",
      gain: 0.8,
      candidates: [
        "assets/pelo(12)_transparente.png",
        "assets/pelo%20(12)_transparente.png",
        "assets/pelo(12)_transparente_v2.png"
      ]
    },
    {
      item: "pelo-13",
      label: "Estilo 4",
      gain: 0.8,
      candidates: [
        "assets/pelo(13)_transparente_v2.png.jpeg",
        "assets/pelo%20(13)_transparente_v2.png.jpeg",
        "assets/pelo(13)_transparente_v2.png"
      ]
    },
    {
      item: "pelo-14",
      label: "Estilo 5",
      gain: 0.8,
      candidates: [
        "assets/pelo(30)_transparente_v2.png.jpeg",
        "assets/pelo%20(30)_transparente_v2.png.jpeg",
        "assets/pelo(14)_transparente_v2.png",
        "assets/pelo(14)_transparente.png",
        "assets/pelo(14).png"
      ]
    },
    {
      item: "pelo-15",
      label: "Estilo 6",
      gain: 0.8,
      candidates: [
        "assets/pelo(15)_transparente_v2.png.jpeg",
        "assets/pelo(15)_transparente.png.jpeg",
        "assets/pelo%20(15)_transparente_v2.png.jpeg",
        "assets/pelo(15)_transparente_v2.png"
      ]
    },
    {
      item: "pelo-16",
      label: "Estilo 7",
      gain: 0.9,
      candidates: [
        "assets/pelo(16)_transparente.png",
        "assets/pelo%20(16)_transparente.png",
        "assets/pelo(16)_transparente_v2.png"
      ]
    },
    {
      item: "pelo-17",
      label: "Estilo 8",
      gain: 0.9,
      candidates: [
        "assets/pelo(17)_transparente_v2.png",
        "assets/pelo(17)_transparente.png",
        "assets/pelo%20(17)_transparente_v2.png"
      ]
    },
    {
      item: "pelo-18",
      label: "Estilo 9",
      gain: 0.9,
      candidates: [
        "assets/pelo(18)_transparente.png",
        "assets/pelo%20(18)_transparente.png",
        "assets/pelo(18)_transparente_v2.png"
      ]
    },
    {
      item: "pelo-19",
      label: "Estilo 10",
      gain: 0.9,
      candidates: [
        "assets/pelo(19)_transparente_v2.png.jpeg",
        "assets/pelo%20(19)_transparente_v2.png.jpeg",
        "assets/pelo(19)_transparente_v2.png"
      ]
    }
  ];

  const rivalsList = [
    { id: 1, name: "Camila", score: 7.5, style: "Reina del Delineado", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDw0lRpikwOt32E7AUqcqlkd1BGJsqCOD2xQMo-A5JJ6LiOgujFv_iRXmywFNve_knfOvcsxJAXGzV9emKTy3_JyKWx_kcQo6BXmvsvQOXfPxf6zrZeatx-Zuupe1vE0LIMZFoYkb7QhjlKmjwzjftxEiER7EptQ3JWaN8KkdE1ljZKU8AbIlNyDc0uWrNxwHi1VHQ8nHOVOtN14_7D80XyVTlpphd3mz8jx12IFC8" },
    { id: 2, name: "Zoe", score: 7.2, style: "Glam Fantasía", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbiNOQRCs1Rp0og9XeHoNFkBXxqiw8nzpojMg_Id7Zbp2p1fH-s-CxTs4hqKdS7kQIpnpzL40kN0_TTIV8-MLqkBpf5FjXV02Ky7IBJklB2e-oloPqujLZKjzqPEeJFGRbJnnNA8vkTkvQcQQsqZevVTV5gVlkWb4yxMintQS6JrudhGGNwfw4zUB9ZXkfmXn1svIs2xxx_PJ_075uH9_dvNsa9yIQ11qGA_dbV_c" },
    { id: 3, name: "Mia", score: 7.8, style: "Neón Pop", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdP9xr-f4fZeP1bIypCCZdrBHmf_JBaCWa6NjhZ806PkbvfnImBKFVYRDFzSMTYIqXqDER8L0U3Ei1TezGo2QZspYjk9PtkNCmYPQPgsdgWrPx1qoGtGbf8yPa-6ZNssNmjO3uV427WCNh8uDjCb2yi-M53M7IDOR0ycMDRtiTDN6_h8Pspdke_9JcsHsuOQSpwnTeUaxMo5zcic-oVcFQmlPYs_9O9sTBJr682dw" },
    { id: 4, name: "Valeria", score: 7.4, style: "Divas de Pasarela", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-EGT5XpOXyPtlnDC63m5zRU_DzzzOHvA-WDFvgekb7SUXcQf3mb8XnFfmlMmQyn3k8KTO39YXljWL1WVtGGDsygJJWaOpWObM0-_d5iIUbx3zBrQthI6ccdgGShflSgqJFAaIuIQn8j1V4VmBGS5lbQsfpijQodPrN4UzW_MHW_Ip6U40LgtNeRlG8F7_a8JHuqWKZdOeN-vdUiHi6t3MOq-SiCRs3FgBSHZUHiI" },
    { id: 5, name: "Luna", score: 7.6, style: "Brillo Estelar", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDw0lRpikwOt32E7AUqcqlkd1BGJsqCOD2xQMo-A5JJ6LiOgujFv_iRXmywFNve_knfOvcsxJAXGzV9emKTy3_JyKWx_kcQo6BXmvsvQOXfPxf6zrZeatx-Zuupe1vE0LIMZFoYkb7QhjlKmjwzjftxEiER7EptQ3JWaN8KkdE1ljZKU8AbIlNyDc0uWrNxwHi1VHQ8nHOVOtN14_7D80XyVTlpphd3mz8jx12IFC8" },
    { id: 6, name: "Sofía R.", score: 7.9, style: "Chica Tokio", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbiNOQRCs1Rp0og9XeHoNFkBXxqiw8nzpojMg_Id7Zbp2p1fH-s-CxTs4hqKdS7kQIpnpzL40kN0_TTIV8-MLqkBpf5FjXV02Ky7IBJklB2e-oloPqujLZKjzqPEeJFGRbJnnNA8vkTkvQcQQsqZevVTV5gVlkWb4yxMintQS6JrudhGGNwfw4zUB9ZXkfmXn1svIs2xxx_PJ_075uH9_dvNsa9yIQ11qGA_dbV_c" },
    { id: 7, name: "Isabella", score: 8.0, style: "Glam Rosa", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdP9xr-f4fZeP1bIypCCZdrBHmf_JBaCWa6NjhZ806PkbvfnImBKFVYRDFzSMTYIqXqDER8L0U3Ei1TezGo2QZspYjk9PtkNCmYPQPgsdgWrPx1qoGtGbf8yPa-6ZNssNmjO3uV427WCNh8uDjCb2yi-M53M7IDOR0ycMDRtiTDN6_h8Pspdke_9JcsHsuOQSpwnTeUaxMo5zcic-oVcFQmlPYs_9O9sTBJr682dw" },
    { id: 8, name: "Abril", score: 8.1, style: "Trenzas Pop", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-EGT5XpOXyPtlnDC63m5zRU_DzzzOHvA-WDFvgekb7SUXcQf3mb8XnFfmlMmQyn3k8KTO39YXljWL1WVtGGDsygJJWaOpWObM0-_d5iIUbx3zBrQthI6ccdgGShflSgqJFAaIuIQn8j1V4VmBGS5lbQsfpijQodPrN4UzW_MHW_Ip6U40LgtNeRlG8F7_a8JHuqWKZdOeN-vdUiHi6t3MOq-SiCRs3FgBSHZUHiI" },
    { id: 9, name: "Valentina", score: 8.2, style: "Estrella Holográfica", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDw0lRpikwOt32E7AUqcqlkd1BGJsqCOD2xQMo-A5JJ6LiOgujFv_iRXmywFNve_knfOvcsxJAXGzV9emKTy3_JyKWx_kcQo6BXmvsvQOXfPxf6zrZeatx-Zuupe1vE0LIMZFoYkb7QhjlKmjwzjftxEiER7EptQ3JWaN8KkdE1ljZKU8AbIlNyDc0uWrNxwHi1VHQ8nHOVOtN14_7D80XyVTlpphd3mz8jx12IFC8" },
    { id: 10, name: "Emilia", score: 8.4, style: "Reina Suprema", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdP9xr-f4fZeP1bIypCCZdrBHmf_JBaCWa6NjhZ806PkbvfnImBKFVYRDFzSMTYIqXqDER8L0U3Ei1TezGo2QZspYjk9PtkNCmYPQPgsdgWrPx1qoGtGbf8yPa-6ZNssNmjO3uV427WCNh8uDjCb2yi-M53M7IDOR0ycMDRtiTDN6_h8Pspdke_9JcsHsuOQSpwnTeUaxMo5zcic-oVcFQmlPYs_9O9sTBJr682dw" }
  ];

  const skinTones = [
    { name: "Porcelana", hex: "#ffe6d6", filter: "brightness(1.06) contrast(0.98) saturate(0.95)" },
    { name: "Canela", hex: "#e5b085", filter: "brightness(0.95) contrast(1.04) saturate(1.18)" },
    { name: "Bronce", hex: "#c47e49", filter: "brightness(0.84) contrast(1.08) saturate(1.26)" },
    { name: "Canela Oscuro", hex: "#8c4d24", filter: "brightness(0.72) contrast(1.12) saturate(1.30)" },
    { name: "Ébano", hex: "#542b12", filter: "brightness(0.58) contrast(1.15) saturate(1.22)" }
  ];

  const hairColors = [
    { name: "Natural", filter: "none", dot: "#ffffff" },
    { name: "Rosa", filter: "hue-rotate(305deg) saturate(1.45)", dot: "#ff4799" },
    { name: "Violeta", filter: "hue-rotate(255deg) saturate(1.35)", dot: "#a855f7" },
    { name: "Rubio", filter: "hue-rotate(25deg) saturate(1.3)", dot: "#facc15" },
    { name: "Turquesa", filter: "hue-rotate(155deg) saturate(1.4)", dot: "#22d3ee" },
    { name: "Rojo", filter: "hue-rotate(335deg) saturate(1.5)", dot: "#f43f5e" }
  ];

  const shadowColors = [
    { name: "Rosa Neón", hex: "#ff4799" },
    { name: "Morado", hex: "#a855f7" },
    { name: "Cian", hex: "#22d3ee" },
    { name: "Dorado", hex: "#facc15" },
    { name: "Coral", hex: "#fb7185" }
  ];

  const lipColors = [
    { name: "Rosa", hex: "#ff2e85" },
    { name: "Rojo", hex: "#e11d48" },
    { name: "Coral", hex: "#fb7185" },
    { name: "Vino", hex: "#9f1239" },
    { name: "Uva", hex: "#9333ea" }
  ];

  const baseColors = [
    { name: "Rosa", hex: "#ff5c93", rgba: "rgba(255, 92, 147, 0.72)" },
    { name: "Durazno", hex: "#fb923c", rgba: "rgba(251, 146, 60, 0.68)" },
    { name: "Coral", hex: "#f43f5e", rgba: "rgba(244, 63, 94, 0.72)" },
    { name: "Bronce", hex: "#d97706", rgba: "rgba(217, 119, 6, 0.65)" }
  ];

  const lashColors = [
    { name: "Negro", hex: "#140826" },
    { name: "Rosa", hex: "#ff4799" },
    { name: "Morado", hex: "#a855f7" },
    { name: "Azul", hex: "#38bdf8" },
    { name: "Dorado", hex: "#facc15" }
  ];

  const glitterColors = [
    { name: "Dorado", hex: "#facc15" },
    { name: "Rosa", hex: "#ff4799" },
    { name: "Cian", hex: "#22d3ee" },
    { name: "Plata", hex: "#f8fafc" }
  ];

  let selectedSkin = skinTones[1];
  let skinEnabled = false;
  let activeHairFilter = "none";
  let hairOffsetY = -4;
  let hairScale = 1.25;
  let selectedShadowColor = shadowColors[0].hex;
  let shadowEnabled = false;
  let selectedLipColor = lipColors[0].hex;
  let lipEnabled = false;
  let selectedBaseColor = baseColors[0];
  let baseEnabled = false;
  let selectedLashColor = lashColors[0].hex;
  let lashEnabled = false;
  let selectedGlitterColor = glitterColors[0].hex;
  let glitterEnabled = false;

  // ==================== TEMPORIZADOR DE BATALLA ====================
  let timerSeconds = 90;
  let timerInterval = null;
  const matchTimerEl = document.getElementById("match-timer");

  function updateTimerDisplay() {
    if (!matchTimerEl) return;
    const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
    const secs = String(timerSeconds % 60).padStart(2, "0");
    matchTimerEl.textContent = `${mins}:${secs}`;
  }

  function startMatchTimer() {
    stopMatchTimer();
    timerSeconds = 90;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds -= 1;
        updateTimerDisplay();
        if (timerSeconds <= 10 && timerSeconds > 0) {
          SoundEngine.tick();
        }
      } else {
        stopMatchTimer();
        document.getElementById("finish-look-btn")?.click();
      }
    }, 1000);
  }

  function stopMatchTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function loadImageWithFallback(imgEl, candidates, index = 0) {
    if (!imgEl || !candidates) return;
    if (index >= candidates.length) {
      imgEl.style.display = "none";
      return;
    }
    imgEl.onload = () => {
      imgEl.style.display = "block";
      imgEl.dataset.loaded = "1";
    };
    imgEl.onerror = () => loadImageWithFallback(imgEl, candidates, index + 1);
    imgEl.src = candidates[index];
  }

  function formatCoins(val) {
    return val >= 1000 ? `${(val / 1000).toFixed(1).replace(".0", "")}K` : String(val);
  }

  function syncHud() {
    if (hudCoins) hudCoins.textContent = formatCoins(gameState.coins);
    if (hudGems) hudGems.textContent = String(gameState.gems);
    if (hudStars) hudStars.textContent = String(gameState.stars);
    if (hudLevel) hudLevel.textContent = String(gameState.level);
    const countWins = Math.min(10, gameState.defeatedRivals.size || gameState.wins || 0);
    const hasTrophy = countWins >= 10 || gameState.trophyUnlocked;
    if (trophyProgressText) {
      trophyProgressText.textContent = hasTrophy ? "🏆 ¡LO LOGRASTE!" : `🏆 ${countWins}/10`;
    }
    if (winnerTrophyBadgeEl) {
      winnerTrophyBadgeEl.classList.toggle("hidden", !hasTrophy);
    }
  }

  function setScreen(targetId) {
    if (!screenEstudio || !screenBatalla) return;
    gameState.activeScreen = targetId;
    if (targetId === "screen-batalla") {
      screenEstudio.classList.add("hidden");
      screenEstudio.classList.remove("flex");
      screenBatalla.classList.remove("hidden");
      screenBatalla.classList.add("flex");
      const resultBox = document.getElementById("battle-result-box");
      if (resultBox) {
        resultBox.classList.add("hidden");
        resultBox.classList.remove("flex");
      }
      startMatchTimer();
    } else {
      stopMatchTimer();
      screenBatalla.classList.add("hidden");
      screenBatalla.classList.remove("flex");
      screenEstudio.classList.remove("hidden");
      screenEstudio.classList.add("flex");
    }
    navTabs.forEach((tab) => {
      const isActive = tab.dataset.target === targetId;
      tab.classList.toggle("text-primary", isActive);
      tab.classList.toggle("text-on-surface-variant", !isActive);
    });
  }

  // ==================== EDITAR NOMBRE ====================
  const editNameBtn = document.getElementById("edit-name-btn");
  const playerNameEl = document.getElementById("player-name");
  const battlePlayerBadge = document.getElementById("battle-player-badge");
  if (editNameBtn && playerNameEl) {
    editNameBtn.addEventListener("click", () => {
      SoundEngine.click();
      const nuevoNombre = prompt("Escribe tu nombre:", gameState.playerName);
      if (nuevoNombre && nuevoNombre.trim() !== "") {
        gameState.playerName = nuevoNombre.trim();
        playerNameEl.textContent = gameState.playerName;
        if (battlePlayerBadge) battlePlayerBadge.textContent = gameState.playerName;
      }
    });
  }

  // ==================== SELECTOR DE 10 RIVALES ====================
  const rivalsGrid = document.getElementById("rivals-grid");
  const rivalNameEl = document.getElementById("rival-name");
  const rivalScoreEl = document.getElementById("rival-score");
  const rivalLookEl = document.getElementById("rival-look-label");
  const rivalBarEl = document.getElementById("rival-bar");
  const battleStyleEl = document.getElementById("battle-style-label");
  const rivalImgEl = document.getElementById("rival-avatar-img");

  function selectRival(r) {
    gameState.rival = { id: r.id, name: r.name, score: r.score, style: r.style, look: "Look " + r.style };
    if (rivalNameEl) rivalNameEl.textContent = r.name;
    if (rivalScoreEl) rivalScoreEl.textContent = r.score.toFixed(1);
    if (rivalLookEl) rivalLookEl.textContent = `Rival ${r.id}/10 • ${r.style}`;
    if (rivalBarEl) rivalBarEl.style.width = `${Math.min(100, r.score * 10)}%`;
    if (battleStyleEl) battleStyleEl.textContent = `Duelo ${r.id}/10 vs ${r.name} • ${r.style}`;
    if (rivalImgEl) rivalImgEl.src = r.img;
  }

  if (rivalsGrid) {
    rivalsGrid.className = "grid grid-cols-5 gap-1.5";
    rivalsGrid.innerHTML = rivalsList.map((r, idx) => {
      const activeClass = idx === 0
        ? "bg-primary-container/25 border-primary/60"
        : "bg-surface-container-low border-transparent hover:border-outline-variant";
      return `
        <button class="rival-card flex flex-col items-center p-1.5 rounded-xl ${activeClass} border text-center transition-all" data-rival-id="${r.id}" type="button">
          <img alt="${r.name}" class="w-full h-12 object-cover object-top rounded-lg mb-1" src="${r.img}"/>
          <span class="font-label-md text-[10px] text-on-surface font-bold truncate w-full">${r.id}. ${r.name}</span>
          <span class="font-label-sm text-[9px] text-tertiary">★ ${r.score.toFixed(1)}</span>
        </button>
      `;
    }).join("");

    const rivalCards = rivalsGrid.querySelectorAll(".rival-card");
    rivalCards.forEach((card) => {
      card.addEventListener("click", () => {
        SoundEngine.click();
        const id = parseInt(card.dataset.rivalId, 10);
        const found = rivalsList.find((item) => item.id === id) || rivalsList[0];
        rivalCards.forEach((c) => {
          c.classList.remove("bg-primary-container/25", "border-primary/60");
          c.classList.add("bg-surface-container-low", "border-transparent");
        });
        card.classList.remove("bg-surface-container-low", "border-transparent");
        card.classList.add("bg-primary-container/25", "border-primary/60");
        selectRival(found);
      });
    });
  }

  // ==================== SUBIR FOTO PERSONAL ====================
  const uploadBtn = document.getElementById("ai-avatar-btn");
  const photoInput = document.getElementById("photo-upload-input");
  const profileAvatarImg = document.getElementById("profile-avatar-img");
  const profileAvatarIcon = document.getElementById("profile-avatar-icon");
  const headerAvatar = document.getElementById("header-avatar");
  const heroCoverImg = document.getElementById("hero-cover-img");
  const uploadPhotoLabel = document.getElementById("upload-photo-label");
  const baseAvatarEl = document.getElementById("base-avatar");
  const avatarContainerEl = document.getElementById("avatar-container");

  if (baseAvatarEl) {
    baseAvatarEl.classList.remove("hidden");
    baseAvatarEl.style.opacity = "1";
    baseAvatarEl.style.display = "block";
    baseAvatarEl.style.zIndex = "5";
  }

  if (uploadBtn && photoInput) {
    uploadBtn.addEventListener("click", () => {
      SoundEngine.click();
      photoInput.click();
    });
    photoInput.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        gameState.customPhotoUrl = dataUrl;
        if (profileAvatarImg) {
          profileAvatarImg.src = dataUrl;
          profileAvatarImg.classList.remove("hidden");
        }
        if (profileAvatarIcon) profileAvatarIcon.classList.add("hidden");
        if (headerAvatar) {
          headerAvatar.innerHTML = `<img src="${dataUrl}" alt="Mi avatar" class="w-full h-full object-cover object-top"/>`;
        }
        if (heroCoverImg) {
          heroCoverImg.src = dataUrl;
          heroCoverImg.classList.remove("object-contain");
          heroCoverImg.classList.add("object-cover", "object-top");
        }
        if (baseAvatarEl) {
          baseAvatarEl.src = dataUrl;
          baseAvatarEl.classList.remove("hidden");
          baseAvatarEl.style.opacity = "1";
        }
        if (uploadPhotoLabel) uploadPhotoLabel.textContent = "¡Foto lista! Cambiar foto";
        SoundEngine.sparkle();
      };
      reader.readAsDataURL(file);
    });
  }

  // ==================== BOTÓN DE SONIDO ====================
  const soundBtn = document.getElementById("sound-toggle-btn");
  const soundIcon = document.getElementById("sound-icon");
  if (soundBtn && soundIcon) {
    soundBtn.addEventListener("click", () => {
      gameState.soundOn = !gameState.soundOn;
      soundIcon.textContent = gameState.soundOn ? "volume_up" : "volume_off";
      SoundEngine.toggleMusic();
      if (gameState.soundOn) SoundEngine.sparkle();
    });
  }

  document.addEventListener("pointerdown", () => {
    SoundEngine.ensureMusic();
  }, { once: true });

  // ==================== CAPAS DE AVATAR ====================
  const oldHair = document.getElementById("layer-hair");
  if (oldHair) oldHair.remove();
  const oldSkinTint = document.getElementById("layer-skin-tint");
  if (oldSkinTint) oldSkinTint.remove();

  let winnerTrophyBadgeEl = document.getElementById("winner-trophy-badge");
  if (avatarContainerEl && !winnerTrophyBadgeEl) {
    winnerTrophyBadgeEl = document.createElement("div");
    winnerTrophyBadgeEl.id = "winner-trophy-badge";
    winnerTrophyBadgeEl.className = "hidden absolute top-1.5 right-1.5 z-[22] flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-400/95 text-slate-950 shadow-lg border border-white/70";
    winnerTrophyBadgeEl.innerHTML = `
      <img src="assets/trofeo.jpeg" alt="Trofeo Campeona" onerror="this.style.display='none';" class="w-4 h-4 rounded-full object-cover"/>
      <span class="text-[9px] font-extrabold">🏆 10/10</span>
    `;
    avatarContainerEl.appendChild(winnerTrophyBadgeEl);
  }

  let hairImgLayerEl = document.getElementById("layer-hair-img");
  if (avatarContainerEl && !hairImgLayerEl) {
    hairImgLayerEl = document.createElement("img");
    hairImgLayerEl.id = "layer-hair-img";
    hairImgLayerEl.alt = "Pelo";
    hairImgLayerEl.className = "hair-overlay-clean hidden";
    avatarContainerEl.appendChild(hairImgLayerEl);
  }

  let shadowLayerEl = document.getElementById("layer-shadow");
  if (avatarContainerEl && !shadowLayerEl) {
    shadowLayerEl = document.createElement("div");
    shadowLayerEl.id = "layer-shadow";
    shadowLayerEl.className = "absolute inset-0 z-[13] pointer-events-none hidden";
    shadowLayerEl.innerHTML = `
      <div id="shadow-left-lid" class="eyeshadow-left"></div>
      <div id="shadow-right-lid" class="eyeshadow-right"></div>
    `;
    avatarContainerEl.appendChild(shadowLayerEl);
  }

  const eyesLayerEl = document.getElementById("layer-eyes");
  const lashesLayerEl = document.getElementById("layer-lashes");
  if (lashesLayerEl) lashesLayerEl.style.display = "none";

  if (eyesLayerEl) {
    eyesLayerEl.classList.remove("z-10", "opacity-0");
    eyesLayerEl.classList.add("z-[15]", "hidden");
    eyesLayerEl.style.mixBlendMode = "normal";
    eyesLayerEl.innerHTML = `
      <div class="relative w-full h-full">
        <div id="lash-set-left" class="absolute top-[40.5%] left-[34%] w-6 h-3 pointer-events-none">
          <div class="lash-strand absolute -top-1 left-0.5 w-0.5 h-2 rounded-full -rotate-25"></div>
          <div class="lash-strand absolute -top-1.5 left-2 w-0.5 h-2.5 rounded-full -rotate-10"></div>
          <div class="lash-strand absolute -top-1.5 right-2 w-0.5 h-2.5 rounded-full rotate-10"></div>
          <div class="lash-strand absolute -top-1 right-0.5 w-0.5 h-2 rounded-full rotate-25"></div>
        </div>
        <div id="lash-set-right" class="absolute top-[40.5%] right-[34%] w-6 h-3 pointer-events-none">
          <div class="lash-strand absolute -top-1 left-0.5 w-0.5 h-2 rounded-full -rotate-25"></div>
          <div class="lash-strand absolute -top-1.5 left-2 w-0.5 h-2.5 rounded-full -rotate-10"></div>
          <div class="lash-strand absolute -top-1.5 right-2 w-0.5 h-2.5 rounded-full rotate-10"></div>
          <div class="lash-strand absolute -top-1 right-0.5 w-0.5 h-2 rounded-full rotate-25"></div>
        </div>
      </div>
    `;
  }

  let blushLayerEl = document.getElementById("layer-blush");
  if (avatarContainerEl && !blushLayerEl) {
    blushLayerEl = document.createElement("div");
    blushLayerEl.id = "layer-blush";
    blushLayerEl.className = "absolute inset-0 z-[14] pointer-events-none hidden";
    blushLayerEl.innerHTML = `
      <div id="blush-left-dot" class="absolute top-[52.5%] left-[25.5%] w-7 h-4 rounded-full blur-[2px]"></div>
      <div id="blush-right-dot" class="absolute top-[52.5%] right-[25.5%] w-7 h-4 rounded-full blur-[2px]"></div>
    `;
    avatarContainerEl.appendChild(blushLayerEl);
  }

  const lipsLayerEl = document.getElementById("layer-lips");
  if (lipsLayerEl) {
    lipsLayerEl.classList.remove("z-10", "opacity-0");
    lipsLayerEl.classList.add("z-[16]", "hidden");
    lipsLayerEl.style.mixBlendMode = "normal";
    lipsLayerEl.innerHTML = `
      <div id="lip-pos-box" class="lip-gloss-shape">
        <div class="w-4 h-1 mx-auto mt-[2px] rounded-full bg-white/65 blur-[0.3px]"></div>
      </div>
    `;
  }

  const glitterLayerEl = document.getElementById("layer-acc");
  if (glitterLayerEl) {
    glitterLayerEl.classList.remove("z-10", "opacity-0");
    glitterLayerEl.classList.add("z-[17]", "hidden");
    glitterLayerEl.innerHTML = `
      <div class="relative w-full h-full">
        <span class="glitter-spark absolute top-[32%] left-[25%] text-base drop-shadow">✦</span>
        <span class="glitter-spark absolute top-[30%] right-[26%] text-lg drop-shadow">✧</span>
        <span class="glitter-spark absolute top-[48%] left-[19%] text-sm drop-shadow">✦</span>
        <span class="glitter-spark absolute top-[50%] right-[20%] text-base drop-shadow">✦</span>
        <span class="glitter-spark absolute top-[67%] left-[31%] text-sm drop-shadow">✧</span>
        <span class="glitter-spark absolute top-[66%] right-[31%] text-sm drop-shadow">✦</span>
      </div>
    `;
  }

  // ==================== CONSTRUCCIÓN DE PANELES ====================
  const hairPanel = document.getElementById("panel-hair");
  if (hairPanel) {
    hairPanel.innerHTML = `
      ${hairConfigs.map((h) => `
        <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="hair" data-hair-item="${h.item}" data-gain="${h.gain}" data-item="${h.item}" type="button">
          <img id="thumb-${h.item}" alt="${h.label}" class="w-9 h-9 rounded-full object-contain mb-1 border border-white/20 bg-white/90"/>
          <span class="text-[10px] text-on-surface font-semibold truncate w-full">${h.label}</span>
          <span class="text-[9px] text-tertiary font-bold">+${h.gain.toFixed(1)}★</span>
        </button>
      `).join("")}
      <div style="grid-column: 1 / -1;" class="mt-1 pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-1.5 px-1">
        <span class="text-[10px] text-on-surface-variant font-semibold">Color pelo:</span>
        <div class="flex items-center gap-1.5">
          ${hairColors.map((hc, i) => `
            <button type="button" data-filter="${hc.filter}" title="${hc.name}" class="hair-color-btn w-5 h-5 rounded-full border border-white/40 transition-transform ${i === 0 ? "ring-2 ring-white scale-110" : ""}" style="background-color: ${hc.dot};"></button>
          `).join("")}
        </div>
      </div>
      <div style="grid-column: 1 / -1;" class="mt-1 pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-1 px-1">
        <span class="text-[10px] text-on-surface-variant font-semibold">Ajustar pelo:</span>
        <div class="flex items-center gap-1">
          <button type="button" id="hair-up-btn" class="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] text-on-surface font-bold">↑</button>
          <button type="button" id="hair-down-btn" class="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] text-on-surface font-bold">↓</button>
          <button type="button" id="hair-bigger-btn" class="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] text-on-surface font-bold">+</button>
          <button type="button" id="hair-smaller-btn" class="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] text-on-surface font-bold">-</button>
        </div>
      </div>
    `;

    hairConfigs.forEach((h) => {
      const thumbEl = document.getElementById(`thumb-${h.item}`);
      loadImageWithFallback(thumbEl, h.candidates, 0);
    });
  }

  const eyesPanel = document.getElementById("panel-eyes");
  if (eyesPanel) {
    eyesPanel.innerHTML = `
      <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="eyes" data-gain="0.7" data-item="shadow-toggle" type="button">
        <div class="w-9 h-9 rounded-full bg-fuchsia-500 flex items-center justify-center mb-1">
          <span class="material-symbols-outlined text-white text-[18px]">palette</span>
        </div>
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">Sombras</span>
        <span class="text-[9px] text-tertiary font-bold">+0.7★</span>
      </button>
      <div style="grid-column: span 3;" class="flex flex-col justify-center gap-1 px-2 py-1.5 rounded-xl bg-surface-container-lowest/70">
        <span class="text-[10px] text-on-surface-variant font-semibold">Color sombras:</span>
        <div class="flex items-center gap-2">
          ${shadowColors.map((sc, idx) => `
            <button type="button" data-shadow-hex="${sc.hex}" title="${sc.name}" class="shadow-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform ${idx === 0 ? "ring-2 ring-tertiary scale-110" : ""}" style="background-color: ${sc.hex};"></button>
          `).join("")}
        </div>
      </div>
      <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="liner" data-gain="0.7" data-item="eyes-lashes-toggle" type="button">
        <div class="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center mb-1">
          <span class="material-symbols-outlined text-white text-[18px]">visibility</span>
        </div>
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">Pestañas</span>
        <span class="text-[9px] text-tertiary font-bold">+0.7★</span>
      </button>
      <div style="grid-column: span 3;" class="flex flex-col justify-center gap-1 px-2 py-1.5 rounded-xl bg-surface-container-lowest/70">
        <span class="text-[10px] text-on-surface-variant font-semibold">Color pestañas:</span>
        <div class="flex items-center gap-2">
          ${lashColors.map((lc, idx) => `
            <button type="button" data-lash-hex="${lc.hex}" title="${lc.name}" class="lash-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform ${idx === 0 ? "ring-2 ring-tertiary scale-110" : ""}" style="background-color: ${lc.hex};"></button>
          `).join("")}
        </div>
      </div>
    `;
  }

  const lipsPanel = document.getElementById("panel-lips");
  if (lipsPanel) {
    lipsPanel.innerHTML = `
      <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="lips" data-gain="0.7" data-item="lips-toggle" type="button">
        <div class="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center mb-1">
          <span class="material-symbols-outlined text-white text-[18px]">favorite</span>
        </div>
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">Labial</span>
        <span class="text-[9px] text-tertiary font-bold">+0.7★</span>
      </button>
      <div style="grid-column: span 3;" class="flex flex-col justify-center gap-1 px-2 py-1.5 rounded-xl bg-surface-container-lowest/70">
        <span class="text-[10px] text-on-surface-variant font-semibold">Color labial:</span>
        <div class="flex items-center gap-2">
          ${lipColors.map((lp, idx) => `
            <button type="button" data-lip-hex="${lp.hex}" title="${lp.name}" class="lip-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform ${idx === 0 ? "ring-2 ring-tertiary scale-110" : ""}" style="background-color: ${lp.hex};"></button>
          `).join("")}
        </div>
      </div>
      <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="blush" data-gain="0.6" data-item="blush-toggle" type="button">
        <div class="w-9 h-9 rounded-full bg-rose-400 flex items-center justify-center mb-1">
          <span class="material-symbols-outlined text-slate-950 text-[18px]">bubble_chart</span>
        </div>
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">Rubor</span>
        <span class="text-[9px] text-tertiary font-bold">+0.6★</span>
      </button>
      <div style="grid-column: span 3;" class="flex flex-col justify-center gap-1 px-2 py-1.5 rounded-xl bg-surface-container-lowest/70">
        <span class="text-[10px] text-on-surface-variant font-semibold">Color rubor:</span>
        <div class="flex items-center gap-2">
          ${baseColors.map((bc, idx) => `
            <button type="button" data-base-idx="${idx}" title="${bc.name}" class="base-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform ${idx === 0 ? "ring-2 ring-tertiary scale-110" : ""}" style="background-color: ${bc.hex};"></button>
          `).join("")}
        </div>
      </div>
    `;
  }

  const glitterPanel = document.getElementById("panel-acc");
  if (glitterPanel) {
    glitterPanel.innerHTML = `
      <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="glitter" data-gain="0.7" data-item="glitter-toggle" type="button">
        <div class="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center mb-1">
          <span class="material-symbols-outlined text-slate-950 text-[18px]">auto_awesome</span>
        </div>
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">Brillos</span>
        <span class="text-[9px] text-tertiary font-bold">+0.7★</span>
      </button>
      <div style="grid-column: span 3;" class="flex flex-col justify-center gap-1 px-2 py-1.5 rounded-xl bg-surface-container-lowest/70">
        <span class="text-[10px] text-on-surface-variant font-semibold">Color brillos:</span>
        <div class="flex items-center gap-2">
          ${glitterColors.map((gc, idx) => `
            <button type="button" data-glitter-hex="${gc.hex}" title="${gc.name}" class="glitter-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform ${idx === 0 ? "ring-2 ring-tertiary scale-110" : ""}" style="background-color: ${gc.hex};"></button>
          `).join("")}
        </div>
      </div>
    `;
  }

  const stationBox = document.getElementById("open-drawer-btn")?.closest(".flex.flex-col.w-full.rounded-2xl");
  const finishLookBtn = document.getElementById("finish-look-btn");
  if (stationBox && finishLookBtn && !document.getElementById("skin-color-bar")) {
    const skinBar = document.createElement("div");
    skinBar.id = "skin-color-bar";
    skinBar.className = "flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20";
    skinBar.innerHTML = `
      <span class="text-[11px] text-on-surface font-semibold">Color piel:</span>
      <div class="flex items-center gap-2">
        ${skinTones.map((sc, idx) => `
          <button type="button" data-skin-idx="${idx}" title="${sc.name}" class="skin-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform active:scale-90" style="background-color: ${sc.hex};"></button>
        `).join("")}
      </div>
    `;
    stationBox.insertBefore(skinBar, finishLookBtn);
  }

  // ==================== EVENTOS DE COLOR Y AJUSTE ====================
  document.addEventListener("click", (e) => {
    const skinBtn = e.target.closest(".skin-color-btn");
    if (skinBtn) {
      SoundEngine.sparkle();
      spawnSparkles(e.clientX, e.clientY, "✨");
      const idx = parseInt(skinBtn.dataset.skinIdx, 10);
      const chosen = skinTones[idx] || skinTones[0];
      const isSame = skinEnabled && selectedSkin.name === chosen.name;
      document.querySelectorAll(".skin-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      if (isSame) {
        skinEnabled = false;
        gameState.appliedItems.delete("skin-color");
      } else {
        skinEnabled = true;
        selectedSkin = chosen;
        skinBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
        gameState.appliedItems.set("skin-color", { cat: "skin", gain: 0.5 });
      }
      refreshVisuals();
      return;
    }

    const hairColorBtn = e.target.closest(".hair-color-btn");
    if (hairColorBtn) {
      SoundEngine.hair();
      spawnSparkles(e.clientX, e.clientY, "💇‍♀️");
      activeHairFilter = hairColorBtn.dataset.filter || "none";
      document.querySelectorAll(".hair-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-white", "scale-110"));
      hairColorBtn.classList.add("ring-2", "ring-white", "scale-110");
      refreshVisuals();
      return;
    }

    const shadowBtn = e.target.closest(".shadow-color-btn");
    if (shadowBtn) {
      SoundEngine.sparkle();
      spawnSparkles(e.clientX, e.clientY, "🎨");
      selectedShadowColor = shadowBtn.dataset.shadowHex || shadowColors[0].hex;
      shadowEnabled = true;
      gameState.appliedItems.set("shadow-toggle", { item: "shadow-toggle", cat: "eyes", gain: 0.7 });
      document.querySelector(`.cosmetic-card[data-item="shadow-toggle"]`)?.classList.add("is-selected");
      document.querySelectorAll(".shadow-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      shadowBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
      refreshVisuals();
      return;
    }

    const lipBtn = e.target.closest(".lip-color-btn");
    if (lipBtn) {
      SoundEngine.sparkle();
      spawnSparkles(e.clientX, e.clientY, "💋");
      selectedLipColor = lipBtn.dataset.lipHex || lipColors[0].hex;
      lipEnabled = true;
      gameState.appliedItems.set("lips-toggle", { item: "lips-toggle", cat: "lips", gain: 0.7 });
      document.querySelector(`.cosmetic-card[data-item="lips-toggle"]`)?.classList.add("is-selected");
      document.querySelectorAll(".lip-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      lipBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
      refreshVisuals();
      return;
    }

    const baseBtn = e.target.closest(".base-color-btn");
    if (baseBtn) {
      SoundEngine.sparkle();
      spawnSparkles(e.clientX, e.clientY, "🌸");
      const idx = parseInt(baseBtn.dataset.baseIdx, 10);
      selectedBaseColor = baseColors[idx] || baseColors[0];
      baseEnabled = true;
      gameState.appliedItems.set("blush-toggle", { item: "blush-toggle", cat: "blush", gain: 0.6 });
      document.querySelector(`.cosmetic-card[data-item="blush-toggle"]`)?.classList.add("is-selected");
      document.querySelectorAll(".base-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      baseBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
      refreshVisuals();
      return;
    }

    const lashBtn = e.target.closest(".lash-color-btn");
    if (lashBtn) {
      SoundEngine.sparkle();
      spawnSparkles(e.clientX, e.clientY, "👁️");
      selectedLashColor = lashBtn.dataset.lashHex || lashColors[0].hex;
      lashEnabled = true;
      gameState.appliedItems.set("eyes-lashes-toggle", { item: "eyes-lashes-toggle", cat: "liner", gain: 0.7 });
      document.querySelector(`.cosmetic-card[data-item="eyes-lashes-toggle"]`)?.classList.add("is-selected");
      document.querySelectorAll(".lash-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      lashBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
      refreshVisuals();
      return;
    }

    const glitterBtn = e.target.closest(".glitter-color-btn");
    if (glitterBtn) {
      SoundEngine.sparkle();
      spawnSparkles(e.clientX, e.clientY, "💎");
      selectedGlitterColor = glitterBtn.dataset.glitterHex || glitterColors[0].hex;
      glitterEnabled = true;
      gameState.appliedItems.set("glitter-toggle", { item: "glitter-toggle", cat: "glitter", gain: 0.7 });
      document.querySelector(`.cosmetic-card[data-item="glitter-toggle"]`)?.classList.add("is-selected");
      document.querySelectorAll(".glitter-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      glitterBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
      refreshVisuals();
    }
  });

  document.getElementById("hair-up-btn")?.addEventListener("click", () => {
    SoundEngine.click();
    hairOffsetY -= 3;
    refreshVisuals();
  });
  document.getElementById("hair-down-btn")?.addEventListener("click", () => {
    SoundEngine.click();
    hairOffsetY += 3;
    refreshVisuals();
  });
  document.getElementById("hair-bigger-btn")?.addEventListener("click", () => {
    SoundEngine.click();
    hairScale = Math.min(1.75, +(hairScale + 0.08).toFixed(2));
    refreshVisuals();
  });
  document.getElementById("hair-smaller-btn")?.addEventListener("click", () => {
    SoundEngine.click();
    hairScale = Math.max(0.75, +(hairScale - 0.08).toFixed(2));
    refreshVisuals();
  });

  // ==================== PESTAÑAS DE HERRAMIENTAS ====================
  const catTabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tool-panel");
  catTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      SoundEngine.click();
      const cat = tab.dataset.cat;
      catTabs.forEach((t) => {
        t.classList.remove("bg-primary-container", "text-on-primary-container", "font-bold");
        t.classList.add("bg-surface-container-high", "text-on-surface", "font-medium");
      });
      tab.classList.remove("bg-surface-container-high", "text-on-surface", "font-medium");
      tab.classList.add("bg-primary-container", "text-on-primary-container", "font-bold");

      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== `panel-${cat}`);
      });
    });
  });

  // ==================== ACTUALIZACIÓN VISUAL Y PUNTAJE ====================
  const playerScoreEl = document.getElementById("player-score");
  const scoreBarEl = document.getElementById("score-bar");
  const appliedCountEl = document.getElementById("applied-count");
  const applauseTextEl = document.getElementById("applause-text");

  function refreshVisuals() {
    let totalGain = 0;
    let activeHairConfig = null;

    gameState.appliedItems.forEach((meta, key) => {
      totalGain += meta.gain;
      if (meta.cat === "hair" && meta.hairItem) {
        activeHairConfig = hairConfigs.find((h) => h.item === meta.hairItem) || null;
      }
      if (key === "shadow-toggle") shadowEnabled = true;
      if (key === "lips-toggle") lipEnabled = true;
      if (key === "blush-toggle") baseEnabled = true;
      if (key === "eyes-lashes-toggle") lashEnabled = true;
      if (key === "glitter-toggle") glitterEnabled = true;
    });

    gameState.playerScore = Math.min(10.0, +(gameState.baseScore + totalGain).toFixed(1));

    if (baseAvatarEl) {
      baseAvatarEl.classList.remove("hidden");
      baseAvatarEl.style.opacity = "1";
      baseAvatarEl.style.display = "block";
      baseAvatarEl.style.filter = skinEnabled ? selectedSkin.filter : "none";
    }

    if (hairImgLayerEl) {
      if (activeHairConfig) {
        hairImgLayerEl.classList.remove("hidden");
        hairImgLayerEl.style.display = "block";
        hairImgLayerEl.style.opacity = "1";
        hairImgLayerEl.style.filter = activeHairFilter && activeHairFilter !== "none" ? activeHairFilter : "none";
        hairImgLayerEl.style.transform = `translate(-50%, ${hairOffsetY}px) scale(${hairScale})`;
        hairImgLayerEl.style.transformOrigin = "top center";
        loadImageWithFallback(hairImgLayerEl, activeHairConfig.candidates, 0);
      } else {
        hairImgLayerEl.classList.add("hidden");
        hairImgLayerEl.style.display = "none";
      }
    }

    if (shadowLayerEl) {
      shadowLayerEl.classList.toggle("hidden", !shadowEnabled);
      if (shadowEnabled) {
        const leftLid = document.getElementById("shadow-left-lid");
        const rightLid = document.getElementById("shadow-right-lid");
        const shadowGrad = `radial-gradient(ellipse at center, ${selectedShadowColor} 0%, transparent 75%)`;
        if (leftLid) leftLid.style.background = shadowGrad;
        if (rightLid) rightLid.style.background = shadowGrad;
      }
    }

    if (eyesLayerEl) {
      eyesLayerEl.classList.toggle("hidden", !lashEnabled);
      if (lashEnabled) {
        eyesLayerEl.querySelectorAll(".lash-strand").forEach((s) => {
          s.style.backgroundColor = selectedLashColor;
        });
      }
    }

    if (blushLayerEl) {
      blushLayerEl.classList.toggle("hidden", !baseEnabled);
      if (baseEnabled) {
        const leftDot = document.getElementById("blush-left-dot");
        const rightDot = document.getElementById("blush-right-dot");
        const grad = `radial-gradient(circle, ${selectedBaseColor.rgba} 0%, transparent 78%)`;
        if (leftDot) leftDot.style.background = grad;
        if (rightDot) rightDot.style.background = grad;
      }
    }

    const lipPosBox = document.getElementById("lip-pos-box");
    if (lipsLayerEl) {
      lipsLayerEl.classList.toggle("hidden", !lipEnabled);
      if (lipPosBox && lipEnabled) {
        lipPosBox.style.background = `linear-gradient(180deg, ${selectedLipColor} 0%, #701a75 100%)`;
      }
    }

    if (glitterLayerEl) {
      glitterLayerEl.classList.toggle("hidden", !glitterEnabled);
      if (glitterEnabled) {
        glitterLayerEl.querySelectorAll(".glitter-spark").forEach((sp) => {
          sp.style.color = selectedGlitterColor;
        });
      }
    }

    if (playerScoreEl) playerScoreEl.textContent = gameState.playerScore.toFixed(1);
    if (scoreBarEl) scoreBarEl.style.width = `${Math.min(100, gameState.playerScore * 10)}%`;
    if (appliedCountEl) appliedCountEl.textContent = `${Math.min(8, gameState.appliedItems.size)} de 8`;
    if (applauseTextEl) {
      if (gameState.playerScore >= 8.5) {
        applauseTextEl.textContent = "¡Look de Pasarela AAA! 👑";
      } else if (gameState.appliedItems.size > 0) {
        applauseTextEl.textContent = "¡Qué look tan bonito! ✨";
      } else {
        applauseTextEl.textContent = "¡Haz tu magia! ✨";
      }
    }
  }

  // ==================== SELECCIÓN DE COSMÉTICOS ====================
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".cosmetic-card");
    if (!card) return;

    const item = card.dataset.item;
    const cat = card.dataset.cat;
    const gain = parseFloat(card.dataset.gain) || 0.5;
    const hairItem = card.dataset.hairItem || null;

    if (cat === "hair") {
      SoundEngine.hair();
      gameState.appliedItems.forEach((meta, k) => {
        if (meta.cat === "hair" && k !== item) {
          gameState.appliedItems.delete(k);
          document.querySelector(`.cosmetic-card[data-item="${k}"]`)?.classList.remove("is-selected");
        }
      });
    } else {
      SoundEngine.sparkle();
    }

    spawnSparkles(e.clientX, e.clientY, cat === "hair" ? "💇‍♀️" : "✨");

    if (gameState.appliedItems.has(item)) {
      gameState.appliedItems.delete(item);
      card.classList.remove("is-selected");
      if (item === "shadow-toggle") shadowEnabled = false;
      if (item === "lips-toggle") lipEnabled = false;
      if (item === "blush-toggle") baseEnabled = false;
      if (item === "eyes-lashes-toggle") lashEnabled = false;
      if (item === "glitter-toggle") glitterEnabled = false;
    } else {
      gameState.appliedItems.set(item, { item, cat, gain, hairItem });
      card.classList.add("is-selected");
      if (item === "shadow-toggle") shadowEnabled = true;
      if (item === "lips-toggle") lipEnabled = true;
      if (item === "blush-toggle") baseEnabled = true;
      if (item === "eyes-lashes-toggle") lashEnabled = true;
      if (item === "glitter-toggle") glitterEnabled = true;
    }

    refreshVisuals();
  });

  // ==================== LIMPIAR MAQUILLAJE ====================
  const clearBtn = document.getElementById("open-drawer-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      SoundEngine.clean();
      gameState.appliedItems.clear();
      skinEnabled = false;
      shadowEnabled = false;
      lipEnabled = false;
      baseEnabled = false;
      lashEnabled = false;
      glitterEnabled = false;
      activeHairFilter = "none";
      hairOffsetY = -4;
      hairScale = 1.25;
      document.querySelectorAll(".cosmetic-card").forEach((c) => c.classList.remove("is-selected"));
      document.querySelectorAll(".skin-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      document.querySelectorAll(".hair-color-btn").forEach((b, idx) => {
        b.classList.toggle("ring-2", idx === 0);
        b.classList.toggle("ring-white", idx === 0);
        b.classList.toggle("scale-110", idx === 0);
      });
      refreshVisuals();
    });
  }

  // ==================== FINALIZAR PASARELA Y VOTACIÓN ====================
  const finishBtn = document.getElementById("finish-look-btn");
  const resultBox = document.getElementById("battle-result-box");
  const resultTitle = document.getElementById("result-title");
  const resultDetail = document.getElementById("result-detail");
  const resultPlayerImg = document.getElementById("result-player-img");
  const resultRivalImg = document.getElementById("result-rival-img");
  const resultPlayerName = document.getElementById("result-player-name");
  const resultRivalName = document.getElementById("result-rival-name");
  const resultPlayerScore = document.getElementById("result-player-score");
  const resultRivalScore = document.getElementById("result-rival-score");
  const resultPlayerCrown = document.getElementById("result-player-crown");
  const resultRivalCrown = document.getElementById("result-rival-crown");

  if (finishBtn && resultBox && resultTitle && resultDetail) {
    finishBtn.addEventListener("click", (e) => {
      stopMatchTimer();
      resultBox.classList.remove("hidden");
      resultBox.classList.add("flex");

      const won = gameState.playerScore >= gameState.rival.score;
      if (won) {
        SoundEngine.win();
        if (e && e.clientX) spawnSparkles(e.clientX, e.clientY, "👑");
        gameState.defeatedRivals.add(gameState.rival.id || gameState.rival.name);
        gameState.wins = gameState.defeatedRivals.size;
        gameState.coins += 250;
        gameState.gems += 20;
        gameState.stars += 2;
      } else {
        SoundEngine.lose();
      }

      if (resultPlayerImg && baseAvatarEl) resultPlayerImg.src = baseAvatarEl.src;
      if (resultRivalImg && rivalImgEl) resultRivalImg.src = rivalImgEl.src;
      if (resultPlayerName) resultPlayerName.textContent = gameState.playerName;
      if (resultRivalName) resultRivalName.textContent = gameState.rival.name;
      if (resultPlayerScore) resultPlayerScore.textContent = `${gameState.playerScore.toFixed(1)}★`;
      if (resultRivalScore) resultRivalScore.textContent = `${gameState.rival.score.toFixed(1)}★`;

      if (resultPlayerCrown) resultPlayerCrown.classList.toggle("hidden", !won);
      if (resultRivalCrown) resultRivalCrown.classList.toggle("hidden", won);

      const totalWins = Math.min(10, gameState.defeatedRivals.size);
      if (totalWins >= 10) {
        gameState.trophyUnlocked = true;
        resultTitle.innerHTML = `<div class="flex flex-col items-center gap-1.5"><img src="assets/trofeo.jpeg" alt="Trofeo" onerror="this.style.display='none';" class="w-20 h-20 rounded-xl object-cover border-2 border-tertiary shadow-lg"/><span class="text-tertiary font-extrabold">¡Lo lograste, ${gameState.playerName}! 🏆</span></div>`;
        resultDetail.textContent = `Venciste a los 10 contrincantes y ganaste el Trofeo de Campeona (${gameState.playerScore.toFixed(1)}★ vs ${gameState.rival.score.toFixed(1)}★). ¡Felicidades!`;
      } else {
        resultTitle.textContent = won
          ? `¡Felicidades, ${gameState.playerName}! Venciste a ${gameState.rival.name} 🎉`
          : `¡Sigue maquillando, ${gameState.playerName}! ✨`;
        resultDetail.textContent = `Tu puntaje: ${gameState.playerScore.toFixed(1)}★ vs ${gameState.rival.name}: ${gameState.rival.score.toFixed(1)}★. Contrincantes vencidos: ${totalWins}/10.`;
      }

      syncHud();
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  navTabs.forEach((tab) => tab.addEventListener("click", () => {
    SoundEngine.click();
    setScreen(tab.dataset.target);
  }));
  if (startBattleBtn) startBattleBtn.addEventListener("click", () => {
    SoundEngine.sparkle();
    setScreen("screen-batalla");
  });
  if (backToStudioBtn) backToStudioBtn.addEventListener("click", () => {
    SoundEngine.click();
    setScreen("screen-estudio");
  });

  setScreen("screen-estudio");
  syncHud();
});