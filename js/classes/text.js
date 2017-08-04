var TextObj = function(material, string, x, y, z){
	var wordsArray = string.split(" ");
	var wordsObjectArray = [];
	var wordsMeshesArray = [];
	var group = new THREE.Group();

	this.loaded = false;
	var _this = this;

	var materials = [];
	for (var i=0; i<wordsArray.length; i++){ //give each word a separate material
		materials.push(material.clone());
	}	

	var loader = new THREE.FontLoader();
	var start = 0;
	loader.load( '/assets/apex.json', function ( font ) {
		for (var i=0; i<wordsArray.length; i++){
			var geometry = new THREE.TextGeometry( wordsArray[i], {
				font: font,
				size: 2,
				height: .15,
				curveSegments: 12,
				bevelEnabled: false,
				bevelThickness: .2,
				bevelSize: .2,
				bevelSegments: .2
			} );

			// geometry.center();
			geometry.computeBoundingBox();

			var offsetX = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
			var positionX = start+offsetX*(i-.5);
			start += offsetX;
			var text = new SingleWord(geometry, materials[i], positionX, 0, 0);
			wordsObjectArray.push(text);
			wordsMeshesArray.push(text.mesh);
			group.add(text.mesh);
			group.position.set(x, y, z);
			scene.add(group);

			_this.loaded = true;
		}
	} );

	this.wordsMeshes = wordsMeshesArray;
	this.wordsObjects = wordsObjectArray;
	this.mesh = group;

	this.update = function(){
		if (!_this.loaded)
			return;
	}
}

var SingleWord = function(geometry, material, x, y, z){
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	this.mesh = mesh;

	this.highlight = function(){
		var cur = {z : this.mesh.position.z };
		var target = { z : cur.z + 2.5};
		var tween = new TWEEN.Tween(cur).to(target, 1200);

		var _this = this;
		tween.onUpdate(function(){
			_this.mesh.position.z = cur.z;
		});
		tween.easing(TWEEN.Easing.Exponential.Out);
		tween.start();
	}

	this.dim = function(){
		var cur = {z : this.mesh.position.z };
		var target = { z : 0};
		var tween = new TWEEN.Tween(cur).to(target, 1200);

		var _this = this;
		tween.onUpdate(function(){
			_this.mesh.position.z = cur.z;
		});
		tween.easing(TWEEN.Easing.Exponential.Out);
		tween.start();
	}
}







