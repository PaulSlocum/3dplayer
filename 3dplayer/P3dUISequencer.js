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
	A1: 1,
	A2: 2,
	A3: 3,
	A4: 4,
	A1b: 5,
	C: 10,
	D: 20,
	E: 30,
	F: 40,
	G: 50,
	H: 60,
	STANDBY: 0
}


// THIS DETERMINES WHICH VISUAL MODE IS USED FOR DIFFERENT TRACKS AND TIMES
// [ TRACK, TIME (SEC), SEQUENCER MODE ]
const TABLE_TRACK_OFFSET = 0;
const TABLE_TIME_SEC_OFFSET = 1;
const TABLE_SEQUENCE_MODE_OFFSET = 2;
const sequenceTable = [
	[ TRACK_1,  0,   SequenceMode.A1 ],
	[ TRACK_1,  40,  SequenceMode.A1b ],
	[ TRACK_1,  60,  SequenceMode.A2 ],
	[ TRACK_1,  90,  SequenceMode.A3 ],
	[ TRACK_1,  105, SequenceMode.A4 ],
	[ TRACK_1,  134, SequenceMode.A1 ],
	[ TRACK_1,  150, SequenceMode.A3 ],
	[ TRACK_1,  165, SequenceMode.A2 ],
	[ TRACK_1,  210, SequenceMode.A3 ],
	[ TRACK_1,  255, SequenceMode.A1 ],
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
		let updatedMode = SequenceMode.STANDBY;
		let appStatus = this.appController.getStatus();
		if( appStatus == TransportMode.PLAYING  ||  appStatus == TransportMode.SEEK )
		{
			// DETERMINE CURRENT MODE FROM SEQUENCE TABLE...
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
								sequenceItem[TABLE_TIME_SEC_OFFSET] > sequenceCandidateItem[TABLE_TIME_SEC_OFFSET] )
						{
							sequenceCandidateItem = sequenceItem;
						}

					} // ELSE

				} // IF

			} // FOR
			updatedMode = sequenceCandidateItem[TABLE_SEQUENCE_MODE_OFFSET];
		}
		else // ELSE - NOT PLAYING/SEEKING...
		{
			updatedMode = SequenceMode.STANDBY;
		}

		// 	UPDATE SEQUENCE MODE IF IT HAS CHANGED...
		let modeDidChange = false;
		if( updatedMode != this.sequenceMode )
		{
			this._setSequencerMode( updatedMode );
			logger( "----------> NEW SEQUENCE MODE: ", this.sequenceMode );
			modeDidChange = true;
		}

		return modeDidChange;
	}


	////////////////////////////////////////////////////////////////////////////////
 	constructor( graphicsController )
	{
		this.appController = graphicsController.appController;
		this.roomCube = graphicsController.roomCube;
		this.particles = graphicsController.particles;
		this.lights = graphicsController.lights;
		this.playerModel = graphicsController.playerModel;

		this.sequenceMode = null;
		this._setSequencerMode( SequenceMode.A1 );

		this.previousAppStatus = null;

		this.trayOpen = true; // MODEL CLASS STARTS WITH TRAY OPEN
		this.particlesEnabled = false;
	}


	/////////////////////////////////////////////////////////////////////////////////
	update()
	{
		let appStatus = this.appController.getStatus();

		// UPDATE SEQUENCER MODE
		let modeDidChange = false;
		if( appStatus == TransportMode.PLAYING  ||  appStatus == TransportMode.SEEK )
			modeDidChange = this._updateSequenceMode();


		if( appStatus != TransportMode.PLAYING  &&  appStatus != TransportMode.SEEK )
			this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );


		// IF APP STATUS CHANGED...
		if( appStatus !== this.previousAppStatus  ||  modeDidChange === true )
		{
			this._updateSequenceMode();

			logger( "___________________________SEQUENCER STATUS/MODE CHANGE: ", appStatus, this.sequenceMode );

			if( appStatus != TransportMode.PLAYING )
			{
				this.roomCube.pause();
				this.particles.disable();
			}
			else
			{
				this.roomCube.play();
				if( this.particlesEnabled === true )
					this.particles.enable();
				else
					this.particles.disable();
			}

			// UPDATE TRAY STATE
			let transportTrayOpen = (appStatus === TransportMode.TRAY_OPENING  ||  appStatus === TransportMode.TRAY_OPEN)
			if( this.playerModel.trayOpen == true  &&  transportTrayOpen == false )
				this.playerModel.closeTray();
			if( this.playerModel.trayOpen == false  &&  transportTrayOpen == true )
				this.playerModel.openTray();
		}

		this.previousAppStatus = appStatus;
	}



	//////////////////////////////////////////////////////////////////////////////////
	_setSequencerMode( newSequenceMode )
	{
		this.sequenceMode = newSequenceMode;
		switch( newSequenceMode )
		{
			case SequenceMode.A1:
				this.roomCube.setShaderMode( 0 );
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.particlesEnabled = false;
				this.lights.disableStrobe();
				break;
			case SequenceMode.A1b:
				this.roomCube.setShaderMode( 0 );
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.particlesEnabled = true;
				this.lights.disableStrobe();
				break;
			case SequenceMode.A2:
				this.lights.setColor( new THREE.Color( 0.15, 0.15, 0.15, 1.0 )  );
				this.roomCube.setShaderMode( 6 );
				this.particlesEnabled = true;
				this.lights.disableStrobe();
				this.particles.startWind( 0.02, 0.0 );
				break;
			case SequenceMode.A3:
				this.lights.setColor( new THREE.Color( 0.3, 0.3, 0.3, 1.0 )  );
				this.roomCube.setShaderMode( 0 );
				this.particlesEnabled = true;
				this.particles.startWind( 0.02, 0.0 );
				break;
			case SequenceMode.A4:
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.roomCube.setShaderMode( 0 );
				this.particlesEnabled = true;
				this.particles.startWind( 0.02, 0.0 );
				break;

			case SequenceMode.C:
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.roomCube.setShaderMode( 1 );
				this.particlesEnabled = true;
				this.lights.disableStrobe();
				break;
			case SequenceMode.D:
				this.roomCube.setShaderMode( 2 );
				this.particlesEnabled = true;
				break;
			case SequenceMode.E:
				this.roomCube.setShaderMode( 3 );
				this.particlesEnabled = true;
				break;
			case SequenceMode.F:
				this.roomCube.setShaderMode( 4 );
				this.particlesEnabled = true;
				break;
			case SequenceMode.G:
				this.roomCube.setShaderMode( 5 );
				this.particlesEnabled = true;
				break;
			case SequenceMode.H:
				this.roomCube.setShaderMode( 6 );
				this.particlesEnabled = true;
				break;

			case SequenceMode.STANDBY:
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.particlesEnabled = false;
				break;
		}
	}


}










