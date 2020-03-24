


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import P3dLEDDriver from './P3dLEDDriver.js'
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
    
    if( playbackTimeInt != 0 )
    {
      var minutes = Math.floor( playbackTimeInt / 60 );
      var seconds = playbackTimeInt % 60;
    
      this.ledDriver.setDigitCharacter( 'blank', 0 );
      this.ledDriver.setDigitCharacter( minutes%10, 1 );
      this.ledDriver.setDigitCharacter( Math.floor( seconds / 10 )%10, 2 );
      this.ledDriver.setDigitCharacter( seconds%10, 3 );
      this.ledDriver.setDigitCharacter( 'blank', 4 );
      this.ledDriver.setDigitCharacter( 1, 5 ); //*/
    }
    else
    {
      /*this.setDigitCharacter( 's', 0 );
      this.setDigitCharacter( 't', 1 );
      this.setDigitCharacter( 'o', 2 );
      this.setDigitCharacter( 'p', 3 );
      this.setDigitCharacter( 'blank', 4 );
      this.setDigitCharacter( 'blank', 5 ); //*/ 
    }

    
  }
  
  
}
