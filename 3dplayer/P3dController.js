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
  BUTTON_UP: 'ButtonUp'
}


// THIS MAY NOT BE USED, STILL DECIDING IF BUTTON ANIMATIONS ARE WORTH IT...
/*export const Animation = {
  ANIMATION_TRAY_OPEN: 'TrayOpen',
  ANIMATION_BUTTON_PLAY: 'ButtonPlay',
  ANIMATION_BUTTON_PAUSE: 'ButtonPause',
  ANIMATION_BUTTON_NEXT: 'ButtonNext',
  ANIMATION_BUTTON_PREV: 'ButtonPrev',
  ANIMATION_BUTTON_STOP: 'ButtonStop',
  ANIMATION_BUTTON_STANDBY: 'ButtonStandby',
  ANIMATION_BUTTON_REWIND: 'ButtonRewind',
  ANIMATION_BUTTON_FAST_FORWARD: 'ButtonFastForward',
  ANIMATION_BUTTON_BASS_DOWN: 'ButtonBassDown',
  ANIMATION_BUTTON_BASS_UP: 'ButtonBassUp',
  ANIMATION_BUTTON_TREBLE_DOWN: 'ButtonTrebDown',
  ANIMATION_BUTTON_TREBLE_UP: 'ButtonTrebUp',
  ANIMATION_BUTTON_VOL_DOWN: 'ButtonVolDown',
  ANIMATION_BUTTON_VOL_UP: 'ButtonVolUp'
}  //*/



export const TransportMode = {
  TRAY_OPEN:'TrayOpen',
  TRAY_OPENING:'TrayOpening',
  TRAY_CLOSING:'TrayClosing',
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


  ////////////////////////////////////////////////////////////////////////////
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
