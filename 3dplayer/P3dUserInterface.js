// P3dUserInterface.js
//
// HANDLES MOUSE/TOUCH EVENTS AND SETS UP THE GRAPHICS SUBSYSTEM CLASS (P3dGraphics)
//
/////////////////////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import P3dGraphics from './P3dGraphics.js'
import { ButtonEvent } from './P3dController.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------






//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dUserInterface 
{


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer ) 
  {
    //console.log("---->DISPLAY CLASS CONSTRUCTOR" );
    logger( "---->DISPLAY CLASS CONSTRUCTOR" );

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    this.graphics = new P3dGraphics( appController, windowWidth, windowHeight, renderer );

    // MOUSE/TOUCH HANDLING
    document.addEventListener( 'mousedown', this.mouseDown.bind(this), false );
    document.addEventListener( 'mouseup', this.mouseUp.bind(this), false );
    document.addEventListener('touchstart', this.touchDown.bind(this), false);
    document.addEventListener('touchcancel', this.touchUp.bind(this), false);
    document.addEventListener('touchend', this.touchUp.bind(this), false);
  }

  //////////////////////////////////////////////////////////////////////////
  mouseDown( event )
  {
    this.touchMouseDown( event );
  }
  
  /////////////////////////////////////////////////////////////////////////
  mouseUp( event )
  {
    this.touchMouseUp( event );
  }


  //////////////////////////////////////////////////////////////////////////
  touchDown( event )
  {
    this.touchMouseDown( event.targetTouches[0] );
    event.targetTouches[0].preventDefault();
  }
  
  /////////////////////////////////////////////////////////////////////////
  touchUp( event )
  {
    this.touchMouseUp( event.targetTouches[0] );
    event.targetTouches[0].preventDefault();
  }


  ///////////////////////////////////////////////////////////////////////
  touchMouseDown( event )
  {
    let mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / this.windowWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / this.windowHeight ) * 2 + 1;

    // DEBUG
    //console.log( "---->DISPLAY MOUSE X: ", mouse.x );
    //this.graphics.debugIndicator( mouse.x );

    let intersects = this.graphics.getIntersectionsAtPixel( mouse );
    for ( let i = 0; i < intersects.length; i++ ) 
    {
      let objectName = intersects[i].object.name;
      if( objectName.startsWith( "Button" ) )
      {
        this.appController.processButtonEvent( objectName ); 
        this.graphics.playAnimation( objectName );
      }
      switch( objectName )
      {
        case ButtonEvent.BUTTON_DOWN_BASS_DOWN:
        case ButtonEvent.BUTTON_DOWN_BASS_UP:
          this.graphics.numericDisplay.showBass();
          break;
        case ButtonEvent.BUTTON_DOWN_TREBLE_DOWN:
        case ButtonEvent.BUTTON_DOWN_TREBLE_UP:
          this.graphics.numericDisplay.showTreble();
          break;
        case ButtonEvent.BUTTON_DOWN_VOL_DOWN:
        case ButtonEvent.BUTTON_DOWN_VOL_UP:
          this.graphics.numericDisplay.showVolume();
          break;
      }
    } //*/



  }


  ///////////////////////////////////////////////////////////////////////
  touchMouseUp( event )
  {
    this.graphics.resetAnimation();

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
  
  
  playAnimation( animationName )
  {
    this.graphics.playAnimation( animationName );
  }

}
