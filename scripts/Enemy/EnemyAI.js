import { getPlayerPosition } from '../player.js';

export function createBasicEnemyAI(enemyObj, playerRef, getShrooms) {
    let aggroToPlayer = false;
    let aggroTimeout = null;

    function updateTarget() {
        const shrooms = getShrooms();
        if (!aggroToPlayer && shrooms && shrooms.length > 0) {
            // Ищем ближайшую грибницу
            const ex = parseInt(enemyObj.el.style.left);
            const ey = parseInt(enemyObj.el.style.top);
            let nearest = null;
            let minDist = Infinity;
            for (const shroom of shrooms) {
                const sx = parseInt(shroom.style.left);
                const sy = parseInt(shroom.style.top);
                const dist = Math.hypot(ex - sx, ey - sy);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = { x: sx, y: sy };
                }
            }
            enemyObj.target = nearest;
        } else {
            // Идём к игроку
            const player = playerRef.current;
            if (player) {
                const x = parseInt(player.style.left);
                const y = parseInt(player.style.top);
                enemyObj.target = { x, y };
            }
        }
    }

    function updateAI() {
        updateTarget(); // 💡 нужно вызывать КАЖДЫЙ РАЗ
        const ex = parseInt(enemyObj.el.style.left);
        const ey = parseInt(enemyObj.el.style.top);

        if (!enemyObj.target) return;

        const dx = enemyObj.target.x - ex;
        const dy = enemyObj.target.y - ey;
        const dist = Math.hypot(dx, dy);
        const speed = 5;

        if (dist > 1) {
            enemyObj.el.style.left = ex + (dx / dist) * speed + 'px';
            enemyObj.el.style.top = ey + (dy / dist) * speed + 'px';
        }
    }

    enemyObj.updateAI = updateAI;

    // 👉 Реакция на урон
    enemyObj.notifyDamage = () => {
        aggroToPlayer = true;
        clearTimeout(aggroTimeout);
        aggroTimeout = setTimeout(() => {
            aggroToPlayer = false;
        }, 5000); // 5 секунд агро на игрока
    };
}

