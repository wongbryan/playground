var lightningVertex = 

"uniform float uTime;" + 
"uniform sampler2D tPerlin;" +
"varying vec2 vUv;" + 
"uniform float fSpeed;" + 

"void main(){" + 
	"vUv = uv; //get uv coordinate on texture" + 
	"vec4 color = texture2D(tPerlin, uv); //get color based on uv coord [0, 1]" +
		"float magnitude = sin(uTime) * 10.;" + 
	"vec4 color2 = texture2D(tPerlin, vec2(color.r, color.b) + uTime*fSpeed);  //adding a factor changes the " +
																		"//color value -> changes position " + 
																		"//value. multiplying uTime changes" +
																		"//the color value faster (depends on texture)" +
	"gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x / color2.g/2., position.y/color2.r/2., position.z, 1.);" +
"}";

var lightningFragment = 	

"uniform float uTime;" +
"uniform sampler2D tYellow;" +
"uniform sampler2D tPerlin;" +
"varying vec2 vUv; //can only access attributes in vertex shader" +
"uniform float fSpeed;" +

"void main(){" +
	"vec4 color = texture2D(tYellow, vUv); //get color based on uv coord [0, 1]" +

	"gl_FragColor = vec4(vec3(color.r, color.g, color.b), 0.1);" +
"}";

