document.querySelector('strong');

class Snake {
  constructor() {
    this.strong = document.querySelector('strong');
    this.points = 2;
    this.results = 0;
    this.snake = [{ x: 10, y: 10 }];
    this.apple = this.generateAppleLocation();
    this.running = false;
    this.move = { x: 0, y: 0 };
    this.nextMove = { x: 0, y: 0 };
    this.ctx = document.querySelector('canvas').getContext('2d');
    this.startGame();
  }

  // tworenie współrzędnych jabłka, gdy tworzone jest w miejscu powstania węża torzone jest ponownie
  generateAppleLocation() {
    let location = {
      x: this.generateRandomNumber(19),
      y: this.generateRandomNumber(19),
    };

    while (
      this.snake.filter(
        (square) => square.x === location.x && square.y === location.y
      ).length > 0
    ) {
      location = {
        x: this.generateRandomNumber(19),
        y: this.generateRandomNumber(19),
      };
    }

    return location;
  }

  generateRandomNumber(number) {
    return Math.floor(Math.random() * (number + 1));
  }

  // nextmove w zależności od naciśnietych strzałek i aktywacja parametry running
  addKeyDownEventListener() {
    document.addEventListener('keydown', (e) => {
      if (e.code.startsWith('Arrow')) {
        this.running = true;
      }
      switch (e.code) {
        case 'ArrowUp':
          this.nextMove = { x: 0, y: -1 };
          break;
        case 'ArrowRight':
          this.nextMove = { x: 1, y: 0 };
          break;
        case 'ArrowDown':
          this.nextMove = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          this.nextMove = { x: -1, y: 0 };
          break;
      }
    });
  }

  //zachowanie w przypadku dotknięcia ściany planszy
  getBounding(number) {
    if (number > 19) {
      return 0;
    } else if (number < 0) {
      return 19;
    } else {
      return number;
    }
  }

  findHeadSnake() {
    return this.snake[this.snake.length - 1];
  }

  // funkcja wywoływana co 100ms, rysuje węża
  renderFrame() {
    if (this.running) {
      if (
        this.nextMove.x !== -this.move.x ||
        this.nextMove.y !== -this.move.y
      ) {
        this.move = this.nextMove;
      }

      this.snake.push({
        x: this.getBounding(this.findHeadSnake().x + this.move.x),
        y: this.getBounding(this.findHeadSnake().y + this.move.y),
      });

      if (
        this.snake.filter(
          (square) =>
            square.x === this.findHeadSnake().x &&
            square.y === this.findHeadSnake().y
        ).length >= 2
      ) {
        this.restartGame();
      }

      if (
        this.apple.x === this.findHeadSnake().x &&
        this.apple.y === this.findHeadSnake().y
      ) {
        this.points++;
        this.results += 100;
        this.strong.innerText = this.results;
        this.apple = this.generateAppleLocation();
      }

      if (this.points <= 0) {
        this.snake.shift();
      } else {
        this.points--;
      }
    }

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'yellow';
    this.snake.forEach((square) =>
      this.ctx.fillRect(square.x * 20, square.y * 20, 18, 18)
    );
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.apple.x * 20, this.apple.y * 20, 18, 18);
  }

  startGame() {
    this.addKeyDownEventListener();
    this.renderFrame();
    this.interval = setInterval(this.renderFrame.bind(this), 100);
  }

  restartGame() {
    this.points = 2;
    this.results = 0;
    this.strong.innerText = 0;
    this.snake = [{ x: 10, y: 10 }];
    this.apple = this.generateAppleLocation();
    this.running = false;
    this.move = { x: 0, y: 0 };
    this.nextMove = { x: 0, y: 0 };
    this.ctx = document.querySelector('canvas').getContext('2d');
    clearInterval(this.interval);
    this.startGame();
  }
}

const snake = new Snake();
