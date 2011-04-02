
// documentation on writing tests here: http://docs.jquery.com/QUnit

module("Joshlib tests");

var J = Joshlib;

J.Apps.Test = J.Class(J.App,{
    
});



test('Installation Joshlib',function(){
	expect(2);

	var myapp = new J.Apps.Test();
	
	equals(typeof window.Joshlib,'object','Joshlib() déclaré');
	
	equals(typeof myapp.tree,'object','Joshlib.Tree() instantié');
	
})  

test('tree navigation',function(){

	expect(32);
	
	//equals(testee2.index,{},'index d\'origine');
	
	var J = Joshlib;
	
	var myapp = new J.Apps.Test();
	
	myapp.tree.setData('/',[
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
             console.log("TEST getChilden leaf3");
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
	myapp.tree.resolveMoves("/leaf1",["next"],function(path) {
	    equals(path,"/leaf2","resolveMove next");
	});
    
    myapp.tree.resolveMoves("/leaf3",["next"],function(path) {
	    equals(path,"/leaf4","resolveMove next3");
	});
	
	equals(myapp.tree.getData("/leaf4").label,"test1");
	
	myapp.tree.resolveMoves("/leaf3",["next"],function(path) {
	    equals(path,"/leaf4","resolveMove next3");
	});
	
	same(myapp.tree.getData("/leaf2").id,"leaf2");
	
	same(myapp.tree.getData("/leaf2/"),[
      {'id':'leaf21'},
      {'id':'leaf22'}
     ]);
     
	//Change a leaf
	myapp.tree.setData('/leaf4',{"label":"test2"});
    equals(myapp.tree.getData("/leaf4").label,"test2");

	myapp.tree.resolveMoves("/leaf3",["next"],function(path) {
	    equals(path,"/leaf4","resolveMove next3");
	});
    

	//Change a tree
	myapp.tree.setData('/leaf4/',[
	    {'id':'leaf41'},
	    {'id':'leaf42'}
	]);
	
     
     same(myapp.tree.getData("/leaf4/"),[
       {'id':'leaf41'},
       {'id':'leaf42'}
      ]);
     
     var rootm = myapp.tree.getData("/");
     same(rootm[0],{'id':'leaf1'});

	var lastStateChange = null;
	myapp.subscribe("stateChange",function(ev,data) {
        console.log('stateChange ',data);
	    lastStateChange = data;
	});
	
	
    lastStateChange=[];
	
	myapp.tree.moveTo("current","/leaf4");
	
	same(lastStateChange,["current","/leaf4"],'tree GoTo current /leaf4');
	
	myapp.tree.move("current","down");
	
    same(lastStateChange,["current","/leaf4/leaf41"],'tree Go current down+next');
	
	myapp.tree.move("current","next");
    
    same(lastStateChange,["current","/leaf4/leaf42"],'tree Go current down+next');

    lastStateChange=[];	

	myapp.tree.moveTo("focus","/leaf1");
    
    same(lastStateChange,["focus","/leaf1"],'tree Goto');
	
    myapp.tree.move("focus","next");
    
	same(lastStateChange,["focus","/leaf2"],'tree Go focus next');
	
	myapp.tree.move("focus","down");
	
	same(lastStateChange,["focus","/leaf2/leaf21"],'tree Go focus down');
	
	myapp.tree.move("focus","up");
	
	same(lastStateChange,["focus","/leaf2"],'tree Go focus up');
	
	myapp.tree.moveTo("focus","/leaf2/");
	
	same(lastStateChange,["focus","/leaf2/leaf21"],'tree Go focus down with last slash');
	
	myapp.tree.move("focus","up");
	
	same(lastStateChange,["focus","/leaf2"],'tree Go focus up');
	
	myapp.tree.move("focus","up");
	
	same(lastStateChange,["focus","/leaf2"],'tree Go focus up - the same.');
	
	myapp.tree.move("focus","next");
	
	same(lastStateChange,["focus","/leaf3"],'tree Go focus next');

    myapp.tree.move("focus","down");
	
	same(lastStateChange,["focus","/leaf3/leaf31"],'tree Go focus down 3');
    
    myapp.tree.move("focus","up");
    
    same(lastStateChange,["focus","/leaf3"],'tree Go up next ');
    
	myapp.tree.move("focus","next");
	
	same(lastStateChange,["focus","/leaf4"],'tree Go up next ');
	
	myapp.tree.move("focus","next");
	
	same(lastStateChange,["focus","/leaf5"],'tree Go up next next');
    
    //Todo: later.
    //myapp.tree.move("focus","down");

    //should not be loaded right away
    same(lastStateChange,["focus","/leaf5"],'Async!');
    
    same(myapp.tree.getData("/leaf5").id,"leaf5");
    
    myapp.tree.move("focus","down");
    
    same(myapp.tree.getData("/leaf5/"),"loading");
    
    
    stop();
    
    setTimeout(function() {

        same(myapp.tree.getData("/leaf5").id,"leaf5");

        same(((myapp.tree.getData("/leaf5/") || [{"id":"noleaf5"}])[0] || {"id":"noidinzero"}).id,"leaf51");

        same(lastStateChange,["focus","/leaf5/leaf51"],'Down Async');
        
        myapp.tree.move("focus",["up","prev","prev","prev","down","next","down","next","prev","next"]);
        same(lastStateChange,["focus","/leaf2/leaf22/leaf222"],'Big path');
        
        
        start();  
    },700)
    
    
});



test('tree incremental additions',function(){

	expect(8);
	
	//equals(testee2.index,{},'index d\'origine');
	
	var J = Joshlib;
	
	var myapp = new J.Apps.Test();
	
	
	var lastTreeData = null;
	myapp.subscribe("treeData",function(ev,data) {
	    if (data[0]=="/") {
	        console.log('***treeData ',data);
    	    lastTreeData = data[1];
	    }
	});
	
	myapp.tree.setData('/',[
	    {'id':'leaf1'}
	]);
	
	stop();
	
	setTimeout(function() {
	    
	    
    	same(lastTreeData[0].id,"leaf1",'Load');

    	myapp.tree.moveTo("focus","/leaf1");

    	myapp.tree.insertData('/',0,[
    	    {'id':'leafbefore'}
    	]);
    	
    	setTimeout(function() {

        	same(lastTreeData[0].id,"leafbefore",'leafbefore');
        	same(lastTreeData[1].id,"leaf1",'leaf1');

            myapp.tree.insertData('/',2,[
        	    {'id':'leafafter'}
        	]);

            myapp.tree.insertData('/',-1,[
           	    {'id':'leafafterafter'}
           	]);
           	
           	myapp.tree.insertData('/',2,[
           	    {'id':'leafmiddle'}
           	]);

            setTimeout(function() {
                
                same(lastTreeData[0].id,"leafbefore",'leafbefore');
            	same(lastTreeData[1].id,"leaf1",'leaf1');
            	same(lastTreeData[2].id,"leafmiddle",'leafmiddle');
                same(lastTreeData[3].id,"leafafter",'leafafter');
                same(lastTreeData[4].id,"leafafterafter",'leafafterafter');
        
        
                start();
                
            },100);
            
        },100);
	    
	},100);
	
});




test('Async tree navigation',function(){

    var doCb;
    
    var myapp;
    
    var lastStateChange = null;
    
    var rst = function() {
        
        delete myapp;
        
        myapp = new J.Apps.Test();

    	myapp.tree.setData('/',[
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
        
        myapp.subscribe("stateChange",function(ev,data) {
            console.log('stateChange ',data);
    	    lastStateChange = data;
    	});
    	
    };
    

	rst();
	

	
	myapp.tree.moveTo("focus","/");
    
	same(lastStateChange,["focus","/leaf1"],'tree init - first child');
	
	
	myapp.tree.moveTo("focus","/leaf1");
    
	same(lastStateChange,["focus","/leaf1"],'tree init');
    
    myapp.tree.move("focus","down");
    
    same(lastStateChange,["focus","/leaf1"],'Still');
    
    myapp.tree.move("focus","next");
    
	same(lastStateChange,["focus","/leaf2"],'Next');

    myapp.tree.move("focus","down");
    
	same(lastStateChange,["focus","/leaf2/"],'Down');

	doCb();
	
	same(lastStateChange,["focus","/leaf2/leaf21"],'Loaded');
    
    
    rst();
    
    myapp.tree.moveTo("focus","/leaf1");
    same(lastStateChange,["focus","/leaf1"],'tree init');
    
    myapp.tree.move("focus","next");
	same(lastStateChange,["focus","/leaf2"],'Next');
    
    myapp.tree.move("focus","down");
	same(lastStateChange,["focus","/leaf2/"],'Down');
	
	myapp.tree.move("focus","up");
	same(lastStateChange,["focus","/leaf2"],'Reup before CB');
    
    doCb();
    
    same(lastStateChange,["focus","/leaf2"],'No change');
    
});




test('Preload all',function(){

	expect(10);
	
	//equals(testee2.index,{},'index d\'origine');
	
	var J = Joshlib;
	
	var myapp = new J.Apps.Test();
	
	myapp.tree.preloadAll();
	
	myapp.tree.setData('/',[
	    {'id':'leaf1'},
	    {'id':'leaf2',
	     'children':[
	      {'id':'leaf21'},
	      {'id':'leaf22'}
	     ]
	    },
        {'id':'leaf3',
         'getChildren':function(callback) {
                setTimeout(function() {
                 callback([
                     {"id":"leaf31",
                      'getChildren':function(callback) {
                             setTimeout(function() {
                              callback([
                                  {"id":"leaf311"},
                                  {"id":"leaf312"}
                                 ]);
                             },500);
                      }},
                     {"id":"leaf32"}
                    ]);
                },500);
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
                         {"id":"leaf51",
                           'getChildren':function(callback) {
                                  setTimeout(function() {
                                   callback([
                                       {"id":"leaf511"},
                                       {"id":"leaf512"}
                                      ]);
                                  },500);
                           }},
                         {"id":"leaf52"  ,
                             'getChildren':function(callback) {
                                    setTimeout(function() {
                                     callback([
                                         {"id":"leaf521"},
                                         {"id":"leaf522"}
                                        ]);
                                    },500);
                             }}
                        ]);
                    },500);
             }
        },
        
	]);
	
	
	
	equals(myapp.tree.getData("/leaf4").label,"test1");
	
	
		
    stop();
    
    setTimeout(function() {

        same(myapp.tree.getData("/leaf3/leaf31").id,"leaf31");
        same(myapp.tree.getData("/leaf5/leaf51"),undefined);
        
        setTimeout(function() {
        
            same(myapp.tree.getData("/leaf5/leaf51").id,"leaf51");
            same(myapp.tree.getData("/leaf3/leaf31/leaf312"),undefined);
            
            setTimeout(function() {

                same(myapp.tree.getData("/leaf3/leaf31/leaf312").id,"leaf312");
                same(myapp.tree.getData("/leaf5/leaf51/leaf511"),undefined);
                
                setTimeout(function() {

                    same(myapp.tree.getData("/leaf5/leaf51/leaf511").id,"leaf511");
                    same(myapp.tree.getData("/leaf5/leaf52/leaf522"),undefined);
                    
                    setTimeout(function() {

                        same(myapp.tree.getData("/leaf5/leaf52/leaf522").id,"leaf522");

                        start();  
                        
                    },500);

                },500);
                
            },500);
            
        },500);

        
    },750);
    
	
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
										//tree.setData(i,data[i]);
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
											//tree.setData(i+'-'+j,editions[j]);
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
//this.retour.numeros.data=this.retour.numeros.treeRoot;


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