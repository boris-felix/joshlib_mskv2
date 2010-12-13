(function(J,$) {
	
	/**
     * @class
     */
	J.Menu = J.Class({
		
		
		
		__constructor:function(app) 
		{

		    this.app = app;
		    
		    this.currentPath='/';
    		this.focus='/';
    		this.index=[];
    		this.datas=[];

    		this.registre={};
		    
			this.index['/']=[];
			this.index['/']['_child']=[];
			this.index['/']['_data']=[];
			
			this.beingLoaded = {};
			
			var self=this;
			this.app.subscribe("menuGoTo",function(ev,data) {
			    //data : [ 0 : nom du registre , 1 : chemin  ]
				self.goAbsolute(data[0],data[1]);
			});

			this.app.subscribe("menuGo",function(ev,data) {
			    //data : [ 0 : nom du registre , 1 : chemin  ]
			    self.goRelative(data[0],data[1]);    
			});
			
		},
		
		setRegister:function(register,position) {
		    
		    this.registre[register]=position;
		    this.app.publish("menuChange",[register,position],true);
		},
		
		getRegister:function(register) {
		    return this.registre[register];
		},
		
		goRelative:function(register,movement) {
		    
		    var self = this;
			var goingnear = undefined;
            
			switch (movement)
			{
				case 'prev' :
				case 'next' :
					goingnear = self.index[self.registre[register]]['_'+movement]!==undefined ?
									self.index[self.registre[register]]['_'+movement]
									:self.registre[register];

				break;
				case 'up'   :
					var path = self.registre[register];
					path = path.substr(0,path.lastIndexOf('/'));
					if ((path=='') || (path=='/'))
					{
					    goingnear = undefined;
					} else {
						goingnear = path;
					}
				break;
				case 'down' :
				
				    if ((register=="focus" || register=="prefocus") && self.beingLoaded[self.registre[register]+"/"]) {
				        self.setRegister(register,self.registre[register]+"/");
				        return true;
					} else if ((typeof self.index[self.registre[register]]['_child'] != 'undefined') && self.index[self.registre[register]]['_child'].length>0 ) {
					    goingnear = self.index[self.registre[register]]['_child'][0];
					} else {
					    goingnear = self.registre[register];
					}
						
				break;
			}
            
			if (goingnear===undefined)
			{
			    
                console.log('Out-of-bounds move: ',register,movement);
				return false;
			} else {
				self.app.publish("menuGoTo",[register,goingnear],true);
				return true;
			}
		    
		},
		
		goAbsolute:function(register,goingto) {
		    
		    var self = this;
		    
			if ((self.index[goingto]===undefined) || (goingto===undefined) || (register===undefined) )
			{
			    console.warn("no such menu "+goingto);
				return false;
			} else {
				
				if (typeof self.index[goingto]["_data"]["getChildren"]=="function" && (register=="focus" || register=="prefocus" || register=="preload") && !self.index[goingto]["_data"]["children"]) 
				{
				    self.app.publish("menuDataLoading",[goingto+"/"],true);
				    self.index[goingto+"/"] = {'_data':"loading"};
				    self.beingLoaded[goingto+"/"]=true;
				    
				    self.index[goingto]["_data"]["getChildren"](function(children) {
				        
				        delete self.beingLoaded[goingto+"/"];
				        
				        
				        self.setData(goingto+"/",children);
				        //console.log("index",goingto,children);
				        self.index[goingto+"/"]["_data"] = children;
				        self.app.publish("menuData",[goingto+"/",children],true);
				        //if we're still waiting for the answer, focus on 1st element
				        if (self.registre[register]==goingto+"/") {
				            
				            if (children.length>0) {
				                
				                self.setRegister(register,goingto+"/"+children[0]["id"]);
				            } else {
				                
				                //back to parent if no children
				                self.setRegister(register,goingto);
				            }
				            
				        }
				        
				        
				    },self.index[goingto]["_data"]);
				}
				
				self.setRegister(register,goingto);
				
				
				return true;
			}
		    
		},
		
		setRootData:function(data)
		{
			return this.setData("/",data);
		},
		
		setData:function(path,data) 
		{
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif, donc vers les enfants
			if (path.charAt(0)!='/') path = (this.currentPath=='/'?'':this.currentPath)+'/'+path;
					
			if ( (path.charAt(path.length-1)!='/') || (path=='/') )
			{
			    this.app.publish("menuData",[path,data],true);
			    
				this.buildIndex(path,data,true);
				if (typeof data === 'object')
				{
					for (var key in data)
					{
						if (typeof data[key] === 'object') this.buildIndex((path==='/'?'':path)+'/'+data[key]['id'],data[key],true);
					}
				}
				
				
			} else {
				
				for (var key in data)
				{
					if (typeof data[key] === 'object') this.buildIndex(path+data[key]['id'],data[key],true);
				}
			}
			
		},
		
		buildIndex:function(path,data,recursive) 
		{
		    
		    
		    
			if (this.index[path] === undefined) 
			{
				this.index[path] = {};
				this.index[path]['_data'] = {};
				
				if (path!='/')
				{
					var parpath = path.substr(0,path.lastIndexOf('/'));
					parpath = (parpath == '' )? '/' : parpath;

					if (this.index[parpath]['_child']===undefined)
					{
						this.index[path]['_prev'] = false;
						this.index[parpath]['_child'] = [path];
					} else {
						var prevchild = this.index[parpath]['_child'][this.index[parpath]['_child'].length-1];
						this.index[parpath]['_child'].push(path);
						this.index[path]['_prev']=prevchild;
						if (this.index[path]['_prev']!==undefined) this.index[this.index[path]['_prev']]['_next']=path;
					}
					this.index[path]['_next']=false;
				}
			}
			
			if (this.index[path]['_data'] === undefined)
			{
				this.index[path]['_data'] = {};
			}
			
			if (typeof data === 'string')
			{
				this.index[path]['_data'][0]=data;
			} else {
				// on a un object
				for (var key in data) {
					
					if (typeof data[key] !== 'object') 
					{
						this.index[path]['_data'][key]=data[key];
					} else {
//						 if (recursive && data[key]["id"])
//						{
//							this.buildIndex((path!=='/'?path:'')+"/"+data[key]["id"],data[key],true);
//						}
					}
				}
			}

			var d=new Date();				
			this.index[path]['_when'] = d.getTime(); // ceci pour un usage futur qui permettrait de mettre à jour les données passé un certain temps.

			
			if (recursive && data["children"])
			{
			    //fixme
                this.index[(path!=='/'?path:'')+"/"] = {'_data':data["children"]};
                
				for (var i in data["children"])
				{
					this.buildIndex((path!=='/'?path:'')+"/"+data["children"][i]["id"],data["children"][i],true);
					
				}
				this.app.publish("menuData",[(path!=='/'?path:'')+"/",data["children"]],true);
			} else if ((path.charAt(path.length-1)=='/')) {
			    this.index[path] = {'_data':data};
			}
		},

		getData:function(path) 
		{
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif, donc vers les enfants
			if (path.charAt(0)!='/') path = (this.currentPath=='/'?'':this.currentPath)+'/'+path;
			
			// aud cas où, je blinde
			if (this.index[path]===undefined)
			{
console.error('getData : données inexistantes pour'+path,this);
				return false;
			} else {
				return this.index[path]['_data'];
			}
		}
		
	});
	
})(Joshlib,jQuery);