// P3dSwarm.js
//
// SIMPLE PARTICLE/PHYSICS SYSTEM THAT DISPLAYS FIELD OF MOVING OBJECTS
//
////////////////////////////////////////////////////////////////////////////////////////


//---------------------------------------------------------------------------------
import { random, converge } from './P3dUtility.js'
import { logger } from './P3dLog.js'
//---------------------------------------------------------------------------------



const MAX_OBJECTS = 20;

const DEBUG_ALWAYS_ENABLE = false;



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dSwarm
{


  ///////////////////////////////////////////////////////////////////////
  constructor( scene ) 
  {
    this.scene = scene;
    
    this.sphere = null;
    
    this.objectArray = [];
    this.sizeArray = [];
    this.objectEnabled = [];
    
    this.xSpeed = [];
    this.ySpeed = [];
    this.zSpeed = [];
    
    this.xBaseSpeed = 0.0;
    
    this.windAmountX = 0.0;
    this.windAmountY = 0.0;
    this.windScale = 0.0;
    this.windActive = false;
    this.windBuilding = false;
    
    this.screenEdgePosition = 6.0;

    this.currentSize = 0.0;
    this.enabled = false;
    
    this.frameCounter = 0;

    this.load();
    this.disable();    
  }
  

  ////////////////////////////////////////////////////////////////////////
  setScreenEdgePosition( newEdge )
  {
    this.screenEdgePosition = newEdge + 0.7;
  } 

  
  ////////////////////////////////////////////////////////////////////////
  load()
  {
    // ADD SPHERE
    const objectSize = 0.33;
    const circularSegments = 22;
    const coneSegments = 60;
    var sphereGeometry = new THREE.SphereGeometry( objectSize, circularSegments, circularSegments );
    var boxGeometry = new THREE.BoxGeometry( objectSize*1.5, objectSize*1.5, objectSize*1.5 );
    var coneGeometry = new THREE.ConeGeometry( objectSize*0.9, objectSize*1.5, coneSegments );
    // OTHER GEOMETRIES TO CONSIDER:
    //    TetrahedronGeometry   ConeGeometry   CylinderGeometry   IcosahedronGeometry  
    //    OctahedronGeometry    TextGeometry    TorusGeometry     TorusKnotGeometry
    var sphereMaterial2 = new THREE.MeshStandardMaterial( {color: 0x747A70} );
    var sphereMaterial1 = new THREE.MeshStandardMaterial( {color: 0x817060} );
    //var sphereMaterial2 = new THREE.MeshStandardMaterial( {color: 0x22242A} );
    //var sphereMaterial1 = new THREE.MeshStandardMaterial( {color: 0x777070} );
    sphereMaterial1.metalness = 0.7;
    sphereMaterial1.roughness = 0.45;
    sphereMaterial2.metalness = 0.4;
    sphereMaterial2.roughness = 0.45;
    
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      switch( random(3) )
      {
        case 0: this.objectArray[i] = new THREE.Mesh( sphereGeometry, sphereMaterial1 ); break;
        case 1: this.objectArray[i] = new THREE.Mesh( boxGeometry, sphereMaterial1 ); break;
        case 2: this.objectArray[i] = new THREE.Mesh( coneGeometry, sphereMaterial1 ); break;
      }

      if( DEBUG_ALWAYS_ENABLE == true )
      {
        this.sizeArray[i] = 1.0; // DEBUG
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
      this.objectArray[i].rotation.x = random(360)*3.14/2.0
      this.objectArray[i].rotation.y = random(360)*3.14/2.0
      this.scene.add( this.objectArray[i] );
      this.xSpeed[i] = random(20) * 0.00002 + 0.0037;
    } //*/
    
  }
  
  
  
  ////////////////////////////////////////////////////////////////////////
  render()
  {
    this.frameCounter++;
  
    // TEST: CONSTANT GRADUAL ACCERLERATION
    //this.xBaseSpeed += 0.000002;
  
    if( this.frameCounter%780 == 0 )
    {
      this.windActive = true;
      this.windBuilding = true;
      this.windScale = 0.0;
      this.windAmountX = (random(100)-0) * 0.00014;
      this.windAmountY = (random(100)-50) * 0.00014;
    }//*/
    
    if( this.windActive == true )
    {
      if( this.windBuilding == true )
      {
        this.windScale = converge( this.windScale, 1.0, 0.01 );
        if( this.windScale == 1.0 )
          this.windBuilding = false;
      }
      else 
      {
        this.windScale = converge( this.windScale, 0.0, 0.005 );
        if( this.windScale == 0.0 )
          this.windActive = false;
      }
    }      
  
    // UPDATE POSITION, ROTATION, AND SCALE OF EACH OBJECT  
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      // IF OBJECT IS DISABLED, THEN SCALE OBJECT SMALLER UNTIL IT IS GONE.
      if( this.objectEnabled[i] == false )
      {
        if( DEBUG_ALWAYS_ENABLE == true )
          this.sizeArray[i] = 1.0; // DEBUG
        else
          this.sizeArray[i] = converge( this.sizeArray[i], 0.0, 0.04);
      }
      this.objectArray[i].rotation.z += 0.02;
      this.objectArray[i].rotation.y += this.xSpeed[i];

      this.objectArray[i].position.x += this.xSpeed[i] + this.windAmountX * this.windScale + this.xBaseSpeed;
      this.objectArray[i].position.y += this.windAmountY * this.windScale;
      //this.objectArray[i].position.z += 0.001; // DEBUG - TESTING CONCEPT OF OBJECTS CHANGING DEPTCH
      
      this.objectArray[i].scale.x = 1.0 * this.sizeArray[i];
      this.objectArray[i].scale.y = 1.0 * this.sizeArray[i];
      this.objectArray[i].scale.z = 1.0 * this.sizeArray[i];

      // IF OBJECT HAS REACHED SCREEN EDGE, THEN RESET TO THE OPPOSITE SIDE...
      if( this.objectArray[i].position.x > this.screenEdgePosition )
      {
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
            break;
          }
          
          // TRY A RANDOM Y LOCATION...
          this.objectArray[i].position.y = random(80)*0.062 - 2.1;
          const PROXIMITY_LIMIT = 1.35;
          foundNearbyObject = false;
          
          // CHECK IF IT'S TOO CLOSE TO ANY OTHER OBJECTS
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
        while( foundNearbyObject == true );
  
      }
    }
      
    //*/
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

  
}




