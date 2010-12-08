﻿/*!
 * Media Element jQuery plugin
 * http://mediaelementjs.com/
 *
 * Creates a controller bar for HTML5 <video> add <audio> tags
 * using jQuery and MediaElement.js
 *
 * Copyright 2010, John Dyer
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function ($) {

	// default player values
	mejs.MepDefaults = {
		// default if the <video width> is not specified
		defaultVideoWidth: 480,
		// default if the <video height> is not specified
		defaultVideoHeight: 270,
		// if set, overrides <video width>
		videoWidth: -1,
		// if set, overrides <video height>
		videoHeight: -1,
		// width of audio player
		audioWidth: 400,
		// height of audio player
		audioHeight: 30,
		// initial volume when the player starts (overrided by user cookie)
		startVolume: 0.8,		
		// useful for <audio> player loops
		loop: false,
		// resize to media dimensions
		enableAutosize: true,		
		// features to show
		features: ['playpause','progress','current','duration','tracks','volume','fullscreen','backlight']
	};

	mejs.mepIndex = 0;

	// wraps a MediaElement object in player controls
	mejs.MediaElementPlayer = function($media, o) {

		var	
			t = this,
			mf = mejs.MediaFeatures;
	
		t.$media = $($media);
		t.options = $.extend(true,{},mejs.MepDefaults,o);
		t.isVideo = (t.$media[0].tagName.toLowerCase() == 'video');
				
		if (mf.isiPad || mf.isiPhone) {
			// add controls and stop
			t.$media.attr('controls', 'controls');
			
			// fix Apple bug
			t.$media.removeAttr('poster');

			// override Apple's autoplay override for iPads
			if (mf.isiPad && t.$media[0].getAttribute('autoplay') !== null) {
				t.$media[0].load();
				t.$media[0].play();
			}

			// don't do the rest
			return;
		} else if (mf.isAndroid && t.isVideo) {

			// Android is better off with native controls (like iOS)
			t.$media.attr('controls', 'controls');
			return;
			
		} else {

			// remove native controls and use MEJS
			t.$media.removeAttr('controls');
		}
		
		t.init();
		
		return t;
	};
	
	// actual player
	mejs.MediaElementPlayer.prototype = {
		init: function() {

			var
				t = this,
				meOptions = $.extend(true, {}, t.options, {
					success: function(media, domNode) { t.meReady(media, domNode); },
					error: function(e) { t.handleError(e);}
				});				
		
			// unique ID
			t.id = 'mep_' + mejs.mepIndex++;			
			
			// build container
			t.container =
				$('<div id="' + t.id + '" class="mejs-container">'+
					'<div class="mejs-inner">'+
						'<div class="mejs-mediaelement"></div>'+
						'<div class="mejs-layers"></div>'+
						'<div class="mejs-controls"></div>'+
						'<div class="mejs-clear"></div>'+
					'</div>' +
				'</div>')						
				.addClass(t.$media[0].className)
				.insertBefore(t.$media);
				
				
				//$('<div class="mejs-controls"></div>').insertBefore(t.$media);
				
			// move the <video/video> tag into the right spot
			t.container.find('.mejs-mediaelement').append(t.$media);
			
			// find parts
			t.controls = $('.mejs-controls');  //t.container.find('.mejs-controls'); 
			t.layers = t.container.find('.mejs-layers');		
			
			// determine the size							
			if (t.isVideo) {			
				// priority = videoWidth (forced), width attribute, defaultVideoWidth		
				t.width = (t.options.videoWidth ) ? t.options.videoWidth : (t.$media[0].getAttribute('width') !== null) ? t.$media.attr('width') : t.options.defaultVideoWidth;
				t.height = (t.options.videoHeight ) ? t.options.videoHeight : (t.$media[0].getAttribute('height') !== null) ? t.$media.attr('height') : t.options.defaultVideoHeight;				
			} else {
				t.width = t.options.audioWidth;
				t.height = t.options.audioHeight;
			}
			
			// set the size, while we wait for the plugins to load below
			t.setPlayerSize(t.width, t.height);
						
			// create MediaElementShim	
			meOptions.pluginWidth = t.height;
			meOptions.pluginHeight = t.width;			
			mejs.MediaElement(t.$media[0], meOptions);			
		},
		
		// Sets up all controls and events
		meReady: function(media, domNode) {		

			var t = this,
				f,
				feature;

			t.media = media;
			t.domNode = domNode;
				
			// two built in features
			t.buildposter(t, t.controls, t.layers, t.media);
			t.buildoverlay(t, t.controls, t.layers, t.media);
			
			// grab for use by feautres
			t.findTracks();
				
			// add user-defined features/controls
			for (f in t.options.features) {
				feature = t.options.features[f];
				if (t['build' + feature]) {
					try {
						t['build' + feature](t, t.controls, t.layers, t.media);
					} catch (e) {
						// TODO: report control error
					}
				}			
			}
			
			// reset all layers and controls
			t.setPlayerSize(t.width, t.height);			
			t.setControlsSize();
			
			// controls fade
			if (t.isVideo) {
				// show/hide controls
				/*
				t.container
					.bind('mouseenter', function () {
						t.controls.css('visibility','visible');						
						t.controls.stop(true, true).fadeIn(200);
					})
					.bind('mouseleave', function () {
						if (!t.media.paused) {
							t.controls.stop(true, true).fadeOut(200, function() {
								$(this).css('visibility','hidden');
								$(this).css('display','block');								
							});						
						}
					});
				*/
				// resizer
				if (t.options.enableAutosize) {
					t.media.addEventListener('loadedmetadata', function(e) {
						// if the <video height> was not set and the options.videoHeight was not set
						// then resize to the real dimensions
						if (t.options.videoHeight <= 0 && t.$media[0].getAttribute('height') === null && !isNaN(e.target.videoHeight)) {
							t.setPlayerSize(e.target.videoWidth, e.target.videoHeight);
							t.setControlsSize();
							t.media.setVideoSize(e.target.videoWidth, e.target.videoHeight);			
						}
					}, false);
				}
			}		
			
			// ended for all
			t.media.addEventListener('ended', function (e) {
				t.media.setCurrentTime(0);
				t.media.pause();				
					
				if (t.options.loop) {					
					t.media.play();
				} else {
					t.controls.css('visibility','visible');
				}
			}, true);

			
			// webkit has trouble doing this without a delay
			setTimeout(function () {
				t.setControlsSize();
				t.setPlayerSize(t.width, t.height);
			}, 50);
			
			
			if (t.options.success) {
				t.options.success(t.media, t.domNode);
			}		
		},

		setPlayerSize: function(width,height) {
			var t = this;
			
			// ie9 appears to need this (jQuery bug?)
			//t.width = parseInt(width, 10);
			//t.height = parseInt(height, 10);
			
			t.container
				.width(t.width)
				.height(t.height);
				
			t.layers.children('div.mejs-layer')
				.width(t.width)
				.height(t.height);						
		},

		setControlsSize: function() {
			var t = this,				
				usedWidth = 0,		
				railWidth = 0,
				rail = t.controls.find('.mejs-time-rail'),
				total = t.controls.find('.mejs-time-total'),
				others = rail.siblings();
			
			// find the size of all the other controls besides the rail
			others.each(function() {
				if ($(this).css('position') != 'absolute') {
					usedWidth += $(this).outerWidth(true);
				}
			});
			// fit the rail into the remaining space
			railWidth = t.controls.width() - usedWidth - (rail.outerWidth(true) - rail.outerWidth(false));
			
			rail.width(railWidth);		
			total.width(railWidth - (total.outerWidth(true) - total.width()));			
		},

		
		buildposter: function(player, controls, layers, media) {			
			var poster = 	
				$('<div class="mejs-poster mejs-layer">'+
					'<img />'+
				'</div>')
					.appendTo(layers),
				posterUrl = player.$media.attr('poster');
				
			if (posterUrl !== '' && posterUrl != null) {
				poster.find('img').attr('src',posterUrl);
			} else {
				poster.hide();
			}
						
			media.addEventListener('play',function() {
				poster.hide();
			}, false);			
		},
		
		buildoverlay: function(player, controls, layers, media) {
			if (!player.isVideo)
				return;
				
			var overlay = 	
				$('<div class="mejs-overlay mejs-layer">'+
					'<div class="mejs-overlay-button"></div>'+
				'</div>')
				.appendTo(layers)
				.click(function() {
					if (media.paused) {
						media.play();
					} else {
						media.pause();
					}
				});
				
			media.addEventListener('play',function() {
				overlay.hide();
			}, false);
			media.addEventListener('pause',function() {
				overlay.show();
			}, false);			
		},
		
		findTracks: function() {	
			var t = this,
				tracktags = t.$media.find('track');
			
			// store for use by plugins
			t.tracks = [];			
			tracktags.each(function() {				
				t.tracks.push({
					srclang: $(this).attr('srclang').toLowerCase(),
					src: $(this).attr('src'),
					kind: $(this).attr('kind'),
					entries: [],
					isLoaded: false
				});				
			});		
		},
		changeSkin: function(className) {
			this.container[0].className = 'mejs-container ' + className;
			this.setPlayerSize();
			this.setControlsSize();
		},
		play: function() {
			this.media.play();
		},
		pause: function() {
			this.media.pause();
		},
		load: function() {
			this.media.load();
		},		
		setMuted: function(muted) {
			this.media.setMuted(muted);
		},
		setCurrentTime: function(time) {
			this.media.setCurrentTime(time);
		},
		getCurrentTime: function() {
			this.media.currentTime;
		},	
		setVolume: function(volume) {
			this.media.setVolume(volume);
		},
		getVolume: function() {
			this.media.volume;
		},	
		setSrc: function(src) {
			this.media.setSrc(src);
		}	
	};
			
	// turn into jQuery plugin
	jQuery.fn.mediaelementplayer = function (options) {
		return this.each(function () {
			return new mejs.MediaElementPlayer($(this), options);
		});
	};

	// push out to window
	window.MediaElementPlayer = mejs.MediaElementPlayer;

})(jQuery);

(function($) {
	// PLAY/pause BUTTON
	MediaElementPlayer.prototype.buildplaypause = function(player, controls, layers, media) {
		var play = 	
			$('<div class="mejs-button mejs-playpause-button mejs-play">' +
				'<span></span>' +
			'</div>')
			.appendTo(controls)
			.click(function() {
				if (media.paused) {
					media.play();
				} else {
					media.pause();
				}
			});
			
		media.addEventListener('play',function() {
			play.removeClass('mejs-play').addClass('mejs-pause');	
		}, false);
		media.addEventListener('playing',function() {
			play.removeClass('mejs-play').addClass('mejs-pause');	
		}, false);


		media.addEventListener('pause',function() {
			play.removeClass('mejs-pause').addClass('mejs-play');	
		}, false);
		media.addEventListener('paused',function() {
			play.removeClass('mejs-pause').addClass('mejs-play');	
		}, false);			

		
		
	}
})(jQuery);
(function($) {
	// progress/loaded bar
	MediaElementPlayer.prototype.buildprogress = function(player, controls, layers, media) {
			
		$('<div class="mejs-time-rail">'+
			'<span class="mejs-time-total">'+
				'<span class="mejs-time-loaded"></span>'+
				'<span class="mejs-time-current"></span>'+
				'<span class="mejs-time-handle"></span>'+
				'<span class="mejs-time-float">' + 
					'<span class="mejs-time-float-current">00:00</span>' + 
					'<span class="mejs-time-float-corner"></span>' + 
				'</span>'+
			'</span>'+
		'</div>')
			.appendTo(controls);
			
		var total = controls.find('.mejs-time-total'),
			loaded  = controls.find('.mejs-time-loaded'),
			current  = controls.find('.mejs-time-current'),
			handle  = controls.find('.mejs-time-handle'),
			timefloat  = controls.find('.mejs-time-float'),
			timefloatcurrent  = controls.find('.mejs-time-float-current'),
			setProgress = function(e) {
				var
					target = e.target,
					percent = null;
				
				// Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
				// to be anything other than 0. If the byte count is available we use this instead.
				// Browsers that support the else if do not seem to have the bufferedBytes value and
				// should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
				if (target && target.bytesTotal != undefined && target.bytesTotal > 0 && target.bufferedBytes != undefined) {
					percent = target.bufferedBytes / target.bytesTotal;
				}
				// need to account for a real array with multiple values (only Firefox 4 has this so far)
				else if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
					percent = target.buffered.end(0) / target.duration;
				}

				if (percent !== null) {
					// update loaded bar
					loaded.width(total.width() * percent);			
				}				
			}, 
			setCurrentTime = function(e) {
					
				if (media.currentTime && media.duration) {
				
					// update bar and handle				
					var 
						newWidth = total.width() * media.currentTime / media.duration,
						handlePos = newWidth - (handle.outerWidth(true) / 2);
				
					current.width(newWidth);
					handle.css('left', handlePos);
					timefloat.css('left', handlePos);
					timefloatcurrent.html( mejs.Utility.secondsToTimeCode(media.currentTime) );
				}				
			
			},
			handleMouseMove = function (e) {
				// mouse position relative to the object
				var x = e.pageX,
					offset = total.offset(),
					width = total.outerWidth(),
					percentage = ((x - offset.left) / width),
					newTime = percentage * media.duration;

				media.setCurrentTime(newTime);
			},
			mouseIsDown = false;
	
		// handle clicks
		//controls.find('.mejs-time-rail').delegate('span', 'click', handleMouseMove);
		total
			.bind('mousedown', function (e) {
				handleMouseMove(e);
				mouseIsDown = true;
				return false;
			});
			
		$(document)
			.bind('mouseup', function (e) {
				mouseIsDown = false;
				//handleMouseMove(e);
			})
			.bind('mousemove', function (e) {
				if (mouseIsDown) {
					handleMouseMove(e);
				}
			});		
		
		// loading
		media.addEventListener('progress', function (e) {								
			setProgress(e);
		}, false);

		// current time
		media.addEventListener('timeupdate', function(e) {
			setProgress(e);
			setCurrentTime(e);
		}, false);
	}
	
})(jQuery);
(function($) {
	// current and duration 00:00 / 00:00
	MediaElementPlayer.prototype.buildcurrent = function(player, controls, layers, media) {
		$('<div class="mejs-time">'+
				'<span class="mejs-currenttime">00:00</span>'+
			'</div>')
			.appendTo(controls);
			
		media.addEventListener('timeupdate',function() {
			if (media.currentTime) {
				controls.find('.mejs-currenttime').html(mejs.Utility.secondsToTimeCode(media.currentTime));
			}		
		}, false);			
	};
	
	MediaElementPlayer.prototype.buildduration = function(player, controls, layers, media) {
		if (controls.children().last().find('.mejs-currenttime').length > 0) {
			$(' <span> | </span> '+
			   '<span class="mejs-duration">00:00</span>')
				.appendTo(controls.find('.mejs-time'));			
		} else {
		
			$('<div class="mejs-time">'+
				'<span class="mejs-duration">00:00</span>'+
			'</div>')
			.appendTo(controls);
		}
		
		media.addEventListener('timeupdate',function() {
			if (media.duration) {
				controls.find('.mejs-duration').html(mejs.Utility.secondsToTimeCode(media.duration));
			}
		}, false);			
	};	

})(jQuery);
(function($) {
	MediaElementPlayer.prototype.buildvolume = function(player, controls, layers, media) {
		var mute = 	
			$('<div class="mejs-button mejs-volume-button mejs-mute">'+
				'<span></span>'+
				'<div class="mejs-volume-slider">'+ // outer background
					'<div class="mejs-volume-total"></div>'+ // line background
					'<div class="mejs-volume-current"></div>'+ // current volume
					'<div class="mejs-volume-handle"></div>'+ // handle
				'</div>'+
			'</div>')
			.appendTo(controls),
		volumeSlider = mute.find('.mejs-volume-slider'),
		volumeTotal = mute.find('.mejs-volume-total'),
		volumeCurrent = mute.find('.mejs-volume-current'),
		volumeHandle = mute.find('.mejs-volume-handle'),
		
		positionVolumeHandle = function(volume) {
			
			var 
				top = volumeTotal.height() - (volumeTotal.height() * volume);
				
			// handle
			volumeHandle.css('top', top - (volumeHandle.height() / 2));
			
			// show the current visibility
			volumeCurrent.height(volumeTotal.height() - top + parseInt(volumeTotal.css('top').replace(/px/,''),10));
			volumeCurrent.css('top',  top);			
		},
		handleVolumeMove = function(e) {
			var	
				railHeight = volumeTotal.height(),
				totalOffset = volumeTotal.offset(),
				totalTop = parseInt(volumeTotal.css('top').replace(/px/,''),10),
				newY = e.pageY - totalOffset.top,
				volume = (railHeight - newY) / railHeight
			
			// TODO: handle vertical and horizontal CSS
			// only allow it to move within the rail
			if (newY < 0)
				newY = 0;
			else if (newY > railHeight)
				newY = railHeight;

			// move the handle to match the mouse
			volumeHandle.css('top', newY - (volumeHandle.height() / 2) + totalTop );
			
			// show the current visibility
			volumeCurrent.height(railHeight-newY);
			volumeCurrent.css('top',newY+totalTop);

			// set mute status
			if (volume == 0) {
				media.setMuted(true);
				mute.removeClass('mejs-mute').addClass('mejs-unmute');
			} else {
				media.setMuted(false);
				mute.removeClass('mejs-unmute').addClass('mejs-mute');
			}
			
			volume = Math.max(0,volume);
			volume = Math.min(volume,1);
			
			// set the volume
			media.setVolume(volume);
		},
		mouseIsDown = false;

		// SLIDER
		volumeSlider
			.bind('mousedown', function (e) {
				handleVolumeMove(e);
				mouseIsDown = true;
				return false;
			});
		$(document)
			.bind('mouseup', function (e) {
				mouseIsDown = false;
			})
			.bind('mousemove', function (e) {
				if (mouseIsDown) {
					handleVolumeMove(e);
				}
			});
				
			
		// MUTE button
		mute.find('span').click(function() {
			if (media.muted) {
				media.setMuted(false);
				mute.removeClass('mejs-unmute').addClass('mejs-mute');
				positionVolumeHandle(1);
			} else {
				media.setMuted(true);
				mute.removeClass('mejs-mute').addClass('mejs-unmute');
				positionVolumeHandle(0);
			}				
		});
		
		// listen for volume change events from other sources
		media.addEventListener('volumechange', function(e) {
			if (!mouseIsDown) {
				positionVolumeHandle(e.target.volume);
			}
		}, true);
		
		// set initial volume
		//player.options.startVolume = Math.min(Math.max(0,player.options.startVolume),1);		
		media.setVolume(player.options.startVolume);		
	}

})(jQuery);
(function($) {
	MediaElementPlayer.prototype.buildfullscreen = function(player, controls, layers, media) {
			
		if (!player.isVideo)
			return;
	
		var 
			isFullScreen = false,
			normalHeight = 0,
			normalWidth = 0,	
			container = player.container,
			fullscreenBtn = 	
				$('<div class="mejs-button mejs-fullscreen-button"><span></span></div>')
				.appendTo(controls)
				.click(function() {
					setFullScreen(!isFullScreen);
				}),				
			setFullScreen = function(goFullScreen) {				
				switch (media.pluginType) {
					case 'flash':
					case 'silverlight':
						media.setFullscreen(goFullScreen);
						break;
					case 'native':

						if (mejs.MediaFeatures.hasNativeFullScreen) {								
							if (goFullScreen) {
								media.webkitEnterFullScreen();
							} else {
								media.webkitExitFullScreen();
							}							
						} else {			
							if (goFullScreen) {

								// store
								normalHeight = player.$media.height();
								normalWidth = player.$media.width();

								// make full size
								container
									.addClass('mejs-container-fullscreen')
									.width('100%')
									.height('100%')
									.css('z-index', 1000);

								player.$media
									.width('100%')
									.height('100%');
									

								layers.children('div')
									.width('100%')
									.height('100%');						
								
								fullscreenBtn
									.removeClass('mejs-fullscreen')
									.addClass('mejs-unfullscreen');

								player.setControlsSize();
							} else {

								container
									.removeClass('mejs-container-fullscreen')
									.width(normalWidth)
									.height(normalHeight)
									.css('z-index', 1);
									
								player.$media
									.width(normalWidth)
									.height(normalHeight);

								layers.children('div')
									.width(normalWidth)
									.height(normalHeight);						
									
								fullscreenBtn
									.removeClass('mejs-unfullscreen')
									.addClass('mejs-fullscreen');

								player.setControlsSize();
							}
						}
				}								
				isFullScreen = goFullScreen;
			};
		
		$(document).bind('keydown',function (e) {
			if (isFullScreen && e.keyCode == 27) {
				setFullScreen(false);
			}
		});
		
	}


})(jQuery);
(function($) {
	
	// add extra default options 
	$.extend(mejs.MepDefaults, {
		// this will automatically turn on a <track>
		startLanguage: '',
		// a list of languages to auto-translate via Google
		translations: [],
		// a dropdownlist of automatic translations
		translationSelector: false,	
		// key for tranlsations
		googleApiKey: ''
	});
	
	$.extend(MediaElementPlayer.prototype, {
		
		buildtracks: function(player, controls, layers, media) {	
			if (!player.isVideo)
				return;
				
			if (player.tracks.length == 0)
				return;
				
			var i, options = '';
		
			player.chapters = 
					$('<div class="mejs-chapters mejs-layer"></div>')
						.prependTo(layers).hide();
			player.captions = 
					$('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position"><span class="mejs-captions-text"></span></div></div>')
						.prependTo(layers).hide();
			player.captionsText = player.captions.find('.mejs-captions-text');
			player.captionsButton = 
					$('<div class="mejs-button mejs-captions-button">'+
						'<span></span>'+
						'<div class="mejs-captions-selector">'+
							'<ul>'+
								'<li>'+
									'<input type="radio" name="' + player.id + '_captions" id="' + player.id + '_captions_none" value="none" checked="checked" />' +
									'<label for="' + player.id + '_captions_none">None</label>'+										
								'</li>'	+
							'</ul>'+
						'</div>'+							
					'</div>')
						.appendTo(controls)
						// handle clicks to the language radio buttons
						.delegate('input[type=radio]','click',function() {				
							lang = this.value;	
							
							if (lang == 'none') {
								player.selectedTrack = null;
							} else {				
								for (i=0; i<player.tracks.length; i++) {
									if (player.tracks[i].srclang == lang) {
										player.selectedTrack = player.tracks[i];
										player.captions.attr('lang', player.selectedTrack.srclang);
										player.displayCaptions();
										break;
									}
								}	
							}
						});
						//.bind('mouseenter', function() {
						//	player.captionsButton.find('.mejs-captions-selector').css('visibility','visible')						
						//});
						
			player.trackToLoad = -1;
			player.selectedTrack = null;
			player.isLoadingTrack = false;
				
			// add user-defined translations
			if (player.tracks.length > 0 && player.options.translations.length > 0) {
				for (i=0; i<player.options.translations.length; i++) {
					player.tracks.push({
						srclang: player.options.translations[i].toLowerCase(),
						src: null,
						kind: 'subtitles', 
						entries: [],
						isLoaded: false,
						isTranslation: true
					});
				}				
			}
			
			// add to list
			for (i=0; i<player.tracks.length; i++) {
				if (player.tracks[i].kind == 'subtitles') {
					player.addTrackButton(player.tracks[i].srclang, player.tracks[i].isTranslation);	
				}
			}
			
			player.loadNextTrack();	


			media.addEventListener('timeupdate',function(e) {
				player.displayCaptions();
			}, false);
			
			media.addEventListener('loadedmetadata', function(e) {
				player.displayChapters();
			}, false);

			player.container.hover(
				function () {
					// chapters
					player.chapters.css('visibility','visible');						
					player.chapters.fadeIn(200);
				},
				function () {
					if (!media.paused) {
						player.chapters.fadeOut(200, function() {
							$(this).css('visibility','hidden');
							$(this).css('display','block');
						});												
					}
				});

			// auto selector
			if (player.options.translationSelector) {				
				for (i in mejs.language.codes) {
					options += '<option value="' + i + '">' + mejs.language.codes[i] + '</option>';
				}
				player.container.find('.mejs-captions-selector ul').before($(					
					'<select class="mejs-captions-translations">' +
						'<option value="">--Add Translation--</option>' +
						options +
					'</select>'
				));
				// add clicks
				player.container.find('.mejs-captions-translations').change(function() {
					var
						option = $(this);
						lang = option.val();
					// add this language to the tracks list
					if (lang != '') {
						player.tracks.push({
							srclang: lang,
							src: null,
							entries: [],
							isLoaded: false,
							isTranslation: true
						});	
						
						if (!player.isLoadingTrack) {
							player.trackToLoad--;
							player.addTrackButton(lang,true);
							player.options.startLanguage = lang;
							player.loadNextTrack();							
						}
					}
				});
			}				
			
		},
	
		loadNextTrack: function() {
			var t = this;
			
			t.trackToLoad++;
			if (t.trackToLoad < t.tracks.length) {
				t.isLoadingTrack = true;
				t.loadTrack(t.trackToLoad);
			} else {
				// add done?
				t.isLoadingTrack = false;				
			}
		},

		loadTrack: function(index){
			var
				t = this,
				track = t.tracks[index],
				after = function() {
					
					track.isLoaded = true;
						
					// create button
					//t.addTrackButton(track.srclang);
					t.enableTrackButton(track.srclang);					
					
					t.loadNextTrack();
				
				};
				
			if (track.isTranslation) {
			
				// translate the first track
				mejs.SrtParser.translateSrt(t.tracks[0].entries, t.tracks[0].srclang, track.srclang, t.options.googleApiKey, function(newOne) {								
					
					// store the new translation
					track.entries = newOne;
					
					after();
				});
				
			} else {
				$.ajax({
					url: track.src,
					success: function(d) {
						
						// parse the loaded file
						track.entries = mejs.SrtParser.parse(d);						
						after();
						
						if (track.kind == 'chapters' && t.media.duration > 0) {
							t.drawChapters(track);
						}
					},
					error: function() {
						t.loadNextTrack();								
					}
				});
			}
		},
		
		enableTrackButton: function(lang) {
			var t = this;
			
			t.captionsButton
				.find('input[value=' + lang + ']')
					.attr('disabled','')
				.siblings('label')
					.html( mejs.language.codes[lang] || lang );

			// auto select
			if (t.options.startLanguage == lang) {
				$('#' + t.id + '_captions_' + lang).click();
			}					
					
			t.adjustLanguageBox();
		},
		
		addTrackButton: function(lang, isTranslation) {
			var t = this,
				l = mejs.language.codes[lang] || lang;
			
			t.captionsButton.find('ul').append(
				$('<li>'+
					'<input type="radio" name="' + t.id + '_captions" id="' + t.id + '_captions_' + lang + '" value="' + lang + '" disabled="disabled" />' +
					'<label for="' + t.id + '_captions_' + lang + '">' + l + ((isTranslation) ? ' (translating)' : ' (loading)') + '</label>'+										
				'</li>')
			);
			
			t.adjustLanguageBox();
			
			// remove this from the dropdownlist (if it exists)
			t.container.find('.mejs-captions-translations option[value=' + lang + ']').remove();
		},	

		adjustLanguageBox:function() {
			var t = this;
			// adjust the size of the outer box
			t.captionsButton.find('.mejs-captions-selector').height(
				t.captionsButton.find('.mejs-captions-selector ul').outerHeight(true) +
				t.captionsButton.find('.mejs-captions-translations').outerHeight(true)
			);		
		},
		
		displayCaptions: function() {
			
			if (typeof this.tracks == 'undefined')
				return;
		
			var
				t = this,
				i,
				track = t.selectedTrack;
			
			if (track != null && track.isLoaded) {
				for (i=0; i<track.entries.times.length; i++) {
					if (t.media.currentTime >= track.entries.times[i].start && t.media.currentTime <= track.entries.times[i].stop){						
						t.captionsText.html(track.entries.text[i]);
						t.captions.show();
						return; // exit out if one is visible;
					}
				}
				t.captions.hide();
			} else {
				t.captions.hide();
			}
		},
		
		displayChapters: function() {
			var 
				t = this,
				i;
			
			for (i=0; i<t.tracks.length; i++) {
				if (t.tracks[i].kind == 'chapters' && t.tracks[i].isLoaded) {
					t.drawChapters(t.tracks[i]);
					break;
				}
			}
		},
		
		drawChapters: function(chapters) {			
			var 
				t = this,
				i,
				dur,
				//width,
				//left,
				percent = 0,
				usedPercent = 0;
			
			t.chapters.empty();
			
			for (i=0; i<chapters.entries.times.length; i++) {
				dur = chapters.entries.times[i].stop - chapters.entries.times[i].start;
				percent = Math.floor(dur / t.media.duration * 100);
				if (percent + usedPercent > 100 || // too large
					i == chapters.entries.times.length-1 && percent + usedPercent < 100) // not going to fill it in
					{
					percent = 100 - usedPercent;
				}
				//width = Math.floor(t.width * dur / t.media.duration);
				//left = Math.floor(t.width * chapters.entries.times[i].start / t.media.duration);
				//if (left + width > t.width) {
				//	width = t.width - left;
				//}
				
				t.chapters.append( $(
					'<div class="mejs-chapter" rel="' + chapters.entries.times[i].start + '" style="left: ' + usedPercent.toString() + '%;width: ' + percent.toString() + '%;">' + 
						'<div class="mejs-chapter-block' + ((i==chapters.entries.times.length-1) ? ' mejs-chapter-block-last' : '') + '">' + 
							'<span class="ch-title">' + chapters.entries.text[i] + '</span>' + 
							'<span class="ch-time">' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].start) + '&ndash;' + mejs.Utility.secondsToTimeCode(chapters.entries.times[i].stop) + '</span>' + 
						'</div>' +
					'</div>'));
				usedPercent += percent;
			}
			
			t.chapters.find('div.mejs-chapter').click(function() {
				t.media.setCurrentTime( parseFloat( $(this).attr('rel') ) );
				if (t.media.paused) {
					t.media.play(); 
				}
			});
			
			t.chapters.show();
		}
	});
	
	
	
	mejs.language = {
		codes:  {
			af:'Afrikaans',
			sq:'Albanian',
			ar:'Arabic',
			be:'Belarusian',
			bg:'Bulgarian',
			ca:'Catalan',
			zh:'Chinese',
			'zh-cn':'Chinese Simplified',
			'zh-tw':'Chinese Traditional',
			hr:'Croatian',
			cs:'Czech',
			da:'Danish',
			nl:'Dutch',
			en:'English',
			et:'Estonian',
			tl:'Filipino',
			fi:'Finnish',
			fr:'French',
			gl:'Galician',
			de:'German',
			el:'Greek',
			ht:'Haitian Creole',
			iw:'Hebrew',
			hi:'Hindi',
			hu:'Hungarian',
			is:'Icelandic',
			id:'Indonesian',
			ga:'Irish',
			it:'Italian',
			ja:'Japanese',
			ko:'Korean',
			lv:'Latvian',
			lt:'Lithuanian',
			mk:'Macedonian',
			ms:'Malay',
			mt:'Maltese',
			no:'Norwegian',
			fa:'Persian',
			pl:'Polish',
			pt:'Portuguese',
			//'pt-pt':'Portuguese (Portugal)',
			ro:'Romanian',
			ru:'Russian',
			sr:'Serbian',
			sk:'Slovak',
			sl:'Slovenian',
			es:'Spanish',
			sw:'Swahili',
			sv:'Swedish',
			tl:'Tagalog',
			th:'Thai',
			tr:'Turkish',
			uk:'Ukrainian',
			vi:'Vietnamese',
			cy:'Welsh',
			yi:'Yiddish'
		}
	};	
	
	/*
	Parses SRT format which should be formatted as
	1
	00:00:01,1 --> 00:00:05,000
	A line of text

	2
	00:01:15,1 --> 00:02:05,000
	A second line of text

	Adapted from: http://www.delphiki.com/html5/playr
	*/
	mejs.SrtParser = {	
		pattern_identifier: /^[0-9]+$/,
		pattern_timecode: /^([0-9]{2}:[0-9]{2}:[0-9]{2}(,[0-9]{1,3})?) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}(,[0-9]{3})?)(.*)$/,		
		timecodeToSeconds: function(timecode){
			var tab = timecode.split(':');
			return tab[0]*60*60 + tab[1]*60 + parseFloat(tab[2].replace(',','.'));
		},
		split2: function (text, regex) {
			// normal version for compliant browsers
			// see below for IE fix
			return text.split(regex);
		},		
		parse: function(srtText) {
			var 	
				i = 0,
				lines = this.split2(srtText, /\r?\n/),
				entries = {text:[], times:[]},
				timecode,
				text;
				
			for(; i<lines.length; i++) {
				// check for the line number
				if (this.pattern_identifier.exec(lines[i])){
					// skip to the next line where the start --> end time code should be
					i++;
					timecode = this.pattern_timecode.exec(lines[i]);
					if (timecode && i<lines.length){
						i++;
						// grab all the (possibly multi-line) text that follows
						text = lines[i];
						i++;
						while(lines[i] !== '' && i<lines.length){
							text = text + '\n' + lines[i];
							i++;
						}					
						
						// Text is in a different array so I can use .join
						entries.text.push(text);
						entries.times.push(
						{
							start: this.timecodeToSeconds(timecode[1]),
							stop: this.timecodeToSeconds(timecode[3]),
							settings: timecode[5]
						});
					}
				}
			}
			
			return entries;		
		},
		
		translateSrt: function(srtData, fromLang, toLang, googleApiKey, callback) {
			
			var 				
				entries = {text:[], times:[]},
				lines,
				i			
			
			this.translateText( srtData.text.join(' <a></a>'), fromLang, toLang, googleApiKey, function(result) {
				// split on separators
				lines = result.split('<a></a>');
				
				// create new entries
				for (i=0;i<srtData.text.length; i++) {
					// add translated line
					entries.text[i] = lines[i];
					// copy existing times
					entries.times[i] = {
						start: srtData.times[i].start,
						stop: srtData.times[i].stop,
						settings: srtData.times[i].settings
					};
				}
				
				callback(entries);			
			});
		},
		
		translateText: function(text, fromLang, toLang, googleApiKey, callback) {
		
			var
				separatorIndex,
				chunks = [],
				chunk,
				maxlength = 1000,
				result = '',
				nextChunk= function() {
					if (chunks.length > 0) {
						chunk = chunks.shift();
						mejs.SrtParser.translateChunk(chunk, fromLang, toLang, googleApiKey, function(r) {
							if (r != 'undefined') {
								result += r;
							}
							nextChunk();
						});
					} else {
						callback(result);
					}
				};
			
			// split into chunks
			while (text.length > 0) {
				if (text.length > maxlength) {
					separatorIndex = text.lastIndexOf('.', maxlength);
					chunks.push(text.substring(0, separatorIndex));
					text = text.substring(separatorIndex+1);
				} else {
					chunks.push(text);
					text = '';
				}				
			}
			
			// start handling the chunks
			nextChunk();			
		},
		translateChunk: function(text, fromLang, toLang, googleApiKey, callback) {
			
			var data = {
				q: text, 
				langpair: fromLang + '|' + toLang,
				v: '1.0'
			};
			if (googleApiKey !== '' && googleApiKey !== null) {
				data.key = googleApiKey;
			}
			
			$.ajax({
				url: 'https://ajax.googleapis.com/ajax/services/language/translate', // 'https://www.google.com/uds/Gtranslate', //'https://ajax.googleapis.com/ajax/services/language/translate', //
				data: data,
				type: 'GET',
				dataType: 'jsonp',
				success: function(d) {
					callback(d.responseData.translatedText);						
				},
				error: function(e) {
					callback(null);
				}
			});			
		}
	};	
	// test for browsers with bad String.split method.
	if ('x\n\ny'.split(/\n/gi).length != 3) {
		// add super slow IE8 and below version
		mejs.SrtParser.split2 = function(text, regex) {			
			var 
				parts = [], 
				chunk = '',
				i;
			
			for (i=0; i<text.length; i++) {
				chunk += text.substring(i,i+1);
				if (regex.test(chunk)) {					
					parts.push(chunk.replace(regex, ''));
					chunk = '';
				}
			}
			parts.push(chunk);
			return parts;
		}
	}
	
	
})(jQuery);
