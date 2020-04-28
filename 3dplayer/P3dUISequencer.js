//
// P3dUISequence.js
//
// SEQUENCE CONTROLLER THAT ORCHESTRATES BACKGROUND VISUALS BASED ON THE TRACK NUMBER
// AND THE CURRENT PLAYBACK TIME.
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


const SequenceMode = {
	A: 1,
	B: 2,
	C: 3,
	D: 4,
	E: 5,
	F: 6,
	G: 7,
	H: 8,
	I: 9,
	J: 10,
	K: 11,
	L: 12,
	M: 13,
	N: 14
}


// THIS DETERMINES WHICH VISUAL MODE IS USED FOR DIFFERENT TRACKS AND TIMES
// [ TRACK, TIME (SEC), SEQUENCER MODE ]
const TABLE_TRACK_OFFSET = 0;
const TABLE_TIME_SEC_OFFSET = 1;
const TABLE_SEQUENCE_MODE_OFFSET = 2;
const sequenceTable = [
	[ TRACK_1,  0, SequenceMode.A ],
	[ TRACK_1,  5, SequenceMode.C ],
	// - - - - - - - - - - - - - -
	[ TRACK_2,  0, SequenceMode.C ],
	// - - - - - - - - - - - - - -
	[ TRACK_3,  0, SequenceMode.D ],
	// - - - - - - - - - - - - - -
	[ TRACK_4,  0, SequenceMode.E ],
	// - - - - - - - - - - - - - -
	[ TRACK_5,  0, SequenceMode.F ],
	// - - - - - - - - - - - - - -
	[ TRACK_6,  0, SequenceMode.G ],
	// - - - - - - - - - - - - - -
	[ TRACK_7,  0, SequenceMode.H ]
]


//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dSequencer
{

	///////////////////////////////////////////////////////////////////////////////////
	_updateSequenceMode()
	{
		let sequenceCandidateItem = null;
		let currentTrackNumber = this.appController.getTrackNumber();
		let currentTimeSec = this.appController.getPlaybackTime();
		for( let i in sequenceTable )
		{
			let sequenceItem = sequenceTable[i];
			//logger( "SEQUENCE ITEM: ", sequenceItem );

			if( sequenceItem[TABLE_TRACK_OFFSET] == currentTrackNumber )
			{
				if( sequenceCandidateItem === null  &&  sequenceItem[TABLE_TIME_SEC_OFFSET] <= currentTimeSec )
				{
					sequenceCandidateItem = sequenceItem;
				}
				else
				{
					if( sequenceItem[TABLE_TIME_SEC_OFFSET] <= currentTimeSec  &&
							sequenceItem[TABLE_TIME_SEC_OFFSET] < sequenceCandidateItem[TABLE_TIME_SEC_OFFSET] )
					{
						sequenceCandidateItem = sequenceItem;
					}

				} // ELSE

			} // IF

		} // FOR

		// 	IF A SEQUENCE WAS FOUND FOR THE CURRENT TRACK/TIME...
		if( sequenceCandidateItem != null  &&  sequenceCandidateItem[TABLE_SEQUENCE_MODE_OFFSET] != this.sequenceMode )
		{
			//this.sequenceMode = sequenceCandidateItem[TABLE_SEQUENCE_MODE_OFFSET];
			this._setSequencerMode( sequenceCandidateItem[TABLE_SEQUENCE_MODE_OFFSET] );
			logger( "----------> NEW SEQUENCE MODE: ", this.sequenceMode );
		}
	}


	////////////////////////////////////////////////////////////////////////////////
 	constructor( graphicsController )
	{
		this.appController = graphicsController.appController;
		this.roomCube = graphicsController.roomCube;
		this.particles = graphicsController.particles;
		this.lights = graphicsController.lights;
		this.playerModel = graphicsController.playerModel;

		this.trayOpen = true; // MODEL CLASS STARTS WITH TRAY OPEN
		this.sequenceMode = null;
		this._setSequencerMode( SequenceMode.A );
		//this._updateSequenceMode();

	}


	/////////////////////////////////////////////////////////////////////////////////
	update()
	{


		let appStatus = this.appController.getStatus();

    if( appStatus != TransportMode.PLAYING )
    {
      this.particles.disable();
      this.roomCube.pause();
    }
    else
    {
      this.particles.enable();
      this.roomCube.play();
    }

    if( appStatus == TransportMode.PLAYING  ||  appStatus == TransportMode.SEEK )
			this._updateSequenceMode();
		//	this.roomCube.setShaderMode( this.appController.getTrackNumber() - 1 );

		// UPDATE TRAY STATE
		let transportTrayOpen = (appStatus === TransportMode.TRAY_OPENING  ||  appStatus === TransportMode.TRAY_OPEN)
		if( this.playerModel.trayOpen == true  &&  transportTrayOpen == false )
			this.playerModel.closeTray();
		if( this.playerModel.trayOpen == false  &&  transportTrayOpen == true )
			this.playerModel.openTray();
	}



	//////////////////////////////////////////////////////////////////////////////////
	_setSequencerMode( newSequenceMode )
	{
		this.sequenceMode = newSequenceMode;
		switch( newSequenceMode )
		{
			case SequenceMode.A:
				this.roomCube.setShaderMode( 0 );
				break;
			case SequenceMode.B:
				this.roomCube.setShaderMode( 0 );
				break;

			case SequenceMode.C:
				this.roomCube.setShaderMode( 1 );
				break;
			case SequenceMode.D:
				this.roomCube.setShaderMode( 2 );
				break;
			case SequenceMode.E:
				this.roomCube.setShaderMode( 3 );
				break;
			case SequenceMode.F:
				this.roomCube.setShaderMode( 4 );
				break;
			case SequenceMode.G:
				this.roomCube.setShaderMode( 5 );
				break;
			case SequenceMode.H:
				this.roomCube.setShaderMode( 6 );
				break;
			case SequenceMode.I:
				this.roomCube.setShaderMode( 7 );
				break;
			case SequenceMode.J:
				this.roomCube.setShaderMode( 8 );
				break;
			case SequenceMode.K:
				this.roomCube.setShaderMode( 9 );
				break;
			case SequenceMode.L:
				this.roomCube.setShaderMode( 10 );
				break;
		}
	}


}










