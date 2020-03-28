// P3dTransport.js
//
// SIMULATES CD PLAYER LOGIC, SOUNDS, AND PLAYBACK USING SOUND PLAYER CLASS (P3dSound).
//
////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import { Mode, ButtonEvent } from './P3dController.js'
import P3dSoundPlayer from './P3dSound.js'
import P3dMusicPlayer from './P3dMusic.js'
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
  constructor( filenameList ) 
  {
    console.log("---->TRANSPORT CLASS CONSTRUCTOR: ", filenameList );
    
    this.soundPlayer = new P3dSoundPlayer();
    this.soundPlayer.loadSound( SoundFilenames.CLICK_DOWN );
    this.soundPlayer.loadSound( SoundFilenames.CLICK_UP );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_OPEN );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_CLOSE );

    // PRE-DECODE FIRST MUSIC TRACK
    this.musicPlayer = new P3dMusicPlayer( this );
    this.musicPlayer.decodeMusic( filenameList[1] );
    
    // PRE-DOWNLOAD THE OTHER MUSIC TRACKS
    if( filenameList.length > 1 )
    {
      for( let i=2; i<filenameList.length; i++ )
       this.musicPlayer.downloadMusic( filenameList[i] );
    }
    
    this.filenameList = filenameList;
    this.trackNumber = 1; // FIRST TRACK IS ONE (NOT ZERO)
    this.trackPlaying = false;
    
    this.status = Mode.STOPPED;
  }
  
  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    // BUTTON CLICK SOUND EFFECT
    if( buttonEvent != ButtonEvent.BUTTON_UP  &&  buttonEvent != ButtonEvent.BUTTON_UP )
      this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN ); 
  
    // BUTON FUNCTIONS...
    switch( buttonEvent )
    {
      case ButtonEvent.BUTTON_DOWN_PLAY: console.log("---->PLAY BUTTON PRESSED (TRANSPORT!)"); 
            if( this.trackPlaying == false )
            {
              console.log("---->PLAYBACK STARTING: ", this.filenameList[this.trackNumber] ); 
              this.trackPlaying = true;
              this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
              this.status = Mode.PLAYING;
            }
            break;
      case ButtonEvent.BUTTON_DOWN_PAUSE: console.log("---->PAUSE BUTTON PRESSED (TRANSPORT)"); 
            if( this.trackPlaying == true )
            {
              this.trackPlaying = false;
              this.musicPlayer.pauseMusic();    
              //this.musicPlayer.stopMusic( MUSIC_FILENAME );    
              this.status = Mode.PAUSED;
            }
            break;
      case ButtonEvent.BUTTON_DOWN_PREV: console.log("---->PREV BUTTON PRESSED (TRANSPORT)"); 
            this.previousTrack();
            break;
      case ButtonEvent.BUTTON_DOWN_NEXT: console.log("---->NEXT BUTTON PRESSED (TRANSPORT)"); 
            this.nextTrack();
            break;
      case ButtonEvent.BUTTON_DOWN_FAST_FORWARD: console.log("---->FAST FORWARD BUTTON PRESSED (TRANSPORT)"); 
            break;
      case ButtonEvent.BUTTON_DOWN_REWIND: console.log("---->REWIND BUTTON PRESSED (TRANSPORT)"); 
            break;
      case ButtonEvent.BUTTON_DOWN_STOP: console.log("---->STOP BUTTON PRESSED (TRANSPORT)"); 
            this.stop();
            break;
      case ButtonEvent.BUTTON_DOWN_STANDBY: console.log("---->STANDBY BUTTON PRESSED (TRANSPORT)"); 
            this.stop();
            /*this.trackPlaying = false;
            this.musicPlayer.rewindMusic();    
            this.trackNumber = 1; //*/
            this.status = Mode.STANDBY;
            break;
      case ButtonEvent.BUTTON_UP: console.log("---->BUTTON UP (TRANSPORT)"); 
            break;
      case ButtonEvent.NONE: console.log("---->NO BUTTON PRESSED (TRANSPORT)"); 
            break;
    }
  }
  
  /////////////////////////////////////////////////////////////////////////
  getPlaybackTime()
  {
    return this.musicPlayer.getMusicTime();
  }
  

  /////////////////////////////////////////////////////////////////////////
  getTrackNumber()
  {
    return this.trackNumber;
  }
  
  
  //////////////////////////////////////////////////////////////////////////
  getNumberOfTracks()
  {
    return this.filenameList.length;
  }
  

  //////////////////////////////////////////////////////////////////////////
  getStatus()
  {
    return this.status;
  }
  
  ///////////////////////////////////////////////////////////////////////////
  nextTrack()
  {
    if( this.trackNumber < this.filenameList.length-1 )
    {
      this.trackNumber++;
      this.trackPlaying = true;
      this.musicPlayer.rewindMusic();    
      this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
      this.status = Mode.PLAYING;
    }
  }
  
  
  ///////////////////////////////////////////////////////////////////////////
  previousTrack()
  {
    if( this.trackNumber > 1 )
    {
      this.trackNumber--;
      this.trackPlaying = true;
      this.musicPlayer.rewindMusic();    
      this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
      this.status = Mode.PLAYING;
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////
  stop()
  {
    this.trackPlaying = false;
    this.musicPlayer.rewindMusic();    
    this.trackNumber = 1;
    this.status = Mode.STOPPED;
  }
  
  
  //////////////////////////////////////////////////////////////////////////
  musicEndedCallback()
  {
    console.log( "----->TRANSPORT: SONG ENDED CALLBACK" );
    if( this.trackNumber < this.filenameList.length-1 )
      this.nextTrack();
    else
      this.stop();

  }
  
  
}
