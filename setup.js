var camera, scene, renderer, controls;
var mouse = {x: 0, y: 0};

var startTime = new Date().getTime();
var buffer = 100;
var time;
var nextUpdate = buffer;

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

		var noiseTex = THREE.ImageUtils.loadTexture("assets/rgb texture.png");
		noiseTex.wrapT = noiseTex.wrapS = THREE.RepeatWrapping;
		var zoomDivider = 12;
		shaderMat = new THREE.ShaderMaterial( {
			transparent: true,
			wireframe: true,
			//shading: THREE.FlatShading,
			wireframe: true,
			uniforms: {
				"uTime": { type: "f", value: 0.0 },
				"tDiffuse": { type: "t", value: noiseTex },
				"uZoomMultiplyer": { type: "f", value: zoomDivider / (new THREE.Vector3().distanceTo(camera.position)) }
			},
			depthTest: false,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		} );
		var shaderGeom = new THREE.SphereBufferGeometry(1, 256, 256);

		shaderPlane = new THREE.Mesh(shaderGeom, shaderMat);
		shaderPlane.scale.set(5, 5, 5);
		scene.add(shaderPlane);

		window.addEventListener('resize', resize);
	}

	function update(){
		camera.lookAt(scene.position);
		controls.update();
		
		time = new Date().getTime() - startTime;
		shaderMat.uniforms['uTime'].value = time * .000000250;
		if (time>nextUpdate){ //if we passed update point, set new update point 
			nextUpdate = time + buffer;
		}
		
	}
	function animate(){
		update();
		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}
	init();
	animate();


