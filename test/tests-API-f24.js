
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
	expect(2);
	var testee2 = new Joshlib.Menu();
	//equals(testee2.index,{},'index d\'origine');
	equals(testee2.currentPath,'/','chemin d\'origine');

	
	testee2.setRootData('babebibobu-2');
	equals(testee2.data,'babebibobu-2','setRootData');

	testee2.setData('leaf','babebibobu-3');
	equals(testee2.data,'babebibobu-3','setData leaf');
	equals(testee2.index['/'],11,'setData index');
	
	
console.log(testee2);
})  


/*
test('Construction de l\'arbre',function(){
  expect(2);
	var testee = Joshlib();
console.log(typeof testee);
console.log(typeof window.Joshlib);
	equals(testee.currentPath,'/','Ok, on a une racine en prime chemin');
	equals(testee.index,{},'avec une arborescence vide');
	testee.setRootData(true);
	testee.index['/'][0]=0;
})

/*
test('Construction de l\'arbre',function(){
  expect(2);
	var testee = J.Menu();
	equals(testee.currentPath,'/','Ok, on a une racine en prime chemin');
	equals(testee.index,{},'avec une arborescence vide');
	
})

*/