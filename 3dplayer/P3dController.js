// P3dController.js
//
// MAIN APP CONTROLLER: LOADS/CONNECTS THE USER INTERFACE SUBSYSTEM
// AND MEDIA TRANSPORT SUBSYSTEM.
//
///////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import P3dUserInterface from './P3dUserInterface.js'
import P3dTransport from './P3dTransport.js'
//-----------------------------------------------------------------------------------




export const ButtonEvent = {
  NONE: 'ButtonNone',
  BUTTON_DOWN_PLAY: 'ButtonDownPlay',
  BUTTON_DOWN_PAUSE: 'ButtonDownPause',
  BUTTON_UP: 'ButtonUp'
}


export const Mode = {
  TRAY_OPEN:'TrayOpen',
  TRAY_OPENING:'TrayOpening',
  TRAY_CLOSING:'TrayClosing',
  PLAYING:'Playing',
  STARTING_PLAY:'StartingPlay',
  PAUSED:'Paused',
  STOPPED:'Stopped',
  STANDBY:'Standby'
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

    this.display = new P3dUserInterface( this, windowWidth, windowHeight, renderer );
    this.display.run();

  }

  /////////////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    this.transport.processButtonEvent( buttonEvent );
  }
  
  /////////////////////////////////////////////////////////////////////////////
  getPlaybackTime()
  {
    return this.transport.getPlaybackTime();
  }
  
  /////////////////////////////////////////////////////////////////////////////
  getStatus()
  {
    return this.transport.getStatus();
  }
  
  
  
}
