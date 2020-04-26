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
 	constructor( appController, room, particles, lights )
	{
		this.appController = appController;
		this.room = room;
		this.particles = particles;
		this.lights = lights;
	}

	/////////////////////////////////////////////////////////////////////////////////
	update()
	{
		// UPDATE "SWARM" PARTICLE SYSTEM
    if( this.appController.getStatus() != TransportMode.PLAYING )
      this.particles.disable();
    else
      this.particles.enable();

	}


}
