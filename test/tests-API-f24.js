
// documentation on writing tests here: http://docs.jquery.com/QUnit


module("Joshlib tests");

test('Installation Joshlib',function(){
	expect(2);
	equals(typeof window.Joshlib,'object','Joshlib() déclaré');
	var testee2 = new Joshlib.Menu();
	equals(typeof testee2,'object','Joshlib.Menu() instantié');
	
})  

test('Construction de l\'arbre',function(){
	expect(12);
	var testee2 = new Joshlib.Menu();
	//equals(testee2.index,{},'index d\'origine');
	equals(testee2.currentPath,'/','chemin d\'origine');

	
	testee2.setRootData('babebibobu-2');
	equals(testee2.data,'babebibobu-2','setRootData');

	testee2.setData('/leaf',{'babebi':'bobu'});
	equals(testee2.index['/leaf']['babebi'],'bobu','setData index');
	
	
	testee2.goTo('/leaf');
	equals(testee2.currentPath,'/leaf','repositionnement absolu');
	
	testee2.setData('/leaf/bourgeon1','b-1');
	testee2.setData('/leaf/bourgeon2','b-2');
	testee2.setData('/leaf/bourgeon3','b-3');

	
	testee2.goTo('/leaf');
	
	equals(testee2.currentPath,'/leaf','repositionnement absolu');

	testee2.setData('bourgeon4','b-4');
	testee2.goTo('/leaf/bourgeon4');
	equals(testee2.data,'b-4','création de feuille relative');
	
	testee2.goParent();
	equals(testee2.currentPath,'/leaf','repositionnement relatif parent');

	testee2.goTo('/leaf/bourgeon1');
	testee2.goParent();
	equals(testee2.currentPath,'/leaf','repositionnement relatif parent sublevel');
	
	testee2.goTo('/leaf/bourgeon1');
	equals(testee2.currentPath,'/leaf/bourgeon1','repositionnement relatif de deux niveaux');
	testee2.goNext();
	equals(testee2.currentPath,'/leaf/bourgeon2','repositionnement relatif suivant');
	testee2.goPrev();
	equals(testee2.currentPath,'/leaf/bourgeon1','repositionnement relatif précédent');

	testee2.setData('kiddie','c-1');
	testee2.goChildren(0);
	equals(testee2.currentPath,'/leaf/bourgeon1/kiddie','repositionnement relatif au premier enfant');

});

var testee = new Joshlib.Menu();

test('Chargement d\'un arbre',function(){
	expect(1);
	
	
	$.ajax({                                                                                      
		url: "http://jsonpify.heroku.com/?resource=http://api.france24.com/fr/services/json-rpc/emission_list%3Fdatabases%3Df24fr%26key%3DXXX&format=json",  
		dataType: 'jsonp',                                                                          
		success: function(data){
			
			var data = data.result.f24fr.list;
			for ( var i in data){

				testee.setData(i,data[i]);
			}
		}                                                                                           
	});
	equals(testee.currentPath,'/','repositionnement relatif enfant');

	console.log(testee)
	
});

var pane = new Joshlib.Pane();

test('UIElements',function(){
    
    expect(3);
    
    var J=Joshlib;
    J.basePath = "../";
	
	
    
	var testApp = J.Class(J.App,{
		
		
		start:function(baseHtmlId) {
			
			this.panelMain = new J.UI.Panel(this,"main",{
			   "onAfterInsert":function(elt) {
			       
			   }
			});
			
			this.panelShows = new J.UI.Panel(this,"shows",{
			    
			});
			
			this.panelGeo = new J.UI.Panel(this,"geo",{
			  
			});
			
			
			this.nav1 = new J.UI.List(this,"nav1",{
				"parent":this.panelMain,
				"autoInsert":true
			});
			
			this.nav2 = new J.UI.List(this,"nav2",{
				"parent":this.panelMain
			});
			
			this.nav3 = new J.UI.List(this,"nav3",{
				"parent":this.panelMain
			});
			
			this.player = new J.UI.Video(this,"vplayer",{
				"maximize":true,
				"parent":this.panelMain,
				"autoInsert":true
			});
			this.setDefaultVideoPlayer(this.player);
            
			this.nav1.setData([
			    {
					"id":"live",
					"type":"video",
					"url":"rtmp//stream2.france24.yacast.net/france24_live/fr",
					"label":"F24 Live",
					"image":"http://"
				},
			    {
					"id":"shows",
					"type":"video",
					"url":"rtmp//stream2.france24.yacast.net/france24_live/fr",
					"label":"Shows",
					"image":"http://"
				},    
				{
    				"id":"geo",
    				"type":"video",
    				"url":"rtmp//stream2.france24.yacast.net/france24_live/fr",
    				"label":"Geo",
    				"image":"http://"
    			}		    
			]);
			
			this.setBaseHtmlId(baseHtmlId);
			
			this.setBaseUIElement(this.panelMain);
            
            this.insert();
		}
		
	});
	
	$("#qunit-fixture2").append($("<div id='testApp1'>Loading!</div>"));
	equals("Loading!",$("#testApp1")[0].innerHTML);
	
	app = new testApp("testAppId");

	
	app.start("testApp1");
	
	equals($("#testAppId_e_Panel_main").length,1);
	
	equals($("#testAppId_e_Video_vplayer").length,1);
    
    app.playMedia({
        "url":"fixtures/video.mp4",
        "type":"video"
    });
	
    
});
