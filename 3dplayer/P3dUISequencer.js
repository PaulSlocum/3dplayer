//
// P3dUISequence.js
//
// SEQUENCE CONTROLLER THAT ORCHESTRATES BACKGROUND VISUALS BASED ON THE TRACK NUMBER
// AND THE CURRENT PLAYBACK TIME
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { TransportMode } from "./P3dController.js";
import { logger } from "./P3dLog.js";
//-----------------------------------------------------------------------------------


//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dSequencer
{

	////////////////////////////////////////////////////////////////////////////////
 	constructor( graphicsController )
	{
		this.appController = graphicsController.appController;
		this.roomCube = graphicsController.roomCube;
		this.particles = graphicsController.particles;
		this.lights = graphicsController.lights;
		this.playerModel = graphicsController.playerModel;

		this.trayOpen = true; // MODEL CLASS STARTS WITH TRAY OPEN
	}

	/////////////////////////////////////////////////////////////////////////////////
	update()
	{
		let appStatus = this.appController.getStatus();

		// UPDATE "SWARM" PARTICLE SYSTEM
    if( this.appStatus != TransportMode.PLAYING )
      this.particles.disable();
    else
      this.particles.enable();

		// UPDATE TRAY STATE
		let transportTrayOpen = appStatus === TransportMode.TRAY_OPENING  ||  appStatus === TransportMode.TRAY_OPEN
		if( this.playerModel.trayOpen == true  &&  transportTrayOpen == false )
			this.playerModel.closeTray();
		if( this.playerModel.trayOpen == false  &&  transportTrayOpen == true )
			this.playerModel.openTray();

	}


}
