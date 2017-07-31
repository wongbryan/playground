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
		vertexShader: document.getElementById( 'lightningVertex' ).textContent,
		fragmentShader: document.getElementById( 'raysFragment' ).textContent
	} );

	var geom = new THREE.CircleBufferGeometry(5, 256, 256);
	mesh = new THREE.Mesh(geom, rayMat);
  mesh.rotation.x += Math.PI/2;
	this.mesh = mesh;
} 

var Aurora = function(){
  var group = new THREE.Group();
  var mesh;
  auroraMat = new THREE.ShaderMaterial( {
    transparent: true,
    wireframe: true,
    // shading: THREE.FlatShading,
    uniforms: {
      "uTime" : { type: "f", value: 0.0 },
      "tPerlin" : { type: "t", value: perlinNoise },
      "fSpeed" : { type: "f", value: 66.}
    },
    depthTest: false,
    vertexShader: document.getElementById( 'lightningVertex' ).textContent,
    fragmentShader: document.getElementById( 'lightningFragment' ).textContent
  } );

  var geom = new THREE.CircleBufferGeometry(5, 256, 256);
  mesh = new THREE.Mesh(geom, auroraMat);  
  var mesh2 = mesh.clone();
  group.add(mesh);
  group.add(mesh2);

  this.mesh = group;
}

var Sun = function(){
	var sunGeom = new THREE.SphereGeometry(1, 16, 16);
	var sunMat = new THREE.MeshBasicMaterial({color: 0xededed});

	var mesh = new THREE.Mesh(sunGeom, sunMat);
	// mesh.position.set(0, .9, 0);

	this.mesh = mesh;
}

var ShapeStorm = function(){
  var group = new THREE.Group();
  var tPI = Math.PI * 2;

  var radius = 25, //sphere radius
  numShapes = 1000, 
  maxVertices = 6,
  maxShapeRadius = 5, //circle in which to draw the shape
  maxThickness = 2,
  shapesArray = [];

  var mat = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide}); //use black for now, custom shader later on

  for (var i=0; i<numShapes; i++){ //CONSTRUCT EACH SHAPE
    var geom = new THREE.Geometry();
    var tempRadius = Math.random()*maxShapeRadius; //draw within this circle
    var tempThickness = Math.random()*maxThickness; //displace points by this much
    var numVertices = Math.random()*maxVertices;
    numVertices >= 3 ? numVertices : 3;

    var x, y, z = 0;
    var vertex;
    var vertexCount = 0;
    for (var j=0; j<numVertices; j++){ //GET VERTICES OF THE SHAPE
      var angle = Math.random()*tPI;
      x = tempRadius * Math.cos(angle);
      y = tempRadius * Math.sin(angle);
      z = 10;

      vertex = new THREE.Vector3(x, y, z);
      geom.vertices.push(vertex);
      vertexCount++;

      if (vertexCount == 3){
        geom.faces.push(new THREE.Face3(0, 1, 2));
      }
      else if (vertexCount == 6){
        geom.faces.push(new THREE.Face3(3, 4, 5));
      }
    }

    geom.computeBoundingSphere();
    var mesh = new THREE.Mesh(geom, mat); //create mesh
    var theta = Math.random() * tPI;
    var phi = Math.random () * tPI/2;
    var posX = Math.cos(theta) * radius;
    var posY = Math.cos(phi) * radius;
    var posZ = Math.sin(theta) * radius;
    mesh.position.set(posX, posY, posZ);
    // mesh.layers.set(OCCLUSION_LAYER);
    group.add(mesh);
  }

  this.mesh = group;
}

var OblivionSphere = function(){
  var sphereGeom = new THREE.SphereGeometry(10, 16, 16);
  var mat = new THREE.MeshBasicMaterial({
    color: 0x000000, 
    wireframe: true,
    transparent: true
  });
  var mesh = new THREE.Mesh(sphereGeom, mat);

  this.mesh = mesh;
}







