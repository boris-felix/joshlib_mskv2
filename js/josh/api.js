(function(J,$){
		J.Pane = J.Class(
			{
				// cette classe déclare comment circuler entre les éléments
				
				currentHighlight : 0, // élément actuellement highlighté
				positions  : [], // liste des éléments où l'on peut circuler
				neighbours : [],   // par id puis mouvement : left right up down . 
				
				moveTo  : function(to)
						{
							this.currentHighlight=to;
						},
				
				moveLeft : function()
						{
							var to = this.neighbours[currentHighlight]['left'];
							if (to !== undefined)
							{
								this.moveTo(to);
							} 
						},
				
				moveRight : function()
						{
							var to = this.neighbours[currentHighlight]['right'];
							if (to !== undefined)
							{
								this.moveTo(to);
							} 
						},
				moveUp : function()
						{
							var to = this.neighbours[currentHighlight]['up'];
							if (to === undefined)
							{
								this.moveLeft();
							} else {
								this.moveTo(to);
							}
						},
				moveDown : function()
						{
							var to = this.neighbours[currentHighlight]['down'];
							if (to === undefined)
							{
								this.moveRight();
							} else {
								this.moveTo(to);
							}
						},
				moveStart : function()
						{
							// va-t-on au dernier élément, ou le plus à gauche de celui actuel ?
							var to=this.currentHighlight;
							var st=this.currentHighlight;
							while (st!==undefined)
							{
								to=st;
								st=this.neighbours[to]['left'];
							}
							this.moveTo(to);
							
						},
				moveEnd : function()
						{
							// va-t-on au dernier élément, ou le plus à droite de celui actuel ?
							var to=this.currentHighlight;
							var st=this.currentHighlight;
							while (st!==undefined)
							{
								to=st;
								st=this.neighbours[to]['right'];
							}
							this.moveTo(to);
						},
				movePageUp : function()
						{
							// va-t-on au dernier élément, ou le plus en haut de celui actuel ?
							var to=this.currentHighlight;
							var st=this.currentHighlight;
							while (st!==undefined)
							{
								to=st;
								st=this.neighbours[to]['up'];
							}
							this.moveTo(to);
						},
				movePageDown : function()
						{
							// va-t-on au dernier élément, ou le plus en bas de celui actuel ?
							var to=this.currentHighlight;
							var st=this.currentHighlight;
							while (st!==undefined)
							{
								to=st;
								st=this.neighbours[to]['down'];
							}
							this.moveTo(to);
						},
			}
		);

})(Joshlib,jQuery);