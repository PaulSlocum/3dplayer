// 3dplayer.js
//
// 3D PLAYER SETUP SCRIPT. CREATES THE RENDERER, READS THE FILENAMES AND OTHER
// SCRIPT PARAMETERS, AND LAUNCHES THE APP CONTROLLER.
//
//////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import './three/build/three.js'
import { P3dController } from './P3dController.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------



logger("---->LAUNCHING 3DPLAYER");

// GET SCRIPT TO READ ATTRIBUTES
const script = document.scripts[document.scripts.length - 1]; // A reference to the currently running script

// READ LIST OF AUDIO FILENAME FROM SCRIPT PARAMETERS
let filenameList = [];
let endOfList = false;
for( let i=1; endOfList==false; i++ )
{
  let attributeName = "track" + i;
  let filename = script.getAttribute( attributeName );
  if( filename != null )
    filenameList[i] = filename;
  else
    endOfList = true;
}
//logger( "--->FILE LIST: ", filenameList );

// GET WINDOW SIZE FROM HTML PARAMETERS
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
const controller = new P3dController( filenameList, windowWidth, windowHeight, renderer );
//controller.setBackgroundColor( 0x000000 );
controller.run(); 

