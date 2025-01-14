const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboardList');
const size = 4;
let activeBoxes = [];
let currentLevel = 1;
let score = 0;

// Load leaderboard from LocalStorage
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Create grid
for (let i = 0; i < size * size; i++) {
  const box = document.createElement('div');
  box.className = 'box';
  grid.appendChild(box);
  box.addEventListener('click', () => boxClick(i));
}

// Start Game with Countdown (adjusted for first start time)
function startGameWithCountdown() {
  let countdown = 5; // 设置为 5 秒（可以修改为其他时间）
  scoreDisplay.textContent = `Game starts in: ${countdown}`;
  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      scoreDisplay.textContent = `Game starts in: ${countdown}`;
    } else {
      clearInterval(interval);
      scoreDisplay.textContent = `Score: 0`;
      startGame(); // 倒计时结束后开始游戏
    }
  }, 1000); // 1 秒倒计时
}

// Main game logic (will increase active boxes with levels)
function startGame() {
  activeBoxes = generateRandom(currentLevel + 2); // 随着关卡增加激活的方块数
  highlightBoxes(activeBoxes); // 高亮显示激活的方块
  setTimeout(() => resetBoxes(), 1000); // 1 秒后重置方块
}

// Generate random unique indices for active boxes
function generateRandom(count) {
  const indices = [];
  while (indices.length < count) {
    const index = Math.floor(Math.random() * size * size);
    if (!indices.includes(index)) indices.push(index);
  }
  return indices;
}

// Highlight active boxes
function highlightBoxes(indices) {
  indices.forEach(i => grid.children[i].classList.add('active'));
}

// Reset boxes to normal
function resetBoxes() {
  document.querySelectorAll('.active').forEach(box => box.classList.remove('active'));
}

// Handle box click
function boxClick(index) {
  if (activeBoxes.includes(index)) {
    const clickedIndex = activeBoxes.indexOf(index);
    activeBoxes.splice(clickedIndex, 1); // 点击后从激活数组中移除
    if (activeBoxes.length === 0) {
      score += 10 * currentLevel; // 关卡得分
      scoreDisplay.textContent = `Score: ${score}`;
      currentLevel++; // 增加下一关
      setTimeout(startGame, 1000); // 新一轮开始前有延迟
    }
  } else {
    gameOver(); // 错误点击结束游戏
  }
}

// Game Over logic (after a wrong click)
function gameOver() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Game Over!</h2>
      <p>Your final score is: <strong>${score}</strong></p>
      <label for="playerName">Enter your name:</label>
      <input type="text" id="playerName" placeholder="Your Name" />
      <button id="saveScoreBtn">Save Score</button>
      <button id="restartBtn">Restart Game</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('saveScoreBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    if (playerName) {
      leaderboard.push({ name: playerName, score });
      leaderboard.sort((a, b) => b.score - a.score); // 排行榜按分数降序排序
      leaderboard = leaderboard.slice(0, 10); // 只保留前 10 名
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      updateLeaderboard();
      alert('Score saved!');
      restartGame();
    } else {
      alert('Please enter your name to save your score.');
    }
  });
  document.getElementById('restartBtn').addEventListener('click', restartGame);
}

// Restart the game
function restartGame() {
  const modal = document.querySelector('.modal');
  if (modal) modal.remove();
  resetGame();
}

// Reset the game state
function resetGame() {
  score = 0;
  currentLevel = 1;
  activeBoxes = []; // 清空激活方块
  resetBoxes(); // 清空所有方块状态
  setTimeout(() => startGameWithCountdown(), 500); // 等待 0.5 秒再开始新的一轮
}

// Update leaderboard display
function updateLeaderboard() {
  leaderboardList.innerHTML = '';
  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// Initialize leaderboard
updateLeaderboard();
startGameWithCountdown(); // 启动游戏并执行倒计时
