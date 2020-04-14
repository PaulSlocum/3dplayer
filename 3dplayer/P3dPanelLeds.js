


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
   
    this.frameCounter = 0;
  }

  
  //////////////////////////////////////////////////////////////////////////////
  load()
  {
  
    // FIND THE MATERIALS USED FOR THE LEDS...
    /*this.scene.traverse( function(child) 
    {
      if( this.ledOnMaterial == null  &&  child.material  &&  child.material.name == "ledOn" )
      {
        //console.log( "---->LED DRIVER: 'ledOn' MATERIAL FOUND" );
        this.ledOnMaterial = child.material;
      }
      if( this.ledDimMaterial == null  &&  child.material  &&  child.material.name == "ledDim" )
      {
        //console.log( "---->LED DRIVER: 'ledDim' MATERIAL FOUND" );
        this.ledDimMaterial = child.material;
      }
      if( this.ledOffMaterial == null  &&  child.material  &&  child.material.name == "ledOff" )
      {
        //console.log( "---->LED DRIVER: 'ledOff' MATERIAL FOUND" );
        this.ledOffMaterial = child.material;
      }
      if( this.displayGlassMaterial == null  &&  child.material  &&  child.material.name == "displayGlass" )
      {
        //console.log( "---->LED DRIVER: 'displayGlass' MATERIAL FOUND" );
        this.displayGlassMaterial = child.material;
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

    /*this.colonObject = this.scene.getObjectByName( "Colon1a" );
    this.colonHighlight = this.scene.getObjectByName( "Colon1b" );
    this.minusObject = this.scene.getObjectByName( "Minus1a" );
    this.minusHighlight = this.scene.getObjectByName( "Minus1b" );
  
    //console.log( "------->LED DRIVER: COLON AND MINUS: ", this.colonObject, this.colonHighlight, 
    //                                                      this.minusObject, this.minusHighlight );

    this.objectsLoaded = true;

    // CLEAR ALL SEGMENTS
    this.setString( 'XXXXXX' );   //*/
  
  }

  
  //////////////////////////////////////////////////////////////////////////////
  update()
  {
    this.frameCounter += 1;
  
    let appMode = this.appController.getStatus();
  }

}
