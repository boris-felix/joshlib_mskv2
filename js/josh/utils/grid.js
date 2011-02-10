(function(J, $) {


    J.Utils.Grid = J.Class(
    /**
        @lends J.Utils.Grid.prototype
     */
    {

        //Indexed by orientation
        moves: {
            "up": {
                "down": [0, 1],
                "up": [0, -1],
                "right": [1, 0],
                "left": [ - 1, 0]
            },
            "down": {
                "down": [0, -1],
                "up": [0, 1],
                "right": [1, 0],
                "left": [ - 1, 0]
            }
        },


        /** 
            @constructs 
            @class A 2D Grid for navigation
            @param {Object} options Options hash
        */
        __constructor: function(options) {
            this.options = options;
            this.grid = options.grid;
            this.currentCoords = false;
            this.orientation = options.orientation || "up";
        },

        setGrid: function(grid) {
            this.grid = grid;
            //this.currentCoords = false;
        },

        get: function(coords) {
            return this.grid[coords[1]][coords[0]];
        },

        goTo: function(coords) {
            if (!this.currentCoords || coords[0] !== this.currentCoords[0] || coords[1] !== this.currentCoords[1]) {
                this.currentCoords = coords;
                if (this.options.onChange) this.options.onChange(this.currentCoords, this.get(this.currentCoords));
            }
            if (this.options.onSelect) this.options.onSelect(this.currentCoords, this.get(this.currentCoords));
        },

        go: function(move) {
            var newx = this.moves[this.orientation][move][0] + this.currentCoords[0];
            var newy = this.moves[this.orientation][move][1] + this.currentCoords[1];
            if (
                (newy < 0 || newy >= this.grid.length || !this.grid[newy]) ||
                (newx < 0 || newx >= this.grid[newy].length || !this.grid[newy][newx])
            ) {

                if (this.options.onExit) this.options.onExit([ - this.moves[this.orientation][move][0], -this.moves[this.orientation][move][1]]);

            } else {
                this.goTo([newx, newy]);
            }
        }

    });



})(Joshlib, jQuery);