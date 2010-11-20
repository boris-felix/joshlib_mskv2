(function(J,$) {
	
	J.UI.List = J.Class(J.UIElement,{
        type:"List",
        
		getHtml:function() {
			
			var ret = ["<ul id='"+this.htmlId+"'>"];
			var prev_showid;
			
			for (var i=0;i<this.data.length;i++)
			{
			    ret.push("<li id='"+this.htmlId+"_"+i+"'>"+this.data[i]["label"]+"</li>");
				pane.addDown(prev_showid,this.htmlId+'_'+i);
				prev_showid=this.htmlId+'_'+i;
			}
			ret.push("</ul>");
			return ret.join("");
		},
		
		setData:function(data) {
			this.data = data;
			
		},
		
		refreshHtml : function() {
			// euh, en fait, c'est complètement xstupiude, ce que je fais ici....
			
			//console.log(this.getHtml());
			//document.getElementById(this.htmlId).outerHTML=       this.getHtml();
		}
		
	});
	
	
	
	
})(Joshlib,jQuery);
