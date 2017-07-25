var camera, scene, renderer, controls, gui;
var angle = 0;
var clock = new THREE.Clock();
var time;

var box, occlusionBox, oblivSphere, sun;


const DEFAULT_LAYER = 0, 
OCCLUSION_LAYER = 1;

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
		renderer.setClearColor(0xededed);
		container.appendChild( renderer.domElement );
		
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set(0, 0, 50);
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.rotateSpeed = 2.0;
		controls.panSpeed = 0.8;
		controls.zoomSpeed = 1.5;

		scene = new THREE.Scene();

		var directionalLight = new THREE.DirectionalLight(0xffffff, .7);
		directionalLight.position.set(1, -1, 0).normalize();
		directionalLight.castShadow = true;
		var ambientLight = new THREE.AmbientLight(0xffffff);
		var pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(0, 0, 0);

		scene.add(ambientLight);
		scene.add(directionalLight);
		scene.add(pointLight);

		sun = new Sun();
		sun.mesh.layers.set(OCCLUSION_LAYER);
		scene.add(sun.mesh);

		// the box in the scene that rotatates around the light
	    var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
	    var material = new THREE.MeshPhongMaterial( { color: 0x111111 } );
	    box = new THREE.Mesh( geometry, material );
	    box.position.z = 2;
	    // scene.add( box );
	    
	    // the all black second box that is used to create the occlusion 
	    var material = new THREE.MeshBasicMaterial( { color:0x111111 } );
	    occlusionBox = new THREE.Mesh( geometry, material);
	    occlusionBox.position.z = 2;
	    occlusionBox.layers.set( OCCLUSION_LAYER );
	    scene.add( occlusionBox );

	    oblivSphere = new OblivionSphere();
	    oblivSphere.mesh.layers.set(OCCLUSION_LAYER);
	    scene.add(oblivSphere.mesh);
	    setUpVolumetericProcessing();

		window.addEventListener('resize', resize);
	}

	function update(){
		camera.lookAt(scene.position);
		controls.update();
	}

	function animate(){
		update();
	 	camera.layers.set(OCCLUSION_LAYER);
	    renderer.setClearColor(0xededed);
	    occlusionComposer.render();
	    
	    camera.layers.set(DEFAULT_LAYER);
	    renderer.setClearColor(0x111111);
	    composer.render();
		window.requestAnimationFrame(animate);
	}

	init();
	animate();


