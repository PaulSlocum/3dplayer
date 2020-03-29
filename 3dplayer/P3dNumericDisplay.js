


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import P3dLEDDriver from './P3dLEDDriver.js'
import { Mode } from './P3dController.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------


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
  
    let playbackTime = this.appController.getPlaybackTime();
    let playbackTimeInt = Math.floor( playbackTime );
    let mode = this.appController.getStatus();
    let trackNumber = this.appController.getTrackNumber();

    // HANDLE COLON...
    switch( mode )
    {
      case Mode.PAUSED:
      case Mode.PLAYING:
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
    switch( mode )
    {
      case Mode.PLAYING:
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
      case Mode.PAUSED:
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
        
      case Mode.STOPPED:
        let numberOfTracks = this.appController.getNumberOfTracks();
        this.ledDriver.setString( 'stopXX' );
        this.ledDriver.setDigitCharacter( 4, 'blank' );
        this.ledDriver.setDigitCharacter( 5, numberOfTracks%10 ); //*/
        break;

      case Mode.STANDBY:
        this.ledDriver.setString( 'XXXXXX' );
        break;
    }
    
  }
  
  
}
