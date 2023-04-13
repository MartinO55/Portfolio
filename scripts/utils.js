export function rectangularCollision({ attacker, defender }) {
  return (
    attacker.attackBox.position.x + attacker.attackBox.width >=
      defender.position.x &&
    attacker.attackBox.position.x <= defender.position.x + defender.width &&
    attacker.attackBox.position.y + attacker.attackBox.height >=
      defender.position.y &&
    attacker.attackBox.position.y <= defender.position.y + defender.height
  );
}

export function determineWinner({ player, enemy, timerID }) {
  clearTimeout(timerID);
  document.querySelector("#UIScriptOverlay").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#UIScriptOverlay").innerHTML = "Draw";
  } else if (player.health > enemy.health) {
    document.querySelector("#UIScriptOverlay").innerHTML = "Player One Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#UIScriptOverlay").innerHTML = "Player Two Wins";
  }
}

let timer = 60;
let timerID;
export function decreaseTimer() {
  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer__clock").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerID });
  }
}
