


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import { ButtonEvent } from './P3dController.js'
import P3dSound from './P3dSound.js'
//-----------------------------------------------------------------------------------


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dTransport {


  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->TRANSPORT CLASS CONSTRUCTOR");
    
    this.soundPlayer = new P3dSound();
    this.soundPlayer.loadSound( '3dplayer/sounds/clickDown.wav' );
    this.soundPlayer.loadSound( '3dplayer/sounds/clickUp.wav' );
    
  }
  
  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    switch( buttonEvent )
    {
      case ButtonEvent.BUTTON_DOWN_PLAY: console.log("---->PLAY BUTTON PRESSED (TRANSPORT!)"); 
            this.soundPlayer.playSound( '3dplayer/sounds/clickDown.wav' ); break;
      case ButtonEvent.BUTTON_DOWN_PAUSE: console.log("---->PAUSE BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( '3dplayer/sounds/clickDown.wav' ); break;
      case ButtonEvent.BUTTON_UP: console.log("---->BUTTON UP (TRANSPORT)"); 
            this.soundPlayer.playSound( '3dplayer/sounds/clickUp.wav' ); break;
      case ButtonEvent.NONE: console.log("---->NO BUTTON PRESSED (TRANSPORT)"); break;
    }
  }
  
  
}
