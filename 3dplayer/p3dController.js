

export default class P3dController {


  constructor( windowWidth, windowHeight, renderer ) 
  {
    this.height = windowWidth;
    this.width = windowHeight;

    // ~     -    ~     -    ~     -    ~     -    ~    

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 );

    var geometry = new THREE.BoxGeometry();

    //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();

    material.color.setHSL(0, 1, .5);  // red
    material.flatShading = true;			
    var cube = new THREE.Mesh( geometry, material );

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    scene.add( spotLight );

    scene.add( cube );

    camera.position.z = 5;

    var animate = function () 
    {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render( scene, camera );
    };

    animate();



  }



}