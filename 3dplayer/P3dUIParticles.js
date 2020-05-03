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


const MAX_OBJECTS = 20; // <-------------
//const MAX_OBJECTS = 1;

//*************************************************************************
// THIS SHOULD BE FALSE UNLESS DEBUGGING
const DEBUG_ALWAYS_ENABLE_PARTICLES = true;
//const DEBUG_ALWAYS_ENABLE_PARTICLES = true;
//*************************************************************************



//*************************************************************************
// PARAMETER NOTES:
// - enable/disable
// - fade out time
// - fade in time
// ~     -     ~     -     ~     -     ~     -
// - generator rate
// - minimum distance
// - generator direction or starting position?
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
	constructor()
	{
		this.xSpeed = 0.0;
		this.ySpeed = 0.0;
		this.zSpeed = 0.0;

		this.object = null;
		this.size = 0.0;

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

    this.sphere = null;

    this.objectArray = [];
    this.sizeArray = [];
    this.objectEnabled = [];

    this.xSpeed = [];
    this.ySpeed = [];
    this.zSpeed = []; //*/

		this.particles = [];

		this.maxParticles = 55;

		this.cubeCameraEnabled = false;

		this.spawnDelayMSec = 500.0;
		this.lastSpawnTime = 0.0;

    this.xBaseSpeed = 0.0;

    this.wind = new P3dParticleWind();

    this.screenEdgePosition = 6.0;

    this.currentSize = 0.0;
    this.enabled = false;

    this.frameCounter = 0;
    //this.frameTimer = 0;
    this.lastFrameTimeMSec = 0;

    this.materialsArray = [];
    this.materialNumber = 3;

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
    //let coneGeometry = new THREE.TorusKnotGeometry( objectSize*1.5, objectSize*0.5, 100, 16 );
    //let coneGeometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
    this.coneGeometry = new THREE.ConeGeometry( objectSize*0.9, objectSize*1.5, coneSegments ); // <-------------
    this.torusKnotGeometry = new THREE.TorusKnotGeometry( objectSize*1.5, objectSize*0.5, 100, 16 );

		this._loadMaterials();

		// CREATE OBJECTS...
    /*for( let i=0; i<MAX_OBJECTS; i++ )
    {
      switch( random(3) )
      {
        case 0: this.objectArray[i] = new THREE.Mesh( sphereGeometry, this.materialsArray[this.materialNumber] ); break;
        case 1: this.objectArray[i] = new THREE.Mesh( boxGeometry, this.materialsArray[this.materialNumber] ); break;
        case 2: this.objectArray[i] = new THREE.Mesh( coneGeometry, this.materialsArray[this.materialNumber] ); break;
      }

      if( DEBUG_ALWAYS_ENABLE_PARTICLES == true )
      {
        this.sizeArray[i] = 1.0;
        this.objectArray[i].visible = true;
      }
      else
      {
        this.sizeArray[i] = 0.0; // <--------------
        this.objectArray[i].visible = false;
      }
      this.objectArray[i].castShadow = true;
      this.objectArray[i].position.y = random(40)*0.1 - 1.6;
      this.objectArray[i].position.x = random(40)*0.16 - 1.5;
      this.objectArray[i].position.z = 0.0;
      this.objectArray[i].rotation.x = random(360)*3.14/2.0;
      this.objectArray[i].rotation.y = random(360)*3.14/2.0;
      this.scene.add( this.objectArray[i] );
      this.xSpeed[i] = random(20) * 0.00002 + 0.0037;
    } //*/

  }


	/////////////////////////////////////////////////////////////////////////////////
	// SELECT FROM A NUMBER OF PREDEFINED MODES
	setModeNumber( newModeNumber )
	{
		this.modeNumber = newModeNumber;
		switch( newModeNumber )
		{
			case 0:
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
		}
	}



	///////////////////////////////////////////////////////////////////////////////
	setMaterialNumber( newMaterialNumber )
	{
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

		// MATTE WHITE MATERIAL
    let material1 = new THREE.MeshStandardMaterial( {color: 0x817060} ); // <-----------
    material1.metalness = 0.0;
    material1.roughness = 0.6;
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

		// TEXTURE MATERIAL

		// EMISSION MATERIAL

		// VIDEO MATERIAL

	}



  ///////////////////////////////////////////////////////////////////////////////
  update()
  {
  	let currentTimeMSec = performance.now();
  	let frameDeltaMSec = currentTimeMSec - this.lastFrameTimeMSec;
  	this.lastFrameTimeMSec = currentTimeMSec;

    this.frameCounter++;

		if( this.cubeCameraEnabled === true  &&  this.frameCounter%2 === 0 )
		{
			this.cubeCamera.update( this.renderer, this.scene );
			this.materialsArray[3].envMap = this.cubeCamera.renderTarget.texture;
		}//*/

		// NEW SPAWNING SYSTEM...
		if( currentTimeMSec > this.lastSpawnTime + this.spawnDelayMSec )
		{
			this._launchObject();
			this.lastSpawnTime = currentTimeMSec;
		}


    // TEST: CONSTANT GRADUAL ACCERLERATION
    //this.xBaseSpeed += 0.000002;

		// UPDATE WIND
		this.wind.update( this.frameCounter, frameDeltaMSec );

    // UPDATE POSITION, ROTATION, AND SCALE OF EACH OBJECT
    for( let i=0; i<this.particles.length; i++ )
    {
    	//this.particles[i].object.position.x = Math.sin( currentTimeMSec * 0.0008 );
      //this.particles[i].object.position.y = Math.cos( currentTimeMSec * 0.0008 );

			this.particles[i].object.position.x += 0.001 * frameDeltaMSec;
			//this.particles[i].object.position.x += this.particles[i].xSpeed[i] + this.wind.windAmountX * this.wind.windScale + this.xBaseSpeed;

      // IF OBJECT HAS REACHED SCREEN EDGE, THEN RESET TO THE OPPOSITE SIDE...
      if( this.particles[i].object.position.x > this.screenEdgePosition )
      {
      	this.killObject( i );
      }


			//-  -  -
      // IF OBJECT IS DISABLED, THEN SCALE OBJECT SMALLER UNTIL IT IS GONE.
      /*if( this.objectEnabled[i] == false )
      {
        if( DEBUG_ALWAYS_ENABLE_PARTICLES == true )
          this.sizeArray[i] = 1.0; // DEBUG
        else
          this.sizeArray[i] = converge( this.sizeArray[i], 0.0, 0.04);
      }

      this.objectArray[i].rotation.z = currentTimeMSec * 0.0012;
      this.objectArray[i].rotation.y = currentTimeMSec * 0.001 * this.xSpeed[i]; // XSPEED??  WHY MULTIPLIED HERE?

      this.objectArray[i].position.x += this.xSpeed[i] + this.wind.windAmountX * this.wind.windScale + this.xBaseSpeed;
      this.objectArray[i].position.y += this.wind.windAmountY * this.wind.windScale;

      //DEBUG - TEST POLAR ORBIT!!!!!!!!!!!!!!!!!!
      //this.objectArray[i].position.x = Math.sin( currentTimeMSec * 0.0008 );
      //this.objectArray[i].position.y = Math.cos( currentTimeMSec * 0.0008 );


      this.objectArray[i].scale.x = 1.0 * this.sizeArray[i];
      this.objectArray[i].scale.y = 1.0 * this.sizeArray[i];
      this.objectArray[i].scale.z = 1.0 * this.sizeArray[i];

      // IF OBJECT HAS REACHED SCREEN EDGE, THEN RESET TO THE OPPOSITE SIDE...
      if( this.objectArray[i].position.x > this.screenEdgePosition )
      	this._launchObject( i );//*/

    }

		// UPDATE CUBE CAMERA POSITION
		/*this.cubeCamera.position.x = this.objectArray[0].position.x;
		this.cubeCamera.position.y = this.objectArray[0].position.y;
		this.cubeCamera.position.z = this.objectArray[0].position.z; //*/

    //*/
  }


	/////////////////////////////////////////////////////////////////////////////////
	killObject( index )
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
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      this.objectEnabled[i] = false;
    }
  }



	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~


/*
//***************************************************************************************
class P3dParticle
{
	constructor()
	{
		this.xSpeed = 0.0;
		this.ySpeed = 0.0;
		this.zSpeed = 0.0;

		this.object = null;
		this.size = 0.0;

		this.enabled = false;
	}
} //*/
//***************************************************************************************



	///////////////////////////////////////////////////////////////////////////////
	_launchObject( objectIndex )
	{
		if( this.particles.length < this.maxParticles )
		{
			let newParticle = new P3dParticle();
			newParticle.object = new THREE.Mesh( this.sphereGeometry, this.materialsArray[this.materialNumber] );
			/*switch( random(3) )
			{
				case 0: newParticle.object = new THREE.Mesh( this.sphereGeometry, this.materialsArray[this.materialNumber] ); break;
				case 1: newParticle.object = new THREE.Mesh( this.boxGeometry, this.materialsArray[this.materialNumber] ); break;
				case 2: newParticle.object = new THREE.Mesh( this.coneGeometry, this.materialsArray[this.materialNumber] ); break;
			} //*/
			newParticle.size = 1.0;
			newParticle.enabled = true;
			newParticle.xSpeed = random(20) * 0.00002 + 0.0037;
			this.scene.add( newParticle.object );
			this.particles.push( newParticle );
		}


		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		/*switch( random(3) )
		{
			case 0: this.objectArray[i] = new THREE.Mesh( sphereGeometry, this.materialsArray[this.materialNumber] ); break;
			case 1: this.objectArray[i] = new THREE.Mesh( boxGeometry, this.materialsArray[this.materialNumber] ); break;
			case 2: this.objectArray[i] = new THREE.Mesh( coneGeometry, this.materialsArray[this.materialNumber] ); break;
		}

		if( DEBUG_ALWAYS_ENABLE_PARTICLES == true )
		{
			this.sizeArray[i] = 1.0;
			this.objectArray[i].visible = true;
		}
		else
		{
			this.sizeArray[i] = 0.0; // <--------------
			this.objectArray[i].visible = false;
		}
		this.objectArray[i].castShadow = true;
		this.objectArray[i].position.y = random(40)*0.1 - 1.6;
		this.objectArray[i].position.x = random(40)*0.16 - 1.5;
		this.objectArray[i].position.z = 0.0;
		this.objectArray[i].rotation.x = random(360)*3.14/2.0;
		this.objectArray[i].rotation.y = random(360)*3.14/2.0;
		this.scene.add( this.objectArray[i] );
		this.xSpeed[i] = random(20) * 0.00002 + 0.0037; //*/
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


		/*let i = objectIndex;

		this.objectArray[i].material = this.materialsArray[ this.materialNumber ];

		this.objectArray[i].position.x = -this.screenEdgePosition;
		if( this.enabled )
		{
			this.objectEnabled[i] = true;
			this.sizeArray[i] = 1.0;
			this.objectArray[i].visible = true;
		}

		// ATTEMPT TO PLACE OBJECT ON LEFT SIDE WITHOUT BEING TOO CLOSE TO OTHER OBJECTS...
		let foundNearbyObject = false;
		let placementAttempts = 0;
		do
		{
			placementAttempts++;
			if( placementAttempts > 5 )
			{
				// IF PLACEMENT FAILS MULTIPLE TIMES, THEN DISABLE OBJECT AND PLACE AT
				// RANDOM X LOCATION TO BE PLACED LATER WHEN IT REACHES THE EDGE AGAIN
				this.objectArray[i].position.x = random(40)*0.16 - 1.5;
				foundNearbyObject = true;
				this.sizeArray[i] = 0.0;
				this.objectArray[i].visible = false;
				this.objectEnabled[i] = false;
				break;  // <---- BREAK DO WHILE LOOP
			}

			// TRY A RANDOM Y LOCATION...
			this.objectArray[i].position.y = random(80)*0.062 - 2.1;
			const PROXIMITY_LIMIT = 1.35;
			foundNearbyObject = false;

			// CHECK IF IT"S TOO CLOSE TO ANY OTHER OBJECTS
			for( let j=0; j<MAX_OBJECTS; j++ )
			{
				if( i != j )
				{
					if( Math.abs( this.objectArray[j].position.x - this.objectArray[i].position.x ) < PROXIMITY_LIMIT  &&
							Math.abs( this.objectArray[j].position.y - this.objectArray[i].position.y ) < PROXIMITY_LIMIT  )
					{
						foundNearbyObject = true;
						break; // FOR LOOP
					}
				}
			}

		}
		while( foundNearbyObject == true );//*/

	}


	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~


	//////////////////////////////////////////////////////////////////////////////
	startWind( extraWindX, extraWindY )
	{
		this.wind.startWind( extraWindX, extraWindY );
	}



}




