(function(J,$) {
	
	var orientations = ["up","right","down","left"];
	var inv = {
	    "up":"down",
	    "down":"up",
	    "left":"right",
	    "right":"left"
	};
	
	
	/**
     * @class
     * @augments J.UI.ListBase
     */
	J.UI.CheckList = J.Class(J.UI.List,{
        type:"CheckList",
	containerTag:"div",
	memory: {'last_save':null, 'list':new Array()}, /* listes ids elements */
	
	getHtmlOpeningContainer:function(){return '<'+this.containerTag+' id="'+this.htmlId+'_container">';},
	getHtmlClosingContainer:function(){return '</'+this.containerTag+'>';},
	getHtmlValidation:function(){
		return '<div id="'+this.htmlId+'_validation" data-path="'+this.menuRoot+'--validation--"></div>';
	},
	getHtml:function(){
return this.__base();
//return this.getHtmlOpeningContainer() + this.__base()+this.getHtmlValidation()+this.getHtmlClosingContainer();
	},
	mem_add:function(element){
	/* Passer plutôt par window.sessionStorage si dispo */	
console.warn("check list memory add "+element );
		this.memory.last_save = new Date().getTime();
		this.memory.list[this.memory.list.length] = element;
		return true;
	},
	mem_remove:function(idx){
	/* Passer plutôt par window.sessionStorage si dispo */	
		this.memory.last_save = new Date().getTime();
		for (var i=idx; i<this.memory.list.length;i++){
			this.memory.list[i]=this.memory.list[i+1];
		}
		this.memory.list.length--;
		return true;
	},
	subscribes:function(){
		var self=this;
		var specific_controls= [["control",function(ev,data) {
  //only supports orientation=="up" for now
		            var sens=data[0];
					
					 /// rtl langages for arabic, hebrew, hindi and japanese
					if ((self.options.browsingSense=='locale') && (document.dir=='rtl'))
					{
						switch (sens)
						{
							case 'left': sens = 'right';	break;
							case 'right': sens = 'left';	break;
						}
					}
					console.log("receiveControl",self.id,data);
		        
		        
		           if (sens=="hover") {
		               var split = data[1].split("/");
					    var lastPath = split[split.length-1];
					    if (data[1].indexOf(self.menuRoot)===0) {
					        var subPath = data[1].substring(self.menuRoot.length);
					        if (subPath.indexOf("/")===-1) {
					            if (self.id2index[subPath]!==undefined) {
					                self.grid.goTo([self.id2index[subPath],0]);
					            }
					        }
					    }
		               
		           } else if (sens=="left" || sens=="right" || sens=="down" || sens=="up") {
		               if (!self.hasFocus) return false;
		               self.grid.go(sens);
		               
		           } else if (sens=="enter") {

			if (self.focusedIndex!=null){
			var valeur = self.data[self.focusedIndex].id;
			
			/* faute de mieux .. */
			if (valeur==="||validation||"){
				/* pourrait etre focusedindex = data.length-1 */
				console.warn("checklist validation");
				self.event("validate");
				return true;

			}

			var elt_index = self.memory.list.indexOf(valeur);
			if (elt_index==-1){
				self.mem_add(valeur);				
				$("#"+self.htmlId+'_'+self.focusedIndex).addClass('memory'); 				}
			else{
				self.mem_remove(elt_index);
				$("#"+self.htmlId+'_'+self.focusedIndex).removeClass('memory');
			}
			}
			}
			return false;

		}]];		
		// J.UI.List fait redescendre d'un cran dans le menu
		//return this.__base().concat(specific_controls);
		return specific_controls;
	},
});
	
	
})(Joshlib,jQuery);
