(function(J,$) {
	
	J.Menu = J.Class({
		
		__construct:function(registre) 
		{
			/// NOTE à instancier manuellement. c'est rageant.
			registre.index['/'] = [];
			registre.index['/']['_child']=undefined;
			registre.datas['/']=undefined;
			registre.currentPath = "/";
			registre.focus = "/";
		},
		
		setRootData:function(registre,data)
		{
			return this.setData(registre,"/",data);
		},
		
		setData:function(registre,path,data) 
		{
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif, donc vers les chti n'enfants
			if (path.charAt(0)!='/') path = (registre.currentPath=='/'?'':registre.currentPath)+'/'+path;
			
			this.buildIndex(registre,path,data,true);
			
			J.publish("menuData",[path,data]);
		},
		
		buildIndex:function(registre,path,data,recursive) 
		{
			if (registre.index[path] === undefined) 
			{
				registre.index[path] = {};
				
				if (path!='/')
				{

					var parpath = path.substr(0,path.lastIndexOf('/'));
					parpath = (parpath == '' )? '/' : parpath;

					if (registre.index[parpath]['_child']===undefined)
					{
						registre.index[path]['_prev'] = false;
						registre.index[parpath]['_child'] = [path];
					} else {
						var prevchild = registre.index[parpath]['_child'][registre.index[parpath]['_child'].length-1];
						registre.index[parpath]['_child'].push(path);
						registre.index[path]['_prev']=prevchild;
						registre.index[registre.index[path]['_prev']]['_next']=path;
					}
					registre.index[path]['_next']=false;
				}
			}
			if (typeof data === 'string')
			{
				registre.index[path][0]=data;
			} else {
				// on a un object
				for (var key in data) {
					registre.index[path][key]=data[key];
				}
			}

			var d=new Date();				
			registre.index[path]['_when'] = d.getTime(); // ceci pour un usage futur qui permettrait de mettre à jour les données passé un certain temps.
			if (recursive && data["children"]) {
				this.buildIndex(registre,path+data[i]["id"]+"/",data["children"],true);
			}
		},

		getData:function(registre,path) 
		{
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif, donc vers les chti n'enfants
			if (path.charAt(0)!='/') path = (registre.currentPath=='/'?'':registre.currentPath)+'/'+path;
			
			return registre.index['/leaf']['data'];
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
			J.publish("menuGoTo",[path,data]);
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
		},
		
	});
	
})(Joshlib,jQuery);
