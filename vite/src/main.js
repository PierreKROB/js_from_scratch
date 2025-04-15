// Vérifie si le navigateur supporte l'API Gamepad
if (!('getGamepads' in navigator)) {
  alert('L\'API Gamepad n\'est pas supportée par votre navigateur.');
}

// Variables
let gamepads = [];
let cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const gamepadStatusElement = document.getElementById('gamepad-status');
const cursorElement = document.getElementById('cursor');
const pongButton = document.getElementById('pong-button');
const tankButton = document.getElementById('tank-button');
const DEAD_ZONE = 0.1;

// Initialisation visuelle du curseur
cursorElement.style.position = 'absolute';
cursorElement.style.width = '20px';
cursorElement.style.height = '20px';
cursorElement.style.backgroundColor = 'red';
cursorElement.style.borderRadius = '50%';
cursorElement.style.left = `${cursor.x}px`;
cursorElement.style.top = `${cursor.y}px`;

// Cache le curseur et les boutons au départ
setVisibility(false);

// Fonction principale de mise à jour
function updateGamepadStatus() {
  const gp = navigator.getGamepads();
  gamepads = [];

  for (let i = 0; i < gp.length; i++) {
    if (gp[i]) {
      gamepads.push(gp[i]);
    }
  }

  gamepadStatusElement.textContent = `En attente de 2 manettes : ${gamepads.length}/2`;

  // Affiche ou masque le curseur et les boutons selon le nombre de manettes
  if (gamepads.length >= 2) {
    setVisibility(true);

    const axes = gamepads[0].axes;
    if (Math.abs(axes[0]) > DEAD_ZONE) {
      cursor.x += axes[0] * 5;
    }
    if (Math.abs(axes[1]) > DEAD_ZONE) {
      cursor.y += axes[1] * 5;
    }

    // Contrainte à l'écran
    cursor.x = Math.max(0, Math.min(window.innerWidth, cursor.x));
    cursor.y = Math.max(0, Math.min(window.innerHeight, cursor.y));

    // Mise à jour position curseur
    cursorElement.style.left = `${cursor.x}px`;
    cursorElement.style.top = `${cursor.y}px`;

    if (gamepads[0].buttons[0].pressed) {
      simulateClick();
    }
  } else {
    setVisibility(false);
  }

  requestAnimationFrame(updateGamepadStatus);
}

// Simule le clic via curseur
function simulateClick() {
  if (isCursorOver(pongButton)) {
    window.location.href = 'pong.html';
  } else if (isCursorOver(tankButton)) {
    window.location.href = 'tank_battle.html';
  }
}

// Vérifie si le curseur est sur un bouton
function isCursorOver(element) {
  const rect = element.getBoundingClientRect();
  return (
    cursor.x > rect.left &&
    cursor.x < rect.right &&
    cursor.y > rect.top &&
    cursor.y < rect.bottom
  );
}

// Affiche ou masque les éléments interactifs
function setVisibility(visible) {
  const displayValue = visible ? 'block' : 'none';
  cursorElement.style.display = displayValue;
  pongButton.style.display = displayValue;
  tankButton.style.display = displayValue;
}

// Connexion/Déconnexion de manette
function connectGamepad() {
  updateGamepadStatus();
}

window.addEventListener('gamepadconnected', connectGamepad);
window.addEventListener('gamepaddisconnected', connectGamepad);

// Ajoute les clics directs (souris, fallback)
pongButton.addEventListener('click', () => {
  window.location.href = 'pong.html';
});
tankButton.addEventListener('click', () => {
  window.location.href = 'tank_battle.html';
});

// Démarre la boucle
requestAnimationFrame(updateGamepadStatus);
