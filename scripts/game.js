import { createPlayer, getPlayerPosition } from './player.js';
import { spawnEnemy } from './enemy.js';
import { shootBullet } from './bullet.js';

const game = document.getElementById('game');
const progress = document.getElementById('progress');
const counter = document.getElementById('counter');
const cooldownFill = document.getElementById('cooldownFill');

const playerRef = { current: null };
let isDead = false;
let canPlant = true;
let cooldownTime = 3000;
let cooldownRemaining = 0;
const goalShrooms = 10;
const keys = {};
const spores = [];
const shrooms = [];
const enemies = [];

playerRef.current = createPlayer(game);

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.code === 'Space') plantSpore();
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function movePlayer() {
    if (isDead || !playerRef.current) return;
    const speed = 10;
    let { x, y } = getPlayerPosition(playerRef.current);

    // W / Ц = вверх
    if (keys['w'] || keys['ц']) y -= speed;
    // S / Ы = вниз
    if (keys['s'] || keys['ы']) y += speed;
    // A / Ф = влево
    if (keys['a'] || keys['ф']) x -= speed;
    // D / В = вправо
    if (keys['d'] || keys['в']) x += speed;

    playerRef.current.style.left = x + 'px';
    playerRef.current.style.top = y + 'px';
}


function plantSpore() {
    if (!canPlant || !playerRef.current) return;
    const { x, y } = getPlayerPosition(playerRef.current);
    const spore = document.createElement('div');
    spore.className = 'spore';
    spore.innerText = '🟡';
    spore.style.left = x + 'px';
    spore.style.top = y + 'px';
    game.appendChild(spore);
    spores.push(spore);
    canPlant = false;
    cooldownRemaining = cooldownTime;
}

function updateCooldown() {
    if (cooldownRemaining > 0) {
        cooldownRemaining -= 50;
        const percent = 100 - (cooldownRemaining / cooldownTime) * 100;
        cooldownFill.style.width = percent + '%';
        if (cooldownRemaining <= 0) canPlant = true;
    }
}

function updateProgressBar() {
    const count = shrooms.length;
    counter.textContent = `🍄 ${count} / ${goalShrooms}`;
    progress.style.width = `${(count / goalShrooms) * 100}%`;
    if (count >= goalShrooms) {
        document.getElementById('victoryTime').textContent = getElapsedTime();
        document.getElementById('victoryModal').style.display = 'flex';
    }
}

function handlePlayerDeath(enemyEl, ex, ey) {
    if (!playerRef.current || isDead) return;
    const { x: px, y: py } = getPlayerPosition(playerRef.current);
    if (Math.abs(ex - px) < 20 && Math.abs(ey - py) < 20) {
        isDead = true;
        game.removeChild(playerRef.current);
        const last = shrooms.pop();
        if (last) {
            const { x, y } = getPlayerPosition(last);
            game.removeChild(last);
            setTimeout(() => {
                playerRef.current = createPlayer(game, '🌱', x, y);
                isDead = false;
                updateProgressBar();
            }, 1000);
        } else {
            document.getElementById('gameOverTime').textContent = getElapsedTime();
            document.getElementById('gameOverModal').style.display = 'flex';

        }
    }
}

function handleShroomDestroyed(enemyEl, ex, ey) {
    for (let i = 0; i < shrooms.length; i++) {
        const sx = parseInt(shrooms[i].style.left);
        const sy = parseInt(shrooms[i].style.top);
        if (Math.abs(ex - sx) < 20 && Math.abs(ey - sy) < 20) {
            game.removeChild(shrooms[i]);
            shrooms.splice(i, 1);
            updateProgressBar();
            break;
        }
    }
}

function growShroom(x, y, sporeIndex) {
    const shroom = document.createElement('div');
    shroom.className = 'shroom';
    shroom.innerText = '🍄';
    shroom.style.left = x + 'px';
    shroom.style.top = y + 'px';
    game.appendChild(shroom);
    shrooms.push(shroom);
    game.removeChild(spores[sporeIndex]);
    spores.splice(sporeIndex, 1);
    updateProgressBar();
}

function spawn() {
    const enemyObj = spawnEnemy(game, playerRef, handlePlayerDeath, handleShroomDestroyed);
    enemies.push(enemyObj);
}

shootBullet(game, () => playerRef.current, enemies, spores, growShroom);

let startTime = Date.now();

function getElapsedTime() {
    const ms = Date.now() - startTime;
    const seconds = Math.floor(ms / 1000);
    return `${seconds} сек.`;
}

// Game Loop
setInterval(() => {
    movePlayer();
    updateCooldown();
}, 50);

setInterval(spawn, 5000);
