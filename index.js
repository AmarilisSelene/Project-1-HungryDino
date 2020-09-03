window.onload = () => {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");
  let id = null;
  let start = false;

  //Sounds
  let eatSound = new Audio();
  eatSound.src = "./assets/EatSound.mp3";
  eatSound.volume = 0.2;
  let winSound = new Audio();
  winSound.src = "./assets/DinoRoarWin.wav";
  let gameoverSound = new Audio();
  gameoverSound.src = "./assets/GameOver.wav";

  class Player {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width + 50;
      this.height = height + 40;
      this.speedX = 0;
      this.direction = "l";
      this.dinoImg = new Image();
      this.dinoImg.src = "./assets/Dino Sprite Left/Run (3)L.png";
      this.dinoImgDir = new Image();
      this.dinoImgDir.src = "./assets/Dino Sprite Right/Run (3).png";
      this.dinoImgDead = new Image();
      this.dinoImgDead.src = "./assets/dino game over.png";
      this.dinoImgWin = new Image();
      this.dinoImgWin.src = "./assets/dino game win.png";
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
      } else if (this.x > canvas.width - this.width) {
        this.x -= 10;
      }
    }

    left() {
      return this.x;
    }
    right() {
      return this.x + this.width;
    }
    top() {
      return this.y + 60;
    }

    crashWith(obstacle) {
      return (
        this.top() === obstacle.bottom() &&
        this.right() >= obstacle.left() &&
        this.left() <= obstacle.right()
      );
    }
  }
  let obstaclesImages = [
    "./assets/Food-copy/Avocado.png",
    "./assets/Food-copy/Onion.png",
    "./assets/Food-copy/Pineapple.png",
  ];

  let obstaclesMeatsImages = [
    "./assets/Food-copy/ChickenLeg.png",
    "./assets/Food-copy/Boar.png",
    "./assets/Food-copy/Steak.png",
  ];

  class Obstacle {
    constructor(x, image) {
      this.x = x;
      this.y = 0;
      this.width = 30;
      this.height = 30;
      this.image = image;
    }

    createObstacle() {
      this.fruitImg = new Image();
      this.fruitImg.src = this.image;
      /*obstaclesImages[Math.floor(Math.random() * obstaclesImages.length)];
      context.drawImage(this.fruitImg, this.x, this.y, this.width, this.height);*/
      context.drawImage(
        this.fruitImg,
        this.x,
        this.y,
        this.width + 10,
        this.height + 10
      );
    }

    createMeat() {
      this.meatImg = new Image();
      this.meatImg.src = this.image;
      console.log(this.meatImg);
      /*obstaclesMeatsImages[
          Math.floor(Math.random() * obstaclesMeatsImages.length)
        ];*/
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
  let lifes = 0;
  let meats = [];

  function createObstaclesFunction() {
    frames += 1;
    if (lifes < 5) {
      //15
      if (frames % 50 === 0) {
        fruits.push(
          new Obstacle(
            Math.floor(Math.random() * (canvas.width - 25)),
            obstaclesImages[Math.floor(Math.random() * obstaclesImages.length)]
          )
        );
        console.log(fruits);
      }
    } else if (lifes >= 5) {
      //15
      if (frames % 35 === 0) {
        fruits.push(
          new Obstacle(
            Math.floor(Math.random() * (canvas.width - 25)),
            obstaclesImages[Math.floor(Math.random() * obstaclesImages.length)]
          )
        );
      }
    }
    if (frames % 150 === 0) {
      setTimeout(function () {
        meats.push(
          new Obstacle(
            Math.floor(Math.random() * (canvas.width - 25)),
            obstaclesMeatsImages[
              Math.floor(Math.random() * obstaclesMeatsImages.length)
            ]
          )
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
    meats.forEach((elem, index) => {
      elem.createMeat();
      elem.moveObstacle();
      if (elem.y >= canvas.height) {
        meats.splice(index, 1);
      }
    });
  }

  function checkCrash() {
    let crashed = fruits.some(function (fruit) {
      return player.crashWith(fruit);
    });

    if (crashed) {
      if (lifes > 0) {
        eatSound.play();
        fruits.forEach((element, index) => {
          fruits.splice(index, 1);
          lifes -= 1;
        });

        // GAME OVER
      } else {
        gameoverSound.play();
        cancelAnimationFrame(id);
        fruits.forEach((element, index) => {
          fruits.splice(index, 1);
        });
        context.drawImage(player.dinoImgDead, (this.x = 100), (this.y = 100));
      }
    }
  }

  function checkCatch() {
    let catched = meats.some(function (meats) {
      return player.crashWith(meats);
    });

    if (catched) {
      if (lifes >= 0) {
        eatSound.play();
        meats.forEach((element, index) => {
          meats.splice(index, 1);
          lifes += 1;
        });
      }

      if (lifes < 0) {
        eatSound.play();
        meats.forEach((element, index) => {
          meats.splice(index, 1);
          lifes += 1;
        });
      }

      if (lifes >= 10) {
        lifes = 10;
        winSound.play();
        cancelAnimationFrame(id);
        context.drawImage(player.dinoImgWin, (this.x = 100), (this.y = 100));
      }
    }
  }

  function lifeScore(points) {
    context.beginPath();
    context.fillStyle = "#051850";
    context.rect(220, 0, 80, 25);
    context.fill();
    context.font = "18px phosphate"; //serif
    context.fillStyle = "#fff";
    context.fillText("Score: " + points, 225, 17);
  }

  function gameUpdate() {
    context.clearRect(0, 0, 700, 700);

    player.createPlayer(); //for the player
    player.newPos(); //for the player

    createObstaclesFunction(); //for the obstacles to work
    moveObstaclesFunction(); //for the obstacles to work

    id = requestAnimationFrame(gameUpdate);

    checkCatch(); //win
    checkCrash(); //lose
    lifeScore(lifes); //score
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
