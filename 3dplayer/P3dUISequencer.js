//
// P3dUISequence.js
//
// SEQUENCE CONTROLLER THAT ORCHESTRATES BACKGROUND VISUALS BASED ON THE TRACK NUMBER
// AND THE CURRENT PLAYBACK TIME.
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { TransportMode } from "./P3dAppController.js";
import { P3dParticlePresets } from "./P3dUIParticlePresets.js";
import { logger } from "./P3dLog.js";
//-----------------------------------------------------------------------------------


const TINY_BUBBLES = 5;
const SPINNING_TRAILS = 2;
const WOBBLY_OBJECTS = 3;
const MIRROR_BLOB = 4;
const LIGHT_DOTS = 1;
const TRACK_6 = 6;
const BLACK_OBJECTS = 7;


const SequenceMode = {
	A1: 1,
	A2: 2,
	A3: 3,
	A4: 4,
	A1b: 5,
	C1: 10,
	C2: 11,
	D: 20,
	E1: 30,
	E2: 31,
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
	[ TINY_BUBBLES,  0,   SequenceMode.A1 ],
	[ TINY_BUBBLES,  30,  SequenceMode.A1b ],
	[ TINY_BUBBLES,  60,  SequenceMode.A2 ],
	[ TINY_BUBBLES,  90,  SequenceMode.A3 ],
	[ TINY_BUBBLES,  105, SequenceMode.A4 ],
	[ TINY_BUBBLES,  134, SequenceMode.A1b ],
	[ TINY_BUBBLES,  150, SequenceMode.A3 ],
	[ TINY_BUBBLES,  165, SequenceMode.A2 ],
	[ TINY_BUBBLES,  196, SequenceMode.A3 ],
	//[ TINY_BUBBLES,  210, SequenceMode.A3 ], // <-- ALTERNATE TO 196 LINE, ORIGINALLY STARTED A LITTLE LATER
	[ TINY_BUBBLES,  255, SequenceMode.A1b ],
	// - - - - - - - - - - - - - -
	[ SPINNING_TRAILS,  0, SequenceMode.C1 ],
	[ SPINNING_TRAILS,  7, SequenceMode.C2 ],
	// - - - - - - - - - - - - - -
	[ WOBBLY_OBJECTS,  0, SequenceMode.D ],
	// - - - - - - - - - - - - - -
	[ MIRROR_BLOB,  0, SequenceMode.E1 ],
	[ MIRROR_BLOB,  24,SequenceMode.E2 ],
	// - - - - - - - - - - - - - -
	[ LIGHT_DOTS,  0, SequenceMode.F ],
	// - - - - - - - - - - - - - -
	[ TRACK_6,  0, SequenceMode.G ],
	// - - - - - - - - - - - - - -
	[ BLACK_OBJECTS,  0, SequenceMode.H ]
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
		this.particles2 = graphicsController.particles2;
		this.lights = graphicsController.lights;
		this.playerModel = graphicsController.playerModel;

		this.particlePresets = new P3dParticlePresets( this.particles );
		this.particlePresets2 = new P3dParticlePresets( this.particles2 );

		this.sequenceMode = null;
		this._setSequencerMode( SequenceMode.A1 );

		this.previousAppStatus = null;

		this.trayOpen = true; // MODEL CLASS STARTS WITH TRAY OPEN
		//this.particlesEnabled = false;
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

			logger( "* * * * * * * * * * * > SEQUENCER STATUS/MODE CHANGE: ", appStatus, this.sequenceMode );

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
					this.particles.disable(); //*/
			}

			// UPDATE TRAY STATE
			let transportTrayOpen = (appStatus === TransportMode.TRAY_OPENING  ||  appStatus === TransportMode.TRAY_OPEN)
			if( this.playerModel != null )
			{
				if( this.playerModel.trayOpen == true  &&  transportTrayOpen == false )
					this.playerModel.closeTray();
				if( this.playerModel.trayOpen == false  &&  transportTrayOpen == true )
					this.playerModel.openTray();
			}
		}

		this.previousAppStatus = appStatus;
	}



	//////////////////////////////////////////////////////////////////////////////////
	_setSequencerMode( newSequenceMode )
	{
		logger( "------> NEW SEQUENCE MODE: ", newSequenceMode );
		this.sequenceMode = newSequenceMode;
		switch( newSequenceMode )
		{
			case SequenceMode.A1:
				this.particlePresets.setModeNumber( 1 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 0 );
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  ); // <----------------
				this.particlesEnabled = true;
				this.lights.disableStrobe();
				this.particles.setCurrentSize( 0.000 );
				break;
			case SequenceMode.A1b:
				this.particlePresets.setModeNumber( 1 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 0 );
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.particlesEnabled = true;
				this.lights.disableStrobe();
				this.particles.setCurrentSize( 0.025 );
				break;
			case SequenceMode.A2:
				this.lights.setColor( new THREE.Color( 0.15, 0.15, 0.15, 1.0 )  );
				this.particlePresets.setModeNumber( 1 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 6 );
				this.particlesEnabled = true;
				this.lights.disableStrobe();
				this.particles.startWind( 0.02, 0.0 );
				break;
			case SequenceMode.A3:
				this.lights.setColor( new THREE.Color( 0.3, 0.3, 0.3, 1.0 )  );
				this.particlePresets.setModeNumber( 1 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 0 );
				this.particlesEnabled = true;
				this.particles.startWind( 0.0, -0.02 );
				//this.particles.setVelocity( 0.0, 0.0004 );
				break;
			case SequenceMode.A4:
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.particlePresets.setModeNumber( 1 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 0 );
				this.particlesEnabled = true;
				this.particles.startWind( 0.02, 0.0 );
				break;

			case SequenceMode.C1:
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.particlePresets.setModeNumber( 2 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 1 );
				this.particlesEnabled = false;
				break;
			case SequenceMode.C2:
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				this.particlePresets.setModeNumber( 2 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 1 );
				this.particlesEnabled = true;
				break;

			case SequenceMode.D:
				logger( "---> PARTICLE MODE (D)" );
				this.particlePresets.setModeNumber( 3 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 2 );
				this.particlesEnabled = true;
				break;

			case SequenceMode.E1:
				this.particlePresets.setModeNumber( 4 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 3 );
				this.particlesEnabled = false;
				break;
			case SequenceMode.E2:
				this.particlePresets.setModeNumber( 4 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 3 );
				this.particlesEnabled = true;
				break;

			case SequenceMode.STANDBY: // DEBUG!
			case SequenceMode.F:
				this.particlePresets.setModeNumber( 5 );
				this.particlePresets2.setModeNumber( 8 );
				this.roomCube.setShaderMode( 6 );
				this.lights.setColor( new THREE.Color( 0.0, 0.0, 0.0, 1.0 )  );
				//this.particles.setMaterialNumber( 2 );
				this.particlesEnabled = true;
				break;

			case SequenceMode.G:
				this.particlePresets.setModeNumber( 6 );
				this.particlePresets2.setModeNumber( 0 );
				this.roomCube.setShaderMode( 5 );
				this.lights.setColor( new THREE.Color( 1.0, 1.0, 1.0, 1.0 )  );
				//this.particles.setMaterialNumber( 0 );
				this.particlesEnabled = true;
				break;

			case SequenceMode.H:
				this.particlePresets.setModeNumber( 7 );
				this.particlePresets2.setModeNumber( 0 );
				//this.roomCube.setShaderMode( 4 );
				this.lights.setColor( new THREE.Color( 0.09, 0.09, 0.09, 1.0 )  );
				this.roomCube.setShaderMode( 6 );
				//this.particles.setMaterialNumber( 0 );
				this.particlesEnabled = true;
				break;

		}
	}


}










