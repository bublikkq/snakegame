// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const startButton = document.getElementById('startButton');

  console.log('DOM Loaded');
  console.log('Canvas:', canvas);
  console.log('Context:', ctx);
  console.log('Score Element:', scoreElement);
  console.log('Start Button:', startButton);

  if (!canvas || !ctx || !scoreElement || !startButton) {
    console.error('One or more elements not found:', {
      canvas, ctx, scoreElement, startButton
    });
    return;
  }

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let dx = 0;
  let dy = 0;
  let score = 0;
  let gameActive = false;

  document.addEventListener('keydown', changeDirection);
  startButton.addEventListener('click', startGame);

  function startGame() {
    console.log('Start button clicked');
    if (!gameActive) {
      gameActive = true;
      dx = 1;
      dy = 0;
      snake = [{ x: 10, y: 10 }];
      score = 0;
      scoreElement.textContent = `Score: ${score}`;
      startButton.textContent = 'Restart Game';
      console.log('Game started, calling gameLoop');
      gameLoop();
    }
  }

  function changeDirection(event) {
    if (!gameActive) return;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) { dx = -1; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 1; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = 1; }
  }

  function drawGame() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreElement.textContent = `Score: ${score}`;
      generateFood();
    } else {
      snake.pop();
    }

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        checkCollision(head, snake)) {
      gameActive = false;
      startButton.textContent = 'Start Game';
      return;
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  }

  function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    if (checkCollision(food, snake)) generateFood();
  }

  function checkCollision(point, array) {
    return array.some(segment => segment.x === point.x && segment.y === point.y);
  }

  function gameLoop() {
    if (gameActive) {
      console.log('Game loop running');
      drawGame();
      setTimeout(gameLoop, 100);
    }
  }
});