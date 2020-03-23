// P3dUserInterface.js
//
// HANDLES MOUSE/TOUCH EVENTS AND SETS UP THE GRAPHICS SUBSYSTEM CLASS (P3dGraphics)
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

    // MOUSE/TOUCH HANDLING (TOUCH DOESN'T WORK YET)
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
    mouse.x = ( event.clientX / this.windowWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / this.windowHeight ) * 2 + 1;

    var intersects = this.graphics.getIntersectionsAtPixel( mouse );
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
