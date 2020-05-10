//
//
//
//
//
//
///////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { logger } from "./P3dLog.js";
import { MeshMode } from "./P3dUIParticles.js";
//-----------------------------------------------------------------------------------


export class P3dParticlePresets
{
	constructor( particles )
	{
		this.p = particles;
	}


		/////////////////////////////////////////////////////////////////////////////////
	// SELECT SETTINGS FROM A NUMBER OF PREDEFINED MODES
	setModeNumber( newModeNumber )
	{
		logger( "----->PARTCLE MODE: ", newModeNumber );
		this.p.modeNumber = newModeNumber;
		switch( newModeNumber )
		{
			case 0:
			case 3: // ORIGINAL GOLD FLOATING OBJECTS
				this.p.maxParticles = 55;
				this.p.launchPositionX = -1.0; // <--------
				//this.p.launchPositionX = 0.0; // DEBUG!
				this.p.launchPositionY = 0.0;
				this.p.launchVarianceX = 0.0;
				this.p.launchVarianceY = 0.5;
				this.p.minimumLaunchDistance = 1.35;
				this.p.cubeCameraEnabled = false;
				this.p.spawnDelayMSec = 300.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.xSpeed = 0.0002;
				this.p.ySpeed = 0.0;
				this.p.r1Value = 0.04;
				this.p.t1Speed = 0.524;
    		this.p.t1StartPosition = 0.0;
				this.p.r2Value = 0.0;
				this.p.t2Speed = 0.0;
    		this.p.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.lightSourceEnabled = false;
				this.p.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.p.materialNumber = 0;
				this.p.currentSize = 1.0;
				this.p.targetSizeRate = 0.001;
				this.p.targetSize = 1.0;
				this.p.wind.enable();
				this.p.wind.setDirection( 0.5, 0.0, 0.2, 0.7 );
				this.p.wind.setIntervalMSec( 15000 );
				break;

			case 2: // ROTATING OBJECTS
				this.p.maxParticles = 40;
				this.p.launchPositionX = -0.8;
				this.p.launchPositionY = 0.0;
				this.p.launchVarianceX = 0.0;
				this.p.launchVarianceY = 0.0;
				this.p.minimumLaunchDistance = 0.0;
				this.p.cubeCameraEnabled = false;
				this.p.spawnDelayMSec = 200.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.xSpeed = 0.0007;
				this.p.ySpeed = 0.0;
				this.p.r1Value = 1.8;
				this.p.t1Speed = 0.04;
    		this.p.t1StartPosition = 2.1;
				this.p.r2Value = 0.0;
				this.p.t2Speed = 0.0;
    		this.p.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.lightSourceEnabled = false;
				this.p.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.p.materialNumber = 4;
				this.p.currentSize = 0.3;
				this.p.targetSize = 0.3;
				this.p.wind.enable();
				this.p.wind.setDirection( 0.0, 0.0, 0.4, 0.4 );
				this.p.wind.setIntervalMSec( 5000 );
				break;

			case 1: // TINY BUBBLES
				this.p.maxParticles = 200;
				this.p.launchPositionX = 0.0;
				this.p.launchPositionY = -0.5;
				this.p.launchVarianceX = 1.0;
				this.p.launchVarianceY = 0.0;
				this.p.minimumLaunchDistance = 0.1;
				this.p.cubeCameraEnabled = false;
				//this.p.spawnDelayMSec = 20.0; // <---- ORIGINAL
				this.p.spawnDelayMSec = 40.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.xSpeed = 0.0000;
				this.p.ySpeed = 0.0015;
				this.p.r1Value = 0.5;
				this.p.t1Speed = 0.04;
    		this.p.t1StartPosition = 0.0;
				this.p.r2Value = 0.0;
				this.p.t2Speed = 0.0;
    		this.p.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.lightSourceEnabled = false;
				this.p.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.p.materialNumber = 1;
				this.p.targetSizeRate = 0.000001;
				this.p.targetSize = 0.09;
				//this.p.targetSize = 0.09; // <--- ORIGINAL
				this.p.wind.enable();
				this.p.wind.setDirection( 0.0, -1.0, 1.0, 0.0 );
				this.p.wind.setIntervalMSec( 10000 );
				break;

			case 4: // SPHERE BLOB WITH CUBE CAMERA
				this.p.maxParticles = 8;
				this.p.launchPositionX = 0.0;
				this.p.launchPositionY = 0.0;
				this.p.launchVarianceX = 0.0;
				this.p.launchVarianceY = 0.0;
				this.p.minimumLaunchDistance = 1.0;
				this.p.cubeCameraEnabled = true;
				this.p.spawnDelayMSec = 400.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.xSpeed = 0.0;
				this.p.ySpeed = 0.0;
				this.p.r1Value = 1.7;
				this.p.t1Speed = 0.02;
	   		this.p.t1StartPosition = 0.0;
				this.p.r2Value = 0.0;
				this.p.t2Speed = 0.0;
    		this.p.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.lightSourceEnabled = false;
				//this.p.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.p.meshMode = MeshMode.TORRUS_KNOT;
				this.p.materialNumber = 3;
				this.p.currentSize = 0.0;
				this.p.targetSizeRate = 0.00005;
				this.p.targetSize = 1.70;
				this.p.wind.enable();
				this.p.wind.setDirection( 0.0, 0.0, 0.5, 0.5 );
				this.p.wind.setIntervalMSec( 10000 );
				break;

			case 5: // LIGHTS
				this.p.maxParticles = 7;
				this.p.launchPositionX = 0.0;
				this.p.launchPositionY = 0.1;
				this.p.launchVarianceX = 0.0;
				this.p.launchVarianceY = 0.0;
				this.p.minimumLaunchDistance = 1.0;
				this.p.cubeCameraEnabled = false;
				//this.p.spawnDelayMSec = 300.0;
				//this.p.spawnDelayMSec = 1500.0;
				//this.p.spawnDelayMSec = 2300.0; // <-------------
				this.p.spawnDelayMSec = 6300.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.xSpeed = 0.0000;
				this.p.ySpeed = 0.0000;
				this.p.r1Value = 2.5;
				this.p.t1Speed = 0.02; //<------------
				//this.p.t1Speed = 0.06;
	   		this.p.t1StartPosition = 3.14/4;
				this.p.r2Value = 0.0;
				this.p.t2Speed = 0.0;
    		this.p.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.lightSourceEnabled = true;
				//this.p.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.p.meshMode = MeshMode.SPHERES;
				this.p.materialNumber = 5;
				this.p.currentSize = 0.10;
				this.p.targetSizeRate = 0.0001;
				this.p.targetSize = 0.10;
				this.p.wind.enable();
				this.p.wind.setDirection( 0.0, -0.01, 0.5, 0.5 );
				this.p.wind.setIntervalMSec( 10000 );
				break;

			case 6: // SMALLER SPHERES WITH CUBE CAMERA
				this.p.maxParticles = 6;
				this.p.launchPositionX = 0.0;
				this.p.launchPositionY = 0.0;
				this.p.launchVarianceX = 0.0;
				this.p.launchVarianceY = 0.0;
				this.p.minimumLaunchDistance = 0.5;
				this.p.cubeCameraEnabled = true;
				this.p.spawnDelayMSec = 1000.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.xSpeed = 0.0;
				this.p.ySpeed = 0.0;
				this.p.r1Value = 1.7;
				this.p.t1Speed = 0.02;
	   		this.p.t1StartPosition = 0.0;
				this.p.r2Value = 0.0;
				this.p.t2Speed = 0.0;
    		this.p.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.lightSourceEnabled = false;
				//this.p.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.p.meshMode = MeshMode.TORRUS_KNOT;
				this.p.materialNumber = 3;
				this.p.currentSize = 0.3;
				this.p.targetSizeRate = 0.0001;
				this.p.targetSize = 1.70;
				this.p.wind.enable();
				this.p.wind.setDirection( 0.0, 0.0, 0.5, 0.5 );
				this.p.wind.setIntervalMSec( 10000 );
				break;

			case 7: // BLACK SHAPES
				this.p.maxParticles = 55;
				this.p.launchPositionX = 0.0; // <--------
				//this.p.launchPositionX = 0.0; // DEBUG!
				this.p.launchPositionY = -1.0;
				this.p.launchVarianceX = 0.5;
				this.p.launchVarianceY = 0.0;
				this.p.minimumLaunchDistance = 2.35;
				this.p.cubeCameraEnabled = false;
				this.p.spawnDelayMSec = 1300.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.xSpeed = 0.0;
				this.p.ySpeed = 0.0002;
				this.p.r1Value = 0.02;
				this.p.t1Speed = 0.0524;
    		this.p.t1StartPosition = 0.0;
				this.p.r2Value = 0.0;
				this.p.t2Speed = 0.0;
    		this.p.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.p.lightSourceEnabled = false;
				this.p.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.p.materialNumber = 2;
				this.p.currentSize = 2.0;
				this.p.targetSizeRate = 0.001;
				this.p.targetSize = 2.0;
				this.p.wind.enable();
				this.p.wind.setDirection( 0.0, 0.0, 0.5, 0.5 );
				this.p.wind.setIntervalMSec( 15000 );
				break;

		}
	}


}












