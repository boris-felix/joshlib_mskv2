(function(J,$) {
	
	J.Menu = J.Class({
		
		currentPath:'/',
		focus :'/',
		index : [],
		datas : [],
		
		registre  : { },
		
		__constructor:function() 
		{
		
			/// NOTE à instancier manuellement. c'est rageant.
			/*
				registre.index['/'] = [];
				registre.index['/']['_child']=undefined;
				registre.datas['/']=undefined;
				registre.currentPath = "/";
				registre.focus = "/";
			*/
			this.index['/']=[];
			this.index['/']['_child']=[];
			this.index['/']['_data']=[];
			
			var this_jmenu=this;
			
			J.subscribe("menuGoTo",function(ev,data) {
				//data : [ 0 : nom du registre , 1 : chemin  ]
						var cle = data[0];
						var goingto = data[1];
						
						if (this_jmenu.index[goingto]===undefined)
						{
							return false;
						} else {
							this_jmenu.registre[cle]=goingto;
							J.publish("menuChange",[cle,goingto],true);
							return true;
						}
				});

			J.subscribe("menuGo",function(ev,data) {
				//data : [ 0 : nom du registre , 1 : chemin  ]
						var cle = data[0];
						
						switch (data[1])
						{
							case 'prev' :
							case 'next' :
								var goingnear = this_jmenu.index[this_jmenu.registre[data[0]]]['_'+data[1]];
							break;
							case 'up'   :
								var path = this_jmenu.registre[data[0]];
								path = path.substr(0,path.lastIndexOf('/'));
								path = (path=='') ? '/' : path;
								var goingnear = path;
							break;
							case 'down' :
								var goingnear = this_jmenu.index[this_jmenu.registre[data[0]]]['_child'][0];
							break;
						}
						
						if (goingnear===undefined)
						{
console.error(' AAAAAHHHHH ! MenuGo est nulle part ');
							return false;
						} else {
							//this_jmenu.registre[cle]=goingnear;
							J.publish("menuGoTo",[cle,goingnear],true);
							return true;
						}
				});
			
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
				
				J.publish("menuData",[path,data]);
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
console.error('getData : données inexistantes pour'+path);
console.info(this);
				return false;
			} else {
				return this.index[path]['_data'];
			}
		},
		
		goTo:function(registre,path) {
			
			if (path==registre) return true;
					 
			if (typeof path !== 'string') 
			{
console.error('goTo : OUCH '+path);
				return false;
			}
			
			var paths = path.split(/\//);
			
			var current = "/";
			for (var i = 0; i < paths.length; i++) 
			{
				
				if (typeof this.index[current]!=='undefined') 
				{
					current += (current!='/'?'/':'')+paths[i];
				} else {
					return false;
				}
			}
			
			registre=current;
			return true;
		},
		
		goNext:function(registre) 
		{
			if (this.index[registre]['_next']===false) 
			{
				return false;
			} else {
				this.goTo(registre,this.index[registre]['_next']);
			}
		},
		
		goPrev:function(registre) 
		{
			if (this.index[this.currentPath]['_prev']===false) 
			{
				return false;
			} else {
				this.goTo(this.index[this.currentPath]['_prev']);
			}
		},
		
		goParent:function() 
		{
			var path=this.currentPath;

			path = path.substr(0,path.lastIndexOf('/'));
			path = (path=='') ? '/' : path;
			
			this.goTo(path);
		},
		
		goChildren:function(id) 
		{
			if (id===undefined) 
			{
				// TODO à définir ce que l'on va renvoyer. J'ai pas vraiment décidé
				return this.index[this.currentPath]['_child'];
			} else {
				this.goTo(this.index[this.currentPath]['_child'][id])
			}
		},
		
	});
	
})(Joshlib,jQuery);
