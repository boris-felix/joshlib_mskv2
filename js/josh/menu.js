(function(J,$) {
	
	J.Menu = J.Class({
		
		index : new Object(),
		currentPath : "/",
		refreshed : [],
		
		__construct:function() {
			this.index = {};
			
			this.currentPath = "/";
		},
		
		setRootData:function(data) {
			return this.setData("/",data);
		},
		
		setData:function(path,data) {
			// si on a pas le leading slash, on considère qu'il s'agit d'un adressage relatif
			if (path.charAt(0)!='/') path = (this.currentPath=='/'?'':this.currentPath)+'/'+path;
			
			this.buildIndex(path,data,true);
			
			this.data = data;
		},
		
		
		buildIndex:function(path,data,recursive) {
			if (this.index[path] === undefined) {
				this.index[path] = {};
				if (path!='/') {
					var parpath = path.substr(0,path.lastIndexOf('/'));
					parpath = (parpath == '' )? '/' : parpath;
					
					if (this.index[parpath]['_child']===undefined) {
console.log('firstchild path '+path+' parent '+parpath+ ' prevchild '+prevchild );
						this.index[path]['_prev'] = false;
						this.index[parpath]['_child'] = [path];
					} else {
						var prevchild = this.index[parpath]['_child'].lastIndexOf();
console.log('anotherchild path '+path+' parent '+parpath+ ' prevchild '+prevchild );
console.log(this.index[parpath]['_child']);
						this.index[parpath]['_child'].push(path);
						this.index[path]['_prev']=prevchild;

					}
					this.index[path]['_next']=false;
				}
			}
			

			for (var i = 0; i < data.length; i++) {
				this.index[path][data[i]["id"]] = data.i;
				/// indiquer au dernier __child du parent qui a désormais un __next
				
				}
				var d=new Date();				
				this.index[path]['_when'] = d.getTime(); // ceci pour un usage futur qui permettrait de mettre à jour les données passé un certain temps.
				if (recursive && data["children"]) {
					this.buildIndex(path+data[i]["id"]+"/",data["children"],true);
				}
			}
		},
		
		goTo:function(path) {
			
			if (path==this.currentPath) return true;
					 
			if (typeof path !== 'string') {
console.error('goTo : OUCH '+path);
				return false;
			}
			
			var paths = path.split(/\//);
			
			var current = "/";
			for (var i = 0; i < paths.length; i++) {
				
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
console.log('next: '+this.currentPath+' ::  '+this.index[this.currentPath]['_next']);
			if (this.index[this.currentPath]['_next']===false) {
				return false;
			} else {
				this.goTo(this.index[this.currentPath]['_next']);
			}
		},
		
		goPrev:function() {
			// .goParent() . __prec
console.log('prev: '+this.currentPath+' ::  '+this.index[this.currentPath]['_prev']);
			if (this.index[this.currentPath]['_prev']===false) {
				return false;
			} else {
				this.goTo(this.index[this.currentPath]['_prev']);
			}
		},
		
		goParent:function() {
			var path=this.currentPath;

			path = path.substr(0,path.lastIndexOf('/'));
			path = (path=='') ? '/' : path;
			
console.log('prev: '+this.currentPath+' ::  '+path);
			
			this.goTo(path);
		},
		
		goChildren:function() {
			
		}
		
		
	});
	
	
})(Joshlib,jQuery);
