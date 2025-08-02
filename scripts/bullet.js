export function shootBullet(game, getPlayer, enemies, spores, onShroomGrown) {
    game.addEventListener('click', (e) => {
        const player = getPlayer();
        if (!player) return;

        const { x: px, y: py } = getPos(player);
        const angle = Math.atan2(e.clientY - py, e.clientX - px);
        const dx = Math.cos(angle) * 8;
        const dy = Math.sin(angle) * 8;

        const bullet = createCircle(game, 'bullet', '🔸', px, py);

        const interval = setInterval(() => {
            const bx = parseInt(bullet.style.left) + dx;
            const by = parseInt(bullet.style.top) + dy;
            bullet.style.left = bx + 'px';
            bullet.style.top = by + 'px';

            enemies.forEach((enemyObj, index) => {
                const enemy = enemyObj.el;
                const ex = parseInt(enemy.style.left);
                const ey = parseInt(enemy.style.top);

                if (Math.abs(ex - bx) < 20 && Math.abs(ey - by) < 20) {
                    for (let i = 0; i < spores.length; i++) {
                        const sx = parseInt(spores[i].style.left);
                        const sy = parseInt(spores[i].style.top);
                        if (Math.hypot(ex - sx, ey - sy) < 40) {
                            onShroomGrown(sx, sy, i);
                            break;
                        }
                    }

                    clearInterval(interval);
                    const isDead = enemyObj.takeDamage();
                    if (isDead) {
                        game.removeChild(enemy);
                        enemies.splice(index, 1);
                    }
                    game.removeChild(bullet);

                }
            });

            if (bx < 0 || by < 0 || bx > window.innerWidth || by > window.innerHeight) {
                clearInterval(interval);
                game.removeChild(bullet);
            }
        }, 30);
    });
}

function createCircle(game, cls, emoji, x, y) {
    const el = document.createElement('div');
    el.className = cls;
    el.innerText = emoji;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    game.appendChild(el);
    return el;
}

function getPos(el) {
    return {
        x: parseInt(el.style.left),
        y: parseInt(el.style.top)
    };
}
