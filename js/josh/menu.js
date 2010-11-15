(function(J,$) {
	
	J.Menu = J.Class({
		
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
		},
		
		buildIndex:function(path,data,recursive) {
			this.index[path] = {};
			for (var i = 0; i < data.length; i++) {
				this.index[path][data[i]["id"]] = i;
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
				
			}
		},
		
		goNext:function() {
			
		},
		
		goPrev:function() {
			
		},
		
		goParent:function() {
			
		},
		
		goChildren:function() {
			
		}
		
		
	});
	
	
})(Joshlib,jQuery);
