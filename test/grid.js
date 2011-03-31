
// documentation on writing tests here: http://docs.jquery.com/QUnit

module("Joshlib tests");

var J = Joshlib;

J.Apps.Test = J.Class(J.App,{
    
});


test('Grid test',function(){

    var lastEvent = false;
    
    var g = new J.Utils.Grid({
        "grid":[
            [{"id":"item11"}         , {"id":"item12"},      {"id":"item13"},      {"id":"item14"},      {"id":"item15"}],
            
            [null                    , {"id":"item22"},      {"id":"item23"}],
            
        ],
        "dimensions":2,
        "onChange":function(coords,elem) {
            lastEvent = ["onChange",coords,elem];
        },
        "onExit":function(side,abSide) {
            lastEvent = ["onExit",side,abSide];
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
    same(lastEvent,["onExit","up","down"],'up');

    g.go("left");
    same(lastEvent,["onChange",[0,0],{"id":"item11"}],'left');
    
    g.go("left");
    same(lastEvent,["onExit","left","left"],'left');


    g.goTo([4,0]);
    same(lastEvent,["onChange",[4,0],{"id":"item15"}],'goTo');
    
    g.go("right");
    same(lastEvent,["onExit","right","right"],'left');
});





test('Sticky Grid test',function(){

    var lastEvent = false;
    
    var g = new J.Utils.Grid({
        "grid":[
            [{"id":"item11"}         , {"id":"item12"},      {"id":"item13"},      {"id":"item14"},      {"id":"item15"}],
            
            [null                    , {"id":"item22"},      {"id":"item23"}],
            
        ],
        "dimensions":2,
        "sticky":true,
        "onChange":function(coords,elem) {
            lastEvent = ["onChange",coords,elem];
        },
        "onExit":function(side,abSide) {
            lastEvent = ["onExit",side,abSide];
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

    
    g.go("up");
    same(lastEvent,["onExit","up","down"],'up');

    g.go("left");
    same(lastEvent,["onChange",[0,0],{"id":"item11"}],'left');
    
    g.go("left");
    same(lastEvent,["onExit","left","left"],'left');


    g.goTo([4,0]);
    same(lastEvent,["onChange",[4,0],{"id":"item15"}],'goTo');
    
    g.go("right");
    same(lastEvent,["onExit","right","right"],'left');
    
    g.go("down");
    same(lastEvent,["onChange",[2,1],{"id":"item23"}],'down');
    
    g.go("right");
    same(lastEvent,["onChange",[3,0],{"id":"item14"}],'goTo');
    
    g.go("down");
    same(lastEvent,["onChange",[2,1],{"id":"item23"}],'down');
    
    g.go("left");
    same(lastEvent,["onChange",[1,1],{"id":"item22"}],'left');
    
    g.go("left");
    same(lastEvent,["onChange",[0,0],{"id":"item11"}],'releft');
    
    g.go("down");
    same(lastEvent,["onChange",[1,1],{"id":"item22"}],'redown');
    
});

