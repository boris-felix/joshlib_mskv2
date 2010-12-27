
// documentation on writing tests here: http://docs.jquery.com/QUnit

module("Joshlib tests");

var J = Joshlib;

J.Apps.Test = J.Class(J.App,{
    
    init:function(callback) {
        
        var self=this;
        
        this.panelMain = new J.UI.Panel(this,"main",{
		   "autoShow":false,
		   "browsingSense" :   'locale'
		});
		
		this.browseBar = new J.UI.List(this,"browsebar",{
			"parent":this.panelMain,
			"autoShow":false,
			"autoInsert":true,
			"menuRoot":/^\/\w*$/,
			"showOnFocus":true,
			"showOnPreFocus":true,
			"orientation":"down",
		    'loadingTemplate' : "<li class='loading'>Loading...</li>",
			"itemTemplate" : function(self,htmlId,data) {
								return "<li data-path='"+self.menuRoot+data.id+"' id='"+htmlId+"' class='joshover'>"+data["id"]+"</li>";
							},
			"onPanelChilding":function(that){
                
			},
			
			"onFocused":function(that)
			{
				
				
				
			},
			"onPanelActing": function(that)
			{
				app.publish("control",["down"]);
			},
			"onPanelExiting" : function(that)
			{
				
			}
		});
		
		
		this.showBar = new J.UI.List(this,"showbar",{
			"parent":this.panelMain,
			"autoShow":false,
			"autoInsert":true,
			"menuRoot":/^\/(leaf1|leaf2)\/\w*$/,
			"showOnFocus":true,
			"showOnPreFocus":true,
			"hideOnBlur":true,
			"orientation":"down",
		    'loadingTemplate' : "<li class='loading'>Loading...</li>",
			"itemTemplate" : function(self,htmlId,data) {
								return "<li data-path='"+self.menuRoot+data.id+"' id='"+htmlId+"' class='joshover'>"+data["id"]+"</li>";
							},
			"onPanelChilding":function(that){
                
			},
			
			"onFocused":function(that)
			{
				
				
				
			},
			"onPanelActing": function(that)
			{
				app.publish("control",["down"]);
			},
			"onPanelExiting" : function(that)
			{
				
			}
		});
		
		this.themeBar = new J.UI.List(this,"themebar",{
			"parent":this.panelMain,
			"autoShow":false,
			"autoInsert":true,
			"menuRoot":/^\/(leaf3|leaf4|leaf5)\/\w*$/,
			"showOnFocus":true,
			"showOnPreFocus":true,
			"hideOnBlur":true,
			"orientation":"down",
		    'loadingTemplate' : "<li class='loading'>Loading...</li>",
			"itemTemplate" : function(self,htmlId,data) {
								return "<li data-path='"+self.menuRoot+data.id+"' id='"+htmlId+"' class='joshover'>"+data["id"]+"</li>";
							},
			"onPanelChilding":function(that){
                
			},
			
			"onFocused":function(that)
			{
				
				
				
			},
			"onPanelActing": function(that)
			{
				app.publish("control",["down"]);
			},
			"onPanelExiting" : function(that)
			{
				
			}
		});
		
		this.editionBar = new J.UI.List(this,"editionbar",{
			"parent":this.panelMain,
			"autoShow":false,
			"autoInsert":true,
			"menuRoot":/(^\/(leaf2|leaf3)\/[^\/]+\/\w*$)/,
			"showOnFocus":true,
			"showOnPreFocus":true,
			"hideOnBlur":true,
			"orientation":"down",
		    'loadingTemplate' : "<li class='loading'>Loading...</li>",
			"itemTemplate" : function(self,htmlId,data) {
								return "<li data-path='"+self.menuRoot+data.id+"' id='"+htmlId+"' class='joshover'>"+data["id"]+"</li>";
							},
			"onPanelChilding":function(that){
                
			},
			
			"onFocused":function(that)
			{
				
				
				
			},
			"onPanelActing": function(that)
			{
				app.publish("control",["down"]);
			},
			"onPanelExiting" : function(that)
			{
				
			}
		});
		
        
    	this.menu.setData('/',[
    	    {'id':'leaf1'},
    	    {'id':'leaf2',
    	     'children':[
    	      {'id':'leaf21'},
    	      {'id':'leaf22',
    	       'children':[
      	        {'id':'leaf221'},
      	        {'id':'leaf222'}
      	       ]
    	      }
    	     ]
    	    },
            {'id':'leaf3',
             'getChildren':function(callback) {
                 self.leaf3cb = function() {
                     
                     callback([
                         {"id":"leaf31"},
                         {"id":"leaf32",
                 	       'children':[
                   	        {'id':'leaf321'},
                   	        {'id':'leaf322'}
                   	       ]}
                        ]);
                };
             }
            },
            {
                'id':'leaf4',
                'label':'test1'
            },
            {
                'id':'leaf5',
                'getChildren':function(callback) {
                     self.leaf5cb = function() {
                         callback([
                             {"id":"leaf51"},
                             {"id":"leaf52"}
                            ]);
                      };
                 }
            },

    	]);
    
        callback();
    },
    
    start:function(baseHtmlId)
    {
        var self = this;
        this.init(function()
    	{
            self.setBaseHtmlId(baseHtmlId);
    		self.setBaseUIElement(self.panelMain);
    		self.insert();
    
    	});
    }
    
});



test('Installation Joshlib',function(){
	expect(2);

	var myapp = new J.Apps.Test();
	
	equals(typeof window.Joshlib,'object','Joshlib() déclaré');
	
	equals(typeof myapp.menu,'object','Joshlib.Menu() instantié');
	
})  

test('Menu navigation',function(){

	expect(32);
	
	//equals(testee2.index,{},'index d\'origine');
	
    var J = Joshlib;

    var myapp = new J.Apps.Test("testapp");

    myapp.start("qunit-appcontainer");


    myapp.menu.resolveMoves("/leaf1",["next"],function(path) {
        equals(path,"/leaf2","resolveMove next");
    });

    //test : inserted but nothing shown
    
    myapp.publish("menuGoTo",["focus","/leaf1"],true);
    
    //test class.focused
    
    myapp.publish("menuGo",["focus","next"],true);
    
    myapp.publish("menuGo",["focus","down"],true);

    //test leaf22
    equals(myapp.menu.getRegister("focus"),"/leaf2/leaf21");
    
    equals(!!document.getElementById("testapp_e_List_showbar_0").className.match(/focused/),true);
    equals(document.getElementById("testapp_e_List_showbar_0").innerHTML,"leaf21");
    
    
    myapp.publish("menuGo",["focus",["up","prev"]],true);
    
    
    equals(myapp.menu.getRegister("focus"),"/leaf1");
    
    //test class.focused
    
    myapp.publish("control",["right"],true);
    
    myapp.publish("control",["down"],true);

    equals(myapp.menu.getRegister("focus"),"/leaf2/leaf21");
    
    //test leaf22
    
    myapp.publish("control",["up"],true);
    myapp.publish("control",["left"],true);
    
    equals(myapp.menu.getRegister("focus"),"/leaf1");
    
    
    myapp.publish("menuGoTo",["focus","/leaf3"],true);
    
    equals(!!document.getElementById("testapp_e_List_browsebar_2").className.match(/focused/),true);
    
    myapp.publish("control",["down"],true);
    
    equals(document.getElementById("testapp_e_List_themebar").childNodes[0].innerHTML,"Loading...");
    
    equals(document.getElementById("testapp_e_List_themebar").style.display,"");
    
    equals(myapp.menu.getRegister("focus"),"/leaf3/");
    
    myapp.publish("control",["up"],true);
    
    equals(document.getElementById("testapp_e_List_themebar").style.display,"none");
    equals(myapp.menu.getRegister("focus"),"/leaf3");
    
    myapp.leaf3cb();
    
    equals(document.getElementById("testapp_e_List_themebar").style.display,"block");
    
    myapp.publish("control",["down"],true);
    
    equals(myapp.menu.getRegister("focus"),"/leaf3/leaf31");
    
    myapp.publish("control",["right"],true);
    
    equals(myapp.menu.getRegister("focus"),"/leaf3/leaf32");
    
    myapp.publish("control",["up"],true);
    
    equals(myapp.menu.getRegister("focus"),"/leaf3");
    
    myapp.publish("control",["down"],true);
    
    equals(myapp.menu.getRegister("focus"),"/leaf3/leaf31");
    
    equals(!!document.getElementById("testapp_e_List_browsebar_2").className.match(/focused/),true);
    equals(!!document.getElementById("testapp_e_List_showbar_0").className.match(/focused/),true);
    
});

