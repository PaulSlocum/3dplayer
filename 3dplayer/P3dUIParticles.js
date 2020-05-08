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
// ~  -  ~  -  ~  -  ~  -  ~  -  ~  -  ~  -
if( DEBUG_ALWAYS_ENABLE_PARTICLES )
	console.warn( "WARNING: PARTICLE ALWAYS ENABLE DEBUG SWITCH ACTIVATED" );
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

		this.xPosition = 0.0;
		this.yPosition = 0.0;

		this.r1Position = 0.0;
		this.t1Position = 0.0;
		this.r2Position = 0.0;
		this.t2Position = 0.0;

		this.object = null;
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
		this.lastSpawnTime = 0.0;

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

    this.wind = new P3dParticleWind();

    this.screenEdgePosition = 6.0;

    this.enabled = false;

    this.frameCounter = 0;
    this.lastFrameTimeMSec = 0;

    this.materialsArray = [];
    this.materialNumber = 3;

    this.particleIdCounter = 1;

		// DEBUG!!!!!!!!
		this.pointLight = null;

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
    //this.torusKnotGeometry = new THREE.BoxGeometry( objectSize*1.5, objectSize*1.5, objectSize*1.5 );
    //this.torusKnotGeometry = new THREE.CylinderGeometry( objectSize*1.5, objectSize*0.5, 100, 16 );
    //this.torusKnotGeometry = new THREE.TorusGeometry( objectSize*1.5, objectSize*0.5, 100, 16 );
    //this.torusKnotGeometry = new THREE.TorusKnotGeometry( objectSize*1.5, objectSize*0.5, 100, 16 ); //<------------------------
    this.torusKnotGeometry = this.sphereBufferGeometry;

		// WORKAROUND FOR SHADOW PROBLEM
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




	///////////////////////////////////////////////////////////////////////////////////
	/*setPolarVelocity( newR1Speed, newT1Speed, newR2Speed, newT2Speed )
	{
		this.r1Value = 0.0;
		this.t1Speed = 0.0;
		this.r2Value = 0.0;
		this.t2Speed = 0.0;
	} //*/


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
  	//logger( "--->PARTICLES ENABLED" );
    this.enabled = true;
  }


  ////////////////////////////////////////////////////////////////////////////
  disable()
  {
  	//logger( "----->PARTICLES DISABLED" );
    this.enabled = false;
    for( let i=0; i<this.particles.length; i++ )
    {
      this.particles[i].enabled = false;
    }
  }



	/////////////////////////////////////////////////////////////////////////////////
	// SELECT SETTINGS FROM A NUMBER OF PREDEFINED MODES
	setModeNumber( newModeNumber )
	{
		logger( "----->PARTCLE MODE: ", newModeNumber );
		this.modeNumber = newModeNumber;
		switch( newModeNumber )
		{
			case 0:
			case 3: // ORIGINAL GOLD FLOATING OBJECTS
				this.maxParticles = 55;
				this.launchPositionX = -1.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.5;
				this.minimumLaunchDistance = 1.35;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 300.0;
				// ~  -  ~  -  ~  -  ~  -
				this.xSpeed = 0.0002;
				this.ySpeed = 0.0;
				this.r1Value = 0.0;
				this.t1Speed = 0.0;
    		this.t1StartPosition = 0.0;
				this.r2Value = 0.0;
				this.t2Speed = 0.0;
    		this.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.materialNumber = 0;
				this.currentSize = 1.0;
				this.targetSizeRate = 0.001;
				this.targetSize = 1.0;
				this.wind.enable();
				this.wind.setDirection( 0.5, 0.0, 0.2, 0.7 );
				this.wind.setIntervalMSec( 15000 );
				break;

			case 2: // ROTATING OBJECTS
				this.maxParticles = 40;
				this.launchPositionX = -0.8;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.0;
				this.minimumLaunchDistance = 0.0;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 200.0;
				// ~  -  ~  -  ~  -  ~  -
				this.xSpeed = 0.0007;
				this.ySpeed = 0.0;
				this.r1Value = 1.8;
				this.t1Speed = 0.04;
    		this.t1StartPosition = 2.1;
				this.r2Value = 0.0;
				this.t2Speed = 0.0;
    		this.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.materialNumber = 5;
				this.currentSize = 0.3;
				this.targetSize = 0.3;
				this.wind.enable();
				this.wind.setDirection( 0.0, 0.0, 0.4, 0.4 );
				this.wind.setIntervalMSec( 5000 );
				break;

			case 6: // TINY BUBBLES
				this.maxParticles = 200;
				this.launchPositionX = 0.0;
				this.launchPositionY = -0.5;
				this.launchVarianceX = 1.0;
				this.launchVarianceY = 0.0;
				this.minimumLaunchDistance = 0.1;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 20.0;
				// ~  -  ~  -  ~  -  ~  -
				this.xSpeed = 0.0000;
				this.ySpeed = 0.0015;
				this.r1Value = 0.5;
				this.t1Speed = 0.04;
    		this.t1StartPosition = 0.0;
				this.r2Value = 0.0;
				this.t2Speed = 0.0;
    		this.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				this.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.materialNumber = 1;
				this.targetSizeRate = 0.000001;
				this.targetSize = 0.09;
				//this.targetSize = 0.09; // <--- ORIGINAL
				this.wind.enable();
				this.wind.setDirection( 0.0, -1.0, 1.0, 0.0 );
				this.wind.setIntervalMSec( 10000 );
				break;

			case 4: // SPHERE BLOB WITH CUBE CAMERA
				this.maxParticles = 8;
				this.launchPositionX = 0.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.0;
				this.minimumLaunchDistance = 1.0;
				this.cubeCameraEnabled = true;
				this.spawnDelayMSec = 300.0;
				// ~  -  ~  -  ~  -  ~  -
				this.xSpeed = 0.0;
				this.ySpeed = 0.0;
				this.r1Value = 1.7;
				this.t1Speed = 0.02;
	   		this.t1StartPosition = 0.0;
				this.r2Value = 0.0;
				this.t2Speed = 0.0;
    		this.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				//this.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.meshMode = MeshMode.TORRUS_KNOT;
				this.materialNumber = 3;
				this.currentSize = 0.0;
				this.targetSizeRate = 0.0001;
				this.targetSize = 1.70;
				this.wind.enable();
				this.wind.setDirection( 0.0, 0.0, 0.5, 0.5 );
				this.wind.setIntervalMSec( 10000 );
				break;

			case 5: // SMALLER SPHERES WITH CUBE CAMERA
				this.maxParticles = 15;
				this.launchPositionX = 0.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.5;
				this.minimumLaunchDistance = 0.5;
				this.cubeCameraEnabled = true;
				this.spawnDelayMSec = 300.0;
				// ~  -  ~  -  ~  -  ~  -
				this.xSpeed = -0.0002;
				this.ySpeed = 0.0;
				this.r1Value = 1.7;
				this.t1Speed = 0.02;
	   		this.t1StartPosition = 0.0;
				this.r2Value = 0.0;
				this.t2Speed = 0.0;
    		this.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				//this.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.meshMode = MeshMode.TORRUS_KNOT;
				this.materialNumber = 3;
				this.currentSize = 0.3;
				this.targetSizeRate = 0.0001;
				this.targetSize = 1.70;
				this.wind.enable();
				this.wind.setDirection( 0.0, 0.0, 0.5, 0.5 );
				this.wind.setIntervalMSec( 10000 );
				break;

			case 1: // LIGHTS
				this.maxParticles = 5;
				this.launchPositionX = 0.0;
				this.launchPositionY = 0.0;
				this.launchVarianceX = 0.0;
				this.launchVarianceY = 0.0;
				this.minimumLaunchDistance = 1.0;
				this.cubeCameraEnabled = false;
				this.spawnDelayMSec = 1300.0;
				// ~  -  ~  -  ~  -  ~  -
				this.xSpeed = 0.0;
				this.ySpeed = 0.0;
				this.r1Value = 1.7;
				this.t1Speed = 0.02;
	   		this.t1StartPosition = 0.0;
				this.r2Value = 0.0;
				this.t2Speed = 0.0;
    		this.t2StartPosition = 0.0;
				// ~  -  ~  -  ~  -  ~  -
				//this.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.meshMode = MeshMode.CONES_CUBES_SPHERES;
				this.materialNumber = 5;
				this.currentSize = 0.10;
				this.targetSizeRate = 0.0001;
				this.targetSize = 0.10;
				this.wind.disable();
				this.wind.setDirection( 0.0, 0.0, 0.5, 0.5 );
				this.wind.setIntervalMSec( 10000 );
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
		//this.cubeCamera = new THREE.CubeCamera( 0.1, 100, 64 )   // <------------- near, far, resolution);
		this.cubeCamera = new THREE.CubeCamera( 0.1, 100, 256 )   // DEBUG
		this.cubeCamera.update( this.renderer, this.scene );
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

		// EMISSION MATERIAL
    let material5 = new THREE.MeshStandardMaterial( {color: 0x888888} ); // <-----------
    material5.metalness = 0.0;
    material5.roughness = 0.6;
    material5.emissive =  new THREE.Color( 0xaaaaaa );
    this.materialsArray[5] = material5;

		// TEXTURE MATERIAL
    let material6 = new THREE.MeshStandardMaterial( {color: 0x00FF00} ); // <-----------
    material6.metalness = 0.0;
    material6.roughness = 0.6;
    this.materialsArray[6] = material6;

		this.pointLight = new THREE.PointLight( 0xFFFFFF, 1, 100, 3 );
		//this.pointLight = new THREE.PointLight( 0xFFFFFF, 1, 100, 2 );
    /*this.pointLight = new THREE.SpotLight(0xffffff);
    this.pointLight.angle = Math.PI / 3.0;
    this.pointLight.castShadow = false;
    this.pointLight.target.position.z = -150;
	  this.pointLight.intensity = 2.0;
    const spotlightDistance = 0.5;
    this.pointLight.position.set( 0.5, 1.2*spotlightDistance, 3.6*spotlightDistance ); //<-------------- //*/
		/*var width = 1;
		var height = 1;
		var intensity = 1;
		this.pointLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
		this.pointLight.position.set( 0, 1, 0 );
		this.pointLight.lookAt( 0, 0, 0 ); //*/
		this.scene.add( this.pointLight );
		//this.scene.add( this.pointLight.target );

		// VIDEO MATERIAL

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

		// DEBUG!!!!!!!!!!!!!!
		if( this.particles.length > 0 )
		{
			this.pointLight.position.x = this.particles[0].object.position.x;
			this.pointLight.position.y = this.particles[0].object.position.y;
			this.pointLight.position.z = this.particles[0].object.position.z;

			/*this.pointLight.target.position.x = this.particles[0].object.position.x;
			this.pointLight.target.position.y = this.particles[0].object.position.y; //*/
			//this.pointLight.target.position.x = 100.0
			//this.pointLight.target.position.y = 100.0
		} //*/


		// SPAWN A NEW PARTICLE IF SPAWN DELAY HAS ELAPSED
		if( this.enabled == true  &&  currentTimeMSec > this.lastSpawnTime + this.spawnDelayMSec )
		{
			this._launchObject();
			this.lastSpawnTime = currentTimeMSec;
		}

		// UPDATE WIND
		this.wind.update( this.frameCounter, frameDeltaMSec );

		// DEBUG!
		//if( this.frameCounter % 60 == 0 )
			//logger( "FRAMECOUNTER: ", this.frameCounter, this.currentSize, this.targetSize, this.targetSizeRate );
			//logger( "FRAMECOUNTER: ", this.frameCounter );

		// UPDATE SIZE DAMPENING
		this.currentSize = converge( this.currentSize, this.targetSize, this.targetSizeRate * frameDeltaMSec );

    // UPDATE POSITION, ROTATION, AND SCALE OF EACH OBJECT
    let deletionList = [];
    for( let i=0; i<this.particles.length; i++ )
    {
    	// UPDATE POLAR COORDINATES
    	this.particles[i].r1Position = this.r1Value;
      this.particles[i].t1Position -= this.t1Speed * frameDeltaMSec * 0.03;

			// UPDATE CARTESIAN COORDINATES
			this.particles[i].xPosition +=
								(this.particles[i].xSpeed + this.wind.getCurrentForceX() * 0.1 + this.xSpeed) * frameDeltaMSec;
			this.particles[i].yPosition +=
								(this.particles[i].ySpeed + this.wind.getCurrentForceY() * 0.1 + this.ySpeed) * frameDeltaMSec;

			// UPDATE ACTUAL OBJECT
			this.particles[i].object.position.x = this.particles[i].xPosition + this.particles[i].r1Position * Math.cos( this.particles[i].t1Position );
			this.particles[i].object.position.y = this.particles[i].yPosition + this.particles[i].r1Position * Math.sin( this.particles[i].t1Position );

			// ENABLE/DISABLE SHADOWS BASED ON POSITION TO TRY TO AVOID WEBGL BUG...
			/*if( Math.abs( this.particles[i].object.position.x ) < this.screenEdgePosition - 4  &&
					Math.abs( this.particles[i].object.position.y ) < this.screenEdgePosition - 5 ) //*/
			if( Math.abs( this.particles[i].object.position.x ) < 4.0  &&
					Math.abs( this.particles[i].object.position.y ) < 2.0 )
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
      // IF OBJECT IS DISABLED, THEN SCALE OBJECT SMALLER UNTIL IT IS GONE.
      if( this.particles[i].enabled === false )
      {
				this.particles[i].fade = converge( this.particles[i].fade, 0.0, 0.003 * frameDeltaMSec );
				if( this.particles[i].fade == 0.0 )
					deletionList.push( this.particles[i].idNumber );
      }
      else // ELSE - SCALE OBJECT BIGGER UNTIL IT'S FULL SIZE
      {
        this.particles[i].fade = converge( this.particles[i].fade, 1.0, 0.003 * frameDeltaMSec );
      }


			//this.particles[i].size = converge( this.particles[i].size, 1.0, 0.0005 );
			//this.particles[i].size = converge( this.particles[i].size, this.targetSize, this.targetSizeRate * frameDeltaMSec );

      this.particles[i].object.scale.x = this.currentSize * this.particles[i].fade;
      this.particles[i].object.scale.y = this.currentSize * this.particles[i].fade;
      this.particles[i].object.scale.z = this.currentSize * this.particles[i].fade; //*/

      /*this.particles[i].object.scale.x = this.particles[i].size * this.particles[i].fade;
      this.particles[i].object.scale.y = this.particles[i].size * this.particles[i].fade;
      this.particles[i].object.scale.z = this.particles[i].size * this.particles[i].fade; //*/

      /*this.particles[i].object.scale.x = 0.02;
      this.particles[i].object.scale.y = 0.02;
      this.particles[i].object.scale.z = 0.02; //*/

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
		this.particles.splice( index, 1 );
	}


	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~


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
				switch( this.meshMode )
				{
					case MeshMode.CONES_CUBES_SPHERES:
						switch( random(3) )
						{
							case 0: newParticle.object = new THREE.Mesh( this.sphereGeometry, this.materialsArray[this.materialNumber] ); break;
							case 1: newParticle.object = new THREE.Mesh( this.boxGeometry, this.materialsArray[this.materialNumber] ); break;
							case 2: newParticle.object = new THREE.Mesh( this.coneGeometry, this.materialsArray[this.materialNumber] ); break;
							case 3: newParticle.object = new THREE.Mesh( this.torusKnotGeometry, this.materialsArray[this.materialNumber] ); break;
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
				//newParticle.xSpeed = random(20) * 0.000002 + 0.00037;

				newParticle.object.castShadow = false;
				newParticle.object.rotation.x = random(360)*3.14/2.0;
				newParticle.object.rotation.y = random(360)*3.14/2.0;
				newParticle.xPosition = xPosition;
				newParticle.yPosition = yPosition;
				newParticle.object.position.z = 0.0;
				//newParticle.size = this.currentSize;
				//newParticle.size = 0.02;
				newParticle.t1Position = this.t1StartPosition;
				newParticle.t2Position = this.t2StartPosition;

				newParticle.idNumber = this.particleIdCounter;
				this.particleIdCounter++;

				this.scene.add( newParticle.object );
				this.particles.push( newParticle );
			}

		}
	}


	//  ~      -       ~      -       ~      -       ~      -       ~      -       ~



}




