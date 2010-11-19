(function(J,$) {
	
	J.UI.List = J.Class(J.UIElement,{
        type:"List",
        
		getHtml:function() {
			var ret = ["<ul id='"+this.htmlId+"'>"];
			
			for (var i=0;i<this.data.length;i++) {
			    ret.push("<li id='"+this.htmlId+"_"+i+"'>"+this.data[i]["label"]+"</li>");
			}
			ret.push("</ul>");
			return ret.join("");
		},
		
		setData:function(data) {
			this.data = data;
		}
		
	});
	
	
	
	
})(Joshlib,jQuery);
