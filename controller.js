var game = new Phaser.Game(640, 640, Phaser.CANVAS, 'sim', { preload: preload, create: create, update: update });

var map;
var layer;
var player;

var snake;
var segments;
var updateTime = 0; 
var gameSpeed = 100; // Frames between updates
var gameStarted = false;

var upKey;
var downKey;
var leftKey;
var rightKey;
var wKey;
var sKey;
var aKey;
var dKey;



function preload() {
    game.load.image('block', 'block.png');
}


// Initializes the game
function create() {
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    snake = new Snake();
    snake.reset();
    segments = [];

    game.stage.backgroundColor = "#2d2d2d";
    map = game.add.tilemap();
    layer = map.create('level1', 40, 30, 32, 32);
    layer.resizeWorld();

    marker = game.add.graphics();
    marker.beginFill(0x000000);
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);
    marker.endFill();
}


// Move each ball and spawn new balls
function update() {

    // Update player direction
    if (leftKey.isDown || aKey.isDown) {
        snake.player.setDirection(Directions.LEFT);
        gameStarted = true;
    }
    if (rightKey.isDown || dKey.isDown) {
        snake.player.setDirection(Directions.RIGHT);
        gameStarted = true;
    }
    if (upKey.isDown || wKey.isDown) {
        snake.player.setDirection(Directions.UP);
        gameStarted = true;
    }
    if (downKey.isDown || sKey.isDown) {
        snake.player.setDirection(Directions.DOWN);
        gameStarted = true;
    }


    // Update the game and graphics
    if(game.time.now > updateTime && gameStarted === true) {
        snake.update();
        
        if(snake.collectedGem === true || true) {
            snake.player.addSegment();
            segments.push(game.add.sprite(0, 0, 'block'));
        }


        marker.x = snake.player.x * 32;
        marker.y = snake.player.y * 32;
        
        if(snake.player.alive === false) {
            snake.reset();
            gameStarted = false;    
        }

        updateTime = game.time.now + gameSpeed;
    }
}
