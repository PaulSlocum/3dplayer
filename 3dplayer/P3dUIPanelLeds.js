//
// P3dUIPanelLeds.js
//
// CLASS TO DRIVE PAUSE/PLAY/REPEAT/TIME PANEL LEDS.
//
//////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
//import { P3dAppController } from "./P3dAppController.js";
import { TransportMode } from "./P3dAppController.js";
import { logger } from "./P3dLog.js";
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
    this.ledOnMaterialPlay = null;
    this.ledOffMaterialPlay = null;

    this.repeatAllLed = null;
    this.timeModeLed = null;
    this.playLed = null;
    this.pauseLed = null;

    this.frameCounter = 0;

    this.ledsLoaded = false;
  }


  //////////////////////////////////////////////////////////////////////////////
  load()
  {

    // FIND THE MATERIALS USED FOR THE LEDS...
    this.scene.traverse( function(child)
    {
      if( this.ledOnMaterial == null  &&  child.material  &&  child.material.name == "LedOnPanel" )
      {
        //console.log( "---->PANEL LEDS: "ledOnPanel" MATERIAL FOUND" );
        this.ledOnMaterial = child.material;
      }
      if( this.ledOffMaterial == null  &&  child.material  &&  child.material.name == "LedOffPanel" )
      {
        //console.log( "---->PANEL LEDS: "ledOffPanel" MATERIAL FOUND" );
        this.ledOffMaterial = child.material;
      }
      if( this.ledOnMaterialPlay == null  &&  child.material  &&  child.material.name == "LedOnPanelPlay" )
      {
        //console.log( "---->PANEL LEDS: "ledOnPanel" MATERIAL FOUND" );
        this.ledOnMaterialPlay = child.material;
      }
      if( this.ledOffMaterialPlay == null  &&  child.material  &&  child.material.name == "LedOffPanelPlay" )
      {
        //console.log( "---->PANEL LEDS: "ledOffPanel" MATERIAL FOUND" );
        this.ledOffMaterialPlay = child.material;
      }

      //console.log("---->LED DRIVER->CHILD: ", child.material);
    }.bind(this) ); //*/

    this.repeatAllLed = this.scene.getObjectByName( "RepeatAllLed" );
    this.timeModeLed = this.scene.getObjectByName( "TimeModeLed" );
    this.playLed = this.scene.getObjectByName( "PlayLed" );
    this.pauseLed = this.scene.getObjectByName( "PauseLed" );

    this.ledsLoaded = true;
  }


  //////////////////////////////////////////////////////////////////////////////
  update()
  {
    this.frameCounter += 1;

    if( this.ledsLoaded == true )
    {

      switch( this.appController.getStatus() )
      {
        case TransportMode.PLAYING:
        case TransportMode.STARTING_PLAY:
        case TransportMode.SEEK:
        case TransportMode.TRAY_CLOSING_PLAY:
          this.playLed.material = this.ledOnMaterialPlay;
          this.pauseLed.material = this.ledOffMaterial;
          break;
        case TransportMode.PAUSED:
          this.playLed.material = this.ledOffMaterialPlay;
          this.pauseLed.material = this.ledOnMaterial;
          break;
        case TransportMode.STOPPED:
        case TransportMode.SHUTDOWN:
        case TransportMode.STARTUP:
        case TransportMode.TRAY_OPEN:
        case TransportMode.TRAY_OPENING:
        case TransportMode.STANDBY:
        case TransportMode.TRAY_CLOSING:
          this.playLed.material = this.ledOffMaterialPlay;
          this.pauseLed.material = this.ledOffMaterial;
          break;
      }

      if( this.appController.getStatus() == TransportMode.STANDBY )
      {
        // ALL LEDS SHOULD BE OFF IN STANDBY MODE
        this.repeatAllLed.material = this.ledOffMaterial;
        this.timeModeLed.material = this.ledOffMaterial;
      }
      else
      {
        if( this.appController.getRepeatAll() == true )
          this.repeatAllLed.material = this.ledOnMaterial;
        else
          this.repeatAllLed.material = this.ledOffMaterial;

        if( this.appController.getRemainingTimeMode() == true )
          this.timeModeLed.material = this.ledOnMaterial;
        else
          this.timeModeLed.material = this.ledOffMaterial;
      }

    }

  }


}
