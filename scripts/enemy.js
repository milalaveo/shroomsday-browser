// scripts/enemy.js
import { getPlayerPosition } from './player.js';

export function spawnEnemy(game, playerRef, onPlayerDeath, onShroomDestroyed) {
    const el = document.createElement('div');
    el.className = 'enemy';
    el.innerText = '👾';
    el.style.left = Math.random() * (window.innerWidth - 30) + 'px';
    el.style.top = Math.random() * (window.innerHeight - 30) + 'px';

    // Добавим текстовое поле для здоровья
    const hpLabel = document.createElement('div');
    hpLabel.className = 'enemy-hp';
    hpLabel.innerText = '5 / 5';
    hpLabel.style.position = 'absolute';
    hpLabel.style.fontSize = '10px';
    hpLabel.style.textAlign = 'center';
    hpLabel.style.width = '30px';
    hpLabel.style.top = '32px';
    hpLabel.style.left = '0px';
    el.appendChild(hpLabel);

    game.appendChild(el);

    let health = 5;

    const obj = {
        el,
        health,
        hpLabel,
        moveInterval: setInterval(() => {
            if (!document.body.contains(el)) return clearInterval(obj.moveInterval);
            if (!playerRef.current) return;

            const { x: px, y: py } = getPlayerPosition(playerRef.current);
            let ex = parseInt(el.style.left);
            let ey = parseInt(el.style.top);
            ex += Math.sign(px - ex) * 8;
            ey += Math.sign(py - ey) * 8;
            el.style.left = ex + 'px';
            el.style.top = ey + 'px';

            onShroomDestroyed(el, ex, ey);
            onPlayerDeath(el, ex, ey);
        }, 200),

        takeDamage() {
            this.health--;
            this.hpLabel.innerText = `${this.health} / 5`;
            return this.health <= 0;
        }
    };

    return obj;
}