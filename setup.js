var camera, scene, renderer, controls, gui;
var clock = new THREE.Clock();
var time;

var U, L, T;
var ULT;
var box;

const DEFAULT_LAYER = 0, 
OCCLUSION_LAYER = 1,
OTHER = 2;

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
		camera.position.set(0, 0, 20);
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

		scene.add(ambientLight);
		scene.add(directionalLight);

		var video = document.getElementById('video');

		var texture = new THREE.VideoTexture(video);
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.format = THREE.RGBFormat;

		var geometry = new THREE.BoxGeometry(15, 10, 5);
		box = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({transparent: true, opacity: .5, map: texture}));
		scene.add(box);

		var loader = new THREE.FontLoader();
		var mat = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture});
		loader.load('assets/youth-culture.json', function(font){
			var params = {
				font: font,
				size: 10,
				height: .5,
			};

			var height = 15, width = 7;

			var geom = new THREE.TextGeometry('u', params);

			U = new THREE.Mesh(geom, mat);
			U.position.set(-width/2, height/3, 0);

			geom = new THREE.TextGeometry('l', params);
			L = new THREE.Mesh(geom, mat);
			L.position.set(width/2, 0, 0);

			geom = new THREE.TextGeometry('t', params);
			T = new THREE.Mesh(geom, mat);
			T.position.set(-width/2, -height/2, 0);

			// scene.add(U);
			// scene.add(L);
			// scene.add(T);

			vargeom = new THREE.TextGeometry('ult', params);
			geom.center();
			ULT = new THREE.Mesh(geom, mat);
			scene.add(ULT);
		});

		lightning = new Lightning();
		scene.add(lightning.mesh);

		window.addEventListener('resize', resize);
	}

	function setUpPostProcessing(){
		var pass;

		occlusionRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth * 0.5, window.innerHeight * 0.5);
		occlusionComposer = new THREE.EffectComposer(renderer, occlusionRenderTarget);

		occlusionComposer.addPass(new THREE.RenderPass(scene, camera));

		pass = new THREE.ShaderPass(THREE.VolumetericLightShader);
		console.log(pass.uniforms);
		pass.needsSwap = false;
		occlusionComposer.addPass(pass);

		volumetericLightShaderUniforms = pass.uniforms;

	    // a second composer and render pass for the lit scene
	    composer = new THREE.EffectComposer( renderer );
	    composer.addPass( new THREE.RenderPass( scene, camera ) ); 
	    pass = new THREE.ShaderPass( THREE.AdditiveBlendingShader );
	    pass.uniforms.tAdd.value = occlusionRenderTarget.texture;
	    composer.addPass( pass );
	    pass.renderToScreen = true;
	}

	function update(){
		time = clock.getDelta() * .0005;
		lightningMat.uniforms["uTime"].value += time;
		camera.lookAt(scene.position);
		controls.update();
	}
	function animate(){
		update();
		// camera.layers.set(OCCLUSION_LAYER);
	 //    renderer.setClearColor(0xededed);
	 //    occlusionComposer.render();
	    
	 //    camera.layers.set(DEFAULT_LAYER);
	 //    renderer.setClearColor(0x111111);
	 //    composer.render();

		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}

	init();
	animate();


