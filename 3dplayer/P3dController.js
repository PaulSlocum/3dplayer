// P3dController.js
//
// MAIN APP CONTROLLER: LOADS/CONNECTS THE USER INTERFACE SUBSYSTEM
// AND MEDIA TRANSPORT SUBSYSTEM.
//
///////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { P3dUserInterface } from './P3dUserInterface.js'
import { P3dTransport } from './P3dTransport.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------




export const ButtonEvent = {
  NONE: 'ButtonNone',
  BUTTON_DOWN_PLAY: 'ButtonPlay',
  BUTTON_DOWN_PAUSE: 'ButtonPause',
  BUTTON_DOWN_NEXT: 'ButtonNext',
  BUTTON_DOWN_PREV: 'ButtonPrev',
  BUTTON_DOWN_STOP: 'ButtonStop',
  BUTTON_DOWN_OPEN: 'ButtonOpen',
  BUTTON_DOWN_STANDBY: 'ButtonStandby',
  BUTTON_DOWN_REWIND: 'ButtonRewind',
  BUTTON_DOWN_FAST_FORWARD: 'ButtonFastForward',
  BUTTON_DOWN_BASS_DOWN: 'ButtonBassDown',
  BUTTON_DOWN_BASS_UP: 'ButtonBassUp',
  BUTTON_DOWN_TREBLE_DOWN: 'ButtonTrebDown',
  BUTTON_DOWN_TREBLE_UP: 'ButtonTrebUp',
  BUTTON_DOWN_VOL_DOWN: 'ButtonVolDown',
  BUTTON_DOWN_VOL_UP: 'ButtonVolUp',
  BUTTON_DOWN_FX_DOWN: 'ButtonFxDown',
  BUTTON_DOWN_FX_UP: 'ButtonFxUp', 
  BUTTON_DOWN_REPEAT_ALL: 'ButtonRepeatAll',
  BUTTON_DOWN_REMAINING_TIME_MODE: 'ButtonTimeMode',
  BUTTON_UP: 'ButtonUp'
}



export const TransportMode = {
  TRAY_OPEN:'TrayOpen',
  TRAY_OPENING:'TrayOpening',
  TRAY_CLOSING:'TrayClosing',
  TRAY_CLOSING_PLAY:'TrayClosingPlay',
  PLAYING:'Playing',
  STARTING_PLAY:'StartingPlay',
  PAUSED:'Paused',
  SEEK:'Seek',
  STOPPED:'Stopped',
  SHUTDOWN:'Shutdown',
  STARTUP: 'Startup',
  STANDBY:'Standby'
}






//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dController {


  ///////////////////////////////////////////////////////////////////////
  constructor( filenameList, windowWidth, windowHeight, renderer ) 
  {
    logger( "---->CONTROLLER CONSTRUCTOR" );

    this.height = windowWidth;
    this.width = windowHeight;

    this.transport = new P3dTransport( this, filenameList );
    this.userInterface = new P3dUserInterface( this, windowWidth, windowHeight, renderer );
  }


  ///////////////////////////////////////////////////////////////////////////
  // START THE PROGRAM RUNNING (BLOCKING CALL)
  run()
  {
    this.userInterface.run();
  }



  // ~      -     ~      -     ~      -     ~      -     ~      -     ~      -     
  
  
  ///////////////////////////////////////////////////////////////////////////
  setBackgroundColor( color )
  {
    this.userInterface.setBackgroundColor( color );
  }


  
  // ~      -     ~      -     ~      -     ~      -     ~      -     ~      -     
  
  

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
  
  /////////////////////////////////////////////////////////////////////////////
  getNumberOfTracks()
  {
    return this.transport.getNumberOfTracks();
  }
  
  /////////////////////////////////////////////////////////////////////////////
  getStatus()
  {
    return this.transport.getStatus();
  }

  ////////////////////////////////////////////////////////////////////////////
  getVolume()
  {
    return this.transport.getVolume();
  }
  
  ////////////////////////////////////////////////////////////////////////////
  getTreble()
  {
    return this.transport.getTreble();
  }
  
  ////////////////////////////////////////////////////////////////////////////
  getBass()
  {
    return this.transport.getBass();
  }
  
  /////////////////////////////////////////////////////////////////////////////
  getFxMode()
  {
    return this.transport.getFxMode();
  }

  ////////////////////////////////////////////////////////////////////////////
  getRepeatAll()
  {
    return this.transport.getRepeatAll();
  }

  ////////////////////////////////////////////////////////////////////////////
  getRemainingTimeMode()
  {
    return this.transport.getRemainingTimeMode();
  }
  
  /////////////////////////////////////////////////////////////////////////////
  getRemainingTrackTimeSec()
  {
    return this.transport.getTrackLengthSec();
  }

  /////////////////////////////////////////////////////////////////////////////
  getTrackLengthSec()
  {
    return this.transport.getTrackLengthSec();
  }
  



  ////////////////////////////////////////////////////////////////////////////
  // THERE TWO TRAY ANIMATION FUNCTIONS ARE CONFUSING...
  // THESE CAN BE ELIMINATED BY CREATING A "GET_TRAY_STATUS()" FUNCTION THAT 
  // RETURNS WHETHER THE TRAY IS OPEN OR CLOSED
  closeTray()
  {
    this.userInterface.closeTray();
  }
  ////////////////////////////////////////////////////////////////////////////
  openTray()
  {
    this.userInterface.openTray();
  }


  
  
  
  
}
