// P3dUIGraphics.js
//
// BASE GRAPHICS CLASS THAT OPERATES THE CAMERA AND LOADS OTHER GRAPHICS COMPONENTS.
// INCLUDES FUNCTION TO DETERMINE CLICKED SCENE COMPONENTS FROM CAMERA PERSPECTIVE
// BASED ON SCREEN COORDINATES.
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
//import { P3dAppController } from "./P3dAppController.js";
import { P3dSwarm } from "./P3dUIParticles.js";
import { P3dPlayerModel } from "./P3dUIPlayerModel.js";
import { P3dRoom } from "./P3dUIRoom.js";
import { P3dLights } from "./P3dUILights.js";
import { P3dSequencer } from "./P3dUISequencer.js";
import { TransportMode } from "./P3dAppController.js";
// ~   -   ~   -   ~   -   ~   -   ~   -   ~   -
import { logger } from "./P3dLog.js";
import { converge, random } from "./P3dUtility.js";
//-----------------------------------------------------------------------------------



//=====================================================================================
// UTILITY FUNCTION  -  THIS SHOULD PROBABLY BE MOVED TO CONTROLLER
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

//=====================================================================================
// UTILITY FUNCTION  -  THIS SHOULD PROBABLY BE MOVED TO CONTROLLER
window.mobileAndTabletcheck = function()
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dGraphics
{

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer )
  {
    logger("---->GRAPHICS CLASS CONSTRUCTOR");

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    //  ~   -   ~   -   ~   -   ~   -   ~   -   ~   -

    // ENABLE SHADOWS
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //  ~   -   ~   -   ~   -   ~   -   ~   -   ~   -

    this.isMobileDevice = window.mobilecheck();
    this.isTabletDevice = window.mobileAndTabletcheck();

    //  ~   -   ~   -   ~   -   ~   -   ~   -   ~   -

    this.scene = new THREE.Scene();

    // NOTE: PerspectiveCamera( FOV : NUMBER, ASPECT : NUMBER, NEAR : NUMBER, FAR : NUMBER )
    this.camera = new THREE.PerspectiveCamera( 38, windowWidth/windowHeight, 0.1, 1000 );
    this.cameraFrustum = null;

    this.raycaster = new THREE.Raycaster();

    //  ~   -   ~   -   ~   -   ~   -   ~   -   ~   -

		this.cameraSetup();

    //  ~   -   ~   -   ~   -   ~   -   ~   -   ~   -

    this.lights = new P3dLights( this.scene );
    this.particles = new P3dSwarm( this.scene, this.renderer, true );
    this.particles.setScreenEdgePosition( this.screenEdgePosition );
    this.particles2 = new P3dSwarm( this.scene, this.renderer, false );
    this.particles2.setScreenEdgePosition( this.screenEdgePosition );

    this.roomCube = new P3dRoom();
    this.scene.add( this.roomCube ); //*/
    //this.playerModel = null;
    this.playerModel = new P3dPlayerModel( appController, this.scene );
    this.playerModel.load();
    this.sequencer = new P3dSequencer( this );

		this.frameCounter = 0;
		this.startTimeMSec = 0;

    //  ~   -   ~   -   ~   -   ~   -   ~   -   ~   -

  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  run()
  {
  	//if( this.frameCounter == 0 )
  	//	this.startTimeMSec = performance.now();

  	this.frameCounter++;

		// FRAMES PER SECOND DISPLAY...
  	/*if( this.frameCounter%60 == 0 )
  	{
  		logger( "=============> FRAMES PER SECOND: ", this.frameCounter * 1000 / (performance.now() - this.startTimeMSec),
  																							this.frameCounter, performance.now(), this.startTimeMSec );
  		this.frameCounter = 0;
  		this.startTimeMSec = performance.now();
    } //*/

    requestAnimationFrame( this.run.bind(this) );

		if( this.playerModel != null )
			this.playerModel.update();

		this.particles.update();
		this.particles2.update();
		this.lights.update();
		this.roomCube.update();
		this.sequencer.update();

    // RENDER!
    this.renderer.render( this.scene, this.camera );
  }






  ///////////////////////////////////////////////////////////////////////////
  // THIS NEEDS TO BE FIXED TO WORK WITH NEW SHADER SYSTEM (LOW PRIORITY)
  /*setBackgroundColor( color )
  {
    this.uniforms["colorA"] = { type: "vec3", value: new THREE.Color( color ) };
    this.uniforms["colorB"] = { type: "vec3", value: new THREE.Color( color ) };
  } //*/



	/////////////////////////////////////////////////////////////////////////////////
	cameraSetup()
	{
    // SET CAMERA POSITION
    const cameraZOffset = 1.9;

    this.camera.position.z = 5.5+cameraZOffset;
    if( this.isMobileDevice == true )
    { // ZOOM IN A LOT FOR PHONES
      this.camera.position.z = 4.0+cameraZOffset;
      this.camera.position.y = -0.1;
    }
    else
    { // ZOOM IN A LITTLE FOR TABLETS
      if( this.isTabletDevice == true )
      {
        this.camera.position.z = 4.5+cameraZOffset;
        this.camera.position.y = -0.1;
      }
      else
      { // ZOOM IN A LITTLE IF THE SCREEN IS REALLY WIDE
        if( this.windowWidth/this.windowHeight > 3 )
        {
          this.camera.position.z = 3.9+cameraZOffset;
          this.camera.position.y = 0.0;
        } //*/
      }
    }//*/

    // GET CAMERA FRUSTRUM
    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.cameraFrustum = new THREE.Frustum();
    this.cameraFrustum.setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse) );
    this.edgeOfWorld = 0;

    // FIND X EDGE POSITION WHEN Z=0 (USED FOR SWARM/PARTICLE EFFECTS)
    let edgePositionTest = 0;
    while( this.cameraFrustum.containsPoint( new THREE.Vector3( edgePositionTest, 0, 0 ) ) == true )
    {
      edgePositionTest++;
    }
    //logger( "------------------ EDGE POSITION:", edgePositionTest, " ------------- " )
    this.screenEdgePosition = edgePositionTest;

	}




  ////////////////////////////////////////////////////////////////////////
  getIntersectionsAtPixel( mousePosition )
  {
  	if( this.playerModel != null )
  	{
			this.raycaster.setFromCamera( mousePosition, this.camera );
			let playerModelScene = this.playerModel.getModel();
			let intersects = this.raycaster.intersectObjects( playerModelScene.children );
			return intersects;
		}
		else
		{
			return [];
		}
  }


}



