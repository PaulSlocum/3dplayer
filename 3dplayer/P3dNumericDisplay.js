


//-----------------------------------------------------------------------------------
import { P3dController } from './P3dController.js'
import { P3dLEDDriver } from './P3dLEDDriver.js'
import { TransportMode } from './P3dController.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------



const LedMode = {
  NORMAL: 'DisplayModeNormal',
  VOLUME: 'DisplayModeVolume',
  TREBLE: 'DisplayModeTreble',
  DISPLAY_MODE_BASS: 'DisplayModeBass'
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
    
    this.altDisplayStartSec = 0.0;
    this.altDisplayWaitSec = 2000.0;
  }
  
  //////////////////////////////////////////////////////////////////////////////
  load()
  {
    this.ledDriver.load();

    this.ledDriver.colonOff();
    this.ledDriver.minusOff();
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
        this.ledDriver.minusOff();
        if( this.altDisplayStartSec + this.altDisplayWaitSec < performance.now() )
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
          this.ledDriver.setString( 'XXvolX5' );
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
    this.altDisplayStartSec = performance.now();
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  showBass()
  {
    this.displayMode = LedMode.BASS;
    this.altDisplayStartSec = performance.now();
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  showTreble()
  {
    this.displayMode = LedMode.TREBLE;
    this.altDisplayStartSec = performance.now();
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
        // DEBUG - FLASH MINUS/COLON
        if( Math.floor(this.frameCounter/20)%3 == 0 )
          this.ledDriver.colonOn();
        else
          this.ledDriver.colonOff();
        break;
      default:
        this.ledDriver.colonOff();
        this.ledDriver.minusOff();
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
        // SHOW TIME AND TRACK NUMBER
        let minutes = Math.floor( playbackTimeInt / 60 );
        let seconds = playbackTimeInt % 60;
        this.ledDriver.setDigitCharacter( 0, 'blank' );
        this.ledDriver.setDigitCharacter( 1, 'blank' );
        this.ledDriver.setDigitCharacter( 2, minutes%10 );
        this.ledDriver.setDigitCharacter( 3, Math.floor( seconds / 10 )%10 );
        this.ledDriver.setDigitCharacter( 4, seconds%10 );
        
        this.ledDriver.setDigitCharacter( 5, 'blank' );
        this.ledDriver.setDigitCharacter( 6, trackNumber%10 ); //*/
        break;
      }
      case TransportMode.PAUSED:
      case TransportMode.SEEK:
      {
        if( Math.floor(this.frameCounter/20)%3 == 0 )
        {
          this.ledDriver.setString( 'XXXXXXX' );
        }
        else
        {
          // SHOW TIME AND TRACK NUMBER
          let minutes = Math.floor( playbackTimeInt / 60 );
          let seconds = playbackTimeInt % 60;
          this.ledDriver.setDigitCharacter( 0, 'blank' );
          this.ledDriver.setDigitCharacter( 1, 'blank' );
          this.ledDriver.setDigitCharacter( 2, minutes%10 );
          this.ledDriver.setDigitCharacter( 3, Math.floor( seconds / 10 )%10 );
          this.ledDriver.setDigitCharacter( 4, seconds%10 );
        }
        this.ledDriver.setDigitCharacter( 5, 'blank' );
        this.ledDriver.setDigitCharacter( 6, trackNumber%10 ); //*/
        break;
      }
        
      case TransportMode.STOPPED:
        let numberOfTracks = this.appController.getNumberOfTracks();
        this.ledDriver.setString( 'XXXXXXX' );
        //this.ledDriver.setString( 'stopXX' );
        this.ledDriver.setDigitCharacter( 5, 'blank' );
        this.ledDriver.setDigitCharacter( 6, numberOfTracks%10 ); //*/
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
