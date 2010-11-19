(function(J,$){
	
	J.Pane = J.Class(
		{
			// cette classe déclare comment circuler entre les éléments
			
			currentHighlight : undefined, // élément actuellement highlighté
			/// NO USE positions  : [], // liste des éléments où l'on peut circuler
			neighbours : [],   // par id puis mouvement : left right up down . 
			enters : [],   
			escapes : [],   
			
			add		: function(that)
					{
						$('#'+that).addClass('panehere');
						
						// commençons quelque part nom didiou !
						if (this.currentHighlight===undefined) this.currentHighlight=that;
					},
			
			addRight : function(that)
					{
						
						this.add(that);
						if (this.neighbours[this.currentHighlight]!==undefined)
						{
							this.neighbours[this.currentHighlight]['right']	= that;
							this.neighbours[that.id]['left']			= this.currentHighlight;
						}
						
					},
			addDown : function(that)
					{
						this.add(that);
						if (this.neighbours[this.currentHighlight]!==undefined)
						{
							this.neighbours[this.currentHighlight]['down']	= that;
							this.neighbours[that.id]['up']				= this.currentHighlight;
						}
						
					},
			
			enter : function(that)
					{
						if (that===undefined) that = this.currentHighlight ;
						
						this.enters[that]();
					},

			escape : function(that)
					{
						if (that===undefined) that = this.currentHighlight ;
						
						this.escapes[that]();
					},

			moveTo  : function(to)
					{
						this.currentHighlight=to;
						$('.focused').removeClass('focused');
						$('#'+to).addClass('focused');
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