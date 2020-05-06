//
// P3dUIParticles.js
//
// SIMPLE PARTICLE/PHYSICS SYSTEM THAT DISPLAYS FIELD OF MOVING OBJECTS.
//
////////////////////////////////////////////////////////////////////////////////////////


//---------------------------------------------------------------------------------
import { random, converge } from "./P3dUtility.js";
import { logger, logerr } from "./P3dLog.js";
import { P3dParticleWind } from "./P3dUIParticleWind.js";
//---------------------------------------------------------------------------------


//*************************************************************************
// THIS SHOULD BE FALSE UNLESS DEBUGGING
const DEBUG_ALWAYS_ENABLE_PARTICLES = true;
//*************************************************************************



//*************************************************************************
// PARAMETER NOTES:
// x enable/disable
// - fade out time
// - fade in time
// ~     -     ~     -     ~     -     ~     -
// x generator rate
// - minimum distance
// x generator direction or starting position?
// ~     -     ~     -     ~     -     ~     -
// - cartesian target velocity (x,y) //     TARGETS EITHER VELOCITY OR POSITION BASED ON WHICH IS NON-ZERO
// - cartesian target position (x,y) //     AND X/Y ARE HANDLED INDEPENDENTLY
// - polar1 target velocity (x,y)
// - polar1 target position (x,y)
// - polar2 target velocity (x,y)
// - polar2 target position (x,y)
// ~     -     ~     -     ~     -     ~     -
// - material mode (shiny, matte, glass, mirror, emitter, texture, video)
// - emitter target brightness
// ~     -     ~     -     ~     -     ~     -
// - wind velocity (x,y)
// - wind frequency
// ~     -     ~     -     ~     -     ~     -
// - object size
// - object depth
// ~     -     ~     -     ~     -     ~     -
// - bounce/explode action that can be activated at regular intervals?
// ~     -     ~     -     ~     -     ~     -
// - polar1 modulation amount (x,y)
// - polar1 modulation frequency (x,y)
// - polar2 modulation amount (x,y)
// - polar2 modulation frequency (x,y)
// ~     -     ~     -     ~     -     ~     -
//*************************************************************************



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
class P3dParticle
{
	constructor( idNumber )
	{
		this.idNumber = 0;

		this.xSpeed = 0.0;
		this.ySpeed = 0.0;
		this.zSpeed = 0.0;

		this.object = null;
		this.size = 1.0;
		this.fade = 0.0;

		this.enabled = false;
	}
}




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dSwarm
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene, renderer )
  {
    this.scene = scene;
    this.renderer = renderer;

		this.particles = [];

		this.maxParticles = 55;

		this.launchPositionX = -1.0;
		this.launchPositionY = 0.0;
		this.launchVarianceX = 0.0;
		this.launchVarianceY = 0.5;

		this.minimumLaunchDistance = 1.0;

		this.cubeCameraEnabled = false;

		this.spawnDelayMSec = 300.0;
		//this.spawnDelayMSec = 1500.0;
		this.lastSpawnTime = 0.0;

    this.xBaseSpeed = 0.0001;
    this.yBaseSpeed = 0.0;
    this.size = 1.0;

    this.wind = new P3dParticleWind();

    this.screenEdgePosition = 6.0;

    this.enabled = false;

    this.frameCounter = 0;
    //this.frameTimer = 0;
    this.lastFrameTimeMSec = 0;

    this.materialsArray = [];
    this.materialNumber = 3;

    this.particleIdCounter = 1;

    this.load();

    this.disable(); // <-- START WITH PARTICLES TURNED OFF
  }


  ////////////////////////////////////////////////////////////////////////
  load()
  {
  	//***********************************************************************************
    // NOTE: OTHER GEOMETRIES TO CONSIDER:
    //    TetrahedronGeometry   ConeGeometry   CylinderGeometry   IcosahedronGeometry
    //    OctahedronGeometry    TextGeometry    TorusGeometry     TorusKnotGeometry
  	//***********************************************************************************

    // CREATE MATERIALS AND GEOMETRIES
    const objectSize = 0.33; //<------------------
    //const objectSize = 0.53;
    const circularSegments = 22;
    const coneSegments = 60;
    this.sphereGeometry = new THREE.SphereGeometry( objectSize, circularSegments, circularSegments );
    this.boxGeometry = new THREE.BoxGeometry( objectSize*1.5, objectSize*1.5, objectSize*1.5 );
    this.coneGeometry = new THREE.ConeGeometry( objectSize*0.9, objectSize*1.5, coneSegments ); // <-------------
    this.torusKnotGeometry = new THREE.TorusKnotGeometry( objectSize*1.5, objectSize*0.5, 100, 16 );

		this._loadMaterials();
  }


	/////////////////////////////////////////////////////////////////////////////////
	// SELECT FROM A NUMBER OF PREDEFINED MODES
	setModeNumber( newModeNumber )
	{
		logger( "----->PARTCLE MODE: ", newModeNumber );
		this.modeNumber = newModeNumber;
		switch( newModeNumber )
		{
			case 0:
			case 3:
				this.maxParticles = 55;
				this.launchPositionX = -1.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.5;
				this.minimumLaunchDistance = 1.35;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 300.0;
				this.xBaseSpeed = 0.0002;
				this.yBaseSpeed = 0.0;
				this.materialNumber = 0;
				this.size = 1.0;
				this.wind.enable();
				this.wind.setDirection( 0.5, 0.0, 0.2, 0.7 );
				this.wind.setIntervalMSec( 15000 );
				break;

			case 2:
				this.maxParticles = 55;
				this.launchPositionX = -1.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.5;
				this.minimumLaunchDistance = 1.0;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 300.0;
				this.xBaseSpeed = 0.0002;
				this.yBaseSpeed = 0.0;
				this.materialNumber = 3;
				this.size = 1.0;
				this.wind.disable();
				break;

			case 1:
				this.maxParticles = 155;
				this.launchPositionX = 0.0;
				this.launchPositionY = -0.5;
				this.launchVarianceX = 1.0;
				this.launchVarianceY = 0.0;
				this.minimumLaunchDistance = 0.1;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 20.0;
				this.xBaseSpeed = 0.0000;
				this.yBaseSpeed = 0.0015;
				this.materialNumber = 1;
				this.size = 0.05;
				this.wind.enable();
				this.wind.setDirection( 0.0, -1.0, 1.0, 0.0 );
				this.wind.setIntervalMSec( 10000 );
				break;

			case 4:
				this.maxParticles = 55;
				this.launchPositionX = -1.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.5;
				this.minimumLaunchDistance = 1.0;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 300.0;
				this.xBaseSpeed = 0.0001;
				this.yBaseSpeed = 0.0;
				this.materialNumber = 3;
				this.size = 1.0;
				break;

			case 5:
				this.maxParticles = 55;
				this.launchPositionX = 0.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.5;
				this.minimumLaunchDistance = 0.5;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 300.0;
				this.xBaseSpeed = -0.0002;
				this.yBaseSpeed = 0.0;
				this.materialNumber = 3;
				this.size = 0.3;
				break;
			case 6:
				break;
			case 7:
				break;
			case 8:
				break;
			case 9:
				break;
		}
	}



	///////////////////////////////////////////////////////////////////////////////
	_loadMaterials()
	{
		// GOLD METAL MATERIAL
    let material0 = new THREE.MeshStandardMaterial( {color: 0x817060} );
    material0.metalness = 0.7;
    material0.roughness = 0.45;
    this.materialsArray[0] = material0;

		// SILVER METAL MATERIAL
    let material1 = new THREE.MeshStandardMaterial( {color: 0xE8E8F0} );
    material1.metalness = 0.8;
    material1.roughness = 0.45;
    this.materialsArray[1] = material1;

		// MATTE BLACK MATERIAL
    let material2 = new THREE.MeshStandardMaterial( {color: 0x050505} ); // <-----------
    material2.metalness = 0.0;
    material2.roughness = 0.5;
    this.materialsArray[2] = material2;

		// MIRROR MATERIAL
		this.cubeCamera = new THREE.CubeCamera( 0.1, 100, 64 )   // near, far, resolution);
		//this.cubeCamera.renderTarget.texture.generateMipmaps = true;
		//this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    let material3 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF,
    									envMap: this.cubeCamera.renderTarget.texture, refractionRatio: 0.655, reflectivity: 0.98} ); // <-----------
    //material3.envMap = this.cubeCamera.renderTarget.texture;
		this.scene.add( this.cubeCamera );
		//material3.metalness = 0.3;
    //material3.roughness = 0.0;
    this.materialsArray[3] = material3;
		//this.cubeCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping;

		// MATTE WHITE MATERIAL
    let material4 = new THREE.MeshStandardMaterial( {color: 0x817060} ); // <-----------
    material4.metalness = 0.0;
    material4.roughness = 0.6;
    this.materialsArray[4] = material4;

		// TEXTURE MATERIAL

		// EMISSION MATERIAL

		// VIDEO MATERIAL

	}



	///////////////////////////////////////////////////////////////////////////////
	setMaterialNumber( newMaterialNumber )
	{
		logger( "----> PARTICLE: SET MATERIAL NUMBER: ", newMaterialNumber );
		if( newMaterialNumber < this.materialsArray.length )
			this.materialNumber = newMaterialNumber;
		else
			logerr( "SET MATERIAL NUMBER OUT OF RANGE: ", newMaterialNumber, this.materialsArray.length );
	}




  ///////////////////////////////////////////////////////////////////////////////
  update()
  {
  	if( DEBUG_ALWAYS_ENABLE_PARTICLES === true )
  		this.enabled = true;

  	let currentTimeMSec = performance.now();
  	let frameDeltaMSec = currentTimeMSec - this.lastFrameTimeMSec;
  	this.lastFrameTimeMSec = currentTimeMSec;

    this.frameCounter++;

		if( this.enabled === true  &&  this.cubeCameraEnabled === true  &&  this.frameCounter%2 === 0 )
		{
			this.cubeCamera.update( this.renderer, this.scene );
			this.materialsArray[3].envMap = this.cubeCamera.renderTarget.texture;
		}//*/

		// NEW SPAWNING SYSTEM...
		if( this.enabled == true  &&  currentTimeMSec > this.lastSpawnTime + this.spawnDelayMSec )
		{
			this._launchObject();
			this.lastSpawnTime = currentTimeMSec;
		}

		// UPDATE WIND
		this.wind.update( this.frameCounter, frameDeltaMSec );

    // UPDATE POSITION, ROTATION, AND SCALE OF EACH OBJECT
    let deletionList = [];
    for( let i=0; i<this.particles.length; i++ )
    {
    	// POLAR COORDINATES
    	//this.particles[i].object.position.x = Math.sin( currentTimeMSec * 0.0008 );
      //this.particles[i].object.position.y = Math.cos( currentTimeMSec * 0.0008 );

			// CARTESIAN COORDINATES
			this.particles[i].object.position.x +=
								(this.particles[i].xSpeed + this.wind.getCurrentForceX() * 0.1 + this.xBaseSpeed) * frameDeltaMSec;
			this.particles[i].object.position.y +=
								(this.particles[i].ySpeed + this.wind.getCurrentForceY() * 0.1 + this.yBaseSpeed) * frameDeltaMSec;

      // IF OBJECT HAS REACHED SCREEN EDGE, THEN RESET TO THE OPPOSITE SIDE...
      if( this.particles[i].object.position.x > this.screenEdgePosition  ||  this.particles[i].object.position.x < -this.screenEdgePosition  ||
          this.particles[i].object.position.y > this.screenEdgePosition  ||  this.particles[i].object.position.y < -this.screenEdgePosition   )
      {
       	deletionList.push( this.particles[i].idNumber );
      }

			//-  -  -
      // IF OBJECT IS DISABLED, THEN SCALE OBJECT SMALLER UNTIL IT IS GONE.
      if( this.particles[i].enabled === false )
      {
        if( DEBUG_ALWAYS_ENABLE_PARTICLES === true )
          this.particles[i].fade = 1.0; // DEBUG
        else
        {
          this.particles[i].fade = converge( this.particles[i].fade, 0.0, 0.003 * frameDeltaMSec );
        }
      }
      else // ELSE - SCALE OBJECT BIGGER UNTIL IT'S FULL SIZE
      {
        this.particles[i].fade = converge( this.particles[i].fade, 1.0, 0.003 * frameDeltaMSec );
        if( this.particles[i].fade == 0.0 )
        	deletionList.push( this.particles[i].idNumber );
      }

      this.particles[i].object.scale.x = this.particles[i].size * this.particles[i].fade;
      this.particles[i].object.scale.y = this.particles[i].size * this.particles[i].fade;
      this.particles[i].object.scale.z = this.particles[i].size * this.particles[i].fade;

      this.particles[i].object.rotation.z += frameDeltaMSec * 0.0012;
      this.particles[i].object.rotation.y += frameDeltaMSec * 0.002 * this.particles[i].xSpeed; // XSPEED??  WHY MULTIPLIED HERE?
    }

    // DELETE ALL OBJECTS THAT WERE MARKED FOR DELETION...
    for( let i=0; i<deletionList.length; i++ )
    {
    	//logger( "------> PARTICLES: DELETING FADED OBJECT: ", deletionList[i] );
    	this.killObjectWithId( deletionList[i] );
    }

		// UPDATE CUBE CAMERA POSITION
		/*this.cubeCamera.position.x = this.objectArray[0].position.x;
		this.cubeCamera.position.y = this.objectArray[0].position.y;
		this.cubeCamera.position.z = this.objectArray[0].position.z; //*/

  }

	/////////////////////////////////////////////////////////////////////////////////
	killObjectWithId( idNumber )
	{
    for( let i=0; i<this.particles.length; i++ )
    {
    	if( idNumber === this.particles[i].idNumber )
    	{
				this.killObjectAtIndex( i );
    	}
    }
	}


	/////////////////////////////////////////////////////////////////////////////////
	killObjectAtIndex( index )
	{
		this.scene.remove( this.particles[index].object );
		this.particles[index].object = null;
		this.particles.splice( index, 1 );
	}


	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~


  ////////////////////////////////////////////////////////////////////////
  setScreenEdgePosition( newEdge )
  {
    this.screenEdgePosition = newEdge + 0.7;
  }



  ////////////////////////////////////////////////////////////////////////////
  enable()
  {
    this.enabled = true;
  }


  ////////////////////////////////////////////////////////////////////////////
  disable()
  {
    this.enabled = false;
    for( let i=0; i<this.particles.length; i++ )
    {
      this.particles[i].enabled = false;
    }
  }



	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~

	///////////////////////////////////////////////////////////////////////////////
	_launchObject( objectIndex )
	{
		//logger( "---> PARTICLES LAUNCH OBJECT: TOTAL OBJECTS: ", this.particles.length, this.maxParticles );
		if( this.particles.length <= this.maxParticles )
		{

			// ATTEMPT TO PLACE OBJECT...
			let foundNearbyObject = false;
			let placementAttempts = 0;
			let xPosition = 0.0;
			let yPosition = 0.0;
			const MAX_PLACE_ATTEMPTS = 5;
			do
			{
				placementAttempts++;
				if( placementAttempts > MAX_PLACE_ATTEMPTS )
				{
					foundNearbyObject = true;
					break;  // <-- BREAK DO-WHILE LOOP
				}

				// TRY A RANDOM LOCATION...
				xPosition = this.launchPositionX * this.screenEdgePosition
								+ ( random( 200 ) - 100.0 ) / 100.0 * this.screenEdgePosition * this.launchVarianceX;
				yPosition = this.launchPositionY * this.screenEdgePosition
								+ ( random( 200 ) - 100.0 ) / 100.0 * this.screenEdgePosition * this.launchVarianceY; //*/

				// CHECK IF IT'S TOO CLOSE TO ANY OTHER OBJECTS
				//const PROXIMITY_LIMIT = 1.35;
				let PROXIMITY_LIMIT = this.minimumLaunchDistance;
				foundNearbyObject = false;
				for( let j=0; j<this.particles.length; j++ )
				{
					if( Math.abs( this.particles[j].object.position.x - xPosition ) < PROXIMITY_LIMIT  &&
							Math.abs( this.particles[j].object.position.y - yPosition ) < PROXIMITY_LIMIT  )
					{
						foundNearbyObject = true;
						break; // <-- BREAK FOR LOOP
					}
				}

			}
			while( foundNearbyObject == true );//*/

			// IF THERE IS ENOUGH SPACE TO PLACE OBJECT...
			if( foundNearbyObject == false )
			{
				let newParticle = new P3dParticle();
				//newParticle.object = new THREE.Mesh( this.sphereGeometry, this.materialsArray[this.materialNumber] );
				switch( random(3) )
				{
					case 0: newParticle.object = new THREE.Mesh( this.sphereGeometry, this.materialsArray[this.materialNumber] ); break;
					case 1: newParticle.object = new THREE.Mesh( this.boxGeometry, this.materialsArray[this.materialNumber] ); break;
					case 2: newParticle.object = new THREE.Mesh( this.coneGeometry, this.materialsArray[this.materialNumber] ); break;
				} //*/
				newParticle.fade = 0.0;
				newParticle.enabled = true;
				//newParticle.xSpeed = random(20) * 0.000002 + 0.00037;

				newParticle.object.castShadow = true;
				newParticle.object.rotation.x = random(360)*3.14/2.0;
				newParticle.object.rotation.y = random(360)*3.14/2.0;
				newParticle.object.position.x = xPosition;
				newParticle.object.position.y = yPosition;
				newParticle.object.position.z = 0.0;
				newParticle.size = this.size;

				newParticle.idNumber = this.particleIdCounter;
				this.particleIdCounter++;

				this.scene.add( newParticle.object );
				this.particles.push( newParticle );
			}

		}
	}


	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~


	//////////////////////////////////////////////////////////////////////////////
	startWind( extraWindX, extraWindY )
	{
		this.wind.startWind( extraWindX, extraWindY );
	}


}




