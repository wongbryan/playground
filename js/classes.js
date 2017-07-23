function ParticleObject(geometry, materials){
	var s = .003;

	var numParticles = 10000;
	var pointGeom = new THREE.Geometry();
	var vertices = THREE.GeometryUtils.randomPointsInGeometry(geometry, numParticles);
	for (var i=0; i<vertices.length; i++){
		pointGeom.vertices.push(vertices[i]);
	}

	var particleMaterial = new THREE.PointsMaterial({
		color: 0xffffff,
		size: .01 ,
		// morphTargets: true
		// needsUpdate: true
	});

	var mesh = new THREE.Points(pointGeom, particleMaterial);
	mesh.position.set(0, 0, 0);
	mesh.scale.set(s, s, s);

	mesh.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );
	mesh.matrixAutoUpdate = false;
	mesh.updateMatrix();
	mesh.geometry.verticesNeedUpdate = true;

	// scene.add( monster );
	// scene.add(particleSystem);
	// mixer.clipAction( geometry.animations[ 0 ], particleSystem )
	// 		.setDuration( 5 )			// one second
	// 		.startAt( - Math.random() )	// random phase (already running)
	// 		.play();					// let's go

	var _this = this;
	this.mesh = mesh;
	this.direction = 0;
	this.up = 1;
	this.down = -1;
	this.speed = 1000;
	this.delay = Math.floor(200 + 200 * Math.random());
	this.start = 100;
	this.started = false;
	this.disintegrate = false;

	this.collapse = function(){
		_this.disintegrate = true;
	}

	this.update = function(){
		if (!_this.disintegrate)
			return;
		var delta = 10 * clock.getDelta();
		delta = delta < 2 ? delta : 2;

		var vertices = _this.mesh.geometry.vertices;
		var p;
		if (!_this.started){
			_this.direction = -1;
			_this.started = true;
		}

		for (var i=0; i<vertices.length; i++){
			p = vertices[i];
			if (_this.direction < 0){
				if (p.y > -200){
					p.x += 1.5 * ( 0.50 - Math.random() ) * _this.speed * delta * i/10000;
					p.y += 3.0 * ( 0.25 - Math.random() ) * _this.speed * delta * i/10000;
					p.z += 1.5 * ( 0.50 - Math.random() ) * _this.speed * delta * i/10000;
				}
			} 
		}
		_this.mesh.geometry.verticesNeedUpdate = true;
	}
}