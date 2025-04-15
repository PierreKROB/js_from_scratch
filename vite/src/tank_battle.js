const canvas = document.getElementById('tankCanvas');
const context = canvas.getContext('2d');

// Paramètres du jeu
const tankSize = 20;
const bulletSize = 5;
const bulletSpeed = 7;
const DEAD_ZONE = 0.1;

// Position initiale des tanks
let tank1 = { x: 100, y: 100, angle: 0, bullets: [] };
let tank2 = { x: 700, y: 500, angle: Math.PI, bullets: [] };

// Dessiner un tank
function drawTank(tank) {
    context.save();
    context.translate(tank.x, tank.y);
    context.rotate(tank.angle);
    context.fillStyle = '#fff';
    context.fillRect(-tankSize / 2, -tankSize / 2, tankSize, tankSize);
    context.restore();
}

// Dessiner une balle
function drawBullet(bullet) {
    context.fillStyle = 'red';
    context.fillRect(bullet.x, bullet.y, bulletSize, bulletSize);
}

// Mettre à jour le jeu
function update() {
    // Mouvement des balles
    tank1.bullets.forEach(bullet => {
        bullet.x += Math.cos(bullet.angle) * bulletSpeed;
        bullet.y += Math.sin(bullet.angle) * bulletSpeed;
    });

    tank2.bullets.forEach(bullet => {
        bullet.x += Math.cos(bullet.angle) * bulletSpeed;
        bullet.y += Math.sin(bullet.angle) * bulletSpeed;
    });

    // Dessiner les éléments
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawTank(tank1);
    drawTank(tank2);
    tank1.bullets.forEach(drawBullet);
    tank2.bullets.forEach(drawBullet);

    requestAnimationFrame(update);
}

// Fonction pour mettre à jour l'état des gamepads
function updateGamepads() {
    const gamepads = navigator.getGamepads();

    if (gamepads[0]) {
        const axes = gamepads[0].axes;
        if (Math.abs(axes[0]) > DEAD_ZONE || Math.abs(axes[1]) > DEAD_ZONE) {
            tank1.x += Math.cos(tank1.angle) * axes[1] * 3;
            tank1.y += Math.sin(tank1.angle) * axes[1] * 3;
            tank1.angle += axes[0] * 0.05;
        }
        if (gamepads[0].buttons[0].pressed) {
            tank1.bullets.push({ x: tank1.x, y: tank1.y, angle: tank1.angle });
        }
    }

    if (gamepads[1]) {
        const axes = gamepads[1].axes;
        if (Math.abs(axes[0]) > DEAD_ZONE || Math.abs(axes[1]) > DEAD_ZONE) {
            tank2.x += Math.cos(tank2.angle) * axes[1] * 3;
            tank2.y += Math.sin(tank2.angle) * axes[1] * 3;
            tank2.angle += axes[0] * 0.05;
        }
        if (gamepads[1].buttons[0].pressed) {
            tank2.bullets.push({ x: tank2.x, y: tank2.y, angle: tank2.angle });
        }
    }

    requestAnimationFrame(updateGamepads);
}

// Démarrer le jeu
requestAnimationFrame(update);
requestAnimationFrame(updateGamepads);
