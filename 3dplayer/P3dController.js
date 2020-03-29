// P3dController.js
//
// MAIN APP CONTROLLER: LOADS/CONNECTS THE USER INTERFACE SUBSYSTEM
// AND MEDIA TRANSPORT SUBSYSTEM.
//
///////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import P3dUserInterface from './P3dUserInterface.js'
import P3dTransport from './P3dTransport.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------




export const ButtonEvent = {
  NONE: 'ButtonNone',
  BUTTON_DOWN_PLAY: 'ButtonPlay',
  BUTTON_DOWN_PAUSE: 'ButtonPause',
  BUTTON_DOWN_NEXT: 'ButtonNext',
  BUTTON_DOWN_PREV: 'ButtonPrev',
  BUTTON_DOWN_STOP: 'ButtonStop',
  BUTTON_DOWN_STANDBY: 'ButtonStandby',
  BUTTON_DOWN_REWIND: 'ButtonRewind',
  BUTTON_DOWN_FAST_FORWARD: 'ButtonFastForward',
  BUTTON_DOWN_BASS_DOWN: 'ButtonBassDown',
  BUTTON_DOWN_BASS_UP: 'ButtonBassUp',
  BUTTON_DOWN_TREBLE_DOWN: 'ButtonTrebDown',
  BUTTON_DOWN_TREBLE_UP: 'ButtonTrebUp',
  BUTTON_DOWN_VOL_DOWN: 'ButtonVolDown',
  BUTTON_DOWN_VOL_UP: 'ButtonVolUp',
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
  constructor( filenameList, windowWidth, windowHeight, renderer ) 
  {
    logger( "---->CONTROLLER CONSTRUCTOR", renderer );

    this.height = windowWidth;
    this.width = windowHeight;

    this.transport = new P3dTransport( filenameList );

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
  getTrackNumber()
  {
    return this.transport.getTrackNumber();
  }
  
  
  getNumberOfTracks()
  {
    return this.transport.getNumberOfTracks();
  }
  
  /////////////////////////////////////////////////////////////////////////////
  getStatus()
  {
    return this.transport.getStatus();
  }
  
  
  
}
