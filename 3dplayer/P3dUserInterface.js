
//-----------------------------------------------------------------------------------
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import P3dController from './P3dController.js'
import { ButtonEvent } from './P3dController.js'
//-----------------------------------------------------------------------------------



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dUserInterface 
{


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer ) 
  {
    console.log("---->DISPLAY CLASS CONSTRUCTOR");

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 );

    this.cube = null;
    this.customCube = null;
    this.loadedModel = null;
    
    this.buttonDown = false;

    this.backgroundSpinRate = 0;
    this.frameCounter = 0;

    this.buildStructures();    

    // MOUSE HANDLING
    this.raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousedown', this.mouseDown.bind(this), false );
    document.addEventListener( 'mouseup', this.mouseUp.bind(this), false );
    document.addEventListener('touchstart', this.mouseDown.bind(this), false);
    //someElement.addEventListener('touchmove', process_touchmove, false);
    document.addEventListener('touchcancel', this.mouseUp.bind(this), false);
    document.addEventListener('touchend', this.mouseUp.bind(this), false);
  }


  ///////////////////////////////////////////////////////////////////////
  mouseDown( event )
  {
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera( mouse, this.camera );

    // calculate objects intersecting the picking ray
    //var intersects = this.raycaster.intersectObjects( this.scene.children );
    var intersects = this.raycaster.intersectObjects( this.loadedModel.children );

    for ( var i = 0; i < intersects.length; i++ ) 
    {
      switch( intersects[i].object.name )
      {
        case "ButtonPlay": this.buttonDown = true;
          this.appController.processButtonEvent( ButtonEvent.BUTTON_DOWN_PLAY ); break;
        case "ButtonPause": this.buttonDown = true;
          this.appController.processButtonEvent( ButtonEvent.BUTTON_DOWN_PAUSE ); break;
      }
    } //*/
  }


  ///////////////////////////////////////////////////////////////////////
  mouseUp( event )
  {
    if( this.buttonDown == true )
    {
      this.buttonDown = false;
      this.appController.processButtonEvent( ButtonEvent.BUTTON_UP ); 
    }
  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.frameCounter++;

    // ROTATE ROOM CUBE...
    this.backgroundSpinRate += 0.00001;
    if( this.backgroundSpinRate > 0.15 ) 
      this.backgroundSpinRate = 0.15;
    if( this.cube != null )
    {
      this.cube.rotation.x += this.backgroundSpinRate;
      this.cube.rotation.y += this.backgroundSpinRate;
    } //*/

    // MODULATE CD PLAYER ROTATION...
    if( this.loadedModel != null )
    {
      this.loadedModel.rotation.y = Math.cos( this.frameCounter * 0.03 ) * 0.08;
      this.loadedModel.rotation.x = Math.sin( this.frameCounter * 0.03) * 0.08 - 0.15;
    }  
    
    this.renderer.render( this.scene, this.camera );

  };


  ///////////////////////////////////////////////////////////////////////
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  buildStructures()
  {
    // CAMERA
    this.camera.position.z = 5.5;

    // MODEL
    const width = 4.0;
    const height = 2.0;
    const depth = 3.0;
    
    // INSTANTIATE A LOADER
    const gltfLoader = new GLTFLoader();
    const url = '3dplayer/model/chassis.glb';
    gltfLoader.load(url, (gltf) => {
      this.loadedModel = gltf.scene;
      this.loadedModel.position.z = -0;
      this.scene.add( this.loadedModel );
      
      //var model = gltf.scene;
      var mixer = new THREE.AnimationMixer( this.loadedModel );
      var clip1 = gltf.animations[1];
      console.log("---->CLIP: ", clip1 );
      var action1 = mixer.clipAction(clip1);
      console.log("---->ACTION: ", action1 );
      //action1.clampWhenFinished = true;
      //mixer.update( 1 );
      action1.play();
    });

    // ADD BLUR (NOT YET WORKING)
    /*this.composer = new THREE.EffectComposer( this.renderer );
    this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
    hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    this.composer.addPass( hblur );
    vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
    // set this shader pass to render to screen so we can see the effects
    vblur.renderToScreen = true;
    this.composer.addPass( vblur ); //*/

    // TEST CUBE  
    var geometry = new THREE.BoxGeometry( -80, -40, -40 );
    //var geometry = new THREE.BoxGeometry( -70, -70, -70 );

    // CUSTOM SHADER
    const material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader(),
      fragmentShader: this.fragmentShader()
    }); //*/
    
    // OTHER MATERIAL OPTIONS (DEBUG)    
    //const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
    //const material = new THREE.MeshBasicMaterial( { color: 0x101030 } );
    //const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();
    //material.flatShading = true; //*/
    
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube ); //*/

    // SPOTLIGHT
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    this.scene.add( spotLight );

  }

  ///////////////////////////////////////////////////////////////////////
  vertexShader() 
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  {
    return `
      void main() 
      {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
        `
  }

  ///////////////////////////////////////////////////////////////////////
  fragmentShader() 
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  {
    return `
      float rand(vec2 co)
      {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }
      
      void main() {
        float colorValue = gl_PointCoord.y/100.0+0.2 + rand(gl_PointCoord.xy)*0.02;
        gl_FragColor = vec4( colorValue, colorValue, colorValue+0.05, 1.0);
      }
        `
  }  

}
