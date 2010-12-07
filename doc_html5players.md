h1. Notes

La googletv est capable de jouer des videos au format 720p et 1080p en 1280x720 (HD720) ou 1920x1080 (HD1080)

h2. Liste de player

# "sublimevideo":http://sublimevideo.net/ encore en béta. Les créateurs veulent en faire un produit payant. (je me suis inscrit sur leur béta.)
# "mooplay":http://mooplay.challet.eu player html5 de Clément Hallet, il n'y a pas de fallback en flash.
# "videojs":http://videojs.com/ utilise FlowPlayer comme player flash en cas de fallback, des transitions dans le css.
# "jw-player":http://www.longtailvideo.com/support/jw-player/jw-player-for-html5 encore en beta, plein d'images... (le css est intégralement dans le JS); code de très mauvaise qualité utilisant jQuery et surtout j'ai vu dans le code une méthode addEventListener... je ne sais pas si ils savent que addEventListener existe déjà en JS...
# "dailymotion":http://www.dailymotion.com/openvideodemo Je n'arrive pas à faire fonctionner leur demo, où est la video?
# "flarevideo":http://flarevideo.com/ pas trop mal, mais le projet semble beaucoup moins abouti que "projekktor"
# "projekktor":http://www.projekktor.com utilise "jaris":http://jaris.sourceforge.net/ comme player flash pour le fallback. Le code sour ce est de bonne qualité. API JS avec une doc.  Déja un certain nombre de thème. Pour l'instant mon number One. Il n'y a pas de controle au clavier, mais grace à son API, je ne vois pas de prob. Le dernier poste sur le blog du créateur est assez explicte : lui aussi est sur la GoogleTV : "Son blog":http://www.projekktor.com/blog/
Il a même un commentaire de Paul Graham sur son site ;) Pour l'instant c'est le seul player qui envoie des evenements...
# "html5media":https://github.com/etianen/html5media utilise FlowPlayer comme fallback, pas d'api JS
# "jMediaelement":https://github.com/aFarkas/jMediaelement/wiki/ utilise JW Player comme fallback, une petite api (pas assez à mon avis), utilise jQuery
# "oiplayer":http://www.openbeelden.nl/oiplayer/ utilise FlowPlayer comme fallback, une petite API JS. Basé sur Jquery
# "hvideo":https://github.com/rsms/html5-video/ pas de fallback flash
# "jquery-video":https://github.com/azatoth/jquery-video pas de fallback flash
# "video_for_everybody":http://camendesign.com/code/video_for_everybody fallback avec JW Player, pas d'API JS
# "Open Video Player":http://www.akamai.com/HTML5 fallback avec leur player maison, basé sur Jquery, presque pas de doc, pas vraiement d'API JS
# "HTML5 video player":http://unholyknight.com/html5_video/ pas de fallback je passe au suivant!
# "mediaelement.js":http://mediaelementjs.com/ basé sur Jquery, fallback en flash avec un player à leur sauce, pas vraiement d'api JS
# "Uppos.HTML5":http://html5player.ru/ pas de fallback en flash
# "LeanBack":http://dev.mennerich.name/showroom/html5_video/ fallback avec JW Player, pas d'api js
# "osmplayer":http://www.mediafront.org/project/osmplayer fallback en flash, jquery, pas d'api.

h1. Conclusion

Personnellement, je pencherai vers "projekktor" à cause de l'API JS et du fait que le player envoie pas mal d'événement, ce qui va être très utile.

Malheureusement, projekktor ne fonctionne pas avec le GoogleTV (testé le 10 Nov. 2010)
