var Directions = {UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3};


function Player() {

	this.alive = true;
	this.x = 10;
	this.y = 10;
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
		var headPos = new Point(this.x, this.y);


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
		this.prevDirection = this.nextDirection;


		// Move tail
		var len = this.segments.length;
		if(len > 0) {
			this.segments[len - 1].x = headPos.x;
			this.segments[len - 1].y = headPos.y;
			this.segments.push(this.segments.pop());
		}
	}


	// Adds a segment to the snake
	this.addSegment = function() {
		var len = this.segments.length;
		var newX;
		var newY;

		if(len > 0) {
			newX = this.segments[len - 1].x;
			newY = this.segments[len - 1].y;
		} else {
			newX = this.prevX;
			newY = this.prevY;
		}

		this.segments.push(new Point(newX, newY));
	};
};
