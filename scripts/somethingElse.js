import { Sprite, Fighter } from "./classes.js";
import {
  rectangularCollision,
  decreaseTimer,
  determineWinner,
} from "./utils.js";

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

const player = new Fighter({
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
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: -50, y: 0 },
  color: "blue",
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
  player.update();
  //enemy.update();

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
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //check for attack hits
  if (
    rectangularCollision({ attacker: player, defender: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("hit");
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({ attacker: enemy, defender: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("player2hit");
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerID });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  //console.log(event.key);
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
      //to fix multi jumping I think we need to add the sprites so you can check if sprite.jumping !=true
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

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
      enemy.attack();
      break;
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
