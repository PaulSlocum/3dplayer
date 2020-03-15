// 3dplayer.js
//
// 3D PLAYER SETUP SCRIPT. CREATES THE RENDERER AND APP CONTROLLER.
//
//////////////////////////////////////////////////////////////////////////

import './three.js/three.js'
import P3dController from './P3dController.js'

// TODO: THE APP SHOULD BE SET UP TO GO FULL SCREEN IF NO SIZE IS SET

// GET WINDOW SIZE FROM HTML PARAMETERS
var script = document.scripts[document.scripts.length - 1]; // A reference to the currently running script
var windowWidth = script.getAttribute('width');
var windowHeight = script.getAttribute('height');

if( (windowWidth > 0  &&  windowHeight > 0) == false )
{
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}


// CREATE RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( windowWidth, windowHeight );

// ADD THE RENDERER TO THE DOCUMENT WHERE THE SCRIPT WAS PLACED
var div = document.createElement('div'); // Create a new div
div.innerHTML = 'Hello'; // Add some content to the newly-created div
script.parentElement.insertBefore(renderer.domElement, script); // Add the newly-created div to the page

// LAUNCH THE APP CONTROLLER
const controller = new P3dController( windowWidth, windowHeight, renderer );


