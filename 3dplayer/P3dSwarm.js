//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSwarm
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene ) 
  {
    this.scene = scene;
    
    this.sphere = null;
    
    this.load();
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  load()
  {
    // ADD SPHERE
    var sphereGeometry = new THREE.SphereGeometry( 0.3, 32, 32 );
    sphereGeometry.castShadow = true;
    var sphereMaterial = new THREE.MeshStandardMaterial( {color: 0x4A4440} );
    //sphereMaterial.metalness = 0.2;
    sphereMaterial.roughness = 0.45;
    this.sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    this.sphere.castShadow = true;
    this.sphere.position.z = -3.0;
    this.scene.add( this.sphere );
    
  }
  
  
  
  ////////////////////////////////////////////////////////////////////////
  render()
  {
    this.sphere.position.x += 0.01;
    //this.sphere.position.y += 0.021;
    if( this.sphere.position.x > 6.0 )
      this.sphere.position.x = -6.1;
    if( this.sphere.position.y > 6.0 )
      this.sphere.position.y = -6.1;
  }

  
}
