'use strict;'

// Enemies our player must avoid
class Enemy {
    constructor(){
      this.sprite = 'images/enemy-bug.png';
      this.x = -83;
      this.y = Math.floor(Math.random() * (4 - 2 + 1)) + 2;
      this.speed = Math.floor(Math.random() * (550 - 50 + 1)) + 30;;
    }

    // It randomly selectes 1 of 3 options for the row and sets a random speed for it.
    randomizeMe() {
      this.y = Math.floor(Math.random() * (4 - 2 + 1)) + 2;
      this.speed = Math.floor(Math.random() * (550 - 50 + 1)) + 30;
    }

    // Udacity Notes:
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // HMORENO Notes:
    // After the enemy is out of the screen, it randomizes it calls the randomize fx on it
    // and moves it to the left of the screen to be reused, if still on screen just increment its position
    update(dt) {
        if (this.x > 505 ) {
          this.x = -83
          this.randomizeMe();
        }
        else {
          this.x += this.speed * dt;
        }
    }

    // Udacity: Draw the enemy on the screen, required method for game
    //Hmoreno: Modified this to use less confusing rows (object.y) so that object.y=1 is row 1, and so on.
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, (this.y * 75) - 75);
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
  constructor(){
    this.sprite = 'images/char-boy.png';
    this.x = 101 * 2;
    this.y =  6;
    this.move = '';
    this.winner = false;
    this.level = 1;
  }

  // It just moves the player back and forth, up button also checks if it is a winner.
  update() {
    switch (this.move) {
      case 'left':
        this.x = this.x === 0 ?  this.x : this.x -= 101;
        this.move = '';
        break;
      case 'right':
        this.x = this.x === 101 * 4 ?  this.x : this.x += 101;
        this.move = '';
        break
      case 'up':
        this.y = this.y <= 1 ?  this.y : this.y -= 1;
        this.move = '';
        this.isWinner();
        break;
      case 'down':
        this.y = this.y >= 6 ?  this.y : this.y += 1;
        this.move = '';
        break;
      default:
        break;
    }
  }

  // Log in console, show the player in the water for a bit, moves the player back down and increases difficulty
  // adding an extra enemy
  isWinner() {
    if (this.y === 1) {
      this.winner = true;
      setTimeout(function (player) {
        player.resetPlayer();
      },100, this);
      updateLevel(this, 'win');
      createEnemies(this.level);
      this.winner = false;
    }
  }

  // Marks the player for movement in a direction, if the player is a winner it ignores movement
  // this just to add extra time to show the player up top but to not allow it to move once it won
  handleInput(key) {
    this.move = this.winner === false ? key : '';
  }

  // Always take the player to the last row, but randomize the column it appears
  resetPlayer() {
    this.x = (Math.floor(Math.random() * (4 - 0 + 1)) + 0) * 101;
    this.y = 6;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, (this.y * 75) - 75);
  }
}

/*
 First it checks if any enemies are on the same row as the Player
 For those on the same row, it checks if any of them are actually touching the player
 Note, not being on the same square, but actually touching the player
 If there is a collision, the difficulty (level) is decreased
*/
function checkCollisions() {
  const enemiesOnRow = allEnemies.filter(
    enemies => enemies.y === player.y
  );
  enemiesOnRow.forEach(function (enemy) {
    if (enemy.x >= player.x - 79 && enemy.x <= player.x + 79) {
      player.resetPlayer();
      updateLevel(player, 'lose');
      createEnemies(player.level);
    }
  });
}

// Updates the span for level
function updateLevel(player, winOrLose){
  let level = document.querySelector('.level');
  let levelText = document.querySelector('.level span');
  if (winOrLose === 'win') {
    player.level += 1;
    levelText.innerText = player.level;
    level.classList.toggle("bounce");
    setTimeout(function () {
      level.classList.toggle("bounce");
    },1200);
  }
  else {
    player.level = player.level > 1 ? player.level - 1 : player.level;
    levelText.innerText = player.level;
    level.classList.toggle("shake");
    setTimeout(function () {
      level.classList.toggle("shake");
    },1200);
  }

}

// Udacity: Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];

//creates enemy objects as needed
function createEnemies(enemies = 1) {
  allEnemies = [];
  for (var x = 0; x < enemies; x++) {
    allEnemies[x] = new Enemy();
  }
}

createEnemies();
let player = new Player;

// Udacity: This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
