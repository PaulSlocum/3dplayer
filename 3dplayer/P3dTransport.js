


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import { ButtonEvent } from './P3dController.js'
import P3dSound from './P3dSound.js'
//-----------------------------------------------------------------------------------



export const SoundFilenames = {
    CLICK_DOWN: '3dplayer/sounds/clickDown.wav',
    CLICK_UP: '3dplayer/sounds/clickDown.wav',
    TRAY_OPEN: '3dplayer/sounds/cdDiscOut.wav',
    TRAY_CLOSE: '3dplayer/sounds/cdDiscIn.wav'
}




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dTransport {


  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->TRANSPORT CLASS CONSTRUCTOR");
    
    this.soundPlayer = new P3dSound();
    this.soundPlayer.loadSound( SoundFilenames.CLICK_DOWN );
    this.soundPlayer.loadSound( SoundFilenames.CLICK_UP );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_OPEN );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_CLOSE );
    
  }
  
  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    switch( buttonEvent )
    {
      case ButtonEvent.BUTTON_DOWN_PLAY: console.log("---->PLAY BUTTON PRESSED (TRANSPORT!)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN ); break;
      case ButtonEvent.BUTTON_DOWN_PAUSE: console.log("---->PAUSE BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN ); break;
      case ButtonEvent.BUTTON_UP: console.log("---->BUTTON UP (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_UP ); break;
      case ButtonEvent.NONE: console.log("---->NO BUTTON PRESSED (TRANSPORT)"); break;
    }
  }
  
  
}
