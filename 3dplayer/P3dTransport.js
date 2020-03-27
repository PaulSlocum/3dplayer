// P3dTransport.js
//
// SIMULATES CD PLAYER LOGIC, SOUNDS, AND PLAYBACK USING SOUND PLAYER CLASS (P3dSound).
//
////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import { Mode, ButtonEvent } from './P3dController.js'
import P3dSoundPlayer from './P3dSound.js'
//-----------------------------------------------------------------------------------



export const SoundFilenames = {
    CLICK_DOWN: '3dplayer/sounds/clickDown.wav',
    CLICK_UP: '3dplayer/sounds/clickDown.wav',
    TRAY_OPEN: '3dplayer/sounds/cdDiscOut.wav',
    TRAY_CLOSE: '3dplayer/sounds/cdDiscIn.wav'
}

//const MUSIC_FILENAME = 'music/expansion.mp3';




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dTransport {


  ///////////////////////////////////////////////////////////////////////
  constructor( filenameList ) 
  {
    console.log("---->TRANSPORT CLASS CONSTRUCTOR: ", filenameList );
    
    this.soundPlayer = new P3dSoundPlayer();
    this.soundPlayer.loadSound( SoundFilenames.CLICK_DOWN );
    this.soundPlayer.loadSound( SoundFilenames.CLICK_UP );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_OPEN );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_CLOSE );
    
    this.soundPlayer.downloadMusic( filenameList[1] );
    
    this.filenameList = filenameList;
    this.trackNumber = 1; // FIRST TRACK IS ONE (NOT ZERO)
    
    this.trackPlaying = false;
    
    this.status = Mode.STOPPED;
  }
  
  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    switch( buttonEvent )
    {
      case ButtonEvent.BUTTON_DOWN_PLAY: console.log("---->PLAY BUTTON PRESSED (TRANSPORT!)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN ); 
            if( this.trackPlaying == false )
            {
              console.log("---->PLAYBACK STARTING: ", this.filenameList[this.trackNumber] ); 
              this.trackPlaying = true;
              this.soundPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
              this.status = Mode.PLAYING;
            }
            break;
      case ButtonEvent.BUTTON_DOWN_PAUSE: console.log("---->PAUSE BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN );
            if( this.trackPlaying == true )
            {
              this.trackPlaying = false;
              this.soundPlayer.pauseMusic();    
              //this.soundPlayer.stopMusic( MUSIC_FILENAME );    
              this.status = Mode.PAUSED;
            }
            break;
      case ButtonEvent.BUTTON_DOWN_PREV: console.log("---->PREV BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN );
            break;
      case ButtonEvent.BUTTON_DOWN_NEXT: console.log("---->NEXT BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN );
            break;
      case ButtonEvent.BUTTON_DOWN_FAST_FORWARD: console.log("---->FAST FORWARD BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN );
            break;
      case ButtonEvent.BUTTON_DOWN_REWIND: console.log("---->REWIND BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN );
            break;
      case ButtonEvent.BUTTON_DOWN_STOP: console.log("---->STOP BUTTON PRESSED (TRANSPORT)"); 
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN );
            if( this.trackPlaying == true )
            {
              this.trackPlaying = false;
              this.soundPlayer.pauseMusic();    
              //this.soundPlayer.stopMusic( MUSIC_FILENAME );    
            }
            this.status = Mode.STOPPED;
            break;
      case ButtonEvent.BUTTON_DOWN_STANDBY: console.log("---->STANDBY BUTTON PRESSED (TRANSPORT)"); 
            if( this.trackPlaying == true )
            {
              this.trackPlaying = false;
              this.soundPlayer.pauseMusic();    
              //this.soundPlayer.stopMusic( MUSIC_FILENAME );    
            }
            this.status = Mode.STANDBY;
            this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN );
            break;
      case ButtonEvent.BUTTON_UP: console.log("---->BUTTON UP (TRANSPORT)"); 
            //this.soundPlayer.playSound( SoundFilenames.CLICK_UP ); 
            break;
      case ButtonEvent.NONE: console.log("---->NO BUTTON PRESSED (TRANSPORT)"); break;
    }
  }
  
  /////////////////////////////////////////////////////////////////////////
  getPlaybackTime()
  {
    return this.soundPlayer.getMusicTime();
  }
  
  //////////////////////////////////////////////////////////////////////////
  getStatus()
  {
    return this.status;
  }
  
}
