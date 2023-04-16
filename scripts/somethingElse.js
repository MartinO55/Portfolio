import { Sprite, Fighter } from "./classes.js";
import {
  rectangularCollision,
  decreaseTimer,
  determineWinner,
  timerID,
} from "./utils.js";

//rationalise these imports
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: { x: 0, y: 0 },
  imgSrc: "../assets/OakWoodsPixelBackground.png",
});

const backgroundShop = new Sprite({
  position: { x: 600, y: 214 },
  imgSrc: "../assets/shop_anim.png",
  scale: 2.75,
  maxFrames: 6,
});

export const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  imgSrc: "../assets/Characters/Samurai/Sprites/Idle.png",
  maxFrames: 8,
  scale: 2.5,
  offset: { x: 215, y: 156 },
  sprites: {
    idle: {
      imgSrc: "../assets/Characters/Samurai/Sprites/Idle.png",
      maxFrames: 8,
    },
    run: {
      imgSrc: "../assets/Characters/Samurai/Sprites/Run.png",
      maxFrames: 8,
    },
    jump: {
      imgSrc: "../assets/Characters/Samurai/Sprites/Jump.png",
      maxFrames: 2,
    },
    fall: {
      imgSrc: "../assets/Characters/Samurai/Sprites/Fall.png",
      maxFrames: 2,
    },
    attack1: {
      imgSrc: "../assets/Characters/Samurai/Sprites/Attack1.png",
      maxFrames: 6,
    },
    takeHit: {
      imgSrc: "../assets/Characters/Samurai/Sprites/Take hit.png",
      maxFrames: 4,
    },
    death: {
      imgSrc: "../assets/Characters/Samurai/Sprites/Death.png",
      maxFrames: 6,
    },
  },
  attackBox: { offset: { x: 100, y: 50 }, width: 150, height: 50 },
});

export const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: -50, y: 0 },
  imgSrc: "../assets/Characters/Ninja/Sprites/Idle.png",
  maxFrames: 4,
  scale: 2.5,
  offset: { x: 215, y: 170 },
  sprites: {
    idle: {
      imgSrc: "../assets/Characters/Ninja/Sprites/Idle.png",
      maxFrames: 4,
    },
    run: {
      imgSrc: "../assets/Characters/Ninja/Sprites/Run.png",
      maxFrames: 8,
    },
    jump: {
      imgSrc: "../assets/Characters/Ninja/Sprites/Jump.png",
      maxFrames: 2,
    },
    fall: {
      imgSrc: "../assets/Characters/Ninja/Sprites/Fall.png",
      maxFrames: 2,
    },
    attack1: {
      imgSrc: "../assets/Characters/Ninja/Sprites/Attack1.png",
      maxFrames: 4,
    },
    takeHit: {
      imgSrc: "../assets/Characters/Ninja/Sprites/Take Hit.png",
      maxFrames: 3,
    },
    death: {
      imgSrc: "../assets/Characters/Ninja/Sprites/Death.png",
      maxFrames: 7,
    },
  },
  attackBox: { offset: { x: -150, y: 50 }, width: 150, height: 50 },
});

const keys = {
  a: { pressed: false },
  d: { pressed: false },

  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  backgroundShop.update();
  c.fillStyle = "rgba(255,255,255,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player 1 move

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //player2 move
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //check for player attack hits
  if (
    rectangularCollision({ attacker: player, defender: enemy }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    //so now you have to pass an attack type to this function, put conditional logic there
    console.log(rectangularCollision({ attacker: player, defender: enemy }));
    enemy.takeHit();
    player.isAttacking = false;

    //so to implement power attacks/weak attacks we can check the animation type here with an if statement

    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  //player misses
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }
  //console.log(rectangularCollision({ attacker: enemy, defender: player }));
  //enemy attacks
  if (
    rectangularCollision({ attacker: enemy, defender: player }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 2
  ) {
    player.takeHit();

    enemy.isAttacking = false;

    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //enemy misses
  if (enemy.isAttacking && enemy.currentFrame === 3) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerID });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  //console.log(event.key);
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        //to fix multi jumping I think we need to add the sprites so you can check if player.image != player.sprites.jumping or falling.image
        player.velocity.y = -20;
        break;
      case " ":
        //so attack needs to take a string variable - either tied to a new key, or you could set it up as a counter
        player.attack();

        // if (player.image === player.sprites.attack1.image) {
        //   console.log("attack1"); //this works
        // }

        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        //to implement the different attack animations we change the attack function to take a string of the attack type as an argument
        enemy.attack();

        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});
