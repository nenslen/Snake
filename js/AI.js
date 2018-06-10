/**
* The AI class. Responsible for calculating moves based on a given board state
*/
function AI() {
	
	/**
	* Returns a move based on a given board. How the move is calculated:
	* 1) Try to find path directly to gem
	* 2) If there is no path to gem, then find the longest path to the furthest reachable snake segment
	* @param state: The current state of the game
	* @return: A Direction enum (UP, LEFT, DOWN, RIGHT)
	*/
	this.getMove = function(state) {

		// Find shortest path to gem
		var start = new Point(state.snake.x, state.snake.y);
		var end = new Point(state.gem.x, state.gem.y);
		var shortest = shortestPath(start, end, state.tiles.length, state.tiles[0].length, state.segments);
		
		if(shortest.length > 0) {
			return getFirstDirection(shortest);
		}
console.log(state.snake.segments);
//console.log(state.snake.segments[0]);
		// Find longest path to the furthest reachable snake segment
		for(var i = state.snake.segments.length - 2; i >= 0; i--) {
			var start = new Point(state.snake.x, state.snake.y);
			var end = new Point(state.snake.segments[i].x, state.snake.segments[i].y);
			//console.log(state.snake.segments);
console.log(state.segments);
			var longest = longestPath(start, end, state.tiles.length, state.tiles[0].length, state.snake.segments);

			if(longest.length > 0) {
				console.log(end);
				return getFirstDirection(longest);
			}
		}


		// No path found, so just go left
		console.log("shouldn't happen");
		return Directions.LEFT;
	};
}


/**
* Computes the shortest path between 2 points using BFS, while 
* @param start: A Point, representing the start of the path
* @param end: A Point, representing the end of the path
* @param width: The width of the grid
* @param height: The height of the grid
* @param obstacles: An array of Points, representing invalid positions
* @return: An array of points, representing the shortest path from start to end (empty if no solution found)
*/
function shortestPath(start, end, width, height, obstacles) {
    var solutionPath = [];
	var searchedTiles = [];
    var queue = [];


    // Set the starting point
    queue.push(new Tile(null, start.x, start.y, null));


    // Search tiles until goal is found (or can't be found)
    while(queue.length > 0) {
        
        var currentTile = queue.shift();

        // Generate solution path if we found the goal
        if(currentTile.x == end.x && currentTile.y == end.y) {

            while(currentTile.parent != null) {
                solutionPath.push(new Point(currentTile.x, currentTile.y));
                currentTile = currentTile.parent;
            }
                
            solutionPath.push(new Point(currentTile.x, currentTile.y));
            solutionPath.reverse();
            return solutionPath;
        }


        // Check if this state has already been expanded
		var isExpanded = false;
		for(var i = 0; i < searchedTiles.length; i++) {
			
			var tempTile = searchedTiles[i];
			if(tempTile.x == currentTile.x && tempTile.y == currentTile.y) {
				isExpanded = true;
			}
		}


		// Add valid neighboring tiles to queue
		if(isExpanded == false) {

			// Mark this tile as searched
			searchedTiles.push(currentTile);

			// Check up
			if(isValidMove(currentTile.x, currentTile.y - 1, width, height, obstacles, end) == true) {
				queue.push(new Tile(currentTile, currentTile.x, currentTile.y - 1, Directions.UP));
			}

			// Check left
			if(isValidMove(currentTile.x - 1, currentTile.y, width, height, obstacles, end) == true) {
				queue.push(new Tile(currentTile, currentTile.x - 1, currentTile.y, Directions.LEFT));
			}

			// Check right
			if(isValidMove(currentTile.x + 1, currentTile.y, width, height, obstacles, end) == true) {
				queue.push(new Tile(currentTile, currentTile.x + 1, currentTile.y, Directions.RIGHT));
			}

			// Check down
			if(isValidMove(currentTile.x, currentTile.y + 1, width, height, obstacles, end) == true) {
				queue.push(new Tile(currentTile, currentTile.x, currentTile.y + 1, Directions.DOWN));
			}
		}
    }


    // No solution found, return empty array
    return solutionPath;
}


/**
* Computes the longest path between 2 points
* @param start: A Point, representing the start
* @param end: A Point, representing the end
* @param width: The width of the grid
* @param height: The height of the grid
* @param obstacles: An array of Points, representing invalid positions
* @return: An array of points, representing the longest path from start to end (empty if no solution found)
*/
function longestPath(start, end, width, height, obstacles) {
	console.log(obstacles);
	// Find the shortest path
	let invalidPoints = obstacles.splice();
	let longest = shortestPath(start, end, width, height, invalidPoints);
	invalidPoints.push(start);
	invalidPoints.push(end);
console.log(invalidPoints);
	// Extend each pair of path pieces until no more extensions can be made
	if(longest.length >= 2) {
		let index = 0;
		let expanded = false;

		while(index < longest.length - 1) {
			let point1 = longest[index];
			let point2 = longest[index + 1];
			let deltaX = 0;
			let deltaY = 0;


			// Left
			if(isValidMove(point1.x - 1, point1.y, width, height, invalidPoints, new Point(-1, -1)) &&
			   isValidMove(point2.x - 1, point2.y, width, height, invalidPoints, new Point(-1, -1))) {
			   	deltaX = -1;
			   	deltaY = 0;
				expanded = true;
			}

			// Right
			if(isValidMove(point1.x + 1, point1.y, width, height, invalidPoints, new Point(-1, -1)) &&
			   isValidMove(point2.x + 1, point2.y, width, height, invalidPoints, new Point(-1, -1)) && !expanded) {
			   	deltaX = 1;
			   	deltaY = 0;
				expanded = true;
			}

			// Up
			if(isValidMove(point1.x, point1.y - 1, width, height, invalidPoints, new Point(-1, -1)) &&
			   isValidMove(point2.x, point2.y - 1, width, height, invalidPoints, new Point(-1, -1)) && !expanded) {
			   	deltaX = 0;
			   	deltaY = -1;
				expanded = true;
			}

			// Down
			if(isValidMove(point1.x, point1.y + 1, width, height, invalidPoints, new Point(-1, -1)) &&
			   isValidMove(point2.x, point2.y + 1, width, height, invalidPoints, new Point(-1, -1)) && !expanded) {
			   	deltaX = 0;
			   	deltaY = 1;
				expanded = true;
			}


			// Extend path
			if(expanded == true) {
				let newPoint1 = new Point(point1.x + deltaX, point1.y + deltaY);
				let newPoint2 = new Point(point2.x + deltaX, point2.y + deltaY);
				longest.splice(index + 1, 0, newPoint1, newPoint2);
				invalidPoints.push(newPoint1, newPoint2);
				expanded = false;
			} else {
				index++;
			}
		}
	}
	//console.log(longest);
	return longest;
}


/**
* Checks if a given move is valid
* @param x: The x coordinate of the move
* @param y: The y coordinate of the move
* @param width: The width of the grid
* @param height: The height of the grid
* @param obstacles: An array of points representing invalid points
* @param end: A point representing the goal
* @return: True if the move is valid, false otherwise
*/
function isValidMove(x, y, width, height, obstacles, end) {

	// Goal
	if(x == end.x && y == end.y) {
		return true;
	}


	// Boundaries
	if(x < 0 || y < 0 || x >= width || y >= height) {
		return false;
	}


	// Obstacles
	for(var i = 0; i < obstacles.length; i++) {
		if(x == obstacles[i].x && y == obstacles[i].y) {
			return false;
		}
	}


	// Move is valid
	return true;
}


/**
* Finds the first direction along a given path
* @param path: An array of Points, representing the path
* @return: A Direction enum (UP, LEFT, DOWN, RIGHT)
*/
function getFirstDirection(path) {
	let point1 = path[0];
	let point2 = path[1];
	let deltaX = point2.x - point1.x;
	let deltaY = point2.y - point1.y;

	// Left
	if(deltaX == -1 && deltaY == 0) {
		return Directions.LEFT;
	}

	// Right
	if(deltaX == 1 && deltaY == 0) {
		return Directions.RIGHT;
	}

	// Up
	if(deltaX == 0 && deltaY == -1) {
		return Directions.UP;
	}

	// Down
	if(deltaX == 0 && deltaY == 1) {
		return Directions.DOWN;
	}

	return Directions.LEFT;
}




var startTest = new Point(2, 3);
var endTest = new Point(4, 6);
var shortPath = shortestPath(startTest, endTest, 5, 7, []);
var longPath = longestPath(startTest, endTest, 5, 7, []);
console.log(shortPath);
console.log(longPath);