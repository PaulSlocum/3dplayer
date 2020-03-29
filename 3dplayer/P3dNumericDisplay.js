


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import P3dLEDDriver from './P3dLEDDriver.js'
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
export default class P3dNumericDisplay
{

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, scene ) 
  {
    logger("---->NUMERIC DISPLAY CLASS CONSTRUCTOR");

    this.appController = appController;
   
    this.ledDriver = new P3dLEDDriver( scene );
    this.frameCounter = 0;
    
    this.displayMode = LedMode.NORMAL;
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

    switch( this.displayMode )
    {
      case LedMode.NORMAL:
        this._updateStandardDisplay( appMode );
        break;
      case LedMode.VOLUME:
        this.ledDriver.colonOff();
        this.ledDriver.minusOff();
        this.ledDriver.setString( 'XvolX5' );
        this.ledDriver.setDigitCharacter( 5, this.appController.getVolume() );
        break;
      case LedMode.TREBLE:
        this.ledDriver.colonOff();
        this.ledDriver.minusOff();
        this.ledDriver.setString( 'trebX5' );
        this.ledDriver.setDigitCharacter( 5, this.appController.getTreble() );
        break;
      case LedMode.BASS:
        this.ledDriver.colonOff();
        this.ledDriver.minusOff();
        this.ledDriver.setString( 'bassX5' );
        this.ledDriver.setDigitCharacter( 5, this.appController.getBass() );
        break;
    }
    
  }


  ////////////////////////////////////////////////////////////////////////////////
  showVolume()
  {
    logger( "SET VOLUME MODE!!!!!!!!!!!!!!!!!!!!!!!!" );
    this.displayMode = LedMode.VOLUME;
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  showBass()
  {
    this.displayMode = LedMode.BASS;
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  showTreble()
  {
    this.displayMode = LedMode.TREBLE;
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
        {
          this.ledDriver.colonOn();
        }
        else
        {
          this.ledDriver.colonOff();
        }
        break;
      default:
        this.ledDriver.colonOff();
        this.ledDriver.minusOff();
        break;
    }
    
    // HANDLE ALPHANUMERIC SEGMENTS...
    switch( appMode )
    {
      case TransportMode.PLAYING:
      {
        // SHOW TIME AND TRACK NUMBER
        let minutes = Math.floor( playbackTimeInt / 60 );
        let seconds = playbackTimeInt % 60;
        this.ledDriver.setDigitCharacter( 0, 'blank' );
        this.ledDriver.setDigitCharacter( 1, minutes%10 );
        this.ledDriver.setDigitCharacter( 2, Math.floor( seconds / 10 )%10 );
        this.ledDriver.setDigitCharacter( 3, seconds%10 );
        
        this.ledDriver.setDigitCharacter( 4, 'blank' );
        this.ledDriver.setDigitCharacter( 5, trackNumber%10 ); //*/
        break;
      }
      case TransportMode.PAUSED:
      {
        if( Math.floor(this.frameCounter/20)%3 == 0 )
        {
          this.ledDriver.setString( 'XXXXXX' );
        }
        else
        {
          // SHOW TIME AND TRACK NUMBER
          let minutes = Math.floor( playbackTimeInt / 60 );
          let seconds = playbackTimeInt % 60;
          this.ledDriver.setDigitCharacter( 0, 'blank' );
          this.ledDriver.setDigitCharacter( 1, minutes%10 );
          this.ledDriver.setDigitCharacter( 2, Math.floor( seconds / 10 )%10 );
          this.ledDriver.setDigitCharacter( 3, seconds%10 );
        }
        this.ledDriver.setDigitCharacter( 4, 'blank' );
        this.ledDriver.setDigitCharacter( 5, trackNumber%10 ); //*/
        break;
      }
        
      case TransportMode.STOPPED:
        let numberOfTracks = this.appController.getNumberOfTracks();
        this.ledDriver.setString( 'stopXX' );
        this.ledDriver.setDigitCharacter( 4, 'blank' );
        this.ledDriver.setDigitCharacter( 5, numberOfTracks%10 ); //*/
        break;

      case TransportMode.STANDBY:
        this.ledDriver.setString( 'XXXXXX' );
        break;
    }

  }
  
  
}
