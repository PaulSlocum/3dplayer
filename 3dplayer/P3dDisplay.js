
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


    this.buildStructures();    

  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: run() MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.customCube.rotation.x += 0.01;
    this.customCube.rotation.y += 0.01;
    
    this.loadedModel.rotation.x += 0.02;
    this.loadedModel.rotation.y += 0.02;
    
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
    /*var loader = new GLTFLoader();

    loader.load( '3dplayer/chassis.glb', function ( gltf ) {

      console.log("---->LOADER SUCCESS");
      //this.scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.log("---->LOADER ERROR");
      console.error( error );

    } ); //*/


    const gltfLoader = new GLTFLoader();
    const url = '3dplayer/chassis.glb';
    gltfLoader.load(url, (gltf) => {
      this.loadedModel = gltf.scene;
      this.loadedModel.position.z = -2;
      this.scene.add( this.loadedModel );
    });


    // CUSTOM GEOMETRY
    const customGeometry = new THREE.Geometry();
    customGeometry.vertices.push(
      new THREE.Vector3( -1, -1,  1 ),  // 0
      new THREE.Vector3(  1, -1,  1 ),  // 1
      new THREE.Vector3( -1,  1,  1 ),  // 2
      new THREE.Vector3(  1,  1,  1 ),  // 3
      new THREE.Vector3( -1, -1, -1 ),  // 4
      new THREE.Vector3(  1, -1, -1 ),  // 5
      new THREE.Vector3( -1,  1, -1 ),  // 6
      new THREE.Vector3(  1,  1, -1 ),  // 7
    );

    
    //     6----7
    //    /|   /|
    //   2----3 |
    //   | |  | |
    //   | 4--|-5
    //   |/   |/
    //   0----1
    

    customGeometry.faces.push(
       // front
       new THREE.Face3(0, 3, 2),
       new THREE.Face3(0, 1, 3),
       // right
       new THREE.Face3(1, 7, 3),
       new THREE.Face3(1, 5, 7),
       // back
       new THREE.Face3(5, 6, 7),
       new THREE.Face3(5, 4, 6),
       // left
       new THREE.Face3(4, 2, 6),
       new THREE.Face3(4, 0, 2),
       // top
       new THREE.Face3(2, 7, 6),
       new THREE.Face3(2, 3, 7),
       // bottom
       new THREE.Face3(4, 1, 0),
       new THREE.Face3(4, 5, 1),
    );

    //function makeInstance(geometry, color, x) {
    //const customMaterial = new THREE.MeshBasicMaterial( 0x44FF44 );
    const customMaterial = new THREE.MeshPhongMaterial();
    customMaterial.color.setHSL( 1.0, 0, .5);  // ?
    customMaterial.flatShading = true;			
    this.customCube = new THREE.Mesh( customGeometry, customMaterial );
    this.customCube.position.z = -2;
    this.scene.add( this.customCube ); //*/
 
    
    // TEST CUBE  
    var geometry = new THREE.BoxGeometry();
    //const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();
    material.color.setHSL(0, 1, .5);  // red
    material.flatShading = true;			
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );

    // SPOTLIGHT
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    this.scene.add( spotLight );

  }

}
