// P3dTransport.js
//
// SIMULATES CD PLAYER LOGIC, SOUNDS, AND PLAYBACK USING SOUND PLAYER CLASS (P3dSound).
//
////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import { TransportMode, ButtonEvent } from './P3dController.js'
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



export const TransportEvent = {
  PLAY: 'TransportPlay',
  PAUSE: 'TransportPause',
  STOP: 'TransportStop', 
  CLOSE_TRAY: 'TransportClose',
  OPEN_TRAY: 'TransportOpen',
  SPIN_UP: 'TransportSpinUp',
  SPIN_DOWN: 'TransportSpinDown',
  POWER_DOWN: 'TransportPowerDown',
  POWER_UP: 'TransportPowerUp', 
  SEEK: 'TransportSeek'
}




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dTransport {


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, filenameList ) 
  {
    logger("---->TRANSPORT CLASS CONSTRUCTOR: ", filenameList );
    
    this.appController = appController;
    
    this.soundPlayer = new P3dSoundPlayer();
    this.soundPlayer.loadSound( SoundFilenames.CLICK_DOWN );
    this.soundPlayer.loadSound( SoundFilenames.CLICK_UP );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_OPEN );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_CLOSE );

    this.eventQueue = [];

    // PRE-DECODE FIRST MUSIC TRACK
    this.musicPlayer = new P3dMusicPlayer( this );
    //this.musicPlayer.decodeMusic( filenameList[1] );  // <-------------
    this.musicPlayer.downloadMusic( filenameList[1] );  // <-- DEBUG
    
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
    
    this.status = TransportMode.TRAY_OPEN;
  }
  
  
  /*
export const TransportMode = {
  TRAY_OPEN:'TrayOpen',
  TRAY_OPENING:'TrayOpening',
  TRAY_CLOSING:'TrayClosing',
  PLAYING:'Playing',
  STARTING_PLAY:'StartingPlay',
  PAUSED:'Paused',
  STOPPED:'Stopped',
  STANDBY:'Standby'
}
  //*/


  
  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    logger( "------>BUTTON PRESS: ", buttonEvent );
  
    // BUTTON CLICK SOUND EFFECT
    if( buttonEvent != ButtonEvent.BUTTON_UP  &&  buttonEvent != ButtonEvent.BUTTON_UP )
      this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN ); 

    if( this.status == TransportMode.STANDBY )
    {
      if( buttonEvent == ButtonEvent.BUTTON_DOWN_STANDBY )
        this.stop();
    }
    else
    {
      // BUTON FUNCTIONS...
      switch( buttonEvent )
      {
        case ButtonEvent.BUTTON_DOWN_PLAY:
              if( this.status == TransportMode.TRAY_OPEN || 
                  this.status == TransportMode.PAUSED || 
                  this.status == TransportMode.STOPPED )
              {
                if( this.status == TransportMode.TRAY_OPEN )
                  this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
                this.eventQueue.push( TransportEvent.PLAY ); //*/
              } //*/
              /*if( this.trackPlaying == false )
              {
                this.trackPlaying = true;
                this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
                this.status = TransportMode.PLAYING;
                this.appController.closeTray();
                this.soundPlayer.playSound( SoundFilenames.TRAY_CLOSE ); 
              } //*/
              break;
        case ButtonEvent.BUTTON_DOWN_PAUSE:
              if( this.status == TransportMode.PLAYING )
              {
                this.eventQueue.push( TransportEvent.PAUSE ); //*/
              }
              /*if( this.trackPlaying == true )
              {
                this.trackPlaying = false;
                this.musicPlayer.pauseMusic();    
                //this.musicPlayer.stopMusic( MUSIC_FILENAME );    
                this.status = TransportMode.PAUSED;
              } //*/
              break;
        case ButtonEvent.BUTTON_DOWN_PREV:
              if( this.status == TransportMode.PLAYING || 
                  this.status == TransportMode.PAUSED || 
                  this.status == TransportMode.STOPPED )
              {
                this.previousTrack();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_NEXT:
              if( this.status == TransportMode.PLAYING || 
                  this.status == TransportMode.PAUSED || 
                  this.status == TransportMode.STOPPED )
              {
                this.nextTrack();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_FAST_FORWARD:
              break;
        case ButtonEvent.BUTTON_DOWN_REWIND:
              break;
        case ButtonEvent.BUTTON_DOWN_STOP:
              if( this.status == TransportMode.TRAY_OPEN )
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
              this.eventQueue.push( TransportEvent.STOP ); //*/
              //this.stop();
              break;
        case ButtonEvent.BUTTON_DOWN_STANDBY:
              if( this.status == TransportMode.TRAY_OPEN )
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
              this.eventQueue.push( TransportEvent.POWER_DOWN ); //*/
              //this.stop();
              //this.status = TransportMode.STANDBY;
              break;
        case ButtonEvent.BUTTON_UP:
              break;
        case ButtonEvent.NONE:
              break;

        case ButtonEvent.BUTTON_DOWN_BASS_DOWN:
              this.bass -= 1;
              if( this.bass < 0 )
                this.bass = 0;
              this.musicPlayer.setBass( this.bass - MIDDLE_AUDIO_SETTING_VALUE );
              break;
        case ButtonEvent.BUTTON_DOWN_BASS_UP:
              this.bass += 1;
              if( this.bass > MAX_AUDIO_SETTING_VALUE )
                this.bass = MAX_AUDIO_SETTING_VALUE;
              this.musicPlayer.setBass( this.bass - MIDDLE_AUDIO_SETTING_VALUE );
              break;
        case ButtonEvent.BUTTON_DOWN_TREBLE_DOWN:
              this.treble -= 1;
              if( this.treble < 0 )
                this.treble = 0;
              this.musicPlayer.setTreble( this.treble - MIDDLE_AUDIO_SETTING_VALUE );
              break;
        case ButtonEvent.BUTTON_DOWN_TREBLE_UP:
              this.treble += 1;
              if( this.treble > MAX_AUDIO_SETTING_VALUE )
                this.treble = MAX_AUDIO_SETTING_VALUE;
              this.musicPlayer.setTreble( this.treble - MIDDLE_AUDIO_SETTING_VALUE );
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
      } // SWITCH
    }
   
    this.processEventQueue();
      
  }
  
  
/*  export const TransportEvent = {
  PLAY: 'TransportPlay',
  PAUSE: 'TransportPause',
  STOP: 'TransportStop', 
  CLOSE_TRAY: 'TransportClose',
  OPEN_TRAY: 'TransportOpen',
  SPIN_UP: 'TransportSpinUp',
  SPIN_DOWN: 'TransportSpinDown',
  POWER_DOWN: 'TransportPowerDown',
  POWER_UP: 'TransportPowerUp', 
  SEEK: 'TransportSeek'
} //*/

  


  
  /////////////////////////////////////////////////////////////////////////
  processEventQueue()
  {
    if( this.eventQueue.length > 0 )
    {
      let event = this.eventQueue.shift();
      switch( event )
      {
        case TransportEvent.CLOSE_TRAY:
          logger( "---->TRANSPORT: CLOSE_TRAY QUEUED!" );
          this.appController.closeTray();
          this.status = TransportMode.TRAY_CLOSING;
          this.soundPlayer.playSound( SoundFilenames.TRAY_CLOSE ); 
          setTimeout( this.processEventQueue.bind(this), 3000 );
          break; //*/
          
        case TransportEvent.PLAY:
          logger( "---->TRANSPORT: PLAY QUEUED!" );
          if( this.trackPlaying == false )
          {
            this.trackPlaying = true;
            this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
            this.status = TransportMode.PLAYING;
            //this.appController.closeTray();
          } //*/
          break;

        case TransportEvent.STOP:
          logger( "---->TRANSPORT: PLAY QUEUED!" );
          this.stop();
          break;

        case TransportEvent.POWER_DOWN:
          logger( "---->TRANSPORT: PLAY QUEUED!" );
          this.stop();
          this.status = TransportMode.STANDBY;
          break;

        case TransportEvent.PAUSE:
          if( this.trackPlaying == true )
          {
            this.trackPlaying = false;
            this.musicPlayer.pauseMusic();    
            //this.musicPlayer.stopMusic( MUSIC_FILENAME );    
            this.status = TransportMode.PAUSED;
          } //*/

      }
      
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


  ////////////////////////////////////////////////////////////////////////////
  getVolume()
  {
    return this.volume;
  }
  
  ////////////////////////////////////////////////////////////////////////////
  getTreble()
  {
    return this.treble;
  }
  
  ////////////////////////////////////////////////////////////////////////////
  getBass()
  {
    return this.bass;
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
      this.status = TransportMode.PLAYING;
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
      this.status = TransportMode.PLAYING;
    }
  }
  
  
  ////////////////////////////////////////////////////////////////////////////
  stop()
  {
    this.trackPlaying = false;
    this.musicPlayer.rewindMusic();    
    this.trackNumber = 1;
    this.status = TransportMode.STOPPED;
  }
  
  
  //////////////////////////////////////////////////////////////////////////
  // CALLED BY MUSIC PLAYER
  musicEndedCallback()
  {
    logger( "----->TRANSPORT: SONG ENDED CALLBACK" );
    if( this.trackNumber < this.filenameList.length-1 )
      this.nextTrack();
    else
      this.stop();

  }
  
  
}
