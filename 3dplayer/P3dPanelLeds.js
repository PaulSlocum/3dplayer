


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
  
    this.repeatAllLed = this.scene.getObjectByName( "RepeatAllLed" );
    this.timeModeLed = this.scene.getObjectByName( "TimeModeLed" );
    this.playLed = this.scene.getObjectByName( "PlayLed" );
    this.pauseLed = this.scene.getObjectByName( "PauseLed" );

    logger( "---->PANEL LEDS: repeatAllLed: ", this.repeatAllLed );

    this.repeatAllLed.material = this.ledOffMaterial;
  }

  
  //////////////////////////////////////////////////////////////////////////////
  update()
  {
    this.frameCounter += 1;
  
    if( this.playLed != null  &&  this.pauseLed != null )
    {
      switch( this.appController.getStatus() )
      {
        case TransportMode.PLAYING:
        case TransportMode.STARTING_PLAY:
        case TransportMode.SEEK:
          this.playLed.material = this.ledOnMaterial;
          this.pauseLed.material = this.ledOffMaterial;
          break;
        case TransportMode.PAUSED:
          this.playLed.material = this.ledOffMaterial;
          this.pauseLed.material = this.ledOnMaterial;
          break;
        case TransportMode.STOPPED:
        case TransportMode.SHUTDOWN:
        case TransportMode.STARTUP:
        case TransportMode.STANDBY:
        case TransportMode.TRAY_OPEN:
        case TransportMode.TRAY_OPENING:
        case TransportMode.TRAY_CLOSING:
          this.playLed.material = this.ledOffMaterial;
          this.pauseLed.material = this.ledOffMaterial;
          break;
      }
    }

    

    //logger( "---->PANEL LEDS: repeatAllLed: ", this.repeatAllLed );
    
    if( this.repeatAllLed != null )
    {
      if( Math.floor(this.frameCounter/60)%2 == 0 )
      {
        this.repeatAllLed.material = this.ledOffMaterial;
        this.playLed.material = this.ledOffMaterial;
        this.pauseLed.material = this.ledOffMaterial;
        this.timeModeLed.material = this.ledOffMaterial;
      }
      else
      {
        this.repeatAllLed.material = this.ledOnMaterial;
        this.pauseLed.material = this.ledOnMaterial;
        this.playLed.material = this.ledOnMaterial;
        this.timeModeLed.material = this.ledOnMaterial;
      }
    } //*/
      
  }

}
