export function createPlayer(game, emoji = '🌱', x = 200, y = 200) {
    const el = document.createElement('div');
    el.className = 'player';
    el.innerText = emoji;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    game.appendChild(el);
    return el;
}

export function getPlayerPosition(player) {
    return {
        x: parseInt(player.style.left),
        y: parseInt(player.style.top)
    };
}