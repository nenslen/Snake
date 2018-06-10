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
	* @return: A Path (array of points) representing the shortest path from start to end
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
				if(isValidMove(currentTile.x, currentTile.y - 1, end, width, height, obstacles) == true) {
					queue.push(new Tile(currentTile, currentTile.x, currentTile.y - 1, Directions.UP));
				}

				// Left
				if(isValidMove(currentTile.x - 1, currentTile.y, end, width, height, obstacles) == true) {
					queue.push(new Tile(currentTile, currentTile.x - 1, currentTile.y, Directions.LEFT));
				}

				// Right
				if(isValidMove(currentTile.x + 1, currentTile.y, end, width, height, obstacles) == true) {
					queue.push(new Tile(currentTile, currentTile.x + 1, currentTile.y, Directions.RIGHT));
				}

				// Down
				if(isValidMove(currentTile.x, currentTile.y + 1, end, width, height, obstacles) == true) {
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
	* @return: A Path (array of points) representing the longest path from start to end
	*/
	this.longestPath = function(start, end, width, height, obstacles) {

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
		
		// Move is valid if it's the goal
		if(x == goal.x && y == goal.y) {
			return true;
		}


		// Move is invalid if it's out of bounds
		if(x < 0 || x >= width || y < 0 || y >= height) {
			return false;
		}


		// Move is invalid if it leads to an obstacle
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