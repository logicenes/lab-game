// Elemente
const startScreen = document.getElementById('startScreen');
const gameWrapper = document.getElementById('gameWrapper');
const gameOverScreen = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const player = document.getElementById('player');
const obstacleContainer = document.getElementById('obstacleContainer');

let gameRunning = false;
let jumpTimeout;
let obstacleInterval;
let gameLoopId;


startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);


function startGame() {
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  gameWrapper.classList.remove('hidden');

  obstacleContainer.innerHTML = '';
  player.style.bottom = '20px';

  gameRunning = true;

  document.addEventListener('keydown', handleJump); 

  obstacleInterval = setInterval(spawnObstacle, 1500);
  gameLoopId = requestAnimationFrame(gameLoop);
}


function handleJump(e) {
  if (!gameRunning) return;

  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (jumpTimeout) return;

    player.style.bottom = '120px';
    jumpTimeout = setTimeout(() => {
      player.style.bottom = '20px';
      jumpTimeout = null;
    }, 420);
  }
}


function spawnObstacle() {
  const obs = document.createElement('div');
  obs.classList.add('obstacle');
  obs.style.right = '-50px';
  obstacleContainer.appendChild(obs);
}


function gameLoop() {
  if (!gameRunning) return;

  const obstacles = document.querySelectorAll('.obstacle');

  obstacles.forEach(obs => {
    let right = parseInt(obs.style.right) || 0;
    right += 5;
    obs.style.right = right + 'px';

    if (right > window.innerWidth + 50) {
      obs.remove();
    }

    if (checkCollision(player, obs)) {
      endGame();
    }
  });

  gameLoopId = requestAnimationFrame(gameLoop);
}


function checkCollision(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(r1.right < r2.left ||
           r1.left > r2.right ||
           r1.bottom < r2.top ||
           r1.top > r2.bottom);
}


function endGame() {
  gameRunning = false;
  cancelAnimationFrame(gameLoopId);
  clearInterval(obstacleInterval);

  document.removeEventListener('keydown', handleJump); 

  gameWrapper.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
}
