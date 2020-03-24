


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import P3dLEDDriver from './P3dLEDDriver.js'
import { Mode } from './P3dController.js'
//-----------------------------------------------------------------------------------


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dNumericDisplay
{

  ///////////////////////////////////////////////////////////////////////
  constructor( appController, scene ) 
  {
    console.log("---->NUMERIC DISPLAY CLASS CONSTRUCTOR");

    this.appController = appController;
   
    this.ledDriver = new P3dLEDDriver( scene );
  }
  
  //////////////////////////////////////////////////////////////////////////////
  load()
  {
    this.ledDriver.load();
  }
  
  //////////////////////////////////////////////////////////////////////////////
  update()
  {
    var playbackTime = this.appController.getPlaybackTime();
    var playbackTimeInt = Math.floor( playbackTime );
    var mode = this.appController.getStatus();
    
    if( mode == Mode.PLAYING )
    {
      // SHOW TIME AND TRACK NUMBER
      var minutes = Math.floor( playbackTimeInt / 60 );
      var seconds = playbackTimeInt % 60;
      this.ledDriver.setDigitCharacter( 0, 'blank' );
      this.ledDriver.setDigitCharacter( 1, minutes%10 );
      this.ledDriver.setDigitCharacter( 2, Math.floor( seconds / 10 )%10 );
      this.ledDriver.setDigitCharacter( 3, seconds%10 );
      this.ledDriver.setDigitCharacter( 4, 'blank' );
      this.ledDriver.setDigitCharacter( 5, 1 ); //*/
    }
    else
    {
      this.ledDriver.setString( 'stopXX' );
      /*this.ledDriver.setDigitCharacter( 0, 's' );
      this.ledDriver.setDigitCharacter( 1, 't' );
      this.ledDriver.setDigitCharacter( 2, 'o' );
      this.ledDriver.setDigitCharacter( 3, 'p' );
      this.ledDriver.setDigitCharacter( 4, 'blank' );
      this.ledDriver.setDigitCharacter( 5, 'blank' ); //*/  
    }

    
  }
  
  
}
