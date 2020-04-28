//
// P3dUIPlayerModule.js
//
// LOADS AND ANIMATED CD PLAYER MODEL, ALSO LOADS SUBCLASSES THAT WORK WITH THE MODEL.
//
////////////////////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
// ~   -   ~   -   ~   -   ~   -   ~   -   ~   -
import { P3dCDShaders } from "./P3dUICompactDisc.js";
import { P3dNumericDisplay } from "./P3dUINumericDisplay.js";
import { P3dPanelLeds } from "./P3dUIPanelLeds.js";
// ~   -   ~   -   ~   -   ~   -   ~   -   ~   -
import { logger } from "./P3dLog.js";
import { converge, random } from "./P3dUtility.js";
//-----------------------------------------------------------------------------------



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dPlayerModel
{

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, scene )
  {

    this.scene = scene;

    // ~   -    ~   -    ~   -    ~   -    ~   -

    this.trayOpen = true;

    this.cdMaterial = null;
    this.cdObject = null;

    this.loadedModel = null;
    this.shaders = new P3dCDShaders();

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( '3dplayer/model/test_1024x1024_1b.png' );
    this.cdUniforms = {
        lightPosition: { type: "vec3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },
        cdTexture: { type: "t", value: texture }
    };

    this.targetRotationX = 0;
    this.targetRotationY = 0;

    this.loadedAnimations = {};
    this.currentClip = null;
    this.currentAction = null;
    this.currentActionCd = null;

    this.backgroundSpinRate = 0;
    this.frameCounter = 0;
    this.screenEdgePosition = 0;

    this.animationMixerTray = null;
    this.animationMixerCd = null;
    this.clock = new THREE.Clock();

    // ~   -    ~   -    ~   -    ~   -    ~   -

    this.numericDisplay = new P3dNumericDisplay( appController, scene );
    this.panelLeds = new P3dPanelLeds( appController, scene );

  }



  /////////////////////////////////////////////////////////////////////////////////
  update()
  {
    this.frameCounter++;

    // CD DEBUG!!!!!!!!!!!!!!!!!!!!!!
    /*if( this.cdObject != null )
    {
      let worldPosition = new THREE.Vector3();
      this.cdObject.getWorldPosition( worldPosition );
      //this.cdObject.rotation.y = Math.sin( this.frameCounter * 0.05 );
      this.cdObject.rotation.y = this.frameCounter * 0.05;
      //this.cdObject.rotation.x = Math.sin( this.frameCounter * 0.01 );
    } //*/

    // UPDATE FAKE LIGHT POSITION FOR CD SHADER...
    if( this.loadedModel != null )
    {
      this.cdUniforms.lightPosition.value.x = this.loadedModel.rotation.x*8.0 - 1.5;
      this.cdUniforms.lightPosition.value.y = this.loadedModel.rotation.y*5.0 + 0.8;
      this.cdUniforms.lightPosition.value.z = this.loadedModel.rotation.x*4.0-1.9;
    } //*/

    // UPDATE ANIMATIONS..
    if( this.animationMixerTray != null )
    {
      var dt = this.clock.getDelta();
      this.animationMixerTray.update(dt);
      this.animationMixerCd.update(dt);
    }

    // UPDATE LED DISPLAY
    this.numericDisplay.update();
    this.panelLeds.update();

    // MODULATE CD PLAYER ORIENTATION...
    const rotationSpeed = 0.03; // NORMAL <-------------------
    //const rotationSpeed = 0.01; // SLOW
    //const rotationSpeed = 0.07; // FAST
    if( this.loadedModel != null )
    {
      this.targetRotationY = Math.cos( this.frameCounter * rotationSpeed ) * 0.08;
      if( this.trayOpen == true )
      {
        this.targetRotationX = Math.sin( this.frameCounter * rotationSpeed) * 0.08 - 0.01  + 0.25;
      }
      else
      {
        this.targetRotationX = Math.sin( this.frameCounter * rotationSpeed) * 0.08 + 0.01;
      } //*/

      this.loadedModel.rotation.x = converge( this.loadedModel.rotation.x, this.targetRotationX, 0.005 );
      this.loadedModel.rotation.y = converge( this.loadedModel.rotation.y, this.targetRotationY, 0.005 );

			// LOCK PLAYER IN PLACE - DEBUG!!!!!!!!!!!!!!!!!!!!!!!
			/*this.loadedModel.rotation.x = 0.2;
			this.loadedModel.rotation.y = 0.0; //*/
    }

  }



  /////////////////////////////////////////////////////////////////////////////////
  load()
  {
    // CD MATERIAL
    this.cdMaterial =  new THREE.ShaderMaterial({
      uniforms: this.cdUniforms,
      fragmentShader: this.shaders.cdFragmentShader(),
      vertexShader: this.shaders.cdVertexShader(),
    });
    this.cdMaterial.transparent = true; //*/

    // INSTANTIATE GLTF LOADER FOR THE PLAYER MODEL
    const gltfLoader = new GLTFLoader();
    const url = "3dplayer/model/saeCdPlayer.glb";


    // NOTE: THIS RESULTS IN A "HTTP Status 0 received" MESSAGE WHEN IT WORKS CORRECTLY
    gltfLoader.load(url, (gltf) =>
    { // GTLF LOADER CALLBACK...

      this.loadedModel = gltf.scene;

      this.loadedModel.position.z = -2.8; // DEFAULT DESKTOP SIZE
      //this.loadedModel.position.z = -5.5; // DEFAULT DESKTOP SIZE

      this.loadedModel.position.y = 0.25;
      this.scene.add( this.loadedModel );

      this.modelLoadComplete();

      this.cdObject = this.scene.getObjectByName( "cd" );
      this.cdObject.castShadow = true;
      this.cdTray = this.scene.getObjectByName( "cdTray" );
      this.cdTray.castShadow = true;
      this.trayInset = this.scene.getObjectByName( "TrayInset" );
      this.trayInset.castShadow = true;

      // LOAD ANIMATIONS INTO DICTIONARY INDEXED BY NAME...
      this.animationMixerTray = new THREE.AnimationMixer( this.cdTray );
      this.animationMixerCd = new THREE.AnimationMixer( this.cdObject );
      for( let i=0; i<gltf.animations.length; i++ )
      {
        //logger( "SCANNING ANIMATIONS: ", i, gltf.animations[i].name );
        this.loadedAnimations[gltf.animations[i].name] = gltf.animations[i];
      }

      this.loadedModel.traverse( function(child)
      {
        // SET CD SURFACE AS CUSTOM MATERIAL
        if( child.material  &&  child.material.name == "cd" )
            child.material = this.cdMaterial; // <-----------------

        // TURN ON SHADOWS FOR ALL MESHES
        if( child.isMesh == true )
          child.receiveShadow = true;

        //if( child.name == "

      }.bind(this) ); //*/


      // OPEN TRAY INSTANTLY (300X SPEED)
      this.openTray( 300 );
    });



  }



  //////////////////////////////////////////////////////////////////////////////
  // UNFINISHED, STILL TO BE DETERMINED HOW THIS INTERFACE IS GOING TO WORK
  // NEEDS REFACTORING
  playAnimation( animationName, rate = 1.0 )
  {
    logger( "------> GRAPHICS: PLAY ANIMATION: ", animationName );

    this.animationMixerTray.stopAllAction();
    this.animationMixerCd.stopAllAction();

    this.currentClip = this.loadedAnimations[ animationName ];
    if( this.currentClip )
    {
      this.currentAction = this.animationMixerTray.clipAction( this.currentClip );
      this.currentAction.clampWhenFinished = true;
      this.currentAction.setLoop( THREE.LoopOnce );
      this.currentAction.timeScale = rate; // OPEN INSTANTLY SO IT LOOKS LIKE IT STARTS OPENED
      this.currentAction.play(); //*/

      this.currentActionCd = this.animationMixerCd.clipAction( this.currentClip );
      this.currentActionCd.clampWhenFinished = true;
      this.currentActionCd.setLoop( THREE.LoopOnce );
      this.currentActionCd.timeScale = rate; // OPEN INSTANTLY SO IT LOOKS LIKE IT STARTS OPENED
      this.currentActionCd.play(); //*/
    }

  }


  ////////////////////////////////////////////////////////////////////////
  // NEEDS REFACTORING
  openTray( rate = 1.0 )
  {
    this.playAnimation( "TrayOpen", rate );
    this.trayOpen = true;
    if( rate == 1.0 )
      this.cdObject.rotation.y = random( 1000 )/300.0;

  }


  ////////////////////////////////////////////////////////////////////////
  // NEEDS REFACTORING
  closeTray()
  {
    this.trayOpen = false;
    this.animationMixerTray.stopAllAction();
    this.animationMixerCd.stopAllAction();
    this.currentAction.timeScale = -1;
    this.currentAction.time = this.currentAction.getClip().duration;
    this.currentAction.play();//*/
    this.currentActionCd.timeScale = -1;
    this.currentActionCd.time = this.currentActionCd.getClip().duration;
    this.currentActionCd.play();//*/
  }


	//////////////////////////////////////////////////////////////////////////
	isTrayOpen()
	{
		return this.trayOpen;
	}


  ////////////////////////////////////////////////////////////////////////
  modelLoadComplete()
  {
    this.numericDisplay.load();
    this.panelLeds.load();
  }


  ////////////////////////////////////////////////////////////////////////////////
  getModel()
  {
    return this.loadedModel;
  }


}
















