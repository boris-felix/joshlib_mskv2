
// documentation on writing tests here: http://docs.jquery.com/QUnit

module("Joshlib tests");

var J = Joshlib;

var events = [];
var ended = function() {
    events.push("ended");
    console.log("ended");
};

var canplay = function() {
    events.push("canplay");
    console.log("canplay");
};

var error = function() {
    events.push("error");
    console.log("error");
};

var timeupdate = function() {
    events.push("timeupdate");
    console.log("timeupdate");
};

J.Apps.VideoTest = J.Class(J.App,{
    init:function(callback) {
        
        this.player = new J.UI.Video(this,"vplayer",{
			maximise:true,
			"autoInsert":true,
			"defaultPlayer":true,
			"persistFocus":false,
			"orientation":"down",
			"menuRoot":/video/,
			'canplay':canplay,
			'ended':ended,
			'loadingTemplate' : "<p>Loading</p>",
			'error' : error,
			'timeupdate':timeupdate
		});
        
        callback();
    },
    
    start:function(baseHtmlId)
	{
	    var self = this;
	    this.init(function()
		{
	        self.setBaseHtmlId(baseHtmlId);
			self.setBaseUIElement(self.player);
			self.insert();
			
			self.player.show();
		});
	}
});



test('Installation Joshlib',function(){
	expect(2);

    var J = Joshlib;
    
	var myapp = new J.Apps.VideoTest();
	
	equals(typeof window.Joshlib,'object','Joshlib() déclaré');
	
	equals(typeof myapp.menu,'object','Joshlib.Menu() instantié');
	
})  

test('Videos',function(){

	expect(32);
	
	//equals(testee2.index,{},'index d\'origine');

	var J = Joshlib;
	
	var myapp = new J.Apps.VideoTest();
	
	myapp.start("qunit-appcontainer");
    
    myapp.player.play({
        "url":"http://video.ted.com/talks/podcast/AlGore_2006_480.mp4"
    });
    
    stop();
    
    setTimeout(function() {
        
        myapp.player.play({
            "url":"http://video.ted.com/talks/embed/BrianCox_2008-embed_high.flv"
        });
        
        setTimeout(function() {

            myapp.player.play({
                "url":"rtmp://stream2.france24.yacast.net/france24_live/en/f24_liveen",
                "mime":"video/flv"
            });

            start();  

        },5000);
        
    },5000);
    
	
});
