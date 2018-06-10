/**
* The AI class. Responsible for calculating moves based on a given board state
*/
function AI() {
	
	/**
	* Returns a move based on a given board. How the move is calculated:
	* 1) Try to find path directly to gem
	* 2) If there is no path to gem, then find the longest path to the furthest snake segment
	* @param state: The current state of the game
	* @return: A Direction enum (UP, LEFT, DOWN, RIGHT)
	*/
	this.getMove = function(state) {
/*
		// Find shortest path to gem
		let ps = new PathSolver();

		let start = new Point(state.snake.x, state.snake.y);
		let end = new Point(state.gem.x, state.gem.y);
		let width = state.tiles.length;
		let height = state.tiles[0].length;
		let obstacles = state.segments.slice();

		let short = ps.shortestPath(start, end, width, height, obstacles);
		if(short.length > 0) {
			return getFirstDirection(short);
		}


		// Find longest valid path to snake segment furthest from the head
		for(let i = state.snake.segments.length - 1; i >= 0; i--) {
			end = new Point(state.snake.segments[i].x, state.snake.segments[i].y);

			let long = ps.longestPath(start, end, width, height, obstacles);
			if(long.length > 3) {
				return getFirstDirection(long);
			}
		}

		return Directions.LEFT;
	}*/

		let snake = JSON.parse(JSON.stringify(state.snake));

		// Follow shortest path to gem if it's safe
		let ps = new PathSolver();
		let start = new Point(snake.x, snake.y);
		let end = new Point(state.gem.x, state.gem.y);
		let width = state.tiles.length;
		let height = state.tiles[0].length;
		let obstacles = state.segments.slice();
		let short = ps.shortestPath(start, end, width, height, obstacles);

		if(short.length > 0) {
			if(pathIsSafe(short, snake, width, height)) {
				return getFirstDirection(short);
			} else {
				console.log("Path is unsafe");
			}
		}


		// Follow longest path to tail
		console.log("Finding longest path to tail...");
		let tail = snake.segments.slice(-1)[0];
		end = new Point(tail.x, tail.y);
		let long = ps.longestPath(start, end, width, height, obstacles);

		if(long.length > 3) {
			return getFirstDirection(long);
		}


		// Find longest valid path to snake segment furthest from the head
		console.log("Finding longest path to furthest segment");
		for(let i = snake.segments.length - 1; i >= 0; i--) {
			end = new Point(snake.segments[i].x, snake.segments[i].y);

			let long = ps.longestPath(start, end, width, height, obstacles);
			if(long.length > 3) {
				return getFirstDirection(long);
			}
		}


		// Move away from gem
		//let avoid = ps.furthestFromGem(start, gem, width, height, obstacles);
		//return getFirstDirection(avoid);
		

		// No other options
		console.log("ERROR");
		return Directions.LEFT;
	};
	
}


/**
* Checks whether or not the snake can reach its tail after traversing a given path
* @param path: A Path to traverse
* @param snake: The Snake which follows the path
* @return: True if the path is safe
*/
function pathIsSafe(path, snake, width, height) {
//return true;
	// No need to check unless the snake has segments
	if(snake.segments.length == 0) {
		return true;
	}


	// Simulate moving the snake along the path
	let tempSnake = new Snake();
	tempSnake.x = snake.x;
	tempSnake.y = snake.y;
	tempSnake.prevX = snake.prevX;
	tempSnake.prevY = snake.prevY;
	tempSnake.segments = snake.segments.slice();

	for(let i = 1; i < path.length; i++) {
		tempSnake.moveTo(path[i].x, path[i].y);
	}


	// Check if the snake can reach its tail
	let ps = new PathSolver();
	let _start = new Point(tempSnake.x, tempSnake.y);
	let _tail = tempSnake.segments.slice(-1)[0];
	let _end = new Point(_tail.x, _tail.y);
	let _obstacles = tempSnake.segments.slice();
	let _short = ps.shortestPath(_start, _end, width, height, _obstacles);

	return _short.length > 0;
}


/**
* Used to calculate paths from point A to point B
*/
function PathSolver() {
	
	/**
	* Returns the shortest path between the given start/end points while avoiding obstacles
	* @param start: A Point representing the start of the path
	* @param end: A Point representing the end of the path
	* @param width: An int representing the width of the grid
	* @param height: An int representing the height of the grid
	* @param obstacles: An array of Points representing forbidden squares
	* @return: A Path (array of points) representing the shortest path from start to end, empty if no path found
	*/
	this.shortestPath = function(start, end, width, height, obstacles) {
		let solutionPath = [];
		let searchedTiles = [];
	    let queue = [];


	    // Set the starting point
	    queue.push(new Tile(null, start.x, start.y, null));


	    // Search tiles until goal is found (or can't be found)
	    while(queue.length > 0) {
	        
	        let currentTile = queue.shift();

	        // Generate solution path if we found the goal
	        if(currentTile.x == end.x && currentTile.y == end.y) {
	            let direction;
	            
	            while(currentTile.parent != null) {
	                solutionPath.push(new Point(currentTile.x, currentTile.y));
	                currentTile = currentTile.parent;
	            }
	                
	            solutionPath.push(new Point(currentTile.x, currentTile.y));
	            solutionPath.reverse();
	            return solutionPath;
	        }


	        // Check if this state has already been expanded
			let isExpanded = false;
			for(let i = 0; i < searchedTiles.length; i++) {
				
				let tempTile = searchedTiles[i];
				if(tempTile.x == currentTile.x && tempTile.y == currentTile.y) {
					isExpanded = true;
				}
			}


			// Add valid neighboring tiles to queue
			if(isExpanded == false) {
				searchedTiles.push(currentTile);

				// Up
				if(this.isValidMove(currentTile.x, currentTile.y - 1, end, width, height, obstacles) == true) {
					queue.push(new Tile(currentTile, currentTile.x, currentTile.y - 1, Directions.UP));
				}

				// Left
				if(this.isValidMove(currentTile.x - 1, currentTile.y, end, width, height, obstacles) == true) {
					queue.push(new Tile(currentTile, currentTile.x - 1, currentTile.y, Directions.LEFT));
				}

				// Right
				if(this.isValidMove(currentTile.x + 1, currentTile.y, end, width, height, obstacles) == true) {
					queue.push(new Tile(currentTile, currentTile.x + 1, currentTile.y, Directions.RIGHT));
				}

				// Down
				if(this.isValidMove(currentTile.x, currentTile.y + 1, end, width, height, obstacles) == true) {
					queue.push(new Tile(currentTile, currentTile.x, currentTile.y + 1, Directions.DOWN));
				}
			}
	    }

	    return solutionPath;
	};


	/**
	* Returns the longest path between the given start/end points while avoiding obstacles
	* @param start: A Point representing the start of the path
	* @param end: A Point representing the end of the path
	* @param width: An int representing the width of the grid
	* @param height: An int representing the height of the grid
	* @param obstacles: An array of Points representing forbidden squares
	* @return: A Path (array of points) representing the longest path from start to end, empty if no path found
	*/
	this.longestPath = function(start, end, width, height, obstacles) {

		// Get shortest path
		let shortestPath = this.shortestPath(start, end, width, height, obstacles);
		if(shortestPath.length == 0) {
			return shortestPath;
		}


		// Set obstacles
		let longestPath = shortestPath.slice();
		let newObstacles = obstacles.slice();
		for(var i = 0; i < shortestPath.length; i++) {
			newObstacles.push(shortestPath[i]);
		}


		// Extend each pair of points
		let index = 0;
		let exitFlag = false;
		while(!exitFlag) {

			if(longestPath.length <= 1) { return []; }


			// Get the two points to expand
			let point1 = longestPath[index];
			let point2 = longestPath[index + 1];
			let expanded = false;


			/**
			* Check if we can expand this pair of points in any direction
			* To expand two horizontal points, we try to expand up then down.
			* To expand two vertical points, we try to expand left then right.
			*/
			let direction = getDirection(point1, point2);
			let newPoint1 = undefined;
			let newPoint2 = undefined;

			switch(direction) {
				case Directions.LEFT:
				case Directions.RIGHT:
					// Expand up
					if(this.isValidMove(point1.x, point1.y - 1, new Point(-1, -1), width, height, newObstacles)) {
						if(this.isValidMove(point2.x, point2.y - 1, new Point(-1, -1), width, height, newObstacles)) {
							newPoint1 = new Point(point1.x, point1.y - 1);
							newPoint2 = new Point(point2.x, point2.y - 1);
							break;
						}
					}

					// Expand down
					if(this.isValidMove(point1.x, point1.y + 1, new Point(-1, -1), width, height, newObstacles)) {
						if(this.isValidMove(point2.x, point2.y + 1, new Point(-1, -1), width, height, newObstacles)) {
							newPoint1 = new Point(point1.x, point1.y + 1);
							newPoint2 = new Point(point2.x, point2.y + 1);
							break;
						}
					}
					break;
				case Directions.UP:
				case Directions.DOWN:
					// Expand left
					if(this.isValidMove(point1.x - 1, point1.y, new Point(-1, -1), width, height, newObstacles)) {
						if(this.isValidMove(point2.x - 1, point2.y, new Point(-1, -1), width, height, newObstacles)) {
							newPoint1 = new Point(point1.x - 1, point1.y);
							newPoint2 = new Point(point2.x - 1, point2.y);
							break;
						}
					}

					// Expand right
					if(this.isValidMove(point1.x + 1, point1.y, new Point(-1, -1), width, height, newObstacles)) {
						if(this.isValidMove(point2.x + 1, point2.y, new Point(-1, -1), width, height, newObstacles)) {
							newPoint1 = new Point(point1.x + 1, point1.y);
							newPoint2 = new Point(point2.x + 1, point2.y);
							break;
						}
					}
					break;
			}


			// Expand the pair of points
			if(newPoint1 != undefined && newPoint2 != undefined) {
				//console.log(newPoint1);
				longestPath.splice(index + 1, 0, newPoint1, newPoint2);
				newObstacles.push(newPoint1);
				newObstacles.push(newPoint2);
				expanded = true;
			}


			// Move onto the next pair of points if we didn't extend
			if(!expanded) {
				index++;

				// We have expanded as much as possible
				if(index >= longestPath.length - 1) {
					exitFlag = true;
				}
			}
		}

		return longestPath;
	};


	/**
	* Checks if a given move is valid
	* @param x: The x position of the move
	* @param y: The y position of the move
	* @param goal: A Point representing the goal
	* @param width: The width of the grid
	* @param height: The height of the grid
	* @param obstacles: An array of Points representing any obstacles
	* @return: True if the move is valid
	*/
	this.isValidMove = function(x, y, goal, width, height, obstacles) {
		
		// Check bounds
		if(x < 0 || x >= width || y < 0 || y >= height) {
			return false;
		}


		// Check goal
		if(x == goal.x && y == goal.y) {
			return true;
		}


		// Check obstacles
		for(let i = 0; i < obstacles.length; i++) {
			if(x == obstacles[i].x && y == obstacles[i].y) {
				return false;
			}
		}


		// Move is valid
		return true;
	};
}


/**
* Gets the first direction of a given Path
* @param path: A Path object
* @return: A Direction
*/
function getFirstDirection(path) {
	let P1 = path[0];
	let P2 = path[1];

	return getDirection(P1, P2);
}


/**
* Gets the direction between 2 points
* @param P1: The first point
* @param P2: The second point
* @return: A Direction
*/
function getDirection(P1, P2) {
	if(P1.x - 1 == P2.x) {
		return Directions.LEFT;
	}

	if(P1.x + 1 == P2.x) {
		return Directions.RIGHT;
	}

	if(P1.y - 1 == P2.y) {
		return Directions.UP;
	}

	if(P1.y + 1 == P2.y) {
		return Directions.DOWN;
	}

	console.log("Default first direction...");
	return Directions.LEFT;
}


/**
* Represents a point on a grid
* @param x: The x position of the point
* @param y: The y position of the point
*/
function Point(x, y) {
	this.x = x;
	this.y = y;
}



// Enums
var TileValues = Object.freeze({EMPTY: 0, WALL: 1, PLAYER: 2, GEM: 3});
var Directions = Object.freeze({UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3});
var GameModes = Object.freeze({CLASSIC: 0, SURVIVAL: 1, MINEFIELD: 2});


function Tile(parent, x, y, direction) {
    this.parent = parent
    this.x = x;
    this.y = y;
    this.direction = direction;
}

















/*
let ps = new PathSolver();

let start = new Point(1, 3);
let end = new Point(3, 1);
let width = 5;
let height = 4;
let obstacles = [new Point(1, 2), new Point(2, 3), new Point(0, 0)];

let p = ps.longestPath(start, end, width, height, obstacles);
console.log(p);
*/
/*
let leftPath = [new Point(3, 3), new Point(2, 3)];
let rightPath = [new Point(3, 3), new Point(4, 3)];
let upPath = [new Point(3, 3), new Point(3, 2)];
let downPath = [new Point(3, 3), new Point(3, 4)];
console.log(getFirstDirection(leftPath));
console.log(getFirstDirection(rightPath));
console.log(getFirstDirection(upPath));
console.log(getFirstDirection(downPath));
*/