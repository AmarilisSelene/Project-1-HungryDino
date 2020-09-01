window.onload = () => {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");
  let id = null;
  let start = false;

  class Player {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width + 40;
      this.height = height + 30; //assim ele fica na linha, nao ultrapassa, mas como deixar o dino
      this.speedX = 0;
      this.direction = "l";
      this.dinoImg = new Image();
      this.dinoImg.src = "./assets/Dino Sprite Left/Run (1)L.png";
      this.dinoImgDir = new Image();
      this.dinoImgDir.src = "./assets/Dino Sprite Right/Run (1).png";
    }

    createPlayer() {
      if (this.direction === "l") {
        context.drawImage(
          this.dinoImg,
          this.x,
          this.y,
          this.width,
          this.height
        );
      } else {
        context.drawImage(
          this.dinoImgDir,
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
    }

    newPos() {
      if (this.x >= 0 && this.x <= canvas.width - this.width) {
        this.x += this.speedX;
      } else if (this.x < 0) {
        this.x = 1;
      } else if (this.x >= canvas.width - this.width) {
        this.x = canvas.width - 50;
      }
    }

    left() {
      return this.x;
    }
    right() {
      return this.x + this.width;
    }
    top() {
      return this.y + 10;
    }

    crashWith(obstacle) {
      return (
        this.top() === obstacle.bottom() &&
        this.right() >= obstacle.left() &&
        this.left() <= obstacle.right()
      );
    }
  }

  class Obstacle {
    constructor(x) {
      this.x = x;
      this.y = 0;
      this.width = 30;
      this.height = 30;
    }

    createObstacle() {
      this.fruitImg = new Image();
      this.fruitImg.src = "./assets/Food copy/Avocado.png";
      context.drawImage(this.fruitImg, this.x, this.y, this.width, this.height);
    }

    createMeat() {
      this.meatImg = new Image();
      this.meatImg.src = "./assets/Food copy/ChickenLeg.png";
      context.drawImage(
        this.meatImg,
        this.x,
        this.y,
        this.width + 10,
        this.height + 10
      );
    }

    moveObstacle() {
      this.y += 5;
    }

    left() {
      return this.x;
    }
    right() {
      return this.x + this.width;
    }
    top() {
      return this.y;
    }
    bottom() {
      return this.y + this.height;
    }
  }

  let player = new Player(canvas.width / 2, canvas.height - 70, 50, 50);
  let frames = 0;
  let fruits = [];
  let lifes = 1;
  let meat = [];

  // Criando novos obstaculos + guardando no array + movendo
  function createObstaclesFunction() {
    frames += 1;
    if (lifes < 15) {
      if (frames % 50 === 0) {
        fruits.push(
          new Obstacle(Math.floor(Math.random() * (canvas.width - 25)))
        );
      }
    } else if (lifes >= 15) {
      if (frames % 35 === 0) {
        fruits.push(
          new Obstacle(Math.floor(Math.random() * (canvas.width - 25)))
        );
      }
    }
    if (frames % 150 === 0) {
      setTimeout(function () {
        meat.push(
          new Obstacle(Math.floor(Math.random() * (canvas.width - 25)))
        );
      }, 2000);
    }
  }

  function moveObstaclesFunction() {
    fruits.forEach((elem, index) => {
      elem.createObstacle();
      elem.moveObstacle();
      if (elem.y >= canvas.height) {
        fruits.splice(index, 1);
      }
    });
    meat.forEach((elem, index) => {
      elem.createMeat();
      elem.moveObstacle();
      if (elem.y >= canvas.height) {
        meat.splice(index, 1);
      }
    });
  }

  function checkCrash() {
    let crashed = fruits.some(function (fruit) {
      return player.crashWith(fruit);
    });

    if (crashed) {
      if (lifes > 0) {
        fruits.forEach((element, index) => {
          fruits.splice(index, 1);
          lifes -= 1;
        });

        // GAME OVER
      } else {
        cancelAnimationFrame(id);
        fruits.forEach((element, index) => {
          fruits.splice(index, 1);
        });
        context.font = "40px verdana";
        context.fillStyle = "#fff";
        context.fillText("GAME OVER! SPECIES EXTINCT", 6, canvas.height / 2);
      }
    }
  }

  function checkCatch() {
    let catched = meat.some(function (meat) {
      return player.crashWith(meat);
    });

    if (catched) {
      if (lifes >= 0) {
        meat.forEach((element, index) => {
          meat.splice(index, 1);
          lifes += 1;
        });
      }
      if (lifes >= 10) {
        lifes = 10;
        cancelAnimationFrame(id);
        context.font = "40px verdana";
        context.fillStyle = "#fff";
        context.fillText(
          "OK. I'm full now, thanks",
          canvas.width / 3,
          canvas.height / 2
        );
      }
    }
  }

  function lifeScore(points) {
    context.beginPath();
    context.fillStyle = "rgb(151, 76, 64)";
    context.rect(220, 0, 80, 25);
    context.fill();
    context.font = "18px serif";
    context.fillStyle = "rgb(242,222,13)";
    context.fillText("Score: " + points, 225, 17);
  }

  // MOTOR
  function gameUpdate() {
    // "CLEAR" (BG)
    context.clearRect(0, 0, 700, 700);

    // PRINT O PLAYER
    player.createPlayer();
    player.newPos();

    // PRINT OBSTACULOS
    createObstaclesFunction();
    moveObstaclesFunction();

    // ANIMATION START
    id = requestAnimationFrame(gameUpdate);

    // WIN
    checkCatch();
    // CRASH
    checkCrash();
    /* PRINT SCORE
    lifeScore(lifes);*/
  }

  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37: // go left
        player.speedX = -4;
        player.direction = "l";
        break;
      case 39: // go right
        player.speedX = 4;
        player.direction = "r";
        break;
      case 13: // enter
        if (!start) {
          gameUpdate();
          start = true;
        } else {
          window.location.reload();
        }
    }
  };

  document.onkeyup = function (e) {
    player.speedX = 0;
    player.speedY = 0;
  };
};
