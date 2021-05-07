/**
* The snake game model
* @param gridWidth: The width of the game board
* @param gridHeight: The height of the game board
*/ 
function SnakeGame(gridWidth, gridHeight, gameMode = GameModes.CLASSIC, wrap = false) {

	// Variables
	var GRID_WIDTH = gridWidth;
	var GRID_HEIGHT = gridHeight;

	var tiles = [];
	var prevCombo = 0;
	var comboTimer;

	this.comboTime = 1500;
	this.combo = 0;
	this.snake = new Snake(Math.floor(gridWidth / 2), Math.floor(gridHeight / 2));
	this.gem = new Point();
	this.currentXP = 0;
	this.collectedGem = false;
	this.gameMode = gameMode;
	this.wrap = wrap;


	/**
	* Resets the game
	* @param gridWidth: Optional parameter to set a new grid width
	* @param gridHeight: Optional parameter to set a new grid height
	*/
	this.reset = function(gridWidth = -1, gridHeight = -1, gameMode = -1, wrap = -1) {
		
		// Reset variables
		this.snake.reset();
		
		this.currentXP = 0;
		this.combo = 0;
		this.collectedGem = false;


		// Set new grid width and height if given
		if(gridWidth > 0 && gridHeight > 0) {
			GRID_WIDTH = gridWidth;
			GRID_HEIGHT = gridHeight;
		}

		this.snake.x = Math.floor(GRID_WIDTH / 2);
		this.snake.y = Math.floor(GRID_HEIGHT / 2);

		// Set game mode and wrap if given
		if(gameMode != -1) {
			this.gameMode = gameMode;
		}
		if(wrap != -1) {
			this.wrap = wrap;
		}


		// Reset tiles
		for(var i = 0; i < GRID_WIDTH; i++) {
			tiles[i] = [];
			for(var j = 0; j < GRID_HEIGHT; j++) {
				tiles[i][j] = TileValues.EMPTY;
			}
		}


		// Create player and gem
		tiles[this.snake.x][this.snake.y] = TileValues.PLAYER;
		this.spawnGem();


		// Start the combo timer
		comboTimer = setTimeout(this.comboClock, this.comboTime);
	};


	/**
	* Move player and check for collisions
	*/
	this.update = function() {

		// Exit if player is dead
		if(this.snake.alive === false) { return; }

		// Move the player
		this.snake.move();

		// Check if player had a collision with anything
		switch(this.checkCollisions()) {
			case TileValues.EMPTY:
				// Player is safe
				break;
			case TileValues.WALL:
			case TileValues.PLAYER:
				// Player is dead
				this.snake.alive = false;
				break;
			case TileValues.GEM:
				// Player gets points and another segment
				this.snake.addSegment();
				this.spawnGem();
				this.currentXP += this.calculateXP();
				this.collectedGem = true;

				// Reset combo timer
				this.combo++;
				clearTimeout(comboTimer);
				comboTimer = setTimeout(this.comboClock, this.comboTime);
				break;
		}
	};


	/**
	* Checks for collisions between the player and other objects
	* @return: A TileValue enum indicating if any collisions occurred
	*/
	this.checkCollisions = function() {

		// Wall collision
		if(this.snake.x < 0 ||
		   this.snake.y < 0 ||
		   this.snake.x >= GRID_WIDTH ||
		   this.snake.y >= GRID_HEIGHT) {
			  return TileValues.WALL;
		}


		// Player collision
		for(var i = 0; i < this.snake.segments.length; i++) {
			var segment = this.snake.segments[i];
			if(this.snake.x == segment.x && this.snake.y == segment.y) {
				return TileValues.PLAYER;
			}
		}


		// Gem collision
		if(this.snake.x == this.gem.x && this.snake.y == this.gem.y) {
			return TileValues.GEM;
		}


		// No collisions
		return TileValues.EMPTY;
	};


	/**
	* Spawns a new gem randomly on the grid
	*/
	this.spawnGem = function() {
		
		// Find valid spawn tiles
		var validTiles = [];
		for(var i = 0; i < GRID_WIDTH; i++) {
			for(var j = 0; j < GRID_HEIGHT; j++) {
				if(this.snake.existsHere(i, j) === false) {
					validTiles.push(new Point(i, j));
				}
			}
		}


		// Randomly choose a valid spawn tile
		if(validTiles.length > 0) {
			var rnd = Math.floor((Math.random() * validTiles.length));
			this.gem.x = validTiles[rnd].x;
			this.gem.y = validTiles[rnd].y;
		}
	};


	/**
	* Calculates how much XP a player should get for collecting a gem
	*/
	this.calculateXP = function() {
		return 0;
	};


	/**
	* Combo timer for tracking time between gem collections
	*/
	var self = this;
	this.comboClock = function() {

	    if(prevCombo <= self.combo) {
	    	self.combo = 0;
	    } else {
	    	prevCombo = self.combo;
	    }
	}


	/**
	* Returns the current state of the game
	* @return: A State object
	*/
	/*
	this.getState = function() {
		var state = {
			player: new Point(this.snake.x, this.snake.y),
			segments: this.snake.segments,
			gem: this.gem,
			tiles: tiles
		};
		return state;
	}
	*/
	/**
	* Returns the current state of the game
	* @return: A State object
	*/
	this.getState = function() {
		var state = {
			snake: this.snake,
			gem: this.gem,
			tiles: tiles,
			segments: this.snake.segments.slice()
		};
		return state;
	}
};
