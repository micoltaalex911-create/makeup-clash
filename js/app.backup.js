// js/app.js - Piel, Labial, Base (cachetes) y Pestañas con selector de color + pelo limpio sin tapar cara
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

  const hairFiles = [
    { item: "pelo-9", label: "Pelo 9", src: "assets/pelo%20(9).png", gain: 0.7 },
    { item: "pelo-10", label: "Pelo 10", src: "assets/pelo%20(10).png", gain: 0.7 },
    { item: "pelo-11", label: "Pelo 11", src: "assets/pelo%20(11).png", gain: 0.8 },
    { item: "pelo-12", label: "Pelo 12", src: "assets/pelo(12).png", gain: 0.7 },
    { item: "pelo-13", label: "Pelo 13", src: "assets/pelo(13).png", gain: 0.8 },
    { item: "pelo-14", label: "Pelo 14", src: "assets/pelo%20(14).png", gain: 0.8 },
    { item: "pelo-15", label: "Pelo 15", src: "assets/pelo(15).png", gain: 0.8 },
    { item: "pelo-16", label: "Pelo 16", src: "assets/pelo(16).png", gain: 0.9 },
    { item: "pelo-17", label: "Pelo 17", src: "assets/pelo(17).png", gain: 0.9 },
    { item: "pelo-18", label: "Pelo 18", src: "assets/pelo(18).png", gain: 0.9 },
    { item: "pelo-19", label: "Pelo 19", src: "assets/pelo(19).png", gain: 1.0 }
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

  // Colores configurables para piel, labial, base y pestañas
  const skinColors = [
    { name: "Porcelana", hex: "#ffe3d1", rgba: "rgba(255, 227, 209, 0.45)" },
    { name: "Canela", hex: "#e5b085", rgba: "rgba(229, 176, 133, 0.58)" },
    { name: "Bronce", hex: "#c47e49", rgba: "rgba(196, 126, 73, 0.66)" },
    { name: "Canela Oscuro", hex: "#94562b", rgba: "rgba(148, 86, 43, 0.72)" },
    { name: "Ébano", hex: "#5e3318", rgba: "rgba(94, 51, 24, 0.78)" }
  ];

  const lipColors = [
    { name: "Rosa", hex: "#ff3b8d" },
    { name: "Rojo", hex: "#e11d48" },
    { name: "Coral", hex: "#fb7185" },
    { name: "Vino", hex: "#9f1239" },
    { name: "Uva", hex: "#9333ea" }
  ];

  const baseColors = [
    { name: "Rosa", hex: "#ff5c93", rgba: "rgba(255, 92, 147, 0.65)" },
    { name: "Durazno", hex: "#fb923c", rgba: "rgba(251, 146, 60, 0.62)" },
    { name: "Coral", hex: "#f43f5e", rgba: "rgba(244, 63, 94, 0.65)" },
    { name: "Bronce", hex: "#d97706", rgba: "rgba(217, 119, 6, 0.60)" }
  ];

  const lashColors = [
    { name: "Negro", hex: "#140826" },
    { name: "Rosa", hex: "#ff4799" },
    { name: "Morado", hex: "#a855f7" },
    { name: "Azul", hex: "#38bdf8" },
    { name: "Dorado", hex: "#facc15" }
  ];

  let selectedSkin = skinColors[1];
  let skinEnabled = false;

  let selectedLipColor = lipColors[0].hex;
  let lipEnabled = false;

  let selectedBaseColor = baseColors[0];
  let baseEnabled = false;

  let selectedLashColor = lashColors[0].hex;
  let lashEnabled = false;

  function formatCoins(val) {
    return val >= 1000 ? `${(val / 1000).toFixed(1).replace(".0", "")}K` : String(val);
  }

  function syncHud() {
    if (hudCoins) hudCoins.textContent = formatCoins(gameState.coins);
    if (hudGems) hudGems.textContent = String(gameState.gems);
    if (hudStars) hudStars.textContent = String(gameState.stars);
    if (hudLevel) hudLevel.textContent = String(gameState.level);
    const countWins = Math.min(10, gameState.defeatedRivals.size || gameState.wins || 0);
    if (trophyProgressText) {
      trophyProgressText.textContent = countWins >= 10 || gameState.trophyUnlocked
        ? "🏆 ¡LO LOGRASTE!"
        : `🏆 ${countWins}/10`;
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
    } else {
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

  setScreen("screen-estudio");
  syncHud();

  navTabs.forEach((tab) => tab.addEventListener("click", () => setScreen(tab.dataset.target)));
  if (startBattleBtn) startBattleBtn.addEventListener("click", () => setScreen("screen-batalla"));
  if (backToStudioBtn) backToStudioBtn.addEventListener("click", () => setScreen("screen-estudio"));

  const editNameBtn = document.getElementById("edit-name-btn");
  const playerNameEl = document.getElementById("player-name");
  const battlePlayerBadge = document.getElementById("battle-player-badge");
  if (editNameBtn && playerNameEl) {
    editNameBtn.addEventListener("click", () => {
      const nuevoNombre = prompt("Escribe tu nombre:", gameState.playerName);
      if (nuevoNombre && nuevoNombre.trim() !== "") {
        gameState.playerName = nuevoNombre.trim();
        playerNameEl.textContent = gameState.playerName;
        if (battlePlayerBadge) battlePlayerBadge.textContent = gameState.playerName;
      }
    });
  }

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
    baseAvatarEl.style.zIndex = "1";
  }

  if (uploadBtn && photoInput) {
    uploadBtn.addEventListener("click", () => photoInput.click());
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
      };
      reader.readAsDataURL(file);
    });
  }

  const soundBtn = document.getElementById("sound-toggle-btn");
  const soundIcon = document.getElementById("sound-icon");
  if (soundBtn && soundIcon) {
    soundBtn.addEventListener("click", () => {
      gameState.soundOn = !gameState.soundOn;
      soundIcon.textContent = gameState.soundOn ? "volume_up" : "volume_off";
    });
  }

  const oldHairSvg = document.getElementById("layer-hair");
  if (oldHairSvg) oldHairSvg.remove();

  // Pelo en esquina superior derecha limpio (no sale por aparte encima de la cara)
  let hairBadgeEl = document.getElementById("layer-hair-img");
  if (avatarContainerEl && !hairBadgeEl) {
    hairBadgeEl = document.createElement("img");
    hairBadgeEl.id = "layer-hair-img";
    hairBadgeEl.alt = "Pelo";
    hairBadgeEl.className = "absolute top-2 right-2 w-11 h-11 rounded-full object-cover object-top z-[12] pointer-events-none hidden border-2 border-tertiary shadow-md";
    avatarContainerEl.appendChild(hairBadgeEl);
  }

  // Capa de color de piel sobre el rostro
  let skinOverlayEl = document.getElementById("layer-skin-tint");
  if (avatarContainerEl && !skinOverlayEl) {
    skinOverlayEl = document.createElement("div");
    skinOverlayEl.id = "layer-skin-tint";
    skinOverlayEl.className = "absolute top-[24%] left-1/2 -translate-x-1/2 w-[56%] h-[52%] rounded-full z-[6] pointer-events-none hidden transition-all duration-200";
    skinOverlayEl.style.mixBlendMode = "multiply";
    avatarContainerEl.appendChild(skinOverlayEl);
  }

  // Pestañas con color configurable en ambos ojos
  const eyesLayerEl = document.getElementById("layer-eyes");
  const lashesLayerEl = document.getElementById("layer-lashes");
  if (lashesLayerEl) lashesLayerEl.style.display = "none";

  if (eyesLayerEl) {
    eyesLayerEl.classList.remove("z-10");
    eyesLayerEl.classList.add("z-[15]", "hidden");
    eyesLayerEl.style.mixBlendMode = "normal";
    eyesLayerEl.innerHTML = `
      <div class="relative w-full h-full">
        <div id="lash-set-left" class="absolute top-[40.5%] left-[34.5%] w-5 h-3 pointer-events-none">
          <div class="lash-strand absolute -top-1 left-0.5 w-0.5 h-1.5 rounded-full -rotate-25"></div>
          <div class="lash-strand absolute -top-1.5 left-2 w-0.5 h-2 rounded-full -rotate-10"></div>
          <div class="lash-strand absolute -top-1.5 right-2 w-0.5 h-2 rounded-full rotate-10"></div>
          <div class="lash-strand absolute -top-1 right-0.5 w-0.5 h-1.5 rounded-full rotate-25"></div>
        </div>
        <div id="lash-set-right" class="absolute top-[40.5%] right-[34.5%] w-5 h-3 pointer-events-none">
          <div class="lash-strand absolute -top-1 left-0.5 w-0.5 h-1.5 rounded-full -rotate-25"></div>
          <div class="lash-strand absolute -top-1.5 left-2 w-0.5 h-2 rounded-full -rotate-10"></div>
          <div class="lash-strand absolute -top-1.5 right-2 w-0.5 h-2 rounded-full rotate-10"></div>
          <div class="lash-strand absolute -top-1 right-0.5 w-0.5 h-1.5 rounded-full rotate-25"></div>
        </div>
      </div>
    `;
  }

  // Base (cachetes) con color configurable
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

  // Labial con color configurable
  const lipsLayerEl = document.getElementById("layer-lips");
  if (lipsLayerEl) {
    lipsLayerEl.classList.remove("z-10");
    lipsLayerEl.classList.add("z-[16]", "hidden");
    lipsLayerEl.style.mixBlendMode = "normal";
    lipsLayerEl.innerHTML = `
      <div id="lip-pos-box" class="absolute top-[63.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3.5 rounded-full" style="box-shadow: 0 1px 5px rgba(0, 0, 0, 0.35);">
        <div class="w-4 h-1 mx-auto mt-[2px] rounded-full bg-white/50 blur-[0.4px]"></div>
      </div>
    `;
  }

  const accLayerEl = document.getElementById("layer-acc");
  if (accLayerEl) {
    accLayerEl.classList.remove("z-10");
    accLayerEl.classList.add("z-[18]", "hidden");
  }

  // Panel de Pelo con tus archivos pelo (9)..pelo(19)
  const hairPanel = document.getElementById("panel-hair");
  if (hairPanel) {
    hairPanel.innerHTML = hairFiles.map((h) => `
      <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="hair" data-hair-src="${h.src}" data-gain="${h.gain}" data-item="${h.item}" type="button">
        <img alt="${h.label}" src="${h.src}" onerror="this.style.display='none';" class="w-9 h-9 rounded-full object-cover object-top mb-1 border border-white/20"/>
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">${h.label}</span>
        <span class="text-[9px] text-tertiary font-bold">+${h.gain.toFixed(1)}★</span>
      </button>
    `).join("");
  }

  // Panel Ojos: Pestañas + selector de color de pestañas
  const eyesPanel = document.getElementById("panel-eyes");
  if (eyesPanel) {
    eyesPanel.innerHTML = `
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

  // Panel Labios: Labial + color labial + Base (cachetes) + color base
  const lipsPanel = document.getElementById("panel-lips");
  if (lipsPanel) {
    lipsPanel.innerHTML = `
      <button class="cosmetic-card cursor-pointer flex flex-col items-center p-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest active:scale-95 text-center transition-all" data-cat="lips" data-gain="0.6" data-item="lips-toggle" type="button">
        <div class="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center mb-1">
          <span class="material-symbols-outlined text-white text-[18px]">favorite</span>
        </div>
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">Labial</span>
        <span class="text-[9px] text-tertiary font-bold">+0.6★</span>
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
        <span class="text-[10px] text-on-surface font-semibold truncate w-full">Base</span>
        <span class="text-[9px] text-tertiary font-bold">+0.6★</span>
      </button>
      <div style="grid-column: span 3;" class="flex flex-col justify-center gap-1 px-2 py-1.5 rounded-xl bg-surface-container-lowest/70">
        <span class="text-[10px] text-on-surface-variant font-semibold">Color base:</span>
        <div class="flex items-center gap-2">
          ${baseColors.map((bc, idx) => `
            <button type="button" data-base-idx="${idx}" title="${bc.name}" class="base-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform ${idx === 0 ? "ring-2 ring-tertiary scale-110" : ""}" style="background-color: ${bc.hex};"></button>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Barra de Color de piel justo encima de Finalizar Look
  const stationBox = document.getElementById("open-drawer-btn")?.closest(".flex.flex-col.w-full.rounded-2xl");
  const finishLookBtn = document.getElementById("finish-look-btn");
  if (stationBox && finishLookBtn && !document.getElementById("skin-color-bar")) {
    const skinBar = document.createElement("div");
    skinBar.id = "skin-color-bar";
    skinBar.className = "flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20";
    skinBar.innerHTML = `
      <span class="text-[11px] text-on-surface font-semibold">Color piel:</span>
      <div class="flex items-center gap-2">
        ${skinColors.map((sc, idx) => `
          <button type="button" data-skin-idx="${idx}" title="${sc.name}" class="skin-color-btn w-6 h-6 rounded-full border border-white/50 transition-transform active:scale-90" style="background-color: ${sc.hex};"></button>
        `).join("")}
      </div>
    `;
    stationBox.insertBefore(skinBar, finishLookBtn);
  }

  // Eventos de selección de color para piel, labial, base y pestañas
  document.addEventListener("click", (e) => {
    const skinBtn = e.target.closest(".skin-color-btn");
    if (skinBtn) {
      const idx = parseInt(skinBtn.dataset.skinIdx, 10);
      const chosen = skinColors[idx] || skinColors[0];
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

    const lipBtn = e.target.closest(".lip-color-btn");
    if (lipBtn) {
      selectedLipColor = lipBtn.dataset.lipHex || lipColors[0].hex;
      lipEnabled = true;
      gameState.appliedItems.set("lips-toggle", { item: "lips-toggle", cat: "lips", gain: 0.6 });
      document.querySelector(`.cosmetic-card[data-item="lips-toggle"]`)?.classList.add("is-selected");
      document.querySelectorAll(".lip-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      lipBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
      refreshVisuals();
      return;
    }

    const baseBtn = e.target.closest(".base-color-btn");
    if (baseBtn) {
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
      selectedLashColor = lashBtn.dataset.lashHex || lashColors[0].hex;
      lashEnabled = true;
      gameState.appliedItems.set("eyes-lashes-toggle", { item: "eyes-lashes-toggle", cat: "liner", gain: 0.7 });
      document.querySelector(`.cosmetic-card[data-item="eyes-lashes-toggle"]`)?.classList.add("is-selected");
      document.querySelectorAll(".lash-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      lashBtn.classList.add("ring-2", "ring-tertiary", "scale-110");
      refreshVisuals();
    }
  });

  const catTabs = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tool-panel");
  catTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
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

  const playerScoreEl = document.getElementById("player-score");
  const scoreBarEl = document.getElementById("score-bar");
  const appliedCountEl = document.getElementById("applied-count");
  const applauseTextEl = document.getElementById("applause-text");

  function refreshVisuals() {
    let totalGain = 0;
    let activeHairSrc = null;

    gameState.appliedItems.forEach((meta, key) => {
      totalGain += meta.gain;
      if (meta.cat === "hair" && meta.hairSrc) activeHairSrc = meta.hairSrc;
      if (key === "lips-toggle") lipEnabled = true;
      if (key === "blush-toggle") baseEnabled = true;
      if (key === "eyes-lashes-toggle") lashEnabled = true;
    });

    gameState.playerScore = Math.min(10.0, +(gameState.baseScore + totalGain).toFixed(1));

    if (baseAvatarEl) {
      baseAvatarEl.classList.remove("hidden");
      baseAvatarEl.style.opacity = "1";
      baseAvatarEl.style.display = "block";
    }

    if (skinOverlayEl) {
      if (skinEnabled) {
        skinOverlayEl.style.backgroundColor = selectedSkin.rgba;
        skinOverlayEl.classList.remove("hidden");
      } else {
        skinOverlayEl.classList.add("hidden");
      }
    }

    if (hairBadgeEl) {
      if (activeHairSrc) {
        hairBadgeEl.src = activeHairSrc;
        hairBadgeEl.classList.remove("hidden");
      } else {
        hairBadgeEl.classList.add("hidden");
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
        lipPosBox.style.background = `linear-gradient(180deg, ${selectedLipColor} 0%, #581c87 100%)`;
      }
    }

    if (playerScoreEl) playerScoreEl.textContent = gameState.playerScore.toFixed(1);
    if (scoreBarEl) scoreBarEl.style.width = `${Math.min(100, gameState.playerScore * 10)}%`;
    if (appliedCountEl) appliedCountEl.textContent = `${Math.min(8, gameState.appliedItems.size)} de 8`;
    if (applauseTextEl) {
      applauseTextEl.textContent = gameState.appliedItems.size > 0
        ? "¡Qué look tan bonito! ✨"
        : "¡Haz tu magia! ✨";
    }
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".cosmetic-card");
    if (!card) return;

    const item = card.dataset.item;
    const cat = card.dataset.cat;
    const gain = parseFloat(card.dataset.gain) || 0.5;
    const hairSrc = card.dataset.hairSrc || null;

    if (cat === "hair") {
      gameState.appliedItems.forEach((meta, k) => {
        if (meta.cat === "hair" && k !== item) {
          gameState.appliedItems.delete(k);
          document.querySelector(`.cosmetic-card[data-item="${k}"]`)?.classList.remove("is-selected");
        }
      });
    }

    if (gameState.appliedItems.has(item)) {
      gameState.appliedItems.delete(item);
      card.classList.remove("is-selected");
      if (item === "lips-toggle") lipEnabled = false;
      if (item === "blush-toggle") baseEnabled = false;
      if (item === "eyes-lashes-toggle") lashEnabled = false;
    } else {
      gameState.appliedItems.set(item, { item, cat, gain, hairSrc });
      card.classList.add("is-selected");
      if (item === "lips-toggle") lipEnabled = true;
      if (item === "blush-toggle") baseEnabled = true;
      if (item === "eyes-lashes-toggle") lashEnabled = true;
    }

    refreshVisuals();
  });

  const clearBtn = document.getElementById("open-drawer-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      gameState.appliedItems.clear();
      skinEnabled = false;
      lipEnabled = false;
      baseEnabled = false;
      lashEnabled = false;
      document.querySelectorAll(".cosmetic-card").forEach((c) => c.classList.remove("is-selected"));
      document.querySelectorAll(".skin-color-btn").forEach((b) => b.classList.remove("ring-2", "ring-tertiary", "scale-110"));
      refreshVisuals();
    });
  }

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
    finishBtn.addEventListener("click", () => {
      resultBox.classList.remove("hidden");
      resultBox.classList.add("flex");

      const won = gameState.playerScore >= gameState.rival.score;
      if (won) {
        gameState.defeatedRivals.add(gameState.rival.id || gameState.rival.name);
        gameState.wins = gameState.defeatedRivals.size;
        gameState.coins += 250;
        gameState.gems += 20;
        gameState.stars += 2;
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
    });
  }
});