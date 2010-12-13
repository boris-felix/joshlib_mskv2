
// documentation on writing tests here: http://docs.jquery.com/QUnit

module("Joshlib tests");

var J = Joshlib;

J.Apps.Test = J.Class(J.App,{
    
});



test('Installation Joshlib',function(){
	expect(2);

	var myapp = new J.Apps.Test();
	
	equals(typeof window.Joshlib,'object','Joshlib() déclaré');
	
	equals(typeof myapp.menu,'object','Joshlib.Menu() instantié');
	
})  

test('Menu navigation',function(){

	expect(24);
	
	//equals(testee2.index,{},'index d\'origine');
	
	var J = Joshlib;
	
	var myapp = new J.Apps.Test();
	
	myapp.menu.setData('/',[
	    {'id':'leaf1'},
	    {'id':'leaf2',
	     'children':[
	      {'id':'leaf21'},
	      {'id':'leaf22'}
	     ]
	    },
        {'id':'leaf3',
         'getChildren':function(callback) {
                 callback([
                     {"id":"leaf31"},
                     {"id":"leaf32"}
                    ]);
         }
        },
        {
            'id':'leaf4',
            'label':'test1'
        },
        {
            'id':'leaf5',
            'getChildren':function(callback) {
                 setTimeout(function() {
                     callback([
                         {"id":"leaf51"},
                         {"id":"leaf52"}
                        ]);
                    },500);
             }
        },
        
	]);
	equals(myapp.menu.getData("/leaf4").label,"test1");
	
	//Change a leaf
	myapp.menu.setData('/leaf4',{"label":"test2"});
    equals(myapp.menu.getData("/leaf4").label,"test2");

	//Change a tree
	myapp.menu.setData('/leaf4/',[
	    {'id':'leaf41'},
	    {'id':'leaf42'}
	]);
	
	same(myapp.menu.getData("/leaf2/"),[
      {'id':'leaf21'},
      {'id':'leaf22'}
     ]);
     
     var rootm = myapp.menu.getData("/");
     same(rootm[0],{'id':'leaf1'});

	var lastMenuChange = null;
	myapp.subscribe("menuChange",function(ev,data) {
        console.log('menuchange ',data);
	    lastMenuChange = data;
	});
	
	
    lastMenuChange=[];
	
	myapp.publish("menuGoTo",["current","/leaf4"],true);
	
	same(lastMenuChange,["current","/leaf4"],'Menu GoTo current /leaf4');
	
	myapp.publish("menuGo",["current","down"],true);
	
    same(lastMenuChange,["current","/leaf4/leaf41"],'Menu Go current down+next');
	
	myapp.publish("menuGo",["current","next"],true);
    
    same(lastMenuChange,["current","/leaf4/leaf42"],'Menu Go current down+next');

    lastMenuChange=[];	

	myapp.publish("menuGoTo",["focus","/leaf1"],true);
    
    same(lastMenuChange,["focus","/leaf1"],'Menu Goto');
	
    myapp.publish("menuGo",["focus","next"],true);
    
	same(lastMenuChange,["focus","/leaf2"],'Menu Go focus next');
	
	myapp.publish("menuGo",["focus","down"],true);
	
	same(lastMenuChange,["focus","/leaf2/leaf21"],'Menu Go focus down');
	
	myapp.publish("menuGo",["focus","up"],true);
	
	same(lastMenuChange,["focus","/leaf2"],'Menu Go focus up');
	
	myapp.publish("menuGo",["focus","up"],true);
	
	same(lastMenuChange,["focus","/leaf2"],'Menu Go focus up - the same.');
	
	myapp.publish("menuGo",["focus","next"],true);
	
	same(lastMenuChange,["focus","/leaf3"],'Menu Go focus next');
    
    myapp.publish("menuGo",["focus","down"],true);
	
	same(lastMenuChange,["focus","/leaf3/leaf31"],'Menu Go focus down');
    
    myapp.publish("menuGo",["focus","up"],true);
    
    same(lastMenuChange,["focus","/leaf3"],'Menu Go up next ');
    
	myapp.publish("menuGo",["focus","next"],true);
	
	same(lastMenuChange,["focus","/leaf4"],'Menu Go up next ');
	
	myapp.publish("menuGo",["focus","next"],true);
	
	same(lastMenuChange,["focus","/leaf5"],'Menu Go up next next');
    
    //Todo: later.
    //myapp.publish("menuGo",["focus","down"],true);

    //should not be loaded right away
    same(lastMenuChange,["focus","/leaf5"],'Async!');
    
    same(myapp.menu.getData("/leaf5").id,"leaf5");
    same(myapp.menu.getData("/leaf5/"),"loading");
    
    
    stop();
    
    setTimeout(function() {

        same(myapp.menu.getData("/leaf5").id,"leaf5");

        same((myapp.menu.getData("/leaf5/")[0] || {"id":"none"}).id,"leaf51");

        myapp.publish("menuGo",["focus","down"],true);
        same(lastMenuChange,["focus","/leaf5/leaf51"],'Down Async');
        
        myapp.publish("menuGo",["focus","up"],true);
        same(lastMenuChange,["focus","/leaf5"],'Up');
        
        
        start();  
    },700)
    
    
});



test('Async Menu navigation',function(){

    var doCb;
    
    var myapp;
    
    var lastMenuChange = null;
    
    var rst = function() {
        
        delete myapp;
        
        myapp = new J.Apps.Test();

    	myapp.menu.setData('/',[
    	    {'id':'leaf1'},

    	    {
              'id':'leaf2',
              'getChildren':function(callback) {

                   doCb = function() {
                       callback([
                        {"id":"leaf21"},
                        {"id":"leaf22"}
                       ]);
                   };

               }
            }

        ]);
        
        myapp.subscribe("menuChange",function(ev,data) {
            console.log('menuchange ',data);
    	    lastMenuChange = data;
    	});
    	
    };
    

	rst();
	

	
	
	
	
	myapp.publish("menuGoTo",["focus","/leaf1"],true);
    
	same(lastMenuChange,["focus","/leaf1"],'Menu init');
    
    myapp.publish("menuGo",["focus","down"],true);
    
    same(lastMenuChange,["focus","/leaf1"],'Still');
    
    myapp.publish("menuGo",["focus","next"],true);
    
	same(lastMenuChange,["focus","/leaf2"],'Next');

    myapp.publish("menuGo",["focus","down"],true);
    
	same(lastMenuChange,["focus","/leaf2/"],'Down');

	doCb();
	
	same(lastMenuChange,["focus","/leaf2/leaf21"],'Loaded');
    
    
    rst();
    
    myapp.publish("menuGoTo",["focus","/leaf1"],true);
    same(lastMenuChange,["focus","/leaf1"],'Menu init');
    
    myapp.publish("menuGo",["focus","next"],true);
	same(lastMenuChange,["focus","/leaf2"],'Next');
    
    myapp.publish("menuGo",["focus","down"],true);
	same(lastMenuChange,["focus","/leaf2/"],'Down');
	
	myapp.publish("menuGo",["focus","up"],true);
	same(lastMenuChange,["focus","/leaf2"],'Reup before CB');
    
    doCb();
    
    same(lastMenuChange,["focus","/leaf2"],'No change');
    
});





test('Grid test',function(){

    var lastEvent = false;
    
    var g = new J.Grid({
        "grid":[
            [{"id":"item11"}         , {"id":"item12"},      {"id":"item13"},      {"id":"item14"},      {"id":"item15"}],
            
            [null                    , {"id":"item22"},      {"id":"item23"}],
            
        ],
        "dimensions":2,
        "onChange":function(coords,elem) {
            lastEvent = ["onChange",coords,elem];
        },
        "onExit":function(side) {
            lastEvent = ["onExit",side];
        },
        "orientation":"up"
    });
    
    g.goTo([0,0]);
    same(lastEvent,["onChange",[0,0],{"id":"item11"}],'Init');
    
    g.go("right");
    same(lastEvent,["onChange",[1,0],{"id":"item12"}],'right');
    
    g.go("right");
    same(lastEvent,["onChange",[2,0],{"id":"item13"}],'right');
    
    g.go("down");
    same(lastEvent,["onChange",[2,1],{"id":"item23"}],'down');

    g.go("left");
    same(lastEvent,["onChange",[1,1],{"id":"item22"}],'left');

    g.go("up");
    same(lastEvent,["onChange",[1,0],{"id":"item12"}],'up');
/*

    manage redirections in the future
    
    g.go("left");
    same(lastEvent,["onChange",{"id":"item11"}],'left');
    
    g.go("down");
    same(lastEvent,["onChange",{"id":"item22"}],'down');
    
    g.go("down");
    same(lastEvent,["onExit",{"id":"item22"},"down"],'down');
*/  
    
    g.go("up");
    same(lastEvent,["onExit","up"],'up');

    g.go("left");
    same(lastEvent,["onChange",[0,0],{"id":"item11"}],'left');
    
    g.go("left");
    same(lastEvent,["onExit","left"],'left');


    g.goTo([4,0]);
    same(lastEvent,["onChange",[4,0],{"id":"item15"}],'goTo');
    
    g.go("right");
    same(lastEvent,["onExit","right"],'left');
});

/*






equals(testee2.currentPath,'/','chemin d\'origine');


testee2.setRootData('babebibobu-2');
equals(testee2.data,'babebibobu-2','setRootData');

testee2.setData('/leaf',(path!=='/'?path:'')+{'babebi':'bobu'});
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
*/

/*
test('Chargement d\'un arbre',function(){
	expect(1);
	
	
	$.ajax({                                                                                      
		url: "http://jsonpify.heroku.com/?resource=http://api.france24.com/fr/services/json-rpc/emission_list%3Fdatabases%3Df24fr%26key%3DXXX&format=json",  
		dataType: 'jsonp',                                                                          
		success: function(data){
			
			var data = data.result.f24fr.list;
			for ( var i in data){

				testee2.setData(i,data[i]);
			}
		}                                                                                           
	});
	equals(testee2.currentPath,'/','repositionnement relatif enfant');

	console.log(testee2)
	
});

var pane = new Joshlib.Pane();

test('UIElements',function(){
    
    expect(3);
    
    var J=Joshlib;
    myapp.basePath = "../";
	
	
    
	var testApp = myapp.Class(myapp.App,{
		
		
		start:function(baseHtmlId) {
			
			this.panelMain = new myapp.UI.Panel(this,"main",{
			   "onAfterInsert":function(elt) {
			       
			   }
			});
			
			this.panelShows = new myapp.UI.Panel(this,"shows",{
			    
			});
			
			this.panelGeo = new myapp.UI.Panel(this,"geo",{
			  
			});
			
			
			this.nav1 = new myapp.UI.List(this,"nav1",{
				"parent":this.panelMain,
				"autoInsert":true
			});
			
			this.nav2 = new myapp.UI.List(this,"nav2",{
				"parent":this.panelMain
			});
			
			this.nav3 = new myapp.UI.List(this,"nav3",{
				"parent":this.panelMain
			});
			
			this.player = new myapp.UI.Video(this,"vplayer",{
				"maximize":true,
				"parent":this.panelMain,
				"autoInsert":true
			});
			
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
			
			// liste des émissions
			this.shows=[];
			// liste des numéros d'émissions
			this.numeros=[];
			
			var self = this;
			
			$.ajax({                                                                                      
						url: "http://jsonpify.heroku.com/?resource=http://api.france24.com/fr/services/json-rpc/emission_list%3Fdatabases%3Df24fr%26key%3DXXX&format=json",  
						dataType: 'jsonp', 
						retour : this,
						success: function(data)
								{
									var data = data.result.f24fr.list;
									var prev_showid;
									this.retour.shows = new myapp.UI.List(this.retour,'shows',{
																			"parent":this.retour.panelShows,
																			"autoInsert":true
																		});
									var shows=[];
									for ( var i in data)
									{
										//menu.setData(i,data[i]);
										var showid='show-'+i;
										//$('<li />').attr('id',showid).text(data[i].title).appendTo('#testarbre');
										var editions = data[i]['editions']['list'];
										//pane.addDown(prev_showid,showid);
										// si on a des émissions dedans
										//$('<ul />').appendTo('#'+showid);
										
										
										this.retour.numeros[showid] = new myapp.UI.List(this.retour,showid,{
																				"parent":this.retour.panelShows,
																				"autoInsert":true
																			});
										
										
										var prev_emissionid=false;
										
										var shownr=[];
										
										for ( var j in editions)
										{
											//menu.setData(i+'-'+j,editions[j]);
											var emissionid='show-'+i+'-'+j;
											//$('<li />').attr('id',emissionid).text(editions[j].title).attr('data-mp4',editions[j]['video'][0]['mp4']).appendTo('#'+showid+' > ul');
											pane.addRight(showid,emissionid);
											//pane.setAction(emissionid,'enter',videoplaythis);

											shownr.push({
															"id"	: emissionid,
															"type"	: "video",
															"url"	: editions[j]['video'][0]['mp4'],
															"label" : editions[j].title,
															"image" : "http://"
															});
										}
										
										prev_showid=showid;

										this.retour.numeros[showid].setData(shownr);
										shows.push({
													"id"	: showid,
													"type"	: "video",
													"url"	: '',
													"label" : data[i].title,
													"image" : "http://"
													});

									}
									
									
									this.retour.shows.setData(shows);
									
									pane.add('testAppId_e_List_nav1_0');
									pane.addDown('testAppId_e_List_nav1_0','testAppId_e_List_nav1_1');
									pane.addDown('testAppId_e_List_nav1_1','testAppId_e_List_nav1_2');
									
									//	$('#testAppId_e_List_nav1_1').append(  this.retour.shows.getHtml() );
									
									//pane.setAction('testAppId_e_List_nav1_1','right','testAppId_e_List_shows_0');
									lastshowid='testAppId_e_List_nav1_1';
									
									pane.addRight('testAppId_e_List_nav1_1','testAppId_e_List_shows_0');
									
									
//console.log('retour ',this.retour.numeros);
//this.retour.numeros.data=this.retour.numeros.menuRoot;


									for ( var i in data)
									{
									// maintenant, on insère les éditions
									//	$('#testAppId_e_List_nav1_1').append(  this.retour.shows[showid].getHtml());
										var showid='show-'+i;
//console.log('numéros showid ',showid,' - ',this.retour.numeros[showid]);



										$('#testAppId_e_List_shows_'+i).append(  this.retour.numeros[showid].getHtml());
										if (i>0)
										{
											pane.addDown('testAppId_e_List_shows_'+(i-1),'testAppId_e_List_shows_'+i);
										}
										
										pane.setAction('testAppId_e_List_shows_'+i,'left','testAppId_e_List_nav1_1');
										pane.addRight('testAppId_e_List_shows_'+i,'testAppId_e_List_show-'+i+'_0');
										// ensuite refaire la boucle pour l'ensemble des éditions
										for ( var j in  data[i]['editions']['list'])
										{
											var emissionid='show-'+i+'-'+j;
											pane.addDown('testAppId_e_List_show-'+i+'-'+(j-1),'testAppId_e_List_show-'+i+'-'+j);
											
										}
									}
									
									
									
                        			self.setBaseHtmlId(baseHtmlId);

                        			self.setBaseUIElement(self.panelMain);

                                    self.insert();

                        			// il faut bien commencer quelque part
                        			$('.panehere').addClass('.focused');
									
									
									//this.retour.panelShows.setData();
									
									// $('#patienteur').html('');
								}           
						});
			
		}
		
	});
	
	$("#qunit-fixture2").append($("<div id='testApp1'>Loading!</div>"));
	equals("Loading!",$("#testApp1")[0].innerHTML);
	
	app = new testApp("testAppId");

	
	app.start("testApp1");
	
	equals($("#testAppId_e_Panel_main").length,1);
	
	equals($("#testAppId_e_Video_vplayer").length,1);
    
});
*/