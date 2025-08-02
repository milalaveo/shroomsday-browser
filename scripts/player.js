export function createPlayer(game, x = 200, y = 200) {
    const el = document.createElement('div');
    el.className = 'player idle';
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