// js/state.js - Estado global del juego
const gameState = {
  activeScreen: "screen-estudio",
  playerName: "Sofía M.",
  customPhotoUrl: "",
  level: 12,
  coins: 4800,
  gems: 320,
  stars: 86,
  wins: 0,
  defeatedRivals: new Set(),
  trophyUnlocked: false,
  baseScore: 5.2,
  playerScore: 5.2,
  rival: {
    id: 1, name: "Camila", score: 7.8, style: "Reina del Delineado", look: "Look Tokio"
  },
  appliedItems: new Map(),
  soundOn: true
};