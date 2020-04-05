


//---------------------------------------------------------------------------------
import { random } from './P3dUtility.js'
//---------------------------------------------------------------------------------



const MAX_OBJECTS = 5;



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSwarm
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene ) 
  {
    this.scene = scene;
    
    this.sphere = null;
    
    this.objectArray = [];
    
    this.load();
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  load()
  {
    // ADD SPHERE
    var sphereGeometry = new THREE.SphereGeometry( 0.3, 32, 32 );
    var sphereMaterial = new THREE.MeshStandardMaterial( {color: 0x4A4440} );
    sphereMaterial.metalness = 0.5;
    sphereMaterial.roughness = 0.45;
    
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      this.objectArray[i] = new THREE.Mesh( sphereGeometry, sphereMaterial );
      this.objectArray[i].castShadow = true;
      this.objectArray[i].position.y = i*0.7 - 1.5;
      this.objectArray[i].position.z = -3.1;
      this.scene.add( this.objectArray[i] );
    } //*/
    
  }
  
  
  
  ////////////////////////////////////////////////////////////////////////
  render()
  {
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      this.objectArray[i].position.x += 0.01;
      if( this.objectArray[i].position.x > 6.0 )
        this.objectArray[i].position.x = -6.1;
      //if( this.sphere.position.y > 6.0 )
      //  this.sphere.position.y = -6.1;
    }
      
    //*/
  }

  
}




