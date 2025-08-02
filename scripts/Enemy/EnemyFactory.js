import { createBasicEnemyAI } from './EnemyAI.js';

export function spawnEnemy(game, playerRef, onPlayerDeath, onShroomDestroyed, getShrooms) {
    const el = document.createElement('div');
    el.className = 'enemy walk';
    el.style.left = Math.random() * (window.innerWidth - 30) + 'px';
    el.style.top = Math.random() * (window.innerHeight - 30) + 'px';

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

    const enemyObj = {
        el,
        health: 5,
        hpLabel,

        moveInterval: null,

        takeDamage() {
            this.health--;
            this.hpLabel.innerText = `${this.health} / 5`;
            this.el.classList.remove('walk');
            this.el.classList.add('hit');
            setTimeout(() => {
                this.el.classList.remove('hit');
                if (this.health > 0) this.el.classList.add('walk');
            }, 200);

            this.notifyDamage?.();

            if (this.health <= 0) {
                clearInterval(this.moveInterval);
                this.el.classList.remove('walk', 'hit');
                this.el.classList.add('death');
                setTimeout(() => {
                    if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
                }, 1000);
                return true;
            }

            return false;
        }
    };

    // Привязываем ИИ
    createBasicEnemyAI(enemyObj, playerRef, getShrooms); // передаём функцию

    // Движение
    enemyObj.moveInterval = setInterval(() => {
        if (!document.body.contains(enemyObj.el)) return clearInterval(enemyObj.moveInterval);
        enemyObj.updateAI?.();

        const ex = parseInt(enemyObj.el.style.left);
        const ey = parseInt(enemyObj.el.style.top);

        onShroomDestroyed(enemyObj.el, ex, ey);
        onPlayerDeath(enemyObj.el, ex, ey);
    }, 200);

    return enemyObj;
}
