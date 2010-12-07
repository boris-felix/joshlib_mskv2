h1. Intro

Certains sites regardent le *User-Agent* du client pour rediriger vers une version de leur site optimisée pour celui-ci.
Il est possible sous Safari de modifier son User-Agent: Develop -> User Agent -> Other...

h2. liste de User-Agent

* Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.127 Large Screen Safari/533.4 GoogleTV/162671
* Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.127 Large Screen Safari/533.4 GoogleTV/b39953

h1. Google TV Sites

h3. Liste des sites optimisés pour GoogleTV avec la techno utilisé

# "CNN":http://edition.cnn.com/xl/ Techno: *Jquery* + *player en flash* _le player ne fonctionne pas_
# "youtube leanback":http://www.youtube.com/leanback Techno: *flash*
# "crackle":http://www.crackle.com/gtv Techno: *Jquery* + *player en flash*
# "adultswim":http://www.adultswim.com/leanback/ Techno: *flash*, clone de youtube leanback
# "blip":http://blip.tv/?skin=googletv Techno: *html5* (usage du tag video) + *jquery* Il y a du code spécific pour safari mobile mais le rendu sur l'ipad et l'iphone est très mauvais.
# "Amazon VOD":http://www.amazon.com/b/?&node=16261631 _je ne vois pas la version GoogleTV_
# "Cartoon Network":http://www.cartoonnetwork.com/leanback/ Techno: *flash* copie du leanback de youtube
# "Chow TV":http://www.chow.com/videos?tag=main_content Techno: *css3* (un peu de keyframes et de transitions), *html5*, *jquery*, *player en flash*
# "Clicker":http://tv.clicker.com/ Techno: *jquery*, *player en flash*
# "Cnet TV":http://cnettv.cnet.com/ Techno: *Mootools*, *player en flash*
# "Daily motion":http://iptv-app.dailymotion.com/dm-front-googletv/dojoroot/app/pages/webkit/index.jsp?&lang=us Techno: *Dojo*, player en *html5* (player de chez "wiztivi":http://www.wiztivi.com/)
# "hbogo":http://www.hbogo.com -> pas d'accès hors USA
# "kqed.tv":http://kqed.tv/ Techno: *jquery*, *player en flash* -> tout le contenu de navigation est au dessus du player flash
# "flixster":http://www.flixster.com/tv/google Techno: *prototype* + *scriptaculous* + *modernizr* + *player en flash*
# "meegenius":http://www.meegenius.com/index-horizontal.xhtml Techno: mixte entre de l'*xhtml* et de l'*html5* + *jquery* -> Il n'y a pas de videos sur ce site -> livres pour enfant avec narration audio
# "fraboom":http://fraboom.com/google/tv/ Techno:*Flash*
# "mspot":http://www.mspot.com/ -> pas d'accès hors USA
# "net-a-porter":http://www.net-a-porter.com/tv Techno:*flash*
# "tbs":http://www.tbs.com/leanback Techno: *jquery* + *player en flash*
# "NY Times":http://www.nytimes.com/gtv/ Techno: *jquery* + *player en html5*
# "The Onion":http://www.theonion.com/video/googletv/ Techno: *jquery* + *player en html5*
# "Tnt Tv":http://www.tnt.tv/leanback/ Techno: *jquery*, *player en flash*
# "pbskids":http://pbskids.org/video/ Techno: *jquery* + *yui* + *flash*
# "sidereel":http://beta.sidereel.com/living_room/tv_shows Techno: *jquery* (je ne vois aucun player video!)
# "tunein":http://tv.tunein.com/ Techno: *jquery* -> pas de player video, il n'y a que de l'audio
# "usatoday":http://itv.usatoday.com/ Techno: *html5*, *jquery* -> pas de video, que du texte
# "vevo.com":http://vevo.com  -> pas d'accès hors USA ou Canada
# "vimeo":http://www.vimeo.com/couchmode Techno: *html5*, *swfobject*, *jquery*, *player en html5 avec fallback en flash* -> code de qualité

h3. Bonnes idées desquelles s'inspirer

 * TODO

h3. Mauvaises idées à éviter

 * TODO

h3. Stats techno

* 14% -> pas d'accès
* 8%  -> sont en *full flash*
* 57% -> utilise *jquery*
* 35% -> utilise un *player en flash*
* 18% -> utilise un *player en html5*
* 3,5% -> utilise *prototype/scriptaculous* ou *Dojo* ou *Mootools*

h2. FrameWork HTML5/JS

Il existe un "tableau":http://en.wikipedia.org/wiki/Comparison_of_JavaScript_frameworks (incomplet) sur wikipedia comparant les différents framework JS.

# "SenchTouch":http://sencha.com (*1.0 RC1* [9 nov. 2010], 343K) Framework dédié pour *les devices mobiles à base de webkit*.
** *Point fort*: beaucoup de widgets classics déjà implémentés (nestedlists, carousel, dnd, overlays,...)
** *Point faible*: il faut acheter une license pour vendre le code.
# "ExtJS":http://sencha.com (*3.3.0*, 662K) Framework dédié à la création de RIA de type informatique de gestion.
** *Point fort*: enormément de widgets de haut niveau et d'extention en tout genre. (cf. "mpa.42loops.com":http://mpa.42loops.com, "demos":http://dev.sencha.com/deploy/dev/examples/)
** *Point faible*: 
*** Il faut acheter une license pour vendre le code.
*** Les widgets ont un look&feel très "windows" même si il est possible de les thémiser.
*** Framework volumineux
# "Dojo":http://www.dojotoolkit.org (*1.5.0* 90K [pour le core]) Le core apporte des fonctionnalités de bas niveau: classe, DOM query, events, effects, ajax... Il existe *Djit*: un ensemble de widgets au  dessus de Dojo.
# "SproutCore":http://www.sproutcore.com/ (*1.4*) MVC en javascript utilisé pour MobileMe. Projet prometteur.
** *Point faible*
*** La documentation est aujourd'hui assez restreinte.
** *Point fort*
*** logique MVC, depuis peu "Yehuda Katz":http://yehudakatz.com/ est rentré dans l'équipe de dev. Inclusion de Jquery
# "Jquery":http://jquery.com (*1.4.3*) C'est la librairie standard du web. Utilisée partout même sur le nouveau twitter. Cette librairie est incontournable si le projet doit être cross-browser. Un grand nombre de widgets est inclus dans "Jquery UI":http://docs.jquery.com/UI
# "MooTools":http://mootools.net/ (*1.3*) 
# "YUI":http://developer.yahoo.com/yui (*3.2.0*) ExtJs est un fork de YUI. Il exsite comme chez ExtJS une multitude de widgets.
# "Prototype":http://www.prototypejs.org / "Scriptaculous":http://script.aculo.us/ (proto *1.6.1* [11/09/2009]{la version 1.7 compatible pour IE9 arrive bientot} script. *1.8.3* [8/10/2009])
# "Scripty2":http://scripty2.com/ encore en beta, c'est une réimplementation de Scriptaculous par le même auteur (Thomas Fuchs) utilisant prototype 1.7 Ce qui est intéressant c'est les animations accélérées matériellement. "demos":http://scripty2.com/demos/cards/
# "Zepto":http://zeptojs.com/ une librairie à la jquery like aussi par Thomas Fuchs visant les navigateurs mobiles à base de webkit.
Thomas a commencé à faire cette lib il y a deux mois.
# "Sammy.js":http://code.quirkey.com/sammy/index.html framework construit sur Jquery à la Sinatra (résolution de 'routes') essayant 
de donner plus de structure à une web-app.
# "qooxdoo":http://qooxdoo.org/ Framework pour créer des RIA ayant pas mal de widgets (moins que ExtJS)
# "unify":http://unify.github.com/unify/ Framework dont le but est d'unifier le monde du mobile et le monde desktop,il se base sur qooxdoo, phonegap, sass et adobe air
# "cappuccino":http://cappuccino.org/ Framework pour RIA (implémentation web de Cocoa) avec le language Objective-J. Demo la plus connue est "280Slides":http://280slides.com/ (Clone de keynote)
# "vapor.js":http://vaporjs.com/ C'était le buzz de la jsconf.eu de septembre... encore par Thomas Fuchs. Lib de 0 bytes... juste pour le fun ;) _The World's Smallest & Fastest JavaScript Library_