var camera, scene, renderer, controls, gui;
var mouse = {x: 0, y: 0};
var clock = new THREE.Clock();
var test;
var shaderGeom;

function resize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function init() {
		var container = document.getElementById( 'container' );
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCSoftShadowMap;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight);
		container.appendChild( renderer.domElement );
		
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set(4, 8, 10);
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.rotateSpeed = 2.0;
		controls.panSpeed = 0.8;
		controls.zoomSpeed = 1.5;

		scene = new THREE.Scene();

		var directionalLight = new THREE.DirectionalLight(0xffffff, .7);
		directionalLight.position.set(1, -1, 0).normalize();
		directionalLight.castShadow = true;
		var ambientLight = new THREE.AmbientLight(0xffffff);
		
		scene.add(ambientLight);
		scene.add(directionalLight);

		var noiseTex = new THREE.TextureLoader().load("assets/rgb texture.png");
		var yellowGradient = new THREE.TextureLoader().load("assets/yellow-gradient.png");
		noiseTex.wrapT = noiseTex.wrapS = THREE.RepeatWrapping;
		var zoomDivider = 12;
		shaderMat = new THREE.ShaderMaterial( {
			transparent: true,
			wireframe: true,
			//shading: THREE.FlatShading,
			wireframe: true,
			uniforms: {
				"uTime" : { type: "f", value: 0.0 },
				"tPerlin" : { type: "t", value: noiseTex },
				"tYellow" : { type: "t", value: yellowGradient},
				"fSpeed" : { type: "f", value: 2000.},
			},
			depthTest: false,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		} );

		shaderGeom = new THREE.CylinderBufferGeometry(.1, .1, 10, 256, 256);
		// shaderGeomTest = new THREE.Geometry();
		// for (var i=0; i<test.children.length; i++){
		// 	var vertices = test.children[i].geometry.vertices;
		// 	for (var j=0; j<vertices.length; j++){
		// 		shaderGeomTest.vertices.push(vertices[j]);
		// 	}
		// }

		lightning = new THREE.Mesh(shaderGeom, shaderMat);
		// lightning.scale.set(2, 2, 2);
		scene.add(lightning);

		window.addEventListener('resize', resize);
	}

	function update(){
		shaderMat.uniforms["uTime"].value += clock.getDelta() * .0005;
		camera.lookAt(scene.position);
		controls.update();
	}
	function animate(){
		update();
		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}
	init();
	animate();


