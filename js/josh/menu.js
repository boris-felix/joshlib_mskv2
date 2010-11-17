(function(J,$) {
	
	J.Menu = J.Class({
		
		index : new Object(),
		currentPath : "/",
		
		__construct:function() {
			this.index = {};
			
			this.currentPath = "/";
		},
		
		setRootData:function(data) {
			return this.setData("/",data);
		},
		
		setData:function(path,data) {
			
			
			this.buildIndex(path,data,true);
			
			this.data = data;
			/// TODO storer la date , au cas où l'on propose un refresh de données périodiques et/ou màj
		},
		
		buildIndex:function(path,data,recursive) {
			this.index[path] = {};
			for (var i = 0; i < data.length; i++) {
				this.index[path][data[i]["id"]] = data.i;
				/// indiquer au dernier __child du parent qui a désormais un __next
				/// indiquer au this qu'il a un __prec
				/// indiquer au parent qu'il a un __child supplémentaire
				var d=new Date();
				this.index[path]['date'] = d.getTime(); // ceci pour un usage futur qui permettrait de mettre à jour les données passé un certain temps.
				if (recursive && data["children"]) {
					this.buildIndex(path+data[i]["id"]+"/",data["children"],true);
				}
			}
		},
		
		goTo:function(path) {
			
			if (path==this.currentPath) return true;
			
			var paths = path.split(/\//);
			
			
			var current = "/";
			for (var i = 0; i < paths.length; i++) {
console.log(paths[i]);
				
				if (typeof this.index[current]!=='undefined') {
					current += (current!='/'?'/':'')+paths[i];
				} else {
					return false;
				}
			}
			
			this.currentPath=current;
			return true;
		},
		
		goNext:function() {
			// .goParent() . __next
		},
		
		goPrev:function() {
			// .goParent() . __prec
		},
		
		goParent:function() {
			var path=this.currentPath;
console.log('gopar ' +path);
			path = path.substr(0,path.lastIndexOf('/'));
			path = (path=='') ? '/' : path;
			this.currentPath = path;
		},
		
		goChildren:function() {
			
		}
		
		
	});
	
	
})(Joshlib,jQuery);
