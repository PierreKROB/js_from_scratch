const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Paramètres du jeu
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const DEAD_ZONE = 0.1;

// Position initiale des raquettes et de la balle
let player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, score: 0 };
let player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, score: 0 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, speedX: 4, speedY: 4 };

// Dessiner les raquettes
function drawPaddle(x, y, width, height) {
    context.fillStyle = '#fff';
    context.fillRect(x, y, width, height);
}

// Dessiner la balle
function drawBall(x, y, size) {
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fillStyle = '#fff';
    context.fill();
    context.closePath();
}

// Mettre à jour le jeu
function update() {
    // Mouvement de la balle
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Collision avec les murs
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.speedY *= -1;
    }

    // Collision avec les raquettes
    if (ball.x - ball.size < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height) {
        ball.speedX *= -1;
    } else if (ball.x + ball.size > player2.x &&
               ball.y > player2.y &&
               ball.y < player2.y + player2.height) {
        ball.speedX *= -1;
    }

    // Marquer un point
    if (ball.x - ball.size < 0) {
        player2.score++;
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        player1.score++;
        resetBall();
    }

    // Dessiner les éléments
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(player1.x, player1.y, player1.width, player1.height);
    drawPaddle(player2.x, player2.y, player2.width, player2.height);
    drawBall(ball.x, ball.y, ball.size);

    // Dessiner les scores
    context.fillStyle = '#fff';
    context.font = '45px Arial';
    context.fillText(player1.score, canvas.width / 4, 50);
    context.fillText(player2.score, 3 * canvas.width / 4, 50);

    requestAnimationFrame(update);
}

// Réinitialiser la balle
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX *= -1;
    ball.speedY *= -1;
}

// Fonction pour mettre à jour l'état des gamepads
function updateGamepads() {
    const gamepads = navigator.getGamepads();

    if (gamepads[0]) {
        const axes = gamepads[0].axes;
        if (Math.abs(axes[1]) > DEAD_ZONE) {
            player1.y += axes[1] * 5;
            player1.y = Math.max(0, Math.min(canvas.height - player1.height, player1.y));
        }
    }

    if (gamepads[1]) {
        const axes = gamepads[1].axes;
        if (Math.abs(axes[1]) > DEAD_ZONE) {
            player2.y += axes[1] * 5;
            player2.y = Math.max(0, Math.min(canvas.height - player2.height, player2.y));
        }
    }

    requestAnimationFrame(updateGamepads);
}

// Démarrer le jeu
requestAnimationFrame(update);
requestAnimationFrame(updateGamepads);
