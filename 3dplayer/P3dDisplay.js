
//import './three.js/three.js'
//import { GLTFLoader } from 'https://www.npmjs.com/package/three-gltf-loader';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';

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
    this.customCube = null;
    this.loadedModel = null;

    this.frameCounter = 0;

    this.buildStructures();    

  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: run() MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.frameCounter++;

    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;

    //this.loadedModel.rotation.x = frameCounter * 0.1;
    //this.loadedModel.rotation.y += 0.02;
    if( this.loadedModel != null )
    {
      this.loadedModel.rotation.y = Math.cos( this.frameCounter * 0.03 ) * 0.08;
      this.loadedModel.rotation.x = Math.sin( this.frameCounter * 0.03) * 0.08;
    }  
      
    
    this.renderer.render( this.scene, this.camera );
  };


  ///////////////////////////////////////////////////////////////////////
  buildStructures()
  {
    // CAMERA
    this.camera.position.z = 5;

    // MODEL
    const width = 4.0;
    const height = 2.0;
    const depth = 3.0;
    
    // INSTANTIATE A LOADER
    const gltfLoader = new GLTFLoader();
    const url = '3dplayer/chassis.glb';
    gltfLoader.load(url, (gltf) => {
      this.loadedModel = gltf.scene;
      this.loadedModel.position.z = -2;
      this.scene.add( this.loadedModel );
    });

    // TEST CUBE  
    /*var geometry = new THREE.BoxGeometry();
    //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();
    material.color.setHSL(0, 1, .5);  // red
    material.flatShading = true;			
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube ); //*/

    // SPOTLIGHT
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    this.scene.add( spotLight );

  }

}
