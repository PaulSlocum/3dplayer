
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dDisplay 
{


  ///////////////////////////////////////////////////////////////////////
  constructor( windowWidth, windowHeight, renderer ) 
  {
    console.log("---->DISPLAY CONSTRUCTOR");

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 );

    this.cube = null;

    this.buildStructures();    

  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: run() MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    
    this.renderer.render( this.scene, this.camera );
  };


  ///////////////////////////////////////////////////////////////////////
  buildStructures()
  {
    var geometry = new THREE.BoxGeometry();

    //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();

    material.color.setHSL(0, 1, .5);  // red
    material.flatShading = true;			
    this.cube = new THREE.Mesh( geometry, material );

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    this.scene.add( spotLight );

    this.scene.add( this.cube );
    this.camera.position.z = 5;
  }

}
