(function(J,$) {
	
	J.Menu = J.Class({
		
		index : new Object(),
		currentPath : "/",
		
		__construct:function() 
		{
			/// NOTE à instancier manuellement. c'est rageant.
			this.index['/'] = [];
			this.index['/']['_child']=undefined;
			this.currentPath = "/";

		},
		
		setRootData:function(data)
		{
			return this.setData("/",data);
		},
		
		setData:function(path,data) 
		{
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif, donc vers les chti n'enfants
			if (path.charAt(0)!='/') path = (this.currentPath=='/'?'':this.currentPath)+'/'+path;
			
			this.buildIndex(path,data,true);
			
			J.publish("menuData",[path,data]);
		},
		
		
		buildIndex:function(path,data,recursive) 
		{
			if (this.index[path] === undefined) 
			{
				this.index[path] = {};
				
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
						this.index[this.index[path]['_prev']]['_next']=path;
					}
					this.index[path]['_next']=false;
				}
			}
			if (typeof data === 'string')
			{
				this.index[path][0]=data;
			} else {
				// on a un object
				for (var key in data) {
					this.index[path][key]=data[key];
				}
			}

			var d=new Date();				
			this.index[path]['_when'] = d.getTime(); // ceci pour un usage futur qui permettrait de mettre à jour les données passé un certain temps.
			if (recursive && data["children"]) {
				this.buildIndex(path+data[i]["id"]+"/",data["children"],true);
			}
		},
		
		goTo:function(path) {
			
			if (path==this.currentPath) return true;
					 
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
			
			this.currentPath=current;
			return true;
		},
		
		goNext:function() 
		{
			if (this.index[this.currentPath]['_next']===false) 
			{
				return false;
			} else {
				this.goTo(this.index[this.currentPath]['_next']);
			}
		},
		
		goPrev:function() 
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
		}
		
	});
	
})(Joshlib,jQuery);
