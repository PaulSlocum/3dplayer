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
import { logger } from './P3dLog.js'
///-----------------------------------------------------------------------------------



export const SoundFilenames = {
    CLICK_DOWN: '3dplayer/sounds/clickDown.wav',
    CLICK_UP: '3dplayer/sounds/clickDown.wav',
    TRAY_OPEN: '3dplayer/sounds/cdDiscOut.wav',
    TRAY_CLOSE: '3dplayer/sounds/cdDiscIn.wav'
}



const MAX_AUDIO_SETTING_VALUE = 9;
const MIDDLE_AUDIO_SETTING_VALUE = 5;


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dTransport {


  ///////////////////////////////////////////////////////////////////////
  constructor( filenameList ) 
  {
    logger("---->TRANSPORT CLASS CONSTRUCTOR: ", filenameList );
    
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
    
    this.treble = MIDDLE_AUDIO_SETTING_VALUE;
    this.bass = MIDDLE_AUDIO_SETTING_VALUE;
    this.volume = MAX_AUDIO_SETTING_VALUE;
    
    
    this.status = Mode.STOPPED;
  }
  
  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    logger( "------>BUTTON PRESS: ", buttonEvent );
  
    // BUTTON CLICK SOUND EFFECT
    if( buttonEvent != ButtonEvent.BUTTON_UP  &&  buttonEvent != ButtonEvent.BUTTON_UP )
      this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN ); 
  
    // BUTON FUNCTIONS...
    switch( buttonEvent )
    {
      case ButtonEvent.BUTTON_DOWN_PLAY: logger("---->PLAY BUTTON PRESSED (TRANSPORT!)"); 
            if( this.trackPlaying == false )
            {
              logger("---->PLAYBACK STARTING: ", this.filenameList[this.trackNumber] ); 
              this.trackPlaying = true;
              this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
              this.status = Mode.PLAYING;
            }
            break;
      case ButtonEvent.BUTTON_DOWN_PAUSE: logger("---->PAUSE BUTTON PRESSED (TRANSPORT)"); 
            if( this.trackPlaying == true )
            {
              this.trackPlaying = false;
              this.musicPlayer.pauseMusic();    
              //this.musicPlayer.stopMusic( MUSIC_FILENAME );    
              this.status = Mode.PAUSED;
            }
            break;
      case ButtonEvent.BUTTON_DOWN_PREV: logger("---->PREV BUTTON PRESSED (TRANSPORT)"); 
            this.previousTrack();
            break;
      case ButtonEvent.BUTTON_DOWN_NEXT: logger("---->NEXT BUTTON PRESSED (TRANSPORT)"); 
            this.nextTrack();
            break;
      case ButtonEvent.BUTTON_DOWN_FAST_FORWARD: logger("---->FAST FORWARD BUTTON PRESSED (TRANSPORT)"); 
            break;
      case ButtonEvent.BUTTON_DOWN_REWIND: logger("---->REWIND BUTTON PRESSED (TRANSPORT)"); 
            break;
      case ButtonEvent.BUTTON_DOWN_STOP: logger("---->STOP BUTTON PRESSED (TRANSPORT)"); 
            this.stop();
            break;
      case ButtonEvent.BUTTON_DOWN_STANDBY: logger("---->STANDBY BUTTON PRESSED (TRANSPORT)"); 
            this.stop();
            /*this.trackPlaying = false;
            this.musicPlayer.rewindMusic();    
            this.trackNumber = 1; //*/
            this.status = Mode.STANDBY;
            break;
      case ButtonEvent.BUTTON_UP: logger("---->BUTTON UP (TRANSPORT)"); 
            break;
      case ButtonEvent.NONE: logger("---->NO BUTTON PRESSED (TRANSPORT)"); 
            break;

      case ButtonEvent.BUTTON_DOWN_BASS_DOWN:
            this.bass -= 1;
            if( this.bass < 0 )
              this.bass = 0;
            this.musicPlayer.setBass( (this.bass - MIDDLE_AUDIO_SETTING_VALUE) * 1.5 );
            break;
      case ButtonEvent.BUTTON_DOWN_BASS_UP:
            this.bass += 1;
            if( this.bass > MAX_AUDIO_SETTING_VALUE )
              this.bass = MAX_AUDIO_SETTING_VALUE;
            this.musicPlayer.setBass( (this.bass - MIDDLE_AUDIO_SETTING_VALUE) * 1.5 );
            break;
      case ButtonEvent.BUTTON_DOWN_TREBLE_DOWN:
            this.treble -= 1;
            if( this.treble < 0 )
              this.treble = 0;
            this.musicPlayer.setTreble( (this.treble - MIDDLE_AUDIO_SETTING_VALUE) * 1.5 );
            break;
      case ButtonEvent.BUTTON_DOWN_TREBLE_UP:
            this.treble += 1;
            if( this.treble > MAX_AUDIO_SETTING_VALUE )
              this.treble = MAX_AUDIO_SETTING_VALUE;
            this.musicPlayer.setTreble( (this.treble - MIDDLE_AUDIO_SETTING_VALUE) * 1.5 );
            break;
      case ButtonEvent.BUTTON_DOWN_VOL_DOWN:
            this.volume -= 1;
            if( this.volume < 0 )
              this.volume = 0;
            this.musicPlayer.setVolume( (this.volume + 1) / 10.0 );
            break;
      case ButtonEvent.BUTTON_DOWN_VOL_UP:
            this.volume += 1;
            if( this.volume > MAX_AUDIO_SETTING_VALUE )
              this.volume = MAX_AUDIO_SETTING_VALUE;
            this.musicPlayer.setVolume( (this.volume + 1) / 10.0 );
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
    return this.filenameList.length - 1; // <-- MINUS ONE BECAUSE THE FIRST TRACK IS AT ARRAY POSITION ONE INSTEAD OF ZERO
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
    logger( "----->TRANSPORT: SONG ENDED CALLBACK" );
    if( this.trackNumber < this.filenameList.length-1 )
      this.nextTrack();
    else
      this.stop();

  }
  
  
}
