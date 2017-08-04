var game = new Phaser.Game(640, 640, Phaser.CANVAS, 'sim', { preload: preload, create: create, update: update });

var SPRITE_SIZE = 32;

var snake;
var head;
var segments;
var gem;

var backLayer;
var midLayer;
var frontLayer;
var emitter;
var particle;
var gemBounce;

var updateTime = 0;
var gameSpeed = 100; // Time between updates
var gameStarted = false;
var comboTimer = 1000;

var upKey;
var downKey;
var leftKey;
var rightKey;
var wKey;
var sKey;
var aKey;
var dKey;



function preload() {
    game.load.image('head', 'head.png');
    game.load.image('segment', 'segment.png');
    game.load.image('gem', 'gem.png');
    game.load.image('particle', 'particle.png');
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

    backLayer = game.add.group();
    midLayer = game.add.group();
    frontLayer = game.add.group();

    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('particle');

    snake = new Snake();
    snake.reset();
    segments = [];

    game.stage.backgroundColor = "#2d2d2d";
    head = game.add.sprite(snake.player.x * SPRITE_SIZE, snake.player.y * SPRITE_SIZE, 'head');
    gem = game.add.sprite(snake.gem.x * SPRITE_SIZE, snake.gem.y * SPRITE_SIZE, 'gem');
    midLayer.add(head);
    frontLayer.add(gem);
}


// Update game and graphics
function update() {

    updatePlayerDirection();

    if(game.time.now > updateTime && gameStarted === true) {
        
        snake.update();
        

        // Add tail segment
        if(snake.collectedGem === true) {
            var newSegment = game.add.sprite(0, 0, 'segment');
            segments.push(newSegment);
            backLayer.add(newSegment);
            snake.collectedGem = false;

            if(snake.combo > 1) {
                game.camera.shake(0.005, 200);
                emitter.x = snake.player.x * SPRITE_SIZE;
                emitter.y = snake.player.y * SPRITE_SIZE;
                emitter.start(true, 500, null, 4);
            }
        }


        // Update head and segments
        head.x = snake.player.x * SPRITE_SIZE;
        head.y = snake.player.y * SPRITE_SIZE;

        for(var i = 0; i < segments.length; i++) {
            segments[i].x = snake.player.segments[i].x * SPRITE_SIZE;
            segments[i].y = snake.player.segments[i].y * SPRITE_SIZE;
        }


        // Update gem
        gem.x = snake.gem.x * SPRITE_SIZE;
        gem.y = snake.gem.y * SPRITE_SIZE;


        // End the game
        if(snake.player.alive === false) {
            snake.reset();
            gameStarted = false;    
        }

        updateTime = game.time.now + gameSpeed;
    }
}


// Updates which direction player wants to move
function updatePlayerDirection() {

    // Check WASD and Arrow keys
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
}
