// Enums
var TileValues = Object.freeze({EMPTY: 0, WALL: 1, PLAYER: 2, GEM: 3});
var Directions = Object.freeze({UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3});
var GameModes = Object.freeze({CLASSIC: 0, SURVIVAL: 1, MINEFIELD: 2});


/**
* A Point object
* @param x: The x value
* @param y: The y value
*/
function Point(x, y) {
	this.x = x;
	this.y = y;
}


function Tile(parent, x, y, direction) {
    this.parent = parent
    this.x = x;
    this.y = y;
    this.direction = direction;
}
