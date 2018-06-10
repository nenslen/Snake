var Bot = {
    getBFSMove: function(state) {
        
        var solutionPath = [];
		var searchedTiles = [];
        var queue = [];


        // Set the player's head as the starting point (root) 
        queue.push(new Tile(null, state.player.x, state.player.y, null));


        // Search tiles until goal is found
        while(queue.length > 0) {
            
            var currentTile = queue.shift();

            // Check if this is a goal tile
            if(currentTile.x == state.gem.x && currentTile.y == state.gem.y) {
                var direction = Directions.UP;
                
                // Generate solution
                while(currentTile.parent != null) {
                    direction = currentTile.direction;
                    currentTile = currentTile.parent;
                }
                    
                return direction;
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
				var gridSize = state.tiles.length;
				searchedTiles.push(currentTile);

				// Up
				if(Bot.isValidMove(currentTile.x, currentTile.y - 1, gridSize, state.segments) == true) {
					queue.push(new Tile(currentTile, currentTile.x, currentTile.y - 1, Directions.UP));
				}

				// Left
				if(Bot.isValidMove(currentTile.x - 1, currentTile.y, gridSize, state.segments) == true) {
					queue.push(new Tile(currentTile, currentTile.x - 1, currentTile.y, Directions.LEFT));
				}

				// Right
				if(Bot.isValidMove(currentTile.x + 1, currentTile.y, gridSize, state.segments) == true) {
					queue.push(new Tile(currentTile, currentTile.x + 1, currentTile.y, Directions.RIGHT));
				}

				// Down
				if(Bot.isValidMove(currentTile.x, currentTile.y + 1, gridSize, state.segments) == true) {
					queue.push(new Tile(currentTile, currentTile.x, currentTile.y + 1, Directions.DOWN));
				}
			}

			//console.log(expandedStates);
        }

        return Directions.LEFT;
    },
    getDFSMove: function(state) {
        
        var solutionPath = [];
		var searchedTiles = [];
        var queue = [];


        // Set the player's head as the starting point (root) 
        queue.push(new Tile(null, state.player.x, state.player.y, null));


        // Search tiles until goal is found
        while(queue.length > 0) {
            
            // Get next tile
            var currentTile = queue.pop();


            // Check if we found a goal tile
            if(currentTile.x == state.gem.x && currentTile.y == state.gem.y) {
                console.log("goal");
                var direction = Directions.UP;

                // Generate solution
                while(currentTile.parent != null) {
                	
                    direction = currentTile.direction;
                    currentTile = currentTile.parent;
                }
                
                return direction;
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
				var gridSize = state.tiles.length;
				searchedTiles.push(currentTile);

				// Up
				if(Bot.isValidMove(currentTile.x, currentTile.y - 1, gridSize, state.segments) == true) {
					if(currentTile.x == state.gem.x && currentTile.y - 1 == state.gem.y) {
					    console.log("goal");
					    var direction = Directions.UP;

					    // Generate solution
					    while(currentTile.parent != null) {
					    	
					        direction = currentTile.direction;
					        currentTile = currentTile.parent;
					    }
					    
					    return direction;
					}
					queue.push(new Tile(currentTile, currentTile.x, currentTile.y - 1, Directions.UP));
				}

				// Left
				if(Bot.isValidMove(currentTile.x - 1, currentTile.y, gridSize, state.segments) == true) {
					if(currentTile.x - 1 == state.gem.x && currentTile.y == state.gem.y) {
					    console.log("goal");
					    var direction = Directions.LEFT;

					    // Generate solution
					    while(currentTile.parent != null) {
					    	
					        direction = currentTile.direction;
					        currentTile = currentTile.parent;
					    }
					    
					    return direction;
					}
					queue.push(new Tile(currentTile, currentTile.x - 1, currentTile.y, Directions.LEFT));
				}

				// Right
				if(Bot.isValidMove(currentTile.x + 1, currentTile.y, gridSize, state.segments) == true) {
					if(currentTile.x + 1 == state.gem.x && currentTile.y == state.gem.y) {
					    console.log("goal");
					    var direction = Directions.RIGHT;

					    // Generate solution
					    while(currentTile.parent != null) {
					    	
					        direction = currentTile.direction;
					        currentTile = currentTile.parent;
					    }
					    
					    return direction;
					}
					queue.push(new Tile(currentTile, currentTile.x + 1, currentTile.y, Directions.RIGHT));
				}

				// Down
				if(Bot.isValidMove(currentTile.x, currentTile.y + 1, gridSize, state.segments) == true) {
					if(currentTile.x == state.gem.x && currentTile.y + 1 == state.gem.y) {
					    console.log("goal");
					    var direction = Directions.DOWN;

					    // Generate solution
					    while(currentTile.parent != null) {
					    	
					        direction = currentTile.direction;
					        currentTile = currentTile.parent;
					    }
					    
					    return direction;
					}
					queue.push(new Tile(currentTile, currentTile.x, currentTile.y + 1, Directions.DOWN));
				}
			}
        }

        return Directions.LEFT;
    },
    isValidMove: function(x, y, gridSize, segments) {
    	var valid = true;

    	// Walls
    	if(x < 0 || y < 0 || x >= gridSize || y >= gridSize) {
    		valid = false;
    	}


    	// Player segments
    	for(var i = 0; i < segments.length; i++) {
    		var segment = segments[i];
    		if(x == segment.x && y == segment.y) {
    			valid = false;
    			break;
    		}
    	}

    	return valid;
    }
};
