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
import { getCanvasMousePosition } from './P3dUtility.js'
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
    event.preventDefault();
    this.touchMouseDown( event );
  }
  
  /////////////////////////////////////////////////////////////////////////
  mouseUp( event )
  {
    event.preventDefault();
    this.touchMouseUp( event );
  }


  //////////////////////////////////////////////////////////////////////////
  touchDown( event )
  {
    event.preventDefault();
    this.touchMouseDown( event.targetTouches[0] );
    //event.targetTouches[0].preventDefault();
  }
  
  
  /////////////////////////////////////////////////////////////////////////
  touchUp( event )
  {
    event.preventDefault();
    this.touchMouseUp( event.targetTouches[0] );
    //event.targetTouches[0].preventDefault();
  }


  ///////////////////////////////////////////////////////////////////////
  touchMouseDown( event )
  {
    // NEW CODE TO CONVERT TO WEBGL COORDS...
    var pos = getCanvasMousePosition( event, this.renderer.domElement );
    let mouse = new THREE.Vector2();
    mouse.x = pos.x / this.renderer.domElement.width  *  2 - 1;
    mouse.y = pos.y / this.renderer.domElement.height * -2 + 1;

    let intersects = this.graphics.getIntersectionsAtPixel( mouse );
    for ( let i = 0; i < intersects.length; i++ ) 
    {
      let objectName = intersects[i].object.name;
      if( objectName.startsWith( "Button" ) )
      {
        this.appController.processButtonEvent( objectName ); 
        //this.graphics.playAnimation( objectName ); // STILL DECIDING ABOUT BUTTON ANIMATIONS
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
    //this.graphics.resetAnimation(); // STILL DECIDING ABOUT BUTTON ANIMATIONS

    if( this.buttonDown == true )
    {
      this.buttonDown = false;
      this.appController.processButtonEvent( ButtonEvent.BUTTON_UP ); 
    }
  }


  ////////////////////////////////////////////////////////////////////////
  run()
  {
    this.graphics.run();
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  openTray()
  {
    this.graphics.openTray();
  }


  ////////////////////////////////////////////////////////////////////////
  closeTray()
  {
    this.graphics.closeTray();
  }


  ////////////////////////////////////////////////////////////////////////
  // STILL DECIDING ON IMPLEMENTATION OF THIS...
  /*playAnimation( animationName )
  {
    this.graphics.playAnimation( animationName );
  }//*/
  


  ///////////////////////////////////////////////////////////////////////////
  setBackgroundColor( color )
  {
    this.graphics.setBackgroundColor( color );
  }


}



