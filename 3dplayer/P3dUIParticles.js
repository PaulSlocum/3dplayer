//
// P3dUIParticles.js
//
// SIMPLE PARTICLE/PHYSICS SYSTEM THAT DISPLAYS FIELD OF MOVING OBJECTS.
//
////////////////////////////////////////////////////////////////////////////////////////


//---------------------------------------------------------------------------------
import { random, converge } from "./P3dUtility.js";
import { logger, logerr } from "./P3dLog.js";
import { P3dLightPool } from "./P3dUILightPool.js";
import { P3dParticleWind } from "./P3dUIParticleWind.js";
//---------------------------------------------------------------------------------


//*************************************************************************
// THIS SHOULD BE FALSE UNLESS DEBUGGING
const DEBUG_ALWAYS_ENABLE_PARTICLES = false;
// ~  -  ~  -  ~  -  ~  -  ~  -  ~  -  ~  -
if( DEBUG_ALWAYS_ENABLE_PARTICLES )
	console.warn( "WARNING: PARTICLE ALWAYS ENABLE DEBUG SWITCH ACTIVATED" );
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

		this.xPosition = 0.0;
		this.yPosition = 0.0;

		this.r1Position = 0.0;
		this.t1Position = 0.0;
		this.r2Position = 0.0;
		this.t2Position = 0.0;

		this.object = null;
		this.light = null;
		this.currentSize = 0.0;
		this.fade = 0.0;

		this.enabled = false;
	}
}



export const MeshMode = {
  CONES_CUBES_SPHERES:"ConesCubesSpheres",
  SPHERES:"Spheres",
  TORRUS_KNOT:"TorrusKnot"
};//*/





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dSwarm
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene, renderer, lightsEnabled )
  {
    this.scene = scene;
    this.renderer = renderer;

		if( lightsEnabled === true )
			this.lightPool = new P3dLightPool( scene, 3 );
		else
			this.lightPool = new P3dLightPool( null, 0 );

		this.particles = [];

		this.maxParticles = 55;

		this.launchPositionX = -1.0;
		this.launchPositionY = 0.0;
		this.launchVarianceX = 0.0;
		this.launchVarianceY = 0.5;

		this.minimumLaunchDistance = 1.0;

		this.cubeCameraEnabled = false;

		this.spawnDelayMSec = 300.0;
		this.lastSpawnTime = 0.0;

    this.zPosition = 0.0;
    this.xSpeed = 0.0001;
    this.ySpeed = 0.0;
    this.r1Value = 0.0;
    this.t1Speed = 0.0;
    this.t1StartPosition = 0.0;
    this.r2Value = 0.0;
    this.t2Speed = 0.0;
    this.t2StartPosition = 0.0;
    this.currentSize = 0.0;
    this.targetSizeRate = 0.00001;
    this.targetSize = 0.0;
		this.meshMode = MeshMode.CONES_CUBES_SPHERES;
		this.lightSourceEnabled = true;

    this.wind = new P3dParticleWind();

    this.screenEdgePosition = 6.0;

    this.enabled = false;

    this.frameCounter = 0;
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
    const circularSegments = 22;
    const coneSegments = 60;
    this.sphereGeometry = new THREE.SphereBufferGeometry( objectSize, circularSegments, circularSegments );
    this.boxGeometry = new THREE.BoxBufferGeometry( objectSize*1.5, objectSize*1.5, objectSize*1.5 );
    this.coneGeometry = new THREE.ConeBufferGeometry( objectSize*0.9, objectSize*1.5, coneSegments ); // <-------------
    this.torusKnotGeometry = new THREE.TorusKnotBufferGeometry( objectSize*1.5, objectSize*0.5, 100, 16 ); //<------------------------

		// DEBUG - TEST TORUS FOR SHADOW PROBLEM (THIS SHOULD NORMALLY BE DISABLED)
		/*let shadowGenObject = new THREE.Mesh( this.torusKnotGeometry );
		shadowGenObject.scale.x = 0.09;
		shadowGenObject.scale.y = 0.09;
		shadowGenObject.castShadow = true;
		this.scene.add( shadowGenObject );
		//shadowGenObject.position.y = ; // OFF SCREEN //*/

		this._loadMaterials();
  }


	///////////////////////////////////////////////////////////////////////////////////
	setVelocity( newXSpeed, newYSpeed )
	{
		this.xSpeed = newXSpeed;
		this.ySpeed = newYSpeed;
	}


	///////////////////////////////////////////////////////////////////////////////////
	setCurrentSize( newSize )
	{
		this.currentSize = newSize;
	}


	///////////////////////////////////////////////////////////////////////////////////
	setTargetSize( newTargetSize )
	{
		this.targetSize = newTargetSize;
	}


  ////////////////////////////////////////////////////////////////////////
  setScreenEdgePosition( newEdge )
  {
    this.screenEdgePosition = newEdge + 0.7;
  }




	//////////////////////////////////////////////////////////////////////////////
	startWind( extraWindX, extraWindY )
	{
		this.wind.startWind( extraWindX, extraWindY );
	}



  ////////////////////////////////////////////////////////////////////////////
  enable()
  {
  	logger( "--->PARTICLES ENABLED" );
    this.enabled = true;
  }


  ////////////////////////////////////////////////////////////////////////////
  disable()
  {
  	logger( "----->PARTICLES DISABLED" );
    this.enabled = false;
    for( let i=0; i<this.particles.length; i++ )
    {
      this.particles[i].enabled = false;
    }
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
		this.cubeCamera = new THREE.CubeCamera( 0.1, 100, 64 )   // <------------- THREE.CubeCamera(near, far, resolution);
		//this.cubeCamera = new THREE.CubeCamera( 0.1, 100, 256 )   // DEBUG - TRYING HIGHER RES (DOESN'T SEEM TO MATTER FOR WHAT I'M DOING)
		this.cubeCamera.update( this.renderer, this.scene );
		//this.cubeCamera.renderTarget.texture.generateMipmaps = true;
		//this.cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    let material3 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF,
    									envMap: this.cubeCamera.renderTarget.texture, refractionRatio: 0.655, reflectivity: 0.98} ); // <-----------
		this.scene.add( this.cubeCamera );
    this.materialsArray[3] = material3;
		//this.cubeCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping;

		// MATTE WHITE MATERIAL
    let material4 = new THREE.MeshStandardMaterial( {color: 0x817060} ); // <-----------
    material4.metalness = 0.0;
    material4.roughness = 0.6;
    this.materialsArray[4] = material4;

		// EMISSION MATERIAL
    let material5 = new THREE.MeshStandardMaterial( {color: 0x888888} ); // <-----------
    material5.metalness = 0.0;
    material5.roughness = 0.6;
    material5.emissive =  new THREE.Color( 0xaaaaaa );
    this.materialsArray[5] = material5;

		// TEXTURE MATERIAL (TBI)
    let material6 = new THREE.MeshStandardMaterial( {color: 0x00FF00} ); // <-----------
    material6.metalness = 0.0;
    material6.roughness = 0.6;
    this.materialsArray[6] = material6; //*/

		// NEW METAL
    let material7 = new THREE.MeshStandardMaterial( {color: 0xAA9988} ); // <-----------
    //let material7 = new THREE.MeshStandardMaterial( {color: 0xDDD8CC} ); // <-----------
    material7.metalness = 0.0;
    material7.roughness = 0.1;
    this.materialsArray[7] = material7;

		// VIDEO MATERIAL ?

	}



  ///////////////////////////////////////////////////////////////////////////////
  update()
  {
  	if( DEBUG_ALWAYS_ENABLE_PARTICLES === true )
  		this.enabled = true;

		// UPDATE TIME
  	let currentTimeMSec = performance.now();
  	if( this.lastFrameTimeMSec === 0.0 )
	  	this.lastSpawnTime = currentTimeMSec;
  	let frameDeltaMSec = currentTimeMSec - this.lastFrameTimeMSec;
  	this.lastFrameTimeMSec = currentTimeMSec;

    this.frameCounter++;

		// UPDATE CUBE CAMERA IF ENABLED
		if( this.enabled === true  &&  this.cubeCameraEnabled === true  &&  this.frameCounter%2 === 0 )
		{
			this.cubeCamera.update( this.renderer, this.scene );
			this.materialsArray[3].envMap = this.cubeCamera.renderTarget.texture;
			if( this.particles.length > 0 )
			{
				// UPDATE CUBE CAMERA POSITION TO POSITION OF MIDDLE PARTICLE
				const middleParticle = Math.floor( this.particles.length / 2 );
				this.cubeCamera.position.x = this.particles[middleParticle].object.position.x;
				this.cubeCamera.position.y = this.particles[middleParticle].object.position.y;
				this.cubeCamera.position.z = this.particles[middleParticle].object.position.z; //*/
			}
		}

		// SPAWN A NEW PARTICLE IF SPAWN DELAY HAS ELAPSED
		if( this.enabled == true  &&  currentTimeMSec > this.lastSpawnTime + this.spawnDelayMSec )
		{
			this._launchObject();
			this.lastSpawnTime = currentTimeMSec;
		}

		// UPDATE WIND
		this.wind.update( this.frameCounter, frameDeltaMSec );

		// UPDATE SIZE DAMPENING
		this.currentSize = converge( this.currentSize, this.targetSize, this.targetSizeRate * frameDeltaMSec );

    // UPDATE POSITION, ROTATION, AND SCALE OF EACH OBJECT
    let deletionList = [];
    for( let i=0; i<this.particles.length; i++ )
    {
    	// UPDATE POLAR COORDINATES #1
    	this.particles[i].r1Position = this.r1Value;
      this.particles[i].t1Position -= this.t1Speed * frameDeltaMSec * 0.03;

    	// UPDATE POLAR COORDINATES #2
    	this.particles[i].r2Position = this.r2Value;
      this.particles[i].t2Position -= this.t2Speed * frameDeltaMSec * 0.03;

			// UPDATE CARTESIAN COORDINATES
			this.particles[i].xPosition +=
								(this.particles[i].xSpeed + this.wind.getCurrentForceX() * 0.1 + this.xSpeed) * frameDeltaMSec;
			this.particles[i].yPosition +=
								(this.particles[i].ySpeed + this.wind.getCurrentForceY() * 0.1 + this.ySpeed) * frameDeltaMSec;

			// ENABLE/DISABLE SHADOWS BASED ON POSITION TO TRY TO AVOID WEBGL BUG...
			if( Math.abs( this.particles[i].object.position.x ) < 4.5  &&
					Math.abs( this.particles[i].object.position.y ) < 2.5 )
				this.particles[i].object.castShadow = true;
			else
				this.particles[i].object.castShadow = false; //*/

      // IF OBJECT HAS REACHED SCREEN EDGE, THEN MARK IT FOR DELETION...
      if( this.particles[i].object.position.x > this.screenEdgePosition  ||  this.particles[i].object.position.x < -this.screenEdgePosition  ||
          this.particles[i].object.position.y > this.screenEdgePosition  ||  this.particles[i].object.position.y < -this.screenEdgePosition   )
      {
       	deletionList.push( this.particles[i].idNumber );
      }

			//-  -  -
      // IF OBJECT IS ENABLED THEN UPDATE POSITION, SIZE, LIGHTING...
      if( this.particles[i].enabled === true )
      {
      	// UPDATE SIZE
        this.particles[i].fade = converge( this.particles[i].fade, 1.0, 0.003 * frameDeltaMSec );
				this.particles[i].object.scale.x = this.currentSize * this.particles[i].fade;
				this.particles[i].object.scale.y = this.currentSize * this.particles[i].fade;
				this.particles[i].object.scale.z = this.currentSize * this.particles[i].fade; //*/

				// UPDATE ACTUAL OBJECT POSITION
				this.particles[i].object.position.x = this.particles[i].xPosition
																						+ this.particles[i].r1Position * Math.cos( this.particles[i].t1Position )
																						+ this.particles[i].r2Position * Math.cos( this.particles[i].t2Position );
				this.particles[i].object.position.y = this.particles[i].yPosition
																						+ this.particles[i].r1Position * Math.sin( this.particles[i].t1Position )
																						+ this.particles[i].r2Position * Math.sin( this.particles[i].t2Position );

				// UPDATE PARTICLE LIGHT IF INCLUDED...
				if( this.particles[i].light != null )
				{
					this.particles[i].light.position.x = this.particles[i].object.position.x;
					this.particles[i].light.position.y = this.particles[i].object.position.y;
					this.particles[i].light.position.z = this.particles[i].object.position.z;
				}
      }
      else // ELSE - SCALE OBJECT SMALLER UNTIL IT'S GONE, THEN DELETE...
      {
				this.particles[i].object.scale.x *= 0.93;
				this.particles[i].object.scale.y *= 0.93;
				this.particles[i].object.scale.z *= 0.93;
				if( this.particles[i].object.scale.x < 0.01 )
					deletionList.push( this.particles[i].idNumber ); //*/
      }

			// UPDATE ROTATION
      this.particles[i].object.rotation.z += frameDeltaMSec * 0.0012;
      this.particles[i].object.rotation.y += frameDeltaMSec * 0.002 * this.particles[i].xSpeed; // XSPEED??  WHY MULTIPLIED HERE?
    }

    // DELETE ALL OBJECTS THAT WERE MARKED FOR DELETION...
    for( let i=0; i<deletionList.length; i++ )
    {
    	this.killObjectWithId( deletionList[i] );
    }

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
		this.particles[index].object.castShadow = false;
		this.scene.remove( this.particles[index].object );
		this.particles[index].object = null;
		if( this.particles[index].light != null )
		{
			this.lightPool.freeLight( this.particles[index].light );
			this.particles[index].light = null;
		}
		this.particles.splice( index, 1 );
	}


	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~


	///////////////////////////////////////////////////////////////////////////////
	_launchObject( objectIndex )
	{
		//logger( "---> PARTICLES LAUNCH OBJECT: TOTAL OBJECTS: ", this.particles.length, this.maxParticles );
		if( this.particles.length < this.maxParticles )
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

				// TRY A LOCATION...
				xPosition = this.launchPositionX * this.screenEdgePosition
								+ ( random( 200 ) - 100.0 ) / 100.0 * this.screenEdgePosition * this.launchVarianceX;
				yPosition = this.launchPositionY * this.screenEdgePosition
								+ ( random( 200 ) - 100.0 ) / 100.0 * this.screenEdgePosition * this.launchVarianceY; //*/

				// CHECK IF IT'S TOO CLOSE TO ANY OTHER OBJECTS
				foundNearbyObject = false;
				for( let j=0; j<this.particles.length; j++ )
				{
					if( Math.abs( this.particles[j].object.position.x - xPosition ) < this.minimumLaunchDistance  &&
							Math.abs( this.particles[j].object.position.y - yPosition ) < this.minimumLaunchDistance  )
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
				switch( this.meshMode )
				{
					case MeshMode.CONES_CUBES_SPHERES:
						switch( random(3) )
						{
							case 0: newParticle.object = new THREE.Mesh( this.sphereGeometry, this.materialsArray[this.materialNumber] ); break;
							case 1: newParticle.object = new THREE.Mesh( this.boxGeometry, this.materialsArray[this.materialNumber] ); break;
							case 2: newParticle.object = new THREE.Mesh( this.coneGeometry, this.materialsArray[this.materialNumber] ); break;
						} //*/
						break;

					case MeshMode.SPHERES:
						newParticle.object = new THREE.Mesh( this.sphereGeometry, this.materialsArray[this.materialNumber] );
						break;

					case MeshMode.TORRUS_KNOT:
						newParticle.object = new THREE.Mesh( this.torusKnotGeometry, this.materialsArray[this.materialNumber] );
						break;
				}
				newParticle.fade = 0.0;
				newParticle.enabled = true;

				// ADD LIGHTING IF ENABLED
				if( this.lightSourceEnabled == true )
				{
					newParticle.light = this.lightPool.getLight();
					if( newParticle.light === null )
					{
						newParticle.object.material = this.materialsArray[4];
					}
				}

				newParticle.object.castShadow = false;
				newParticle.object.rotation.x = random(360)*3.14/2.0;
				newParticle.object.rotation.y = random(360)*3.14/2.0;
				newParticle.xPosition = xPosition;
				newParticle.yPosition = yPosition;
				newParticle.object.position.z = this.zPosition;
				newParticle.t1Position = this.t1StartPosition;
				newParticle.t2Position = this.t2StartPosition;

				newParticle.idNumber = this.particleIdCounter;
				this.particleIdCounter++;

				this.scene.add( newParticle.object );
				this.particles.push( newParticle );
			}

		}
	}




}




