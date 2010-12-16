(function(J,$) {
	
	/**
     * @class
     */
	J.Menu = J.Class({
		
		inverses:{
		    "down":"up",
		    "up":"down",
		    "next":"prev",
		    "prev":"next"
		},
		
		__constructor:function(app) 
		{

		    this.app = app;
		    
    		this.registers={};
    		
    		this.id2index = {};
    		
    		this.data = {};
		    
			this.beingLoaded = {};
			
			var self=this;
			this.app.subscribe("menuGoTo",function(ev,data) {
			    var register=data[0];
			    var path=data[1];
			    
			    //self.app.publish("control",["enter",menuPath || event.currentTarget.id]); ?
			    if (!path) return;
			    
			    //Go to first child
			    if (self.isDirectory(path)) {
			        var async=true
			        self.resolveMoves(path.substring(0,path.length-1),["down"],function(newPath) {
			            console.log("FChild callback got "+newPath,newPath);
			            async=false;
			            self.setRegister(register,newPath);
			        });
			        //Set the temporary register
			        if (async) {
			            console.log("FChild callback was async, setting "+path,path);
			            self.setRegister(register,path);
			        }
			    } else {
			        self.setRegister(register,path);
			    }
			    
                
			    
				
			});

			this.app.subscribe("menuGo",function(ev,data) {
			    var register=data[0];
			    var path=data[1];
			    
			    //self.app.publish("control",["enter",menuPath || event.currentTarget.id]); ?
			    if (!path) return;
                
			    //data : [ 0 : nom du registre , 1 : chemin  ]
			    var async=true;
			    self.resolveMoves(self.getRegister(register),path,function(newPath) {
			        async=false;
			        self.app.publish("menuGoTo",[register,newPath],true);
			    });
			    
			    if (async && path=="down") {
			        self.setRegister(register,(self.getRegister(register)+"/").replace(/\/\/$/,"/"));
			    }
			        
			});
			
		},
		
		setRegister:function(register,position) {
		    
		    //try to fix https://github.com/joshfire/france24/issues/#issue/41
		    if (!position) return;
		    
		    this.registers[register]=position;
		    this.app.publish("menuChange",[register,position],true);
		},
		
		getRegister:function(register) {
		    return this.registers[register];
		},
		
		compactMoves:function(moves) {
		    if (moves.length<2) return [].concat(moves);
		    var newMoves = [];
		    
		    for (var i=0;i<moves.length;i++) {
		        if ((i<moves.length-1) && moves[i]==this.inverses[moves[i+1]]) {
		            i++;
		        } else {
		            newMoves.push(moves[i]);
		        }
		    }
		    //console.log("                                         compat",moves,newMoves);
		    return newMoves;
		    
		},
		
		resolveMoves:function(path,moves,callback) {
		    if (typeof moves=="string") {
		        moves = [moves];
		    } else {
		        moves = [].concat(moves);
		    }
		    console.log("resolveMoves ",path,moves[0]);
		    
		    //Can't resolve moves from a directory. Start from its first child.
		    if (this.isDirectory(path)) {
		        path = this.getDirName(path);
		        moves.unshift("down");
		    }
		    moves = [].concat(this.compactMoves(moves));
		    
		    var self = this;
		    var next = function() {
		        if (moves.length==0) {
		            console.log(" = ",path);
		            return callback(path);
		        }
		        var move = moves.shift();
		        
		        
		        //Moving up is easy
		        if (move=="up") {
		            var dir = self.getDirName(path);
		            
		            //Not yet at root level?
		            if (dir!=="") {
		                path = dir;
		            }   
		            next();
		            
		        //Next and previous, also easy
		        } else if (move=="next" || move=="prev") {
		            var dir = self.getDirName(path)+"/";
		            var basename = self.getBaseName(path);
                    var i=self.id2index[dir][basename];
                    
                    i+=(move=="next"?1:-1);
                    
                    if (i>=0 && i<self.data[dir].length) {
                        path = dir+self.data[dir][i].id;
                    }   
                    next();
                    
                //Now, down is the hard one.
		        } else if (move=="down") {
		            
		            //If we already have registered childs
		            if (self.data[path+"/"]) {
		                if (self.data[path+"/"]=="loading") {
		                    //TODO fire when ready?
		                    
		                } else {
		                    
		                    //Go to the first child
		                    if (self.data[path+"/"].length>0) {
		                        path = path+"/"+self.data[path+"/"][0].id;
		                    }
		                    next();
		                    
		                }
		                
		            //Asynchronous loading
		            //(register=="focus" || register=="prefocus" || register=="preload")
		            } else {
		                var dir = self.getDirName(path)+"/";
    		            var basename = self.getBaseName(path);
                        var i=self.id2index[dir][basename];
		                
		                if (typeof self.data[dir][i]["getChildren"]=="function") {
		                
    		                self.app.publish("menuDataLoading",[path+"/"],true);
    		                self.beingLoaded[path+"/"]=true;
		                
		                    console.log("BL",self.beingLoaded[path+"/"],path);
		                    
    		                self.data[dir][i]["getChildren"](function(children) {
		                    
    		                    delete self.beingLoaded[path+"/"];
		                        
    		                    if (children.length>0) {
    		                        self.setData(path+"/",children);
    		                        path = path+"/"+self.data[path+"/"][0].id;
    		                    }
    		                    next();
		                    
		                    
    		                },self.data[dir][i]);
	                    } else {
	                        next();
	                    }
		            }
		            
		        }
		        
		    };
		    
		    next();
		    
		},
		
		isDirectory:function(path) {
		    return path.charAt(path.length-1)=="/";
		},
		
		//Returns the final component of a pathname
		getBaseName:function(path) {
		    var tmp = path.split("/");
		    return tmp[tmp.length-1];
		},
        
        //Returns the directory component of a pathname
		getDirName:function(path) {
		    return path.replace(/\/[^/]*$/,"");
		},
		
		setData:function(path,data) {
		    console.log("set",path);
		    if (this.isDirectory(path)) {
		        delete this.beingLoaded[path];
		        
		        this.data[path] = [];
		        this.id2index[path] = {};
		        for (var i=0;i<data.length;i++) {
		            this.id2index[path][data[i].id] = i;
		            this.setData(path+data[i].id,data[i]);
	            }
		        
		    //Leaf
	        } else {
	            
                var dir = this.getDirName(path)+"/";
                var basename = this.getBaseName(path);
                
                var children = data["children"];
                delete data["children"];

                console.log(" set leaf",path,dir,basename,this.data,this.id2index);
                if (this.data[dir]!==null && this.id2index[dir]!==null) {
                    var i = this.id2index[dir][basename];
                    console.log(" set leaf i=",i);
                    if (i===null) {
                        throw "can't setData to a new menu element like that for now";
                    }
                    
                    if (!this.data[dir][i]) {
                        this.data[dir][i] = data;
                    } else {
                        for (var elem in data) {
                            this.data[dir][i][elem] = data[elem];
                        }
                    }
                    
                }
                //TODO remove children element in stored data struct
                if (children) {
                    this.setData(path+"/",children);
                }
	        }
	        this.sendMenuDataEvent(path);
		},
		
		sendMenuDataEvent:function(path) {
		    this.app.publish("menuData",[path,this.getData(path)]);
		},
		

        getData:function(path) 
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
                
                var dir = this.getDirName(path)+"/";
                var basename = this.getBaseName(path);
                //console.log("getData",dir,this.data,this.id2index);
                if (this.beingLoaded[dir]) {
                    return "loading";
                } else if (this.data[dir] && this.id2index[dir]!==null) {
                    var i = this.id2index[dir][basename];
                    if (i!==null) {
                        return this.data[dir][i];
                    }
                }
                return null;
                
            }
            
        },


        preloadAll:function() {
            return;
            var self = this;
            self.app.subscribe("menuData",function(ev,data) {
                self.app.publish("menuGoTo",["preload",data]);
            });
        }
		
		
	});
	
})(Joshlib,jQuery);