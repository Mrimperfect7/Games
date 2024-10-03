const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 5,
    bullets: []
};

const enemies = [];
const enemySize = 50;
const keys = {};

// Player movement
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Shooting mechanic
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        player.bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10, color: 'yellow' });
    }
});

// Update game state
function update() {
    // Move player
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

    // Move bullets
    player.bullets = player.bullets.filter(bullet => bullet.y > 0);
    player.bullets.forEach(bullet => {
        bullet.y -= 5;
    });

    // Spawn enemies
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - enemySize),
            y: -enemySize,
            width: enemySize,
            height: enemySize,
            color: 'red',
            speed: 2
        });
    }

    // Move enemies
    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
    });

    // Bullet-enemy collision
    enemies.forEach((enemy, i) => {
        player.bullets.forEach((bullet, j) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(i, 1);
                player.bullets.splice(j, 1);
            }
        });
    });
}

// Render game objects
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    player.bullets.forEach(bullet => {
        context.fillStyle = bullet.color;
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
        context.fillStyle = enemy.color;
        context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
