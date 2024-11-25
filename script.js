const gameBoard = document.querySelector('.game-board');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let level = 1;
let score = 0;
let timer = 30;
let timerInterval;
let flippedCards = [];
let matchedPairs = 0;

// 生成卡片
function generateCards(cardCount) {
  gameBoard.innerHTML = '';
  const shapes = ['circle', 'square', 'triangle', 'star'];
  const patterns = [];

  for (let i = 0; i < cardCount / 2; i++) {
    const shape = shapes[i % shapes.length];
    patterns.push(shape, shape); // 每种图案成对
  }

  const shuffledPatterns = patterns.sort(() => Math.random() - 0.5);

  shuffledPatterns.forEach(pattern => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.pattern = pattern;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    front.textContent = '?';

    const back = document.createElement('div');
    back.classList.add('card-back');

    // 动态添加图案
    const shape = document.createElement('div');
    shape.classList.add('shape', pattern); // 添加图案的类名
    back.appendChild(shape);

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);

    card.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

// 翻转卡片逻辑
function flipCard(card) {
  if (flippedCards.length < 2 && !card.classList.contains('flip')) {
    card.classList.add('flip');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}

// 检查是否匹配
function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.pattern === card2.dataset.pattern) {
    matchedPairs++;
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    flippedCards = [];
    if (matchedPairs === gameBoard.children.length / 2) {
      clearInterval(timerInterval);
      setTimeout(nextLevel, 1000);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
      flippedCards = [];
    }, 1000);
  }
}

// 下一关
function nextLevel() {
  level++;
  levelDisplay.textContent = `Level: ${level}`;
  matchedPairs = 0;

  // 判断是否达到游戏结束条件
  if (level > 10) { // 假设 10 关为游戏结束
    endGame();
    return;
  }

  timer = Math.max(10, 30 - level * 2); // 随关卡递减时间，最少10秒
  startGame();
}

// 游戏结束逻辑
function endGame() {
  clearInterval(timerInterval);
  alert(`Game Over! Your final score is: ${score}`);
  window.location.href = 'index.html'; // 跳转回主页
}

// 开始游戏
function startGame() {
  generateCards(level * 4); // 每关卡片数增加
  timerDisplay.textContent = `Time: ${timer}s`;
  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Time: ${timer}s`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      alert('Time is up!');
      endGame(); // 时间到后结束游戏并返回主页
    }
  }, 1000);
}

// 按钮绑定
restartBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', () => window.location.href = 'index.html');

// 初始化游戏
startGame();
