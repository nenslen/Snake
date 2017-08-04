function Player() {

	this.alive = true;
	this.x = 10;
	this.y = 10;
	this.prevX = 0;
	this.prevY = 0;
	this.prevDirection = Directions.UP;
	this.nextDirection = Directions.UP;
	this.segments = [];


	// Resets values
	this.reset = function() {
		this.alive = true;
		this.x = 0;
		this.y = 0;
		this.prevDirection = Directions.UP;
		this.nextDirection = Directions.UP;
		this.segments = [];
	};


	// Validates and sets the next direction
	this.setDirection = function(direction) {
		var newDirection = direction;


		// Do not allow opposite direction to be set
		if(this.prevDirection == Directions.UP && direction == Directions.DOWN    ||
		   this.prevDirection == Directions.DOWN && direction == Directions.UP    ||
		   this.prevDirection == Directions.LEFT && direction == Directions.RIGHT ||
		   this.prevDirection == Directions.RIGHT && direction == Directions.LEFT) {
			newDirection = this.prevDirection;
		}


		this.nextDirection = newDirection;
	};


	// Moves the player and its segments
	this.move = function() {
		
		// Save prev pos and movement
		this.prevX = this.x;
		this.prevY = this.y;
		this.prevDirection = this.nextDirection;


		// Move head
		switch(this.nextDirection) {
			case Directions.UP:
				this.y--;
				break;
			case Directions.DOWN:
				this.y++;
				break;
			case Directions.LEFT:
				this.x--;
				break;
			case Directions.RIGHT:
				this.x++;
				break;
		}
		

		// Move tail
		var len = this.segments.length;
		if(len > 0) {
			var tempTail = this.segments[len - 1];
			this.segments.pop();
			this.segments.unshift(tempTail);
			this.segments[0].x = this.prevX;
			this.segments[0].y = this.prevY;
		}
	}


	// Adds a segment to the snake
	this.addSegment = function() {
		var len = this.segments.length;
		var newX;
		var newY;

		// Finds where segment should be placed
		if(len > 0) {
			newX = this.segments[len - 1].x;
			newY = this.segments[len - 1].y;
		} else {
			newX = this.prevX;
			newY = this.prevY;
		}

		this.segments.push(new Point(newX, newY));
	};


	// Removes the last segment from the player
	this.removeSegment = function() {
		if(this.segments.length > 0) {
			segments.pop();
		}
	};


	// Removes all segments from the player
	this.removeAllSegments = function() {
		if(this.segments.length > 0) {
			segments = [];
		}
	};


	// Checks if the player or its segments occupies a given position
	this.existsHere = function(posX, posY) {
		if(this.segments.length > 0) {

			// Check head
			if(this.x == posX && this.y == posY) {
				return true;
			}


			// Check segments
			for(var i = 0; i < this.segments.length; i++) {
				if(this.segments[i].x == posX && this.segments[i].y == posY) {
					return true;
				}
			}
		}

		return false;
	};
};
