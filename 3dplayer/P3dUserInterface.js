// P3dUserInterface.js
//
// USER INTERFACE SUBSYSTEM THAT HANDLES MOUSE/TOUCH EVENTS AND CONTAINS CLASSES
// TO DRIVE THE GRAPHICS.
//
/////////////////////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import P3dGraphics from './P3dGraphics.js'
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

    this.graphics = new P3dGraphics( appController, windowWidth, windowHeight, renderer );


    // MOUSE HANDLING
    this.raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousedown', this.mouseDown.bind(this), false );
    document.addEventListener( 'mouseup', this.mouseUp.bind(this), false );
    document.addEventListener('touchstart', this.mouseDown.bind(this), false);
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
    /*this.raycaster.setFromCamera( mouse, this.camera );

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


  run()
  {
    this.graphics.run();
  }

}
