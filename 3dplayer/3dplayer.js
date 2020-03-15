// 3dplayer.js
//
// 3D PLAYER SETUP SCRIPT. CREATES THE RENDERER AND APP CONTROLLER.
//
//////////////////////////////////////////////////////////////////////////


import './three.js/three.js'
import P3dController from './P3dController.js'




// GET WINDOW SIZE FROM HTML PARAMETERS
var script = document.scripts[document.scripts.length - 1]; // A reference to the currently running script
var windowWidth = script.getAttribute('width');
var windowHeight = script.getAttribute('height');

// USE ENTIRE WINDOW IF NO SIZE WAS SPECIFIED...
if( (windowWidth > 0  &&  windowHeight > 0) == false )
{
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

// CREATE RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( windowWidth, windowHeight );

// ADD THE RENDERER TO THE DOCUMENT AT THE LOCATION WHERE THE SCRIPT WAS PLACED
script.parentElement.insertBefore(renderer.domElement, script); // Add the newly-created div to the page

// LAUNCH THE 3D PLAYER APPLICATION CONTROLLER
const controller = new P3dController( windowWidth, windowHeight, renderer );


