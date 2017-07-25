//texture
var perlinNoise = new THREE.TextureLoader().load("assets/rgb texture.png");
perlinNoise.wrapT = perlinNoise.wrapS = THREE.RepeatWrapping;
var yellowGradient = new THREE.TextureLoader().load("assets/yellow-gradient-trans.png");

//Shaders
THREE.VolumetericLightShader = {
  uniforms: {
    tDiffuse: {value:null},
    lightPosition: {value: new THREE.Vector2(0.5, 0.5)},
    exposure: {value: 0.18},
    decay: {value: 0.95},
    density: {value: 0.8},
    weight: {value: 0.4},
    samples: {value: 50}
  },

  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "varying vec2 vUv;",
    "uniform sampler2D tDiffuse;",
    "uniform vec2 lightPosition;",
    "uniform float exposure;",
    "uniform float decay;",
    "uniform float density;",
    "uniform float weight;",
    "uniform int samples;",
    "const int MAX_SAMPLES = 100;",
    "void main()",
    "{",
      "vec2 texCoord = vUv;",
      "vec2 deltaTextCoord = texCoord - lightPosition;",
      "deltaTextCoord *= 1.0 / float(samples) * density;",
      "vec4 color = texture2D(tDiffuse, texCoord);",
      "float illuminationDecay = 1.0;",
      "for(int i=0; i < MAX_SAMPLES; i++)",
      "{",
        "if(i == samples){",
          "break;",
        "}",
        "texCoord -= deltaTextCoord;",
        "vec4 sample = texture2D(tDiffuse, texCoord);",
        "sample *= illuminationDecay * weight;",
        "color += sample;",
        "illuminationDecay *= decay;",
      "}",
      "gl_FragColor = color * exposure;",
    "}"
  ].join("\n")
};

THREE.AdditiveBlendingShader = {
  uniforms: {
    tDiffuse: { value:null },
    tAdd: { value:null }
  },

  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),

  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D tAdd;",
    "varying vec2 vUv;",
    "void main() {",
      "vec4 color = texture2D( tDiffuse, vUv );",
      "vec4 add = texture2D( tAdd, vUv );",
      "gl_FragColor = color + add;",
    "}"
  ].join("\n")
};

THREE.PassThroughShader = {
    uniforms: {
        tDiffuse: { value: null }
    },

    vertexShader: [
        "varying vec2 vUv;",
    "void main() {",
          "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join( "\n" ),

    fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "varying vec2 vUv;",
    "void main() {",
            "gl_FragColor = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );",
        "}"
    ].join( "\n" )
};

//objects
var Lightning = function(){
	var mesh;
	lightningMat = new THREE.ShaderMaterial( {
		transparent: true,
		wireframe: true,
		//shading: THREE.FlatShading,
		uniforms: {
			"uTime" : { type: "f", value: 0.0 },
			"tPerlin" : { type: "t", value: perlinNoise },
			"tYellow" : { type: "t", value: yellowGradient},
			"fSpeed" : { type: "f", value: 2000.}
		},
		depthTest: false,
		vertexShader: document.getElementById( 'lightningVertex' ).textContent,
		fragmentShader: document.getElementById( 'lightningFragment' ).textContent
	} );

	var shaderGeom = new THREE.CylinderBufferGeometry(.1, .1, 10, 128, 128);
	mesh = new THREE.Mesh(shaderGeom, lightningMat);

	this.mesh = mesh;
}

var Rays = function(){
	var mesh;
	rayMat = new THREE.ShaderMaterial( {
		transparent: true,
		wireframe: true,
		// shading: THREE.FlatShading,
		uniforms: {
			"uTime" : { type: "f", value: 0.0 },
			"tPerlin" : { type: "t", value: perlinNoise },
			"fSpeed" : { type: "f", value: 66.}
		},
		depthTest: false,
		vertexShader: document.getElementById( 'raysVertex' ).textContent,
		fragmentShader: document.getElementById( 'raysFragment' ).textContent
	} );

	var geom = new THREE.PlaneBufferGeometry(1, 256, 256);
	mesh = new THREE.Mesh(geom, rayMat);

	this.mesh = mesh;
} 

var Sun = function(){
	var sunGeom = new THREE.SphereBufferGeometry(1, 16, 16);
	var sunMat = new THREE.MeshBasicMaterial({color: 0xededed});

	var mesh = new THREE.Mesh(sunGeom, sunMat);
	// mesh.position.set(0, .9, 0);

	this.mesh = mesh;
}