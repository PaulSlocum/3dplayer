
//-----------------------------------------------------------------------------------
import P3dDisplay from './P3dDisplay.js'
import P3dTransport from './P3dTransport.js'
//-----------------------------------------------------------------------------------




export const ButtonEvent = {
    NONE: 'ButtonNone',
    BUTTON_DOWN_PLAY: 'ButtonDownPlay',
    BUTTON_DOWN_PAUSE: 'ButtonDownPause',
    BUTTON_UP: 'ButtonUp'
}





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dController {


  ///////////////////////////////////////////////////////////////////////
  constructor( windowWidth, windowHeight, renderer ) 
  {
    console.log("---->CONTROLLER CONSTRUCTOR");

    this.height = windowWidth;
    this.width = windowHeight;

    this.transport = new P3dTransport();

    this.display = new P3dDisplay( this, windowWidth, windowHeight, renderer );
    this.display.run();

  }

  /////////////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    this.transport.processButtonEvent( buttonEvent );
  }
  

}
