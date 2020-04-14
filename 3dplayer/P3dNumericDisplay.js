


//-----------------------------------------------------------------------------------
import { P3dController } from './P3dController.js'
import { P3dLEDDriver } from './P3dLEDDriver.js'
import { TransportMode } from './P3dController.js'
import { logger } from './P3dLog.js'
import { EffectsPreset } from './P3dAudioEffects.js'
//-----------------------------------------------------------------------------------



const LedMode = {
  NORMAL: 'DisplayModeNormal',
  VOLUME: 'DisplayModeVolume',
  TREBLE: 'DisplayModeTreble',
  BASS: 'DisplayModeBass',
  FX_MODE: 'DisplayModeFx'
}




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dNumericDisplay
{

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, scene ) 
  {
    logger("---->NUMERIC DISPLAY CLASS CONSTRUCTOR");

    this.appController = appController;
   
    this.ledDriver = new P3dLEDDriver( scene );
    this.frameCounter = 0;
    
    this.displayMode = LedMode.NORMAL;
    
    this.altDisplayStartMSec = 0.0;
    this.altDisplayWaitMSec = 3000.0;
  }
  
  //////////////////////////////////////////////////////////////////////////////
  load()
  {
    this.ledDriver.load();

    this.ledDriver.colonOff();
  }
  
  //////////////////////////////////////////////////////////////////////////////
  update()
  {
    this.frameCounter += 1;
  
    let appMode = this.appController.getStatus();

    if( appMode == TransportMode.STANDBY )
    {
      // HIGHEST PRIORITY IN THE LOGIC IS STANDBY MODE WHICH TURNS OFF DISPLAY COMPLETELY
      this.ledDriver.setString( 'XXXXXX' );
      this.showNormalDisplay();
    }
    else
    {
      if( this.displayMode != LedMode.NORMAL )
      {
        this.ledDriver.colonOff();
        if( this.altDisplayStartMSec + this.altDisplayWaitMSec < performance.now() )
        {
          this.displayMode = LedMode.NORMAL;
        }
      }

      switch( this.displayMode )
      {
        case LedMode.NORMAL:
          this._updateStandardDisplay( appMode );
          break;
        case LedMode.VOLUME:
          this.ledDriver.setString( 'XXVOLX5' );
          this.ledDriver.setDigitCharacter( 6, this.appController.getVolume() );
          break;
        case LedMode.TREBLE:
          this.ledDriver.setString( 'trebLX5' );
          this.ledDriver.setDigitCharacter( 6, this.appController.getTreble() );
          break;
        case LedMode.BASS:
          this.ledDriver.setString( 'XbassX5' );
          this.ledDriver.setDigitCharacter( 6, this.appController.getBass() );
          break;
        case LedMode.FX_MODE:
          switch( this.appController.getFxMode() )
          { 
            case EffectsPreset.CLEAN: this.ledDriver.setString( 'CLEANXX' ); break;
            case EffectsPreset.CHURCH: this.ledDriver.setString( 'CHRCHXX' ); break;
            case EffectsPreset.CLUB: this.ledDriver.setString( 'CLUBXXX' ); break;
            case EffectsPreset.LOFI: this.ledDriver.setString( 'LOWFIXX' ); break;
            case EffectsPreset.CAVE: this.ledDriver.setString( 'CAVEXXX' ); break;
          }
          break;
      }
    }
    
  }

  ////////////////////////////////////////////////////////////////////////////////
  showNormalDisplay()
  {
    this.displayMode = LedMode.NORMAL;
  }


  ////////////////////////////////////////////////////////////////////////////////
  showVolume()
  {
    this.displayMode = LedMode.VOLUME;
    this.altDisplayStartMSec = performance.now();
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  showBass()
  {
    this.displayMode = LedMode.BASS;
    this.altDisplayStartMSec = performance.now();
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  showTreble()
  {
    this.displayMode = LedMode.TREBLE;
    this.altDisplayStartMSec = performance.now();
  }
  

  showFxMode()
  {
    this.displayMode = LedMode.FX_MODE;
    this.altDisplayStartMSec = performance.now();
  }



  ////////////////////////////////////////////////////////////////////////////////
  _showTimeAndTrack( playbackTimeInt, trackNumber )
  {
    if( playbackTimeInt != null )
    {
      let firstCharacter = 'blank'
      if( this.appController.getRemainingTimeMode() == true )
      {
        playbackTimeInt = Math.floor( this.appController.getTrackLengthSec() ) - playbackTimeInt;
        firstCharacter = 'W'; // DASH
      }
      let minutes = Math.floor( playbackTimeInt / 60 );
      let seconds = playbackTimeInt % 60;
      //logger( "TRACK LENGTH: ", minutes, seconds ); // DEBUG!!!!!!!!!!!!!!!!!!!!!!!!!
      this.ledDriver.setDigitCharacter( 0, firstCharacter );
      if( minutes < 10 )
        this.ledDriver.setDigitCharacter( 1, 'blank' );
      else
        this.ledDriver.setDigitCharacter( 1, Math.floor(minutes/10)%10 );
        //this.ledDriver.setDigitCharacter( 1, (minutes/10)%10 );
      this.ledDriver.setDigitCharacter( 2, minutes%10 );
      this.ledDriver.setDigitCharacter( 3, Math.floor( seconds / 10 )%10 );
      this.ledDriver.setDigitCharacter( 4, seconds%10 );
    }
    else
    {
      this.ledDriver.setString( 'XXXXX' );
    }
    
    this._showTrackNumber( trackNumber );    
  }


  ////////////////////////////////////////////////////////////////////////////////
  _showTrackNumber( trackNumber )
  {
    if( trackNumber < 10 )
      this.ledDriver.setDigitCharacter( 5, 'blank' );
    else
      this.ledDriver.setDigitCharacter( 5, Math.floor( trackNumber/10 )%10 );
    this.ledDriver.setDigitCharacter( 6, trackNumber%10 ); //*/
  }



  ////////////////////////////////////////////////////////////////////////////////
  _updateStandardDisplay( appMode )
  {
    let playbackTime = this.appController.getPlaybackTime();
    let playbackTimeInt = Math.floor( playbackTime );
    let trackNumber = this.appController.getTrackNumber();

    // HANDLE COLON...
    switch( appMode )
    {
      case TransportMode.PAUSED:
      case TransportMode.PLAYING:
        // DEBUG - FLASH COLON
        if( Math.floor(this.frameCounter/20)%3 == 0 )
          this.ledDriver.colonOn();
        else
          this.ledDriver.colonOff();
        break;
      default:
        this.ledDriver.colonOff();
        break;
    }
    
    // HANDLE ALPHANUMERIC SEGMENTS...
    switch( appMode )
    {
      case TransportMode.STARTING_PLAY:
          this.ledDriver.setString( 'XpLayXX' );
          break;
      
      case TransportMode.PLAYING:
      {
        this._showTimeAndTrack( playbackTimeInt, trackNumber );
        break;
      }
      case TransportMode.PAUSED:
      case TransportMode.SEEK:
      {
        if( Math.floor(this.frameCounter/20)%3 == 0 )
        {
          this.ledDriver.setString( 'XXXXXXX' );
          this._showTrackNumber( trackNumber );    
        }
        else
          this._showTimeAndTrack( playbackTimeInt, trackNumber );

        break;
      }
        
      case TransportMode.STOPPED:
        let numberOfTracks = this.appController.getNumberOfTracks();
        this.ledDriver.setString( 'XXXXXXX' );
        this._showTrackNumber( trackNumber );    
        break;

        // STANDBY DOESN'T DO ANYTHING HERE BECAUSE STANDBY MODE IS HANDLED AT THE TOP LEVEL
      case TransportMode.STANDBY:
        break;


        // STANDBY DOESN'T DO ANYTHING HERE BECAUSE STANDBY MODE IS HANDLED AT THE TOP LEVEL
      case TransportMode.TRAY_OPEN:
      case TransportMode.TRAY_OPENING:
        this.ledDriver.setString( 'XOpeNXX' );
        break;

        // STANDBY DOESN'T DO ANYTHING HERE BECAUSE STANDBY MODE IS HANDLED AT THE TOP LEVEL
      case TransportMode.TRAY_CLOSING:
      case TransportMode.TRAY_CLOSING_PLAY:
        this.ledDriver.setString( 'XLOadXX' );
        break;

      case TransportMode.SHUTDOWN:
        this.ledDriver.setString( 'XXOffXX' );
        break;
      case TransportMode.STARTUP:
        this.ledDriver.setString( '8888888' );
        break;
    }

  }
  
  
}
