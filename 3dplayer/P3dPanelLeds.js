


//-----------------------------------------------------------------------------------
import { P3dController } from './P3dController.js'
import { TransportMode } from './P3dController.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dPanelLeds
{


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, scene ) 
  {
    logger("---->PANEL LED CLASS CONSTRUCTOR");

    this.appController = appController;
    this.scene = scene;
    
    this.ledOnMaterial = null;
    this.ledOffMaterial = null;
   
    this.repeatAllLed = null;
    this.timeModeLed = null;
    this.playLed = null;
    this.pauseLed = null;
   
    this.frameCounter = 0;
  }

  
  //////////////////////////////////////////////////////////////////////////////
  load()
  {
  
    // FIND THE MATERIALS USED FOR THE LEDS...
    this.scene.traverse( function(child) 
    {
      if( this.ledOnMaterial == null  &&  child.material  &&  child.material.name == "LedOnPanel" )
      {
        console.log( "---->PANEL LEDS: 'ledOnPanel' MATERIAL FOUND" );
        this.ledOnMaterial = child.material;
      }
      if( this.ledOffMaterial == null  &&  child.material  &&  child.material.name == "LedOffPanel" )
      {
        console.log( "---->PANEL LEDS: 'ledOffPanel' MATERIAL FOUND" );
        this.ledOffMaterial = child.material;
      }

      //console.log("---->LED DRIVER->CHILD: ", child.material);
    }.bind(this) ); //*/
  
    // FIND AND LOAD ALL THE SEGMENT OBJECTS INTO ARRAYS...
    /*for( let ledDigit=0; ledDigit<TOTAL_LED_DIGITS; ledDigit++ )
    {
      for( let ledSegment=0; ledSegment<TOTAL_LED_SEGMENTS; ledSegment++ )
      {
        var mainObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "100", ledDigit );
        //logger( ">>>>>>>>>>>>> MAIN OBJECT NAME: ", mainObjectName );
        this.mainLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( mainObjectName, true );
      
        var highlightObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "200", ledDigit );
        //logger( ">>>>>>>>>>>>> HIGHLIGHT OBJECT NAME: ", highlightObjectName );
        this.highlightLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( highlightObjectName, true );
      }
    } //*/

    this.repeatAllLed = this.scene.getObjectByName( "RepeatAllLed" );
    /*this.timeModeLed = this.scene.getObjectByName( "timeModeLed" );
    this.playLed = this.scene.getObjectByName( "playLed" );
    this.pauseLed = this.scene.getObjectByName( "pauseLed" ); //*/

    logger( "---->PANEL LEDS: repeatAllLed: ", this.repeatAllLed );

    this.repeatAllLed.material = this.ledOffMaterial;
  }

  
  //////////////////////////////////////////////////////////////////////////////
  update()
  {
    this.frameCounter += 1;
  
    let appMode = this.appController.getStatus();

    //logger( "---->PANEL LEDS: repeatAllLed: ", this.repeatAllLed );
    
    if( this.repeatAllLed != null )
    {
      if( Math.floor(this.frameCounter/60)%2 == 0 )
        this.repeatAllLed.material = this.ledOffMaterial;
      else
        this.repeatAllLed.material = this.ledOnMaterial;
    } //*/
      
  }

}
