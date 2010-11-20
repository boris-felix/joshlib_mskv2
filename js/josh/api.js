(function(J,$){
	
	J.Pane = J.Class(
		{
			// cette classe déclare comment circuler entre les éléments
			
			currentHighlight : undefined, // élément actuellement highlighté
			/// NO USE positions  : [], // liste des éléments où l'on peut circuler
			actions : [],   // par id puis 
										// left right up down : (id) mouvement
										// movein,moveout  : (function) triggers sur mouvements
										// enter  : (function) si clic sur "enter" ou "space"
										// escape  : (function) si clic "escape"
										
			
			add		: function(that)
					{
						$('#'+that).addClass('panehere');
						this.actions[that] = [];
						
						// commençons quelque part nom didiou !
						if (this.currentHighlight===undefined) this.currentHighlight=that;
					},
			
			addRight : function(from,that)
					{
						
						this.add(that);
						if (this.actions[from]!==undefined)
						{
							this.actions[from]['right']		= that;
							this.actions[that]['left']		= from;
						}

					},
			addDown : function(from,that)
					{
						this.add(that);
						if (this.actions[from]!==undefined)
						{
							this.actions[from]['down']		= that;
							this.actions[that]['up']		= from;
						}
						
					},
			setAction : function(that,event,fx)
					{
						this.actions[that][event]		= fx;
					},
			
			enter : function(that)
					{
						if (that===undefined) that = this.currentHighlight ;
						if ((that!==undefined) && (typeof this.actions[that]['enter'] == 'function')) this.actions[that]['enter']();
					},

			escape : function(that)
					{
						if (that===undefined) that = this.currentHighlight ;
						
						if ((that!==undefined) && (typeof this.actions[that]['escape'] == 'function')) this.actions[that]['escape']();
					},

			moveTo  : function(to)
					{
						if ((this.currentHighlight!==undefined) && (typeof this.actions[this.currentHighlight]['moveout'] == 'function')) this.actions[this.currentHighlight]['moveout']();
						
						this.currentHighlight=to;
						$('.focused').removeClass('focused');
						$('#'+to).addClass('focused');
						
						if ((this.currentHighlight!==undefined) && (typeof this.actions[this.currentHighlight]['movein'] == 'function')) this.actions[this.currentHighlight]['movein']();
					},
			
			moveLeft : function()
					{
						var to = this.actions[this.currentHighlight]['left'];
						if (to !== undefined)
						{
							this.moveTo(to);
						} 
					},
			
			moveRight : function()
					{
						var to = this.actions[this.currentHighlight]['right'];
						if (to !== undefined)
						{
							this.moveTo(to);
						} 
					},
			moveUp : function()
					{
						var to = this.actions[this.currentHighlight]['up'];
						if (to === undefined)
						{
							this.moveLeft();
						} else {
							this.moveTo(to);
						}
					},
			moveDown : function()
					{
						var to = this.actions[this.currentHighlight]['down'];
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
							st=this.actions[to]['left'];
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
							st=this.actions[to]['right'];
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
							st=this.actions[to]['up'];
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
							st=this.actions[to]['down'];
						}
						this.moveTo(to);
					},
		}
	);

})(Joshlib,jQuery);