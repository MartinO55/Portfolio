//so this is now running... BUT: canvas and c are defined twice, and we had to use the module key in the html so we run into the mime error again
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const gravity = 0.7;

export class Sprite {
  constructor({
    position,
    imgSrc,
    scale = 1,
    maxFrames = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imgSrc;
    this.width = 50;
    this.height = 150;
    this.scale = scale;
    this.maxFrames = maxFrames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 6;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.maxFrames),
      0,
      this.image.width / this.maxFrames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.maxFrames) * this.scale,
      this.image.height * this.scale
    );
  }

  animateSprite() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.maxFrames - 1) {
        this.currentFrame++;
      } else this.currentFrame = 0;
    }
  }

  update() {
    this.draw();
    this.animateSprite();
  }
}

export class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imgSrc,
    scale = 1,
    maxFrames = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imgSrc,
      scale,
      maxFrames,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 7;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imgSrc;
    }
  }

  update() {
    this.draw();
    this.animateSprite();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 11) {
      this.velocity.y = 0;
      this.position.y = 415.1;
    } else this.velocity.y += gravity;

    console.log(this.position.y);
  }
  dw;
  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  switchSprite(sprite) {
    if (
      //add an or case if you add multiple attack types
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.maxFrames - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image != this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.maxFrames = this.sprites.idle.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image != this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.maxFrames = this.sprites.run.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image != this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.maxFrames = this.sprites.jump.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image != this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.maxFrames = this.sprites.fall.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image != this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.maxFrames = this.sprites.attack1.maxFrames;
          this.currentFrame = 0;
        }
        break;
      default:
        break;
    }
  }
}
