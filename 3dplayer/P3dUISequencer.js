//
// P3dUISequence.js
//
// SEQUENCE CONTROLLER THAT ORCHESTRATES BACKGROUND VISUALS BASED ON THE TRACK NUMBER
// AND THE CURRENT PLAYBACK TIME
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { TransportMode } from "./P3dAppController.js";
import { logger } from "./P3dLog.js";
//-----------------------------------------------------------------------------------

const TRACK_1 = 1;
const TRACK_2 = 2;
const TRACK_3 = 3;
const TRACK_4 = 4;
const TRACK_5 = 5;
const TRACK_6 = 6;
const TRACK_7 = 7;

const SequenceModes = {
	MODE_1: 1,
	MODE_2: 2,
	MODE_3: 3,
	MODE_4: 4,
	MODE_5: 5,
	MODE_6: 6,
	MODE_7: 7,
	MODE_8: 8,
	MODE_9: 9,
	MODE_10: 10,
	MODE_11: 11,
	MODE_12: 12,
	MODE_13: 13,
	MODE_14: 14
}


// THIS DETERMINES WHICH VISUAL MODE IS USED FOR DIFFERENT TRACKS AND TIMES
// [ TRACK, TIME IN SECONDS, SEQUENCER MODE ]
const sequenceTable = [
	[ TRACK_1,  0, SequenceModes.MODE_1 ],
	[ TRACK_1, 30, SequenceModes.MODE_2 ],

	[ TRACK_2,  0, SequenceModes.MODE_3 ],

	[ TRACK_3,  0, SequenceModes.MODE_4 ],

	[ TRACK_4,  0, SequenceModes.MODE_5 ],

	[ TRACK_5,  0, SequenceModes.MODE_6 ],

	[ TRACK_6,  0, SequenceModes.MODE_7 ],

	[ TRACK_7,  0, SequenceModes.MODE_8 ]
]







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
    if( appStatus != TransportMode.PLAYING )
    {
      this.particles.disable();
      this.roomCube.play();
    }
    else
    {
      this.particles.enable();
      this.roomCube.pause();
    }

		this.roomCube.setShaderMode( this.appController.getTrackNumber() - 1 );

		// UPDATE TRAY STATE
		let transportTrayOpen = (appStatus === TransportMode.TRAY_OPENING  ||  appStatus === TransportMode.TRAY_OPEN)
		if( this.playerModel.trayOpen == true  &&  transportTrayOpen == false )
			this.playerModel.closeTray();
		if( this.playerModel.trayOpen == false  &&  transportTrayOpen == true )
			this.playerModel.openTray();

	}


}










