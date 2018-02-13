var PlayerType = Object.freeze({HUMAN: 0, BOT_NAIVE: 1});
var SPRITE_SIZE = 32;
var GRID_SIZE = 20;

var game = new Phaser.Game(SPRITE_SIZE * GRID_SIZE, SPRITE_SIZE * GRID_SIZE, Phaser.CANVAS, 'sim', { preload: preload, create: create, update: update });



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
var gameSpeed = 25; // Time between updates (lower = faster)
var gameStarted = false;
var playerType = PlayerType.BOT_DFS;
var comboTime = 100;
var comboTimer = 0;
var comboFont;
var comboText;
var comboEffects = false;

var spaceKey;
var upKey;
var downKey;
var leftKey;
var rightKey;
var wKey;
var sKey;
var aKey;
var dKey;



function preload() {
    game.load.image('head', 'iridescent.png');
    game.load.image('segment', 'goldbox.png');
    game.load.image('gem', 'star.png');
    game.load.image('knightFont', 'KNIGHT3.png');
}


// Initializes the game
function create() {

    // Keyboard presses
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    showGameOverMessage();
    game.stage.backgroundColor = "#2d2d2d";
}


// Update game and graphics
function update() {

    // Reset game or show game over message
    if(gameStarted === false && spaceKey.isDown) {
        reset();
        gameStarted = true;
    }


    // Human or bot will set the next direction
    
    

    // Update object locations
    if(game.time.now > updateTime && gameStarted === true) {
        updatePlayerDirection(playerType);
        snake.update();
        

        // Add tail segment
        if(snake.collectedGem === true) {
            var newSegment = game.add.sprite(0, 0, 'segment');
            newSegment.width = SPRITE_SIZE;
            newSegment.height = SPRITE_SIZE;
            segments.push(newSegment);
            backLayer.add(newSegment);
            snake.collectedGem = false;

            if(snake.combo > 1 && comboEffects) {
                game.camera.shake(0.005, 200);
                emitter.x = snake.player.x * SPRITE_SIZE;
                emitter.y = snake.player.y * SPRITE_SIZE;
                emitter.start(true, 500, null, 4);
                comboTimer = comboTime;
                comboText.x = game.world.centerX;
                comboText.y = game.world.centerY;
                comboFont.text = "Combo:" + snake.combo;
                comboText.tint = 12822094.436339;
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
            gameStarted = false;
            showGameOverMessage();
        }


        // Update game timer
        updateTime = game.time.now + gameSpeed;
    }


    // Move combo text
    if(gameStarted === true) {
        if(comboTimer > 0) {
            comboText.y--;
            comboTimer--;
        } else {
            comboText.x = -1000;
            comboText.y = -1000;
        }
    }
}


// Updates which direction player wants to move
function updatePlayerDirection(playerType) {

    if(gameStarted === false) {
        return;
    }


    // Get next direction from human or bot
    var nextDirection;
    switch(playerType) {
        case PlayerType.HUMAN:
            if (leftKey.isDown || aKey.isDown) {
                snake.player.setDirection(Directions.LEFT);
            }
            if (rightKey.isDown || dKey.isDown) {
                snake.player.setDirection(Directions.RIGHT);
            }
            if (upKey.isDown || wKey.isDown) {
                snake.player.setDirection(Directions.UP);
            }
            if (downKey.isDown || sKey.isDown) {
                snake.player.setDirection(Directions.DOWN);
            }
            break;
        case PlayerType.BOT_BFS:
            snake.player.setDirection(Bot.getBFSMove(snake.getState()));
            break;
        case PlayerType.BOT_DFS:
            snake.player.setDirection(Bot.getDFSMove(snake.getState()));
            break;  
    }

    gameStarted = true;
}


// Resets the game and graphics
function reset() {

    // Set player type
    bot = Bot.NONE;

    // Clear all objects first
    game.world.removeAll();

    // Layers
    backLayer = game.add.group();
    midLayer = game.add.group();
    frontLayer = game.add.group();

    // Particle effects
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('gem');
    var scale = (1.0 / (emitter.children[0].width / SPRITE_SIZE)) / 2.0;
    emitter.minParticleScale = scale;
    emitter.maxParticleScale = scale;

    // Game and player
    snake = new Snake(GRID_SIZE);
    snake.reset();
    segments = [];

    // Game setup
    game.stage.backgroundColor = "#2d2d2d";
    head = game.add.sprite(snake.player.x * SPRITE_SIZE, snake.player.y * SPRITE_SIZE, 'head');
    head.width = SPRITE_SIZE;
    head.height = SPRITE_SIZE;
    gem = game.add.sprite(snake.gem.x * SPRITE_SIZE, snake.gem.y * SPRITE_SIZE, 'gem');
    gem.width = SPRITE_SIZE;
    gem.height = SPRITE_SIZE;
    midLayer.add(head);
    frontLayer.add(gem);

    // Combo text
    comboFont = game.add.retroFont('knightFont', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    comboText = game.add.image(-1000, -1000, comboFont);
    comboText.tint = 12822094.436339;
    comboText.anchor.set(0.5, 0.5);
    comboText.x = game.world.centerX;
    comboText.y = game.world.centerY;
    frontLayer.add(comboText);


    // Initialize game
    snake.reset();
    segments = [];
}


// Displays a game over message
function showGameOverMessage() {
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    var text = game.add.text(0, 0, "Press SPACE to start new game", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    text.setTextBounds(0, 100, SPRITE_SIZE * GRID_SIZE, 100);
}
