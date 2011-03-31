(function(J, $) {

    /**
     * @class Input interface for regular mouse
     * @augments J.Input
     */
    J.Inputs.mouse = J.Class(J.Input, {

        start: function()
        {
            var self = this;

            $('.joshover', this.app.baseHtml).live('mousedown',
            function(event) {
                
                //console.log("click",this,event);
                
                var uiElement = $(this).attr('josh-ui-element');
                if (uiElement) {
                    
                    self.app.ui[uiElement].publish("input",["enter",$(this).attr('josh-grid-id')]);
                    
                } else {
                    var menuPath = $(this).attr('data-path');
                    console.log("click", menuPath);
                    if (menuPath) {
                        self.app.publish("stateGoTo", ["focus", menuPath], true);
                    }

                    setTimeout(function() {

                        //If we didn't auto-child
                        console.log("autochild?", self.app.tree.getState("focus"), menuPath);

                        if (self.app.tree.getState("focus") == menuPath || !menuPath) {
                            self.app.publish("input", ["enter"]);
                            //,menuPath || event.currentTarget.id]);
                        }
                    },
                    100);
                }
                
                


                return false;
            });

            $('.joshover', this.app.baseHtml).live('mouseenter',function(event) {
                
                var uiElement = $(this).attr('josh-ui-element');
                if (uiElement) {
                    
                    self.app.ui[uiElement].publish("input",["hover",$(this).attr('josh-grid-id')]);
                
                } else {
                    
                    var menuPath = $(this).attr('data-path') || event.currentTarget.id;

                    self.app.publish("input", ["hover", menuPath]);
                    
                }
                
                return false;
            });


        }
    });


})(Joshlib, jQuery);