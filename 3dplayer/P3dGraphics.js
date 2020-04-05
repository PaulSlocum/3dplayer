// P3dGraphics.js
//
// LOADS AND MANIPULATES 3D MODELS AND RENDERING ASSETS.
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import P3dController from './P3dController.js'
import P3dSwarm from './P3dSwarm.js'
import P3dNumericDisplay from './P3dNumericDisplay.js'
import P3dShaders from './P3dShaders.js'
import { logger } from './P3dLog.js'
import { TransportMode } from './P3dController.js'
import { random, converge } from './P3dUtility.js'
//-----------------------------------------------------------------------------------



//=====================================================================================
// UTILITY FUNCTION 
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
  
//=====================================================================================
// UTILITY FUNCTION 
window.mobileAndTabletcheck = function() 
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dGraphics
{

  ///////////////////////////////////////////////////////////////////////////
  setBackgroundColor( color )
  {
    this.uniforms['colorA'] = { type: 'vec3', value: new THREE.Color( color ) };
    this.uniforms['colorB'] = { type: 'vec3', value: new THREE.Color( color ) };
  }
  

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer ) 
  {
    logger("---->GRAPHICS CLASS CONSTRUCTOR");

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;
    
    this.trayOpen = true;
    
    this.scene = new THREE.Scene();
    // ---> PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    //this.camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 ); // <-- ORIGINAL
    this.camera = new THREE.PerspectiveCamera( 35, windowWidth/windowHeight, 0.1, 1000 );

    this.roomCube = null;
    this.roomMaterial = null;
    this.cdMaterial = null;
    this.spotlight = null;
    
    this.loadedModel = null;
    this.shaders = new P3dShaders();
    /*this.roomUniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0x070507)},
        colorA: {type: 'vec3', value: new THREE.Color(0x040410)}
    }; //*/
    this.roomUniforms = {
        colorB: {type: 'vec3', value: new THREE.Color(0x0A0B0A)},
        colorA: {type: 'vec3', value: new THREE.Color(0x060607)}
    };
    this.cdUniforms = {
        colorC: {type: 'vec3', value: new THREE.Color(0x040302)},
        colorD: {type: 'vec3', value: new THREE.Color(0x090806)}
    };

    this.targetRotationX = 0;
    this.targetRotationY = 0;

    this.loadedAnimations = {};
    this.currentClip = null;
    this.currentAction = null;
    
    this.buttonDown = false;
    this.raycaster = new THREE.Raycaster();

    this.backgroundSpinRate = 0;
    this.frameCounter = 0;

    this.buildStructures();    

    this.swarm = new P3dSwarm( this.scene );

    
    this.animationMixer = null;
    this.clock = new THREE.Clock();

    this.numericDisplay = new P3dNumericDisplay( appController, this.scene );
    
    this.isMobileDevice = window.mobilecheck();
    this.isTabletDevice = window.mobileAndTabletcheck();
  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.frameCounter++;

    // UPDATE ANIMATIONS..
    if( this.animationMixer != null )
    {
      var dt = this.clock.getDelta()
      this.animationMixer.update(dt);
    }

    // UPDATE LED DISPLAY
    this.numericDisplay.update();

    // UPDATE "SWARM" 
    this.swarm.render();

    // ROTATE ROOM CUBE...
    this.backgroundSpinRate += 0.00001; // <------------- ORIGINAL
    if( this.backgroundSpinRate > 0.04 ) 
      this.backgroundSpinRate = 0.04;
    if( this.appController.getStatus() != TransportMode.PLAYING )
    { 
      this.backgroundSpinRate -= 0.0001;
      if( this.backgroundSpinRate < 0.0002 )
        this.backgroundSpinRate = 0.0002;
    }
    if( this.roomCube != null )
    {
      this.roomCube.rotation.x += this.backgroundSpinRate;
      this.roomCube.rotation.y += this.backgroundSpinRate;
    } //*/

    

    // MODULATE CD PLAYER ORIENTATION...
    const rotationSpeed = 0.03; // NORMAL <-------------------
    //const rotationSpeed = 0.01; // SLOW
    //const rotationSpeed = 0.07; // FAST
    if( this.loadedModel != null )
    {
      if( this.trayOpen == true )
        this.targetRotationX = Math.sin( this.frameCounter * rotationSpeed) * 0.08 - 0.01  + 0.10;
      else 
        this.targetRotationX = Math.sin( this.frameCounter * rotationSpeed) * 0.08 - 0.01;
      
      this.targetRotationY = Math.cos( this.frameCounter * rotationSpeed ) * 0.08;

      this.loadedModel.rotation.x = converge( this.loadedModel.rotation.x, this.targetRotationX, 0.005 );
      this.loadedModel.rotation.y = converge( this.loadedModel.rotation.y, this.targetRotationY, 0.005 );
    }  
    
    this.renderer.render( this.scene, this.camera );

  };
  
  
  
  
  //////////////////////////////////////////////////////////////////////////////
  // UNFINISHED, STILL TO BE DETERMINED HOW THIS INTERFACE IS GOING TO WORK
  playAnimation( animationName, rate = 1.0 )
  {
    logger( "------> GRAPHICS: PLAY ANIMATION: ", animationName );

    this.animationMixer.stopAllAction();
    
    this.currentClip = this.loadedAnimations[ animationName ];
    if( this.currentClip )
    {
      //var clip1 = this.loadedAnimations[ 'ButtonPause' ];
      logger("---->CLIP: ", this.currentClip, this.currentClip.name );
      this.currentAction = this.animationMixer.clipAction( this.currentClip );
      //var action1 = this.animationMixer.clipAction( this.loadedAnimations[ 'TrayOpen' ] );
      logger("---->ACTION: ", this.currentAction );
      this.currentAction.clampWhenFinished = true;
      this.currentAction.setLoop( THREE.LoopOnce );
      //if( rate < 0.0 )
        //this.currentAction.time = this.currentAction.getClip().duration;
      this.currentAction.timeScale = rate; // OPEN INSTANTLY SO IT LOOKS LIKE IT STARTS OPENED
      //mixer.update( 1 );
      this.currentAction.play(); //*/
    }
    
  }

  
  //////////////////////////////////////////////////////////////////////////////
  // UNFINISHED - MAY BE REMOVED
  resetAnimation()
  {
    this.animationMixer.stopAllAction();
    this.currentAction.timeScale = -1;
    this.currentAction.play();
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  openTray( rate = 1.0 )
  {
    this.playAnimation( 'TrayOpen', rate );
    this.trayOpen = true;
  }


  ////////////////////////////////////////////////////////////////////////
  closeTray()
  {
    this.trayOpen = false;
    this.animationMixer.stopAllAction();
    this.currentAction.timeScale = -1;
    this.currentAction.time = this.currentAction.getClip().duration;
    this.currentAction.play();//*/
  }




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
  // -----> THIS SHOULD MAYBE BE MOVED TO A NEW CLASS
  buildStructures()
  {
    // CAMERA
    this.camera.position.z = 5.5;

    // INSTANTIATE A LOADER
    const gltfLoader = new GLTFLoader();
    const url = '3dplayer/model/chassis.glb';
    gltfLoader.load(url, (gltf) => 
    { // GTLF LOADER CALLBACK...
      
      this.loadedModel = gltf.scene;
      
      this.loadedModel.position.z = -5.5; // DEFAULT DESKTOP SIZE
      if( this.isMobileDevice == true )
        this.loadedModel.position.z = -2.5;
      if( this.isTabletDevice == true )
        this.loadedModel.position.z = -4.5;
      this.loadedModel.position.y = 0.4;
      this.scene.add( this.loadedModel );
      
      this.modelLoadComplete();
      
      // LOAD ANIMATIONS INTO DICTIONARY INDEXED BY NAME...
      this.animationMixer = new THREE.AnimationMixer( this.loadedModel );
      for( let i=0; i<gltf.animations.length; i++ )
      {
        logger( "SCANNING ANIMATIONS: ", i, gltf.animations[i].name );
        this.loadedAnimations[gltf.animations[i].name] = gltf.animations[i];
      }
      
      
      // FIND THE MATERIALS USED FOR THE LEDS...
      this.loadedModel.traverse( function(child) 
      {
        if( child.material  &&  child.material.name == "cd" )
        {
          //console.log( "---->LED DRIVER: 'ledOn' MATERIAL FOUND" );
          child.material = this.cdMaterial;
        }
        
        if ( child.isMesh ) 
        {
          //child.castShadow = true;
          child.receiveShadow = true;
        }//*/

      }.bind(this) ); //*/

      
      // OPEN TRAY INSTANTLY (300X SPEED)
      this.openTray( 300 );
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

    //this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // ROOM CUBE  
    let geometry = new THREE.BoxGeometry( -80, -40, -40 );
    //var geometry = new THREE.BoxGeometry( -70, -70, -70 );

    this.roomMaterial =  new THREE.ShaderMaterial({
      uniforms: this.roomUniforms,
      fragmentShader: this.shaders.roomFragmentShader(),
      vertexShader: this.shaders.roomVertexShader(),
    })

    this.cdMaterial =  new THREE.ShaderMaterial({
      uniforms: this.cdUniforms,
      fragmentShader: this.shaders.cdFragmentShader(),
      vertexShader: this.shaders.cdVertexShader(),
    })

    
    // OTHER MATERIAL OPTIONS (DEBUG)    
    //const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
    //const material = new THREE.MeshBasicMaterial( { color: 0x101030 } );
    //const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();
    //material.flatShading = true; //*/
    
    this.roomCube = new THREE.Mesh( geometry, this.roomMaterial );
    this.roomCube.rotation.x = 200;
    this.roomCube.rotation.y = 120;
    this.scene.add( this.roomCube ); //*/

    // SPOTLIGHT
    /*let spotLight = new THREE.PointLight( 0xffffff ); // DEBUG!!!!!!!!!!!!!!!!
    spotLight.intensity = 5.8;
    spotLight.position.set(-0, 28, 30); //*/

    this.spotLight = new THREE.SpotLight(0xffffff); // <----------------------
    this.spotLight.position.set(-0, 1.2, 0.9);
    this.spotLight.angle = Math.PI / 3.0;
    this.spotLight.castShadow = true;
    //spotLight.shadow.mapSize.width = 2048;
    //spotLight.shadow.mapSize.height = 2048;
    
    //spotLight.target = this.loadedModel;
    this.spotLight.target.position.z = -3;
    //spotLight.shadow.camera.fov = 60;
    //spotLight.shadow.radius = 8;

/*light.shadowCameraLeft = -d
light.shadowCameraRight = d
light.shadowCameraTop = d
light.shadowCameraBottom = -d    //*/

   //spotLight.shadow.camera.near = 1; 
    //spotLight.shadow.camera.far = 60;
    //spotLight.shadow.bias = - 0.005; // reduces self-shadowing on double-sided objects //*/
    this.spotLight.intensity = 1.0;
    this.scene.add( this.spotLight );
    this.scene.add( this.spotLight.target );
    //spotLight.target.position = new THREE.Object3D( 0, 5, 0 );

  }




  ////////////////////////////////////////////////////////////////////////
  getIntersectionsAtPixel( mousePosition )
  {
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera( mousePosition, this.camera );

    // calculate objects intersecting the picking ray
    //var intersects = this.raycaster.intersectObjects( this.scene.children );
    let intersects = this.raycaster.intersectObjects( this.loadedModel.children );

    return intersects;
  }

  
}

