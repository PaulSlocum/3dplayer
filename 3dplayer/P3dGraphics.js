// P3dGraphics.js
//
// LOADS AND MANIPULATES 3D MODELS AND RENDERING ASSETS.
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';
import P3dController from './P3dController.js'
import P3dNumericDisplay from './P3dNumericDisplay.js'
import P3dShaders from './P3dShaders.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
  
//------------------------------------------------------------------------------------------------
window.mobileAndTabletcheck = function() 
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dGraphics
{

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer ) 
  {
    logger("---->GRAPHICS CLASS CONSTRUCTOR");

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;
    
    this.scene = new THREE.Scene();
    // ---> PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    //this.camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 ); // <-- ORIGINAL
    this.camera = new THREE.PerspectiveCamera( 35, windowWidth/windowHeight, 0.1, 1000 );

    this.roomCube = null;
    this.loadedModel = null;
    this.shaders = new P3dShaders();
    
    this.buttonDown = false;
    this.raycaster = new THREE.Raycaster();

    this.backgroundSpinRate = 0;
    this.frameCounter = 0;

    this.buildStructures();    

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

    // UPDATE LED DISPLAY
    this.numericDisplay.update();

    // ROTATE ROOM CUBE...
    this.backgroundSpinRate += 0.00001;
    if( this.backgroundSpinRate > 0.04 ) 
      this.backgroundSpinRate = 0.04;
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
      this.loadedModel.rotation.x = Math.sin( this.frameCounter * rotationSpeed) * 0.08 - 0.05;
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
      
      this.loadedModel.position.z = -5.5; // DEFAULT DESKTOP SIZE
      if( this.isMobileDevice == true )
        this.loadedModel.position.z = -2.5;
      if( this.isTabletDevice == true )
        this.loadedModel.position.z = -4.5;
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
    let geometry = new THREE.BoxGeometry( -80, -40, -40 );
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
      fragmentShader: this.shaders.roomFragmentShader(),
      vertexShader: this.shaders.roomVertexShader(),
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
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 20, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    this.scene.add( spotLight );

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

