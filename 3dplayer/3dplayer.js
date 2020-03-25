// 3dplayer.js
//
// 3D PLAYER SETUP SCRIPT. CREATES THE RENDERER AND LAUNCHES THE APP CONTROLLER.
//
//////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import './three/build/three.js'
import P3dController from './P3dController.js'
//-----------------------------------------------------------------------------------



console.log("---->LAUNCHING 3DPLAYER");



// GET WINDOW SIZE FROM HTML PARAMETERS
const script = document.scripts[document.scripts.length - 1]; // A reference to the currently running script
let windowWidth = script.getAttribute('width');
let windowHeight = script.getAttribute('height');

// USE ENTIRE WINDOW IF NO SIZE WAS SPECIFIED...
if( (windowWidth > 0  &&  windowHeight > 0) == false )
{
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

// CREATE RENDERER
const renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer:false} );
//renderer.antialias = false;
//renderer.preserveDrawingBuffer = false;
renderer.setSize( windowWidth, windowHeight );

// ADD THE RENDERER TO THE DOCUMENT AT THE LOCATION WHERE THE SCRIPT WAS PLACED
script.parentElement.insertBefore(renderer.domElement, script); // Add the newly-created div to the page

// LAUNCH THE 3D PLAYER APPLICATION CONTROLLER
const controller = new P3dController( windowWidth, windowHeight, renderer );


