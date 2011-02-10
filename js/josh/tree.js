(function(J, $) {

    J.Tree = J.Class(
    /**
	  @lends J.Tree.prototype
    */
    {
        inverses: {
            "down": "up",
            "up": "down",
            "next": "prev",
            "prev": "next"
        },

        /** 
		    @constructs 
		    @class The state tree
		    @param {J.App} app Reference to the app object
		*/
        __constructor: function(app)
        {

            this.app = app;

            this.registers = {};

            this.id2index = {};

            this.data = {};

            this.beingLoaded = {};

            var self = this;
            this.app.subscribe("stateGoTo",
            function(ev, data) {
                var register = data[0];
                var path = data[1];

                //self.app.publish("control",["enter",menuPath || event.currentTarget.id]); ?
                if (!path) return;

                //Go to first child
                if (self.isDirectory(path)) {
                    var async = true;
                    self.resolveMoves(path.substring(0, path.length - 1), ["down"],
                    function(newPath) {
                        //console.log("FChild callback got "+newPath,newPath);
                        async = false;
                        self.setState(register, newPath);
                    });
                    //Set the temporary register
                    if (async) {
                        //console.log("FChild callback was async, setting "+path,path);
                        self.setState(register, path);
                    }
                } else {
                    self.setState(register, path);
                }




            });

            this.app.subscribe("stateGo",
            function(ev, data) {
                var register = data[0];
                var path = data[1];

                //self.app.publish("control",["enter",menuPath || event.currentTarget.id]); ?
                if (!path) return;

                //data : [ 0 : nom du registre , 1 : chemin  ]
                var async = true;
                self.resolveMoves(self.getState(register), path,
                function(newPath) {
                    async = false;
                    self.app.publish("stateGoTo", [register, newPath], true);
                });

                if (async && path == "down") {
                    self.setState(register, (self.getState(register) + "/").replace(/\/\/$/, "/"));
                }

            });

        },

        /** 
		    Set a state register to a value
		    @function 
		    @param {String} register A named state register
		    @param state The state value
		*/
        setState: function(register, state) {

            //try to fix https://github.com/joshfire/france24/issues/#issue/41
            if (!state) return;

            this.registers[register] = state;
            this.app.publish("stateChange", [register, state], true);
        },

        /** 
		    Get the value in a state register
		    @function 
		    @param {String} register A named state register
		*/
        getState: function(register) {
            return this.registers[register];
        },

        /** 
		    Removes useless move sequences like ['up','down']
		    @function 
		    @param {Array} moves An array of moves
		    @returns {Array} Array A possibly smaller array of moves
		*/
        compactMoves: function(moves) {
            if (moves.length < 2) return [].concat(moves);
            var newMoves = [];

            for (var i = 0; i < moves.length; i++) {
                if ((i < moves.length - 1) && moves[i] == this.inverses[moves[i + 1]]) {
                    i++;
                } else {
                    newMoves.push(moves[i]);
                }
            }
            //console.log("                                         compat",moves,newMoves);
            return newMoves;

        },

        /** 
		    Apply a move sequence to a path and get the result path
		    @function 
		    @param {String} path The starting path
		    @param {Array} moves An array of moves
		    @param {Function} callback A callback for the end path
		*/
        resolveMoves: function(path, moves, callback) {
            if (typeof moves == "string") {
                moves = [moves];
            } else {
                moves = [].concat(moves);
            }
            //console.log("resolveMoves ",path,moves[0]);
            //Can't resolve moves from a directory. Start from its first child.
            if (this.isDirectory(path)) {
                path = this.getDirName(path);
                moves.unshift("down");
            }
            moves = [].concat(this.compactMoves(moves));

            var self = this;
            var next = function() {
                if (moves.length === 0) {
                    //console.log(" = ",path);
                    return callback(path);
                }
                var move = moves.shift();

                var dir,
                basename,
                i;

                //Moving up is easy
                if (move == "up") {
                    dir = self.getDirName(path);

                    //Not yet at root level?
                    if (dir !== "") {
                        path = dir;
                    }
                    next();

                    //Next and previous, also easy
                } else if (move == "next" || move == "prev") {
                    dir = self.getDirName(path) + "/";
                    basename = self.getBaseName(path);
                    i = self.id2index[dir][basename];

                    i += (move == "next" ? 1: -1);

                    if (i >= 0 && i < self.data[dir].length) {
                        path = dir + self.data[dir][i].id;
                    }
                    next();

                    //Now, down is the hard one.
                } else if (move == "down") {

                    //If we already have registered childs
                    if (self.data[path + "/"]) {
                        if (self.data[path + "/"] == "loading") {
                            //TODO fire when ready?
                            } else {

                            //Go to the first child
                            if (self.data[path + "/"].length > 0) {
                                path = path + "/" + self.data[path + "/"][0].id;
                            }
                            next();

                        }

                        //Asynchronous loading
                        //(register=="focus" || register=="prefocus" || register=="preload")
                    } else {
                        dir = self.getDirName(path) + "/";
                        basename = self.getBaseName(path);
                        i = self.id2index[dir][basename];

                        if (typeof self.data[dir][i].getChildren == "function") {

                            self.app.publish("treeDataLoading", [path + "/"], true);
                            self.beingLoaded[path + "/"] = true;

                            //console.log("BL",self.beingLoaded[path+"/"],path);
                            self.data[dir][i].getChildren(function(children) {

                                delete self.beingLoaded[path + "/"];

                                if (children.length > 0) {
                                    self.setData(path + "/", children);
                                    path = path + "/" + self.data[path + "/"][0].id;
                                }
                                next();


                            },
                            self.data[dir][i]);
                        } else {
                            next();
                        }
                    }

                }

            };

            next();

        },

        /** 
		    Tests if a path is a directory
		    @function 
		    @param {String} path The path
		    @returns {Boolean} Wheter the path is a directory
		*/
        isDirectory: function(path) {
            return path.charAt(path.length - 1) == "/";
        },

        /** 
		    Returns the final component of a pathname
		    @function 
		    @param {String} path The path
		    @returns {String} Final component
		*/
        getBaseName: function(path) {
            var tmp = path.split("/");
            return tmp[tmp.length - 1];
        },


        sendTreeDataEvent: function(path) {
            this.app.publish("treeData", [path, this.getData(path)]);
        },


        /** 
		    Returns the directory component of a pathname
		    @function 
		    @param {String} path The path
		    @returns {String} Directory name
		*/
        getDirName: function(path) {
            return path.replace(/\/[^\/]*$/, "");
        },

        /** 
		    Assigns data to a path in the tree
		    @function 
		    @param {String} path The path
		    @param data The tree data 
		*/
        setData: function(path, data) {
            //console.log("set",path);
            if (this.isDirectory(path)) {
                delete this.beingLoaded[path];

                this.data[path] = [];
                this.id2index[path] = {};
                for (var y = 0; y < data.length; y++) {
                    this.id2index[path][data[y].id] = y;
                    this.setData(path + data[y].id, data[y]);
                }

                //Leaf
            } else {

                var dir = this.getDirName(path) + "/";
                var basename = this.getBaseName(path);

                var children = data.children;
                delete data.children;

                //console.log(" set leaf",path,dir,basename,this.data,this.id2index);
                if (this.data[dir] !== null && this.id2index[dir] !== null) {
                    var i = this.id2index[dir][basename];
                    //console.log(" set leaf i=",i);
                    if (i === null) {
                        throw "can't setData to a new menu element like that for now";
                    }

                    if (!this.data[dir][i]) {
                        this.data[dir][i] = data;
                    } else {
                        var self = this;
                        _.map(data,
                        function(value, key) {
                            self.data[dir][i][key] = value;
                        });

                    }

                }
                //TODO remove children element in stored data struct
                if (children) {
                    this.setData(path + "/", children);
                }
            }
            this.sendTreeDataEvent(path);
        },

        /** 
		    Gets the data at some path in the tree
		    @function 
		    @param {String} path The path
		    @returns Tree data
		*/
        getData: function(path)
        {
            //Directory
            if (this.isDirectory(path)) {

                if (this.beingLoaded[path]) {
                    return "loading";
                } else {
                    return this.data[path];
                }

                //Leaf
            } else {

                var dir = this.getDirName(path) + "/";
                var basename = this.getBaseName(path);
                //console.log("getData",dir,this.data,this.id2index);
                if (this.beingLoaded[dir]) {
                    return "loading";
                } else if (this.data[dir] && this.id2index[dir] !== null) {
                    var i = this.id2index[dir][basename];
                    if (i !== null) {
                        return this.data[dir][i];
                    }
                }
                return null;

            }

        },

        /** 
		    Preloads all tree data
		    @function 
		*/
        preloadAll: function() {
            var self = this;
            self.app.subscribe("treeData",
            function(ev, data) {
                var path = data[0];
                if (!self.isDirectory(path) && (typeof data[1].getChildren == "function")) {

                    self.app.publish("stateGoTo", ["preload", data[0] + "/"]);

                }


            });
        }


    });

})(Joshlib, jQuery);