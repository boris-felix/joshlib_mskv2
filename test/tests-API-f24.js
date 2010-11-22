
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
	
	var J = Joshlib;
	
	testee2.setData('/',[
	    {'id':'leaf1'},
	    {'id':'leaf2',
	     'children':[
	      {'id':'leaf21'},
	      {'id':'leaf22'}
	     ]
	    },
        {'id':'leaf3'},
        {
            'id':'leaf4',
            'label':'test1'
        }
	]);
	
	equals(testee2.getData("/leaf4").label,"test1");
	
	//Change a leaf
	testee2.setData('/leaf4',{"label":"test2"});
    equals(testee2.getData("/leaf4").label,"test2");
	
	//Change a tree
	testee2.setData('/leaf4/',[
	    {'id':'leaf41'},
	    {'id':'leaf42'}
	]);
	
	var lastMenuChange = null;
	J.subscribe("menuChange",function(ev,data) {
	    lastMenuChange = data;
	});
	
	
	
	
	J.publish("menuGoTo",["focus","/leaf1"],true);
    
    equals(lastMenuChange,["focus","/leaf1"]);
    
    J.publish("menuGo",["focus","next"],true);
    
	equals(lastMenuChange,["focus","/leaf2"]);
	
	J.publish("menuGo",["focus","down"],true);
	
	equals(lastMenuChange,["focus","/leaf2/leaf21"]);
	
	J.publish("menuGo",["focus","up"],true);
	
	equals(lastMenuChange,["focus","/leaf2"]);
	
	
	J.publish("menuGoTo",["current","/leaf4"],true);
	
	equals(lastMenuChange,["current","/leaf4"]);
	
	J.publish("menuGo",["current","down"],true);
	J.publish("menuGo",["current","next"],true);
    
    equals(lastMenuChange,["current","/leaf4/leaf42"]);
    >
    
	/*
	
	
	
	
	
	
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
*/
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
			
			$.ajax({                                                                                      
						url: "http://jsonpify.heroku.com/?resource=http://api.france24.com/fr/services/json-rpc/emission_list%3Fdatabases%3Df24fr%26key%3DXXX&format=json",  
						dataType: 'jsonp', 
						retour : this,
						success: function(data)
								{
									var data = data.result.f24fr.list;
									var prev_showid;
									this.retour.shows = new J.UI.List(this.retour,'shows',{
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
										
										
										this.retour.numeros[showid] = new J.UI.List(this.retour,showid,{
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
									
									$('#testAppId_e_List_nav1_1').append(  this.retour.shows.getHtml());
									
									//pane.setAction('testAppId_e_List_nav1_1','right','testAppId_e_List_shows_0');
									lastshowid='testAppId_e_List_nav1_1';
									
									pane.addRight('testAppId_e_List_nav1_1','testAppId_e_List_shows_0');
									
									for ( var i in data)
									{
									// maintenant, on insère les éditions
									//	$('#testAppId_e_List_nav1_1').append(  this.retour.shows[showid].getHtml());
										var showid='show-'+i;
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
									
									//this.retour.panelShows.setData();
									
									// $('#patienteur').html('');
								}           
						});
			
			this.setBaseHtmlId(baseHtmlId);
			
			this.setBaseUIElement(this.panelMain);
            
            this.insert();
			
			// il faut bien commencer quelque part
			$('.panehere').addClass('.focused');
		}
		
	});
	
	$("#qunit-fixture2").append($("<div id='testApp1'>Loading!</div>"));
	equals("Loading!",$("#testApp1")[0].innerHTML);
	
	app = new testApp("testAppId");

	
	app.start("testApp1");
	
	equals($("#testAppId_e_Panel_main").length,1);
	
	equals($("#testAppId_e_Video_vplayer").length,1);
    
	/*
    app.playMedia({
        "url":"fixtures/video.mp4",
        "type":"video"
    });
	*/
    
});
