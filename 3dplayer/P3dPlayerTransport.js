// P3dPlayerTransport.js
//
// SIMULATES CD PLAYER LOGIC, SOUNDS, AND PLAYBACK.
//
////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
//import { P3dAppController } from "./P3dAppController.js";
import { TransportMode, ButtonEvent } from "./P3dAppController.js";
import { P3dSoundPlayer } from "./P3dAudioSounds.js";
import { P3dPlayerEventQueue } from "./P3dPlayerEventQueue.js";
import { P3dMusicPlayer } from "./P3dAudioMusic.js";
import { EffectsPreset } from "./P3dAudioEffects.js";
import { logger } from "./P3dLog.js";
import { random } from "./P3dUtility.js";
///-----------------------------------------------------------------------------------



export const TransportEvent = {
  PLAY: "TransportPlay",
  PAUSE: "TransportPause",
  STOP: "TransportStop",
  CLOSE_TRAY: "TransportClose",
  CLOSE_TRAY_PLAY: "TransportClosePlay",
  OPEN_TRAY: "TransportOpen",
  START_TRAY_OPEN: "TransportStartTrayOpen",
  TRAY_OPENED: "TransportOpened",
  SPINUP: "TransportSpinUp",
  SPINDOWN: "TransportSpinDown",
  STANDBY: "Standby",
  SHUTDOWN: "TransportPowerDown",
  STARTUP: "TransportPowerUp",
  SKIP_TRACK: "TransportSkipTrack",
  SEEK: "TransportSeek",
  SEEK_PLAY: "TransportSeekPlay"
};


const MAX_AUDIO_SETTING_VALUE = 10;
const MIDDLE_AUDIO_SETTING_VALUE = 5;
const NUMBER_OF_EFFECTS = 5;


export const SoundFilename = {
    CLICK_DOWN: "3dplayer/sounds/clickDown.wav",
    TRAY_OPEN: "3dplayer/sounds/cdOpen1.wav",
    TRAY_CLOSE: "3dplayer/sounds/cdClose1.wav",
    CD_SPINUP1: "3dplayer/sounds/cdSpinup1.wav",
    CD_SPINUP2: "3dplayer/sounds/cdSpinup2.wav",
    CD_SPINUP3: "3dplayer/sounds/cdSpinup3.wav",
    CD_SPINUP4: "3dplayer/sounds/cdSpinup4.wav",
    CD_SPINDOWN: "3dplayer/sounds/cdSpindown1.wav",
    CD_SEEK1: "3dplayer/sounds/cdSeek1.wav",
    CD_SEEK2: "3dplayer/sounds/cdSeek2.wav",
    CD_SEEK3: "3dplayer/sounds/cdSeek3.wav",
    CD_SEEK4: "3dplayer/sounds/cdSeek4.wav",
    CD_SHORT_SEEK1: "3dplayer/sounds/cdShortSeek1.wav",
    CD_SHORT_SEEK2: "3dplayer/sounds/cdShortSeek2.wav",
    CD_SHORT_SEEK3: "3dplayer/sounds/cdShortSeek3.wav",
    CD_SHORT_SEEK4: "3dplayer/sounds/cdShortSeek4.wav",
    CD_SHORT_SEEK5: "3dplayer/sounds/cdShortSeek5.wav"
};





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dPlayerTransport {


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, filenameList )
  {
    logger("---->TRANSPORT CLASS CONSTRUCTOR: ", filenameList );

    this.appController = appController;

    this.soundPlayer = new P3dSoundPlayer();

		// START LOADING ALL THE SOUNDS IN THE BACKGROUND
		for (var key in SoundFilename )
		  this.soundPlayer.loadSound( SoundFilename[key] );

    this.eventQueue = [];
    this.nextEventTimeSec = performance.now();

    // PRE-DECODE FIRST 2 MUSIC TRACKS
    this.musicPlayer = new P3dMusicPlayer( this );
    this.musicPlayer.decodeMusic( filenameList[1] );  // <-------------
    if( filenameList.length > 1 )
      this.musicPlayer.decodeMusic( filenameList[2] );  // <-------------

    this.filenameList = filenameList;
    this.trackNumber = 1; // FIRST TRACK IS ONE (NOT ZERO)
    this.trackPlaying = false;

    this.treble = MIDDLE_AUDIO_SETTING_VALUE;
    this.bass = MIDDLE_AUDIO_SETTING_VALUE;
    this.volume = MAX_AUDIO_SETTING_VALUE;
    this.repeatAll = true;
    this.remainingTimeMode = false;
    this.seekVelocity = 0;

    // PROBABLY WILL USE THESE?
    //this.rewindButtonDown = false;
    //this.fastForwardButtonDown = false;

    this.fxModeNumber = 0;
    this.fxMode = null;

    this.status = TransportMode.TRAY_OPEN;
  }



  /////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  stopCdSounds()
  {
    this.soundPlayer.stopSound( SoundFilename.SEEK );
    this.soundPlayer.stopSound( SoundFilename.SPINUP );
  }



  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    logger( "------>BUTTON PRESS: ", buttonEvent );

    this.musicPlayer.createContext();

    // BUTTON CLICK SOUND EFFECT
    if( buttonEvent != ButtonEvent.BUTTON_UP  &&  buttonEvent != ButtonEvent.BUTTON_UP )
      this.soundPlayer.playSound( SoundFilename.CLICK_DOWN );

    // END SEEK WHEN ANY BUTTON IS RELEASED...
    if( buttonEvent == ButtonEvent.BUTTON_UP )
      this.seekVelocity = 0;

    // BUTTONS ARE DISABLED WHEN IN STANDBY MODE...
    if( this.status == TransportMode.STANDBY )
    {
      if( buttonEvent == ButtonEvent.BUTTON_DOWN_STANDBY )
      { // TURN PLAYER BACK ON...
        this.eventQueue.push( TransportEvent.STARTUP ); //*/
        this.eventQueue.push( TransportEvent.STOP ); //*/
        this.scheduleNextEvent();
      }

    }
    else // ELSE - NOT IN STANDBY...
    {
      // BUTON FUNCTIONS...
      switch( buttonEvent )
      {
        case ButtonEvent.BUTTON_DOWN_PLAY:
              this.play();
              break;
        case ButtonEvent.BUTTON_DOWN_PAUSE:
              if( this.status == TransportMode.PLAYING )
              {
                this.eventQueue.push( TransportEvent.PAUSE ); //*/
                this.scheduleNextEvent();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_PREV:
              if( this.status == TransportMode.PLAYING ||
                  this.status == TransportMode.PAUSED ||
                  this.status == TransportMode.SEEK ||
                  this.status == TransportMode.STOPPED )
              {
                this.previousTrack();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_NEXT:
              if( this.status == TransportMode.PLAYING ||
                  this.status == TransportMode.PAUSED ||
                  this.status == TransportMode.SEEK  ||
                  this.status == TransportMode.STOPPED )
              {
                this.nextTrack();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_FAST_FORWARD:
              if( this.status == TransportMode.PLAYING )
              {
                this.seekVelocity = 10;
                this.eventQueue.push( TransportEvent.SEEK );
                this.scheduleNextEvent();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_REWIND:
              if( this.status == TransportMode.PLAYING )
              {
                this.seekVelocity = -10;
                this.eventQueue.push( TransportEvent.SEEK );
                this.scheduleNextEvent();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_STOP:
              if( this.status == TransportMode.TRAY_OPEN )
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
              this.eventQueue.push( TransportEvent.STOP ); //*/
              this.scheduleNextEvent();
              break;
        case ButtonEvent.BUTTON_DOWN_STANDBY:
              if( this.status == TransportMode.TRAY_OPEN )
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
              this.eventQueue.push( TransportEvent.SHUTDOWN ); //*/
              this.eventQueue.push( TransportEvent.STANDBY ); //*/
              this.scheduleNextEvent();
              break;
        case ButtonEvent.BUTTON_DOWN_OPEN:
              if( this.status == TransportMode.TRAY_OPEN )
              { // CLOSE TRAY
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
                this.eventQueue.push( TransportEvent.STOP ); //*/
              }
              else
              {
                if( this.status == TransportMode.PLAYING  ||
                    this.status == TransportMode.PAUSED  ||
                    this.status == TransportMode.STOPPED  ||
                    this.status == TransportMode.STARTING_PLAY )
                {
                  // OPEN TRAY
                  this.eventQueue.push( TransportEvent.START_OPEN_TRAY ); //*/
                  this.eventQueue.push( TransportEvent.OPEN_TRAY ); //*/
                  this.eventQueue.push( TransportEvent.TRAY_OPENED );
                }
              }
              this.scheduleNextEvent();
              break;
        case ButtonEvent.BUTTON_UP:
              break;
        case ButtonEvent.NONE:
              break;

              //   ~    -     ~    -     ~    -     ~    -     ~    -     ~    -     ~    -

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

              //   ~    -     ~    -     ~    -     ~    -     ~    -     ~    -     ~    -

        case ButtonEvent.BUTTON_DOWN_VOL_DOWN:
        {
              this.volume -= 1;
              if( this.volume < 0 )
                this.volume = 0;
              let volumeValue = (this.volume) / 10.0;
              logger( "VOLUME VALUE: ", volumeValue );
              this.musicPlayer.setVolume( volumeValue );
              break;
        }
        case ButtonEvent.BUTTON_DOWN_VOL_UP:
        {
              this.volume += 1;
              if( this.volume > MAX_AUDIO_SETTING_VALUE )
                this.volume = MAX_AUDIO_SETTING_VALUE;
              let volumeValue = (this.volume) / 10.0;
              logger( "VOLUME VALUE: ", volumeValue );
              this.musicPlayer.setVolume( volumeValue );
              break;
        }

        case ButtonEvent.BUTTON_DOWN_FX_DOWN:
              this.fxModeNumber -= 1;
              if( this.fxModeNumber < 0 )
                this.fxModeNumber = NUMBER_OF_EFFECTS-1;  // <-- LOOP AROUND
              this.setFxModeByNumber( this.fxModeNumber );
              break;
        case ButtonEvent.BUTTON_DOWN_FX_UP:
              this.fxModeNumber += 1;
              if( this.fxModeNumber >= NUMBER_OF_EFFECTS )
                this.fxModeNumber = 0; // <-- LOOP AROUND
              this.setFxModeByNumber( this.fxModeNumber );
              break;

        case ButtonEvent.BUTTON_DOWN_REPEAT_ALL:
              this.repeatAll = !this.repeatAll; // TOGGLE BUTTON
              break;

        case ButtonEvent.BUTTON_DOWN_REMAINING_TIME_MODE:
              logger( "------> TRANSPORT: REMAINING TIME MODE BUTTON DOWN", this.remainingTimeMode );
              this.remainingTimeMode = !this.remainingTimeMode; // TOGGLE BUTTON
              break;

      } // SWITCH

    } // ELSE NOT IN STANDBY

  }



  //////////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  scheduleNextEvent( delaySec = 0.0 )
  {
    this.nextEventTimeSec = performance.now() + delaySec;
    if( delaySec > 0.0 )
    {
    	const timeoutMSec = (delaySec * 1000) + 2;
      setTimeout( this.processEventQueue.bind(this), timeoutMSec );
    }
    else
      this.processEventQueue();
  }


  /////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  processEventQueue()
  {
    if( this.eventQueue.length > 0   &&  performance.now() >= this.nextEventTimeSec )
    {
      let event = this.eventQueue.shift();
      switch( event )
      {
        case TransportEvent.SEEK:
          logger( "----->TRANSPORT: S E E K !" );
          this.currentTrackTime = this.musicPlayer.getMusicTime();
          this.musicPlayer.pauseMusic();
          switch( random(5) )
          {
            case 0: this.soundPlayer.playSound( SoundFilename.CD_SHORT_SEEK1 ); break;
            case 1: this.soundPlayer.playSound( SoundFilename.CD_SHORT_SEEK2 ); break;
            case 2: this.soundPlayer.playSound( SoundFilename.CD_SHORT_SEEK3 ); break;
            case 3: this.soundPlayer.playSound( SoundFilename.CD_SHORT_SEEK4 ); break;
            case 4: this.soundPlayer.playSound( SoundFilename.CD_SHORT_SEEK5 ); break;
          } //*/
          this.eventQueue.push( TransportEvent.SEEK_PLAY );
          this.scheduleNextEvent( 0.25 );
          break; //*/

        case TransportEvent.SEEK_PLAY:
          logger( "----->TRANSPORT: S E E K   P L A Y !" );
          // IF SEEKING BEFORE THE START OF THE TRACK...
          if( this.currentTrackTime + this.seekVelocity < 0 )
          { // PLAY FROM START OF TRACK...
            this.musicPlayer.rewindMusic();
            this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );
            this.seekVelocity = 0;
          }
          else
          { // IF SEEKING BEYOND END OF TRACK...
            if( this.currentTrackTime + this.seekVelocity > this.musicPlayer.getCurrentTrackLengthSec() )
            {
              // PLAY AND END SEEKING...
              this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );
              this.seekVelocity = 0;
            }
            else // ELSE - DO SEEK...
            {
              this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ], this.currentTrackTime + this.seekVelocity );
            }
          }
          // CONTINUE SEEKING IF SEEK IS STILL ACTIVE...
          if( this.seekVelocity != 0 )
          {
            this.seekVelocity *= 1.10;  // <---- INCREASE RATE BY A PERECENTAGE EACH TIME
            this.eventQueue.push( TransportEvent.SEEK );
            this.scheduleNextEvent( 0.25 );
          }
          break;

        case TransportEvent.CLOSE_TRAY:
          this.status = TransportMode.TRAY_CLOSING;
          this.soundPlayer.playSound( SoundFilename.TRAY_CLOSE );
          this.scheduleNextEvent( 3 );
          break; //*/

        case TransportEvent.CLOSE_TRAY_PLAY:
          this.status = TransportMode.TRAY_CLOSING_PLAY;
          this.soundPlayer.playSound( SoundFilename.TRAY_CLOSE );
          this.scheduleNextEvent( 3 );
          break; //*/

        case TransportEvent.START_OPEN_TRAY:
          logger( "START OPEN TRAY!!!!!!!!!!!!!!!!!!!!!!" );
          this.stop();
          //this.status = TransportMode.TRAY_OPENING;
          this.soundPlayer.playSound( SoundFilename.TRAY_OPEN );
          this.scheduleNextEvent( 0.65 );
          break; //*/

        case TransportEvent.OPEN_TRAY:
          this.status = TransportMode.TRAY_OPENING;
          this.scheduleNextEvent( 1 );
          break; //*/

        case TransportEvent.TRAY_OPENED:
          this.status = TransportMode.TRAY_OPEN;
          break;

        case TransportEvent.SPINUP:
          switch( random(4) )
          {
            case 0: this.soundPlayer.playSound( SoundFilename.CD_SPINUP1 ); break;
            case 1: this.soundPlayer.playSound( SoundFilename.CD_SPINUP2 ); break;
            case 2: this.soundPlayer.playSound( SoundFilename.CD_SPINUP3 ); break;
            case 3: this.soundPlayer.playSound( SoundFilename.CD_SPINUP4 ); break;
          } //*/

          this.status = TransportMode.STARTING_PLAY;
          this.scheduleNextEvent( 2 );
          break;

        case TransportEvent.SKIP_TRACK:
          switch( random(4) )
          {
            case 0: this.soundPlayer.playSound( SoundFilename.CD_SEEK1 ); break;
            case 1: this.soundPlayer.playSound( SoundFilename.CD_SEEK2 ); break;
            case 2: this.soundPlayer.playSound( SoundFilename.CD_SEEK3 ); break;
            case 3: this.soundPlayer.playSound( SoundFilename.CD_SEEK4 ); break;
          } //*/
          //this.soundPlayer.playSound( SoundFilename.CD_SEEK1 );
          this.scheduleNextEvent( 0.65 );
          this.status = TransportMode.SEEK;
          break;

        case TransportEvent.PLAY:
          if( this.trackPlaying == false )
          {
            this.trackPlaying = true;
            this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );
            this.status = TransportMode.PLAYING;
          } //*/
          break;

        case TransportEvent.STOP:
          this.stop();
          this.scheduleNextEvent();
          break;

        case TransportEvent.SHUTDOWN:
          this.stop();
          this.status = TransportMode.SHUTDOWN;
          this.scheduleNextEvent(1);
          break;

        case TransportEvent.STARTUP:
          this.soundPlayer.playSound( SoundFilename.CD_SPINUP1 );
          this.status = TransportMode.STARTUP;
          this.scheduleNextEvent(3.2);
          break;

        case TransportEvent.STANDBY:
          this.stop();
          this.status = TransportMode.STANDBY;
          break;

        case TransportEvent.PAUSE:
          if( this.trackPlaying == true )
          {
            this.trackPlaying = false;
            this.musicPlayer.pauseMusic();
            this.status = TransportMode.PAUSED;
          } //*/
          break;
      }

    }

  }


  // ~     -      ~     -      ~     -      ~     -      ~     -      ~     -

  ////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  previousTrack()
  {
    if( this.trackNumber > 1 )
    {
      this.soundPlayer.playSound( SoundFilename.CD_SEEK );
      this.trackNumber--;
      this.trackPlaying = false;
      this.musicPlayer.rewindMusic();

      //this.eventQueue.push( TransportEvent.PAUSE ); //*/
      this.eventQueue = [];
      this.eventQueue.push( TransportEvent.SKIP_TRACK ); //*/
      this.eventQueue.push( TransportEvent.PLAY ); //*/
      this.scheduleNextEvent();
      this.musicPlayer.decodeMusic( this.filenameList[ this.trackNumber ] );

      // PRE-DECODE THE PREVIOUS TRACK IF THERE IS ONE...
      if( this.trackNumber > 1 )
        this.musicPlayer.decodeMusic( this.filenameList[ this.trackNumber-1 ] );
    }
  }



  ////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  nextTrack()
  {
    if( this.trackNumber < this.filenameList.length-1 )
    {
      this.soundPlayer.playSound( SoundFilename.CD_SEEK );
      this.trackNumber++;
      this.trackPlaying = false;
      this.musicPlayer.rewindMusic();

      //this.eventQueue.push( TransportEvent.PAUSE ); //*/
      this.eventQueue = [];
      this.eventQueue.push( TransportEvent.SKIP_TRACK ); //*/
      this.eventQueue.push( TransportEvent.PLAY ); //*/
      this.scheduleNextEvent();

      // START DECODING THE TRACK THAT"S ABOUT TO PLAY IF IT"S NOT ALREADY...
      this.musicPlayer.decodeMusic( this.filenameList[ this.trackNumber ] );

      // PRE-DECODE THE NEXT TRACK IF THERE IS ONE...
      if( this.trackNumber < this.filenameList.length-1 )
        this.musicPlayer.decodeMusic( this.filenameList[ this.trackNumber+1 ] );
    }
  }


  ////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  play()
  {
    if( this.status == TransportMode.TRAY_OPEN ||
        this.status == TransportMode.PAUSED ||
        this.status == TransportMode.STOPPED )
    {
      if( this.status == TransportMode.TRAY_OPEN )
        this.eventQueue.push( TransportEvent.CLOSE_TRAY_PLAY ); //*/
      if( this.status != TransportMode.PAUSED )
        this.eventQueue.push( TransportEvent.SPINUP ); //*/
      this.eventQueue.push( TransportEvent.PLAY ); //*/
      this.scheduleNextEvent();
    } //*/
  }

  ////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  stop()
  {
    this.trackPlaying = false;
    this.musicPlayer.rewindMusic();
    this.trackNumber = 1;
    if( this.status != TransportMode.STOPPED  &&  this.status != TransportMode.SHUTDOWN)
      this.soundPlayer.playSound( SoundFilename.CD_SPINDOWN );
    this.status = TransportMode.STOPPED;
  }


  // ~     -      ~     -      ~     -      ~     -      ~     -      ~     -


  //////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION - CALLBACK FROM MUSIC PLAYER
  musicEndedCallback()
  {
    logger( "----->TRANSPORT: SONG ENDED CALLBACK" );

    // IF THAT WAS THE LAST TRACK...
    if( this.trackNumber >= this.filenameList.length-1 )
    {
      this.stop();
      if( this.repeatAll === true )
      {
        this.trackNumber = 1;
        this.play();
      }
    }
    else
      this.nextTrack();

  }


  // ~     -      ~     -      ~     -      ~     -      ~     -      ~     -



  //////////////////////////////////////////////////////////////////////////////////
  setFxModeByNumber( fxModeNumber )
  {
    switch( fxModeNumber )
    {
      case 0: this.fxMode = EffectsPreset.CLEAN; break;
      case 1: this.fxMode = EffectsPreset.CHURCH; break;
      case 2: this.fxMode = EffectsPreset.CLUB; break;
      case 3: this.fxMode = EffectsPreset.LOFI; break;
      case 4: this.fxMode = EffectsPreset.CAVE; break;
    }
    this.musicPlayer.setFxMode( this.fxMode );
  }



  ////////////////////////////////////////////////////////////////////////////////////
  getFxMode()
  {
    return( this.fxMode );
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

  /////////////////////////////////////////////////////////////////////////////
  getRepeatAll()
  {
    return this.repeatAll;
  }

  /////////////////////////////////////////////////////////////////////////////
  getRemainingTimeMode()
  {
    return this.remainingTimeMode;
  }

  /////////////////////////////////////////////////////////////////////////////
  getTrackLengthSec()
  {
    return this.musicPlayer.getCurrentTrackLengthSec();
  }



}






