// P3dGraphics.js
//
// LOADS AND MANIPULATES 3D MODELS AND RENDERING ASSETS.
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import P3dController from './P3dController.js'
import P3dNumericDisplay from './P3dNumericDisplay.js'
//-----------------------------------------------------------------------------------



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dGraphics
{

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer ) 
  {
    console.log("---->GRAPHICS CLASS CONSTRUCTOR");

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    //this.camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 ); // <-- ORIGINAL
    this.camera = new THREE.PerspectiveCamera( 35, windowWidth/windowHeight, 0.1, 1000 );

    this.roomCube = null;
    this.loadedModel = null;
    
    this.buttonDown = false;
    this.raycaster = new THREE.Raycaster();

    this.backgroundSpinRate = 0;
    this.frameCounter = 0;

    this.buildStructures();    

    this.numericDisplay = new P3dNumericDisplay( appController, this.scene );
  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.frameCounter++;

    // UPDATE LED DISPLAY
    this.numericDisplay.update();

    // ROTATE ROOM CUBE...
    this.backgroundSpinRate += 0.00001;
    if( this.backgroundSpinRate > 0.15 ) 
      this.backgroundSpinRate = 0.15;
    if( this.roomCube != null )
    {
      this.roomCube.rotation.x += this.backgroundSpinRate;
      this.roomCube.rotation.y += this.backgroundSpinRate;
    } //*/

    // MODULATE CD PLAYER ORIENTATION...
    const rotationSpeed = 0.03; // NORMAL
    //const rotationSpeed = 0.01; // SLOW
    if( this.loadedModel != null )
    {
      this.loadedModel.rotation.y = Math.cos( this.frameCounter * rotationSpeed ) * 0.08;
      this.loadedModel.rotation.x = Math.sin( this.frameCounter * rotationSpeed) * 0.08 - 0.10;
    }  
    
    this.renderer.render( this.scene, this.camera );

  };


  //////////////////////////////////////////////////////////////////////////////
  debugIndicator( xOffset )
  {
    this.loadedModel.position.x += xOffset;
  }


  ////////////////////////////////////////////////////////////////////////
  modelLoadComplete()
  {
    this.numericDisplay.load();
  }


  ///////////////////////////////////////////////////////////////////////
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  buildStructures()
  {
    // CAMERA
    this.camera.position.z = 5.5;

    // INSTANTIATE A LOADER
    const gltfLoader = new GLTFLoader();
    const url = '3dplayer/model/chassis.glb';
    gltfLoader.load(url, (gltf) => {
      this.loadedModel = gltf.scene;
      this.loadedModel.position.z = -3.5;
      this.loadedModel.position.y = 0;
      this.scene.add( this.loadedModel );
      
      this.modelLoadComplete();
      
      // TEST ANIMATIONS (NOT YET WORKING)
      /*var mixer = new THREE.AnimationMixer( this.loadedModel );
      var clip1 = gltf.animations[1];
      console.log("---->CLIP: ", clip1 );
      var action1 = mixer.clipAction(clip1);
      console.log("---->ACTION: ", action1 );
      //action1.clampWhenFinished = true;
      //mixer.update( 1 );
      action1.play(); //*/
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

    // ROOM CUBE  
    var geometry = new THREE.BoxGeometry( -80, -40, -40 );
    //var geometry = new THREE.BoxGeometry( -70, -70, -70 );

    // OLD CUSTOM SHADER FOR ROOM BACKGROUND
    /*const material = new THREE.ShaderMaterial({
      vertexShader: this.roomVertexShader(),
      fragmentShader: this.roomFragmentShader()
    }); //*/
    
    
    // *NEW* CUSTOM SHADER FOR ROOM BACKGROUND
    const uniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0x020000)},
        colorA: {type: 'vec3', value: new THREE.Color(0x010102)}
    }

    //let geometry = new THREE.BoxGeometry(1, 1, 1)
    const material =  new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: this.roomFragmentShader(),
      vertexShader: this.roomVertexShader(),
    })

    
    // OTHER MATERIAL OPTIONS (DEBUG)    
    //const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
    //const material = new THREE.MeshBasicMaterial( { color: 0x101030 } );
    //const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();
    //material.flatShading = true; //*/
    
    this.roomCube = new THREE.Mesh( geometry, material );
    this.scene.add( this.roomCube ); //*/

    // SPOTLIGHT
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    this.scene.add( spotLight );

  }

  ///////////////////////////////////////////////////////////////////////
  roomVertexShader() 
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  {
    //---------------------------------------------------------------------
    /* DIFFUSE SHADER
      varying vec3 normal;
      varying vec3 vertex_to_light_vector;
 
      void main()
      {
          // Transforming The Vertex
          gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
 
          // Transforming The Normal To ModelView-Space
          normal = gl_NormalMatrix * gl_Normal;
 
          // Transforming The Vertex Position To ModelView-Space
          vec4 vertex_in_modelview_space = gl_ModelViewMatrx * gl_Vertex;
 
          // Calculating The Vector From The Vertex Position To The Light Position
          vertex_to_light_vector = vec3(gl_LightSource[0].position Â– vertex_in_modelview_space);
      }
    //*/
    //-------------------------------------------------------------------------
    /* ORIGINAL
      void main()
      {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    //*/
    //-------------------------------------------------------------------------

    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }

      `
  }

  ///////////////////////////////////////////////////////////////////////
  roomFragmentShader() 
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  {   
      //----------------------------------------------------------------------------
      //float colorValue = gl_PointCoord.y/100.0+0.2;
      //gl_FragColor = vec4( colorValue, colorValue, colorValue+0.05, 1.0);
      //float colorValue = gl_PointCoord.y/100.0+0.2 + rand(gl_PointCoord.xy)*0.02;
      //----------------------------------------------------------------------------
      /* ORIGINAL GRADIENT
        float colorValue = gl_PointCoord.y/100.0;
        colorValue = clamp( colorValue, 0.0, 1.0 );
        gl_FragColor = vec4( colorValue, colorValue, colorValue, 1.0);
      //*/
      //----------------------------------------------------------------------------
      /* SOLID COLOR
              gl_FragColor = vec4( 0.0, 0.0, 0.1, 1.0);
              //*/
      //----------------------------------------------------------------------------
      /* DIFFUSE SHADER
        varying vec3 normal;
        varying vec3 vertex_to_light_vector;
 
        void main()
        {
            // Defining The Material Colors
            const vec4 AmbientColor = vec4(0.1, 0.0, 0.0, 1.0);
            const vec4 DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
 
            // Scaling The Input Vector To Length 1
            vec3 normalized_normal = normalize(normal);
            vec3 normalized_vertex_to_light_vector = normalize(vertex_to_light_vector);
 
            // Calculating The Diffuse Term And Clamping It To [0;1]
            float DiffuseTerm = clamp(dot(normal, vertex_to_light_vector), 0.0, 1.0);
 
            // Calculating The Final Color
            gl_FragColor = AmbientColor + DiffuseColor * DiffuseTerm;
        }
              //*/
      //----------------------------------------------------------------------------
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.y), 1.0);
      }        `
  }  


  ////////////////////////////////////////////////////////////////////////
  getIntersectionsAtPixel( mousePosition )
  {
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera( mousePosition, this.camera );

    // calculate objects intersecting the picking ray
    //var intersects = this.raycaster.intersectObjects( this.scene.children );
    var intersects = this.raycaster.intersectObjects( this.loadedModel.children );

    return intersects;
  }

  
}

