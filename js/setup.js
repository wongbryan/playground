var camera, scene, renderer, controls, gui;
var angle = 0;
var clock = new THREE.Clock();
var time;

var lighting, ray, sun;

var box, occlusionBox;

var occlusionRenderTarget, occlusionComposer, composer, volumetericLightShaderUniforms;

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
		// renderer.setClearColor(0xededed);
		container.appendChild( renderer.domElement );
		
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set(0, 0, 10);
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

		lightning = new Lightning();
		// scene.add(lightning.mesh);

		rays = new Rays();
		rays.mesh.position.set(-2, 2.5, 5);
		rays.mesh.scale.set(5, 5, 5);
		rays.mesh.rotation.x = Math.PI/1.9;
		// scene.add(rays.mesh);

		sun = new Sun();
		sun.mesh.layers.set(OCCLUSION_LAYER);
		scene.add(sun.mesh);

		// the box in the scene that rotatates around the light
	    var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
	    var material = new THREE.MeshPhongMaterial( { color: 0xe74c3c } );
	    box = new THREE.Mesh( geometry, material );
	    box.position.z = 2;
	    scene.add( box );
	    
	    // the all black second box that is used to create the occlusion 
	    var material = new THREE.MeshBasicMaterial( { color:0x000000 } );
	    occlusionBox = new THREE.Mesh( geometry, material);
	    occlusionBox.position.z = 2;
	    occlusionBox.layers.set( OCCLUSION_LAYER );
	    scene.add( occlusionBox );

	    setUpPostProcessing();

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
		rayMat.uniforms["uTime"].value += time;
		camera.lookAt(scene.position);
		controls.update();

		var radius = 2.5,
        xpos = Math.sin(angle) * radius,
        zpos = Math.cos(angle) * radius;
    
	    // each frame rotate the lit cube
	    box.position.set( xpos, 0, zpos);
	    box.rotation.x += 0.01;
	    box.rotation.y += 0.01;
	    
	    // and match its position and rotation with the 
	    // occluding cube
	    occlusionBox.position.copy(box.position);
	    occlusionBox.rotation.copy(box.rotation);
	    
	    angle += 0.02;
	}
	function animate(){
		update();
		camera.layers.set(OCCLUSION_LAYER);
	    renderer.setClearColor(0x111111);
	    occlusionComposer.render();
	    
	    camera.layers.set(DEFAULT_LAYER);
	    renderer.setClearColor(0x111111);
	    composer.render();

		// renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}

	init();
	animate();


