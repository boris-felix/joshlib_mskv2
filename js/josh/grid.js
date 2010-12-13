(function(J,$) {
	
	/**
     * @class
     */
	J.Grid = J.Class({
		
		moves:{
		    "down":[0,1],
		    "up":[0,-1],
            "right":[1,0],
            "left":[-1,0],
		},
		
		__constructor:function(options) {
			this.options = options;
			this.grid = options.grid;
			this.currentCoords = false;
		},
		
		get:function(coords) {
		    return this.grid[coords[1]][coords[0]];
		},
		
		goTo:function(coords) {
		    this.currentCoords=coords;
		    this.options.onChange(this.currentCoords,this.get(this.currentCoords));
		},
		
		go:function(move) {
		    var newx = this.moves[move][0]+this.currentCoords[0];
		    var newy = this.moves[move][1]+this.currentCoords[1];
		    if (newy<0 || newy>=this.grid.length || !this.grid[newy]) {
		        this.options.onExit(move);
		    } else if (newx<0 || newx>=this.grid[newy].length || !this.grid[newy][newx]) {
		        this.options.onExit(move);
		    } else {
		        this.goTo([newx,newy]);
		    }
		}
		
	});
	
	
	
})(Joshlib,jQuery);