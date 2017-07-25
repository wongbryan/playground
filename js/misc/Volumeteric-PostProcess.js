function setUpVolumetericProcessing(){
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