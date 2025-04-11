const clouds = document.createElement('img');
clouds.src = './imagens/clouds.png';
clouds.className = 'clouds';
document.querySelector('.game-board').appendChild(clouds);

const mario = document.querySelector('.mario');
let pipe = document.querySelector('.pipe');
const gameBoard = document.querySelector('.game-board');

const scoreEl = document.createElement('div');
scoreEl.className = 'score';
scoreEl.innerText = 'Score: 0';
gameBoard.appendChild(scoreEl);

const startScreen = document.createElement('div');
startScreen.className = 'start-screen';
startScreen.innerHTML = `<p>Pressione qualquer tecla ou toque para iniciar</p>`;
gameBoard.appendChild(startScreen);

const gameOverScreen = document.createElement('div');
gameOverScreen.className = 'game-over-screen';
gameOverScreen.innerHTML = `
  <h1>Game Over</h1>
  <button class="reiniciar-button" onclick="restartGame()">
    <span class="button_top">Reiniciar</span>
  </button>
`;
gameBoard.appendChild(gameOverScreen);

const grass = document.createElement('div');
grass.className = 'grass';
gameBoard.appendChild(grass);

let score = 0;
let gameRunning = false;
let gameStarted = false;
let pipeSpeed = 1300;
let scoreLoop, gameLoop;

function createPipe() {
  const newPipe = document.createElement('img');
  newPipe.src = './imagens/pipe.png';
  newPipe.className = 'pipe';
  newPipe.style.animation = `pipe-animation ${pipeSpeed}ms infinite linear`;
  gameBoard.appendChild(newPipe);
  pipe?.remove();
  pipe = newPipe;
}

const jump = () => {
  if (gameRunning && !mario.classList.contains('jump')) {
    mario.classList.add('jump');
    setTimeout(() => {
      mario.classList.remove('jump');
    }, 500);
  }
};

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  gameRunning = true;
  startScreen.remove();

  createPipe();

  gameLoop = setInterval(() => {
    const pipeRect = pipe.getBoundingClientRect();
    const marioRect = mario.getBoundingClientRect();

    const padding = 20;

    const collision =
      pipeRect.left + padding < marioRect.right - padding &&
      pipeRect.right - padding > marioRect.left + padding &&
      pipeRect.bottom - padding > marioRect.top + padding &&
      pipeRect.top + padding < marioRect.bottom - padding;
    
    if (collision) {
      pipe.style.animation = 'none';
      pipe.style.left = `${pipe.offsetLeft}px`;

      mario.style.animation = 'none';
      mario.src = './imagens/game-over.png';
      mario.style.bottom = `${window.getComputedStyle(mario).bottom}`;

      gameOverScreen.classList.add('active');
      clearInterval(scoreLoop);
      clearInterval(gameLoop);
      gameRunning = false;
    }
  }, 10);

  scoreLoop = setInterval(() => {
    if (gameRunning) {
      score++;
      scoreEl.innerText = `Score: ${score}`;

      if (score % 100 === 0 && score !== 0) {
        pipeSpeed = Math.max(pipeSpeed - 100, 200);

        const currentPipePosition = pipe.offsetLeft;
        if (currentPipePosition < 0) {
          createPipe();
        } else {
          const waitForExit = setInterval(() => {
            if (pipe.offsetLeft < 0) {
              createPipe();
              clearInterval(waitForExit);
            }
          }, 50);
        }
      }
    }
  }, 100);
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted) startGame();
  jump();
});
document.addEventListener('touchstart', (e) => {
  if (!gameStarted) startGame();
  jump();
});

function restartGame() {
  location.reload();
}

const style = document.createElement('style');
style.textContent = `
  .reiniciar-button {
    --button_radius: 0.75em;
    --button_color: #e8e8e8;
    --button_outline_color: #000000;
    font-size: 17px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: var(--button_radius);
    background: var(--button_outline_color);
  }

  .reiniciar-button .button_top {
    display: block;
    box-sizing: border-box;
    border: 2px solid var(--button_outline_color);
    border-radius: var(--button_radius);
    padding: 0.75em 1.5em;
    background: var(--button_color);
    color: var(--button_outline_color);
    transform: translateY(-0.2em);
    transition: transform 0.1s ease;
  }

  .reiniciar-button:hover .button_top {
    transform: translateY(-0.33em);
  }

  .reiniciar-button:active .button_top {
    transform: translateY(0);
  }

  .grass {
    position: absolute;
    bottom: -5px;
    width: 100%;
    height: 10px;
    background: repeating-linear-gradient(
      -45deg,
      #228B22,
      #228B22 5px,
      #2e8b57 5px,
      #2e8b57 10px
    );
    z-index: 1;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .start-screen {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 20px 40px;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    z-index: 10;
    text-align: center;
  }
`;
document.head.appendChild(style);
