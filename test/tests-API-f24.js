
// documentation on writing tests here: http://docs.jquery.com/QUnit


module("example tests");

test('Installation Joshlib',function(){
	expect(3);
	equals(typeof window.Joshlib,'function','Joshlib() déclaré');
	var testee1 = new Joshlib;
	equals(typeof testee1,'object','Joshlib() instantié');
	var testee2 = new Joshlib.Menu();
	equals(typeof testee2,'object','Joshlib.Menu() instantié');
	
})  

test('Construction de l\'arbre',function(){
	expect(10);
	var testee2 = new Joshlib.Menu();
	//equals(testee2.index,{},'index d\'origine');
	equals(testee2.currentPath,'/','chemin d\'origine');

	
	testee2.setRootData('babebibobu-2');
	equals(testee2.data,'babebibobu-2','setRootData');

	testee2.setData('leaf','babebibobu-3');
	equals(testee2.data,'babebibobu-3','setData leaf');
	equals(testee2.index['/'],{'undefined':11},'setData index');
	
	
	testee2.goTo('leaf');
	equals(testee2.currentPath,'leaf','repositionnement absolu');
	
	testee2.setData('bourgeon1','b-1');
	testee2.setData('bourgeon2','b-2');
	testee2.setData('bourgeon3','b-3');


	testee2.goParent();
	equals(testee2.currentPath,'/','repositionnement relatif parent');
	
	testee2.goTo('leaf/bourgeon1');
	equals(testee2.currentPath,'leaf/bourgeon1','repositionnement relatif de deux niveaux');
	testee2.goNext();
	equals(testee2.currentPath,'leaf/bourgeon2','repositionnement relatif suivant');
	testee2.goPrev();
	equals(testee2.currentPath,'leaf/bourgeon1','repositionnement relatif précédent');

	testee2.setData('kiddie','c-1');
	testee2.goChildren();
	equals(testee2.currentPath,'leaf/bourgeon1/kiddie','repositionnement relatif enfant');
	


})  
