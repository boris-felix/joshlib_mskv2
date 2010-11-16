(function(J,$) {
	
	J.UI.ListView = J.Class(J.UIElement,{

		getHtml:function() {
			var ret = ["<ul id='"+this.htmlId+"'>"];
			
			for (var i=0;i<this.data.length;i++) {
			    ret.push("<li>"+this.data[i]["label"]+"</li>");
			}
			ret.push("</ul>");
			return ret.join("");
		},
		
		setData:function(data) {
			this.data = data;
		}
		
	},{
		type:"ListView"
	});
	
	
	
	
})(Joshlib,jQuery);
