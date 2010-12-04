(function(J,$) {
	
	/**
     * @class
     */
	J.Menu = J.Class({
		
		currentPath:'/',
		focus :'/',
		index : [],
		datas : [],
		
		registre  : { },
		
		__constructor:function(app) 
		{
		    this.app = app;
		    
			this.index['/']=[];
			this.index['/']['_child']=[];
			this.index['/']['_data']=[];
			
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
		
		
		goRelative:function(register,movement) {
		    
		    var self = this;
			var goingnear = undefined;
            
			switch (movement)
			{
				case 'prev' :
				case 'next' :
					var goingnear = self.index[self.registre[register]]['_'+movement]!==undefined ?
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
					var goingnear = ((typeof self.index[self.registre[register]]['_child'] != 'undefined') && self.index[self.registre[register]]['_child'].length>0 ) ?
									self.index[self.registre[register]]['_child'][0]:
									self.registre[register];
				break;
			}
            
			if (goingnear===undefined)
			{
                console.error(' AAAAAHHHHH ! MenuGo est nulle part ');
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
				self.registre[register]=goingto;
				
				if (typeof self.index[goingto]["_data"]["getChildren"]=="function" && register=="focus" && !self.index[goingto]["_data"]["children"]) 
				{
				    self.app.publish("menuDataLoading",[goingto+"/"],true);
				    self.index[goingto]["_data"]["getChildren"](function(children) {
				        self.setData(goingto+"/",children);
				    },self.index[goingto]["_data"]);
				}
				self.app.publish("menuChange",[register,goingto],true);
				
				return true;
			}
		    
		},
		
		setRootData:function(data)
		{
			return this.setData("/",data);
		},
		
		setData:function(path,data) 
		{
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif, donc vers les chti n'enfants
			if (path.charAt(0)!='/') path = (this.currentPath=='/'?'':this.currentPath)+'/'+path;
					
			if ( (path.charAt(path.length-1)!='/') || (path=='/') )
			{
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
			this.app.publish("menuData",[path,data],true);
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
				for (var i in data["children"])
				{
					this.buildIndex((path!=='/'?path:'')+"/"+data["children"][i]["id"],data["children"],true);
				}
			}
		},

		getData:function(path) 
		{
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif, donc vers les chti n'enfants
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