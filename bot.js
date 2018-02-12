var Bot = {
    getMove: function(state) {
        
        var solutionPath = [];
		var searchedTiles = [];
        var queue = [];


        // Set the player's head as the starting point (root) 
        queue.push(new Tile(null, state.player.x, state.player.y, null));


        // Search tiles until goal is found
        while(queue.length > 0) {
            
            var currentTile = queue.shift();
            //console.log("pop");
            // Check if this is a goal tile
            //console.log("X=" + currentTile.x + ",Y=" + currentTile.y + ",X=" + state.gem.x + ",Y=" + state.gem.y);
            //console.log(state.gem.x);
            //console.log(state.gem.y);
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
