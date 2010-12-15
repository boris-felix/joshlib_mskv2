(function(J,$) {
	
	/**
     * @class
     */
	J.Menu = J.Class({
		
		__constructor:function(app) 
		{

		    this.app = app;
		    
    		this.registers={};
    		
    		this.id2index = {};
    		
    		this.data = {};
		    
			this.beingLoaded = {};
			
			var self=this;
			this.app.subscribe("menuGoTo",function(ev,data) {
			    //data : [ 0 : nom du registre , 1 : chemin  ]
			    
			    //Go to first child
			    if (self.isDirectory(data[1])) {
			        self.resolveMoves(data[1].substring(0,data[1].length-1),["down"],function(newPath) {
			            self.setRegister(data[0],newPath);
			        });
			    } else {
			        self.setRegister(data[0],data[1]);
			    }
			    
                
			    
				
			});

			this.app.subscribe("menuGo",function(ev,data) {
			    //data : [ 0 : nom du registre , 1 : chemin  ]
			    
			    self.resolveMoves(self.getRegister(data[0]),data[1],function(newPath) {
			        self.app.publish("menuGoTo",[data[0],newPath],true);
			    });
			        
			});
			
		},
		
		setRegister:function(register,position) {
		    
		    this.registers[register]=position;
		    this.app.publish("menuChange",[register,position],true);
		},
		
		getRegister:function(register) {
		    return this.registers[register];
		},
		
		resolveMoves:function(path,moves,callback) {
		    if (typeof moves=="string") moves = [moves];
		    
		    console.log("resolveMoves ",path,moves[0]);
		    
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