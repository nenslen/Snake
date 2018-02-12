// The snake game model
function Snake() {

	// Variables
	var GRID_SIZE = 20;

	var tiles = [];
	var prevCombo = 0;
	var comboTimer;

	this.comboTime = 1500;
	this.combo = 0;
	this.player = new Player();
	this.gem = new Point();
	this.currentXP = 0;
	this.collectedGem = false;
	this.gameMode = GameModes.CLASSIC;
	this.wrap = false;


	// Resets values
	this.reset = function() {
		this.player = new Player();
		this.currentXP = 0;
		this.player.alive = true;
		this.combo = 0;

		for(var i = 0; i < GRID_SIZE; i++) {
			tiles[i] = [];
			for(var j = 0; j < GRID_SIZE; j++) {
				tiles[i][j] = TileValues.EMPTY;
			}
		}

		tiles[this.player.x][this.player.y] = TileValues.PLAYER;
		this.spawnGem();
		comboTimer = setTimeout(this.comboClock, this.comboTime);
	};


	// Move player and check for collisions
	this.update = function() {
		if(this.player.alive === false) { return; }

		this.player.move();

		switch(this.checkCollisions()) {
			case TileValues.EMPTY:
				break;
			case TileValues.WALL:
			case TileValues.PLAYER:
				this.player.alive = false;
				break;
			case TileValues.GEM:
				this.player.addSegment();
				this.spawnGem();
				this.currentXP += this.calculateXP();
				this.collectedGem = true;
				this.combo++;
				clearTimeout(comboTimer);
				comboTimer = setTimeout(this.comboClock, this.comboTime);
				break;
		}
	};


	// Checks for player collisions
	this.checkCollisions = function() {
		var collision = TileValues.EMPTY;


		// Walls
		if(this.player.x < 0 ||
		   this.player.y < 0 ||
		   this.player.x >= GRID_SIZE ||
		   this.player.y >= GRID_SIZE) {
			  collision = TileValues.WALL;
		}


		// Player segments
		for(var i = 0; i < this.player.segments.length; i++) {
			var segment = this.player.segments[i];
			if(this.player.x == segment.x && this.player.y == segment.y) {
				collision = TileValues.PLAYER;
			}
		}


		// Gem
		if(this.player.x == this.gem.x && this.player.y == this.gem.y) {
			collision = TileValues.GEM;
		}


		return collision;
	};


	// Spawns a gem randomly
	this.spawnGem = function() {
		
		// Add empty tiles
		var validTiles = [];
		for(var i = 0; i < GRID_SIZE; i++) {
			for(var j = 0; j < GRID_SIZE; j++) {
				if(this.player.existsHere(i, j) === false) {
					validTiles.push(new Point(i, j));
				}
			}
		}


		// Select a random tile
		if(validTiles.length > 0) {
			var rnd = Math.floor((Math.random() * validTiles.length));
			this.gem.x = validTiles[rnd].x;
			this.gem.y = validTiles[rnd].y;
		}
	};


	// Calculates how much XP a player should get for collection a gem
	this.calculateXP = function() {
		return 0;
	};


	// Combo timer
	var self = this;
	this.comboClock = function() {

	    if(prevCombo <= self.combo) {
	    	self.combo = 0;
	    } else {
	    	prevCombo = self.combo;
	    }
	}


	// Returns the current state of the game
	this.getState = function() {
		var state = {
			player: new Point(this.player.x, this.player.y),
			segments: this.player.segments,
			gem: this.gem,
			tiles: tiles
		};
		return state;
	}
};
