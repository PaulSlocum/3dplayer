// P3dUI.js
//
// HANDLES MOUSE/TOUCH EVENTS AND SETS UP THE GRAPHICS SUBSYSTEM CLASS (P3dGraphics).
//
/////////////////////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
//import { P3dAppController } from "./P3dAppController.js";
import { P3dGraphics } from "./P3dUIGraphics.js";
import { ButtonEvent } from "./P3dAppController.js";
import { logger } from "./P3dLog.js";
import { getCanvasMousePosition } from "./P3dUtility.js";
//-----------------------------------------------------------------------------------




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dUserInterface
{


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer )
  {
    logger( "---->DISPLAY CLASS CONSTRUCTOR" );

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    this.graphics = new P3dGraphics( appController, windowWidth, windowHeight, renderer );

    // MOUSE/TOUCH HANDLING
    document.addEventListener( "mousedown", this._mouseDown.bind(this), false );
    document.addEventListener( "mouseup", this._mouseUp.bind(this), false );
    document.addEventListener( "touchstart", this._touchDown.bind(this), false);
    document.addEventListener( "touchcancel", this._touchUp.bind(this), false);
    document.addEventListener( "touchend", this._touchUp.bind(this), false);
  }



  ////////////////////////////////////////////////////////////////////////
  run()
  {
    this.graphics.run();
  }



  ///////////////////////////////////////////////////////////////////////////
  // DISABLED UNTIL RE-IMPLMENTATION OF THIS FEATURE IN THE SHADER SYSTEM
  /*setBackgroundColor( color )
  {
    this.graphics.setBackgroundColor( color );
  } //*/



	//  ~     -       ~     -       ~     -       ~     -       ~     -       ~



  //////////////////////////////////////////////////////////////////////////
  _mouseDown( event )
  {
    event.preventDefault();
    this._touchMouseDown( event );
  }

  /////////////////////////////////////////////////////////////////////////
  _mouseUp( event )
  {
    event.preventDefault();
    this._touchMouseUp( event );
  }


  //////////////////////////////////////////////////////////////////////////
  _touchDown( event )
  {
    event.preventDefault();
    this._touchMouseDown( event.targetTouches[0] );
    //event.targetTouches[0].preventDefault();
  }


  /////////////////////////////////////////////////////////////////////////
  _touchUp( event )
  {
    event.preventDefault();
    this._touchMouseUp( event.targetTouches[0] );
    //event.targetTouches[0].preventDefault();
  }


  ///////////////////////////////////////////////////////////////////////
  _touchMouseDown( event )
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
				// SEND BUTTON TO APP CONTROLLER/TRANSPORT
        this.appController.processButtonEvent( objectName );
        //this.graphics.playAnimation( objectName ); // <--- STILL DECIDING ABOUT BUTTON ANIMATIONS, DON'T DELETE YET...
      }

			// HANDLE SPECIAL BUTTONS THAT DIRECTLY AFFECT THE STATUS DISPLAY MODE...
      switch( objectName )
      {
        case ButtonEvent.BUTTON_DOWN_BASS_DOWN:
        case ButtonEvent.BUTTON_DOWN_BASS_UP:
          this.graphics.playerModel.numericDisplay.showBass();
          break;
        case ButtonEvent.BUTTON_DOWN_TREBLE_DOWN:
        case ButtonEvent.BUTTON_DOWN_TREBLE_UP:
          this.graphics.playerModel.numericDisplay.showTreble();
          break;
        case ButtonEvent.BUTTON_DOWN_VOL_DOWN:
        case ButtonEvent.BUTTON_DOWN_VOL_UP:
          this.graphics.playerModel.numericDisplay.showVolume();
          break;
        case ButtonEvent.BUTTON_DOWN_FX_DOWN:
        case ButtonEvent.BUTTON_DOWN_FX_UP:
          this.graphics.playerModel.numericDisplay.showFxMode();
          break;
        default:
          this.graphics.playerModel.numericDisplay.showNormalDisplay();
      }
    } //*/

  }


  ///////////////////////////////////////////////////////////////////////
  _touchMouseUp( event )
  {
    this.appController.processButtonEvent( ButtonEvent.BUTTON_UP );
  }




}















