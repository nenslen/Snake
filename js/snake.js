function Snake() {

	// Attributes
	this.alive = true;
	this.x = 10;
	this.y = 10;
	this.prevX = 0;
	this.prevY = 0;
	this.prevDirection = Directions.UP;
	this.nextDirection = Directions.UP;
	this.segments = [];


	/**
	* Resets the snake to its default values
	*/
	this.reset = function() {
		this.alive = true;
		this.x = 10;
		this.y = 10;
		this.prevX = 0;
		this.prevY = 0;
		this.prevDirection = Directions.UP;
		this.nextDirection = Directions.UP;
		this.segments = [];
	};


	/**
	* Validates and sets the next direction
	* @param direction: A Direction enum specifying the direction the snake should move next
	*/
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


	// Moves the player and its segments in the set direction
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


	/**
	* Moves the player and its segments to a given position
	* @param x: The x position to move to
	* @param y: The y position to move to
	*/
	this.moveTo = function(x, y) {
		
		// Save prev pos and movement
		this.prevX = this.x;
		this.prevY = this.y;
		this.x = x;
		this.y = y;
		

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


	/**
	* Checks if the player or any of its segments occupies a given position
	* @param x: The x coordinate of the position to check
	* @param y: The y coordinate of the position to check
	*/
	this.existsHere = function(x, y) {
		if(this.segments.length > 0) {

			// Check head
			if(this.x == x && this.y == y) {
				return true;
			}


			// Check segments
			for(var i = 0; i < this.segments.length; i++) {
				if(this.segments[i].x == x && this.segments[i].y == y) {
					return true;
				}
			}
		}

		return false;
	};
};
