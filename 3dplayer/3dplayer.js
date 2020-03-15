

import './js/THREE.js'


//var windowWidth = window.innerWidth;
//var windowHeight = window.innerHeight;

var script = document.scripts[document.scripts.length - 1]; // A reference to the currently running script
var windowWidth = script.getAttribute('width');
var windowHeight = script.getAttribute('height');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( windowWidth, windowHeight );
//document.body.appendChild( renderer.domElement );

//////////////////////////////////////////////////////////////////
var div = document.createElement('div'); // Create a new div
//var script = document.scripts[document.scripts.length - 1]; // A reference to the currently running script
div.innerHTML = 'Hello'; // Add some content to the newly-created div
//script.parentElement.insertBefore(div, script); // Add the newly-created div to the page
script.parentElement.insertBefore(renderer.domElement, script); // Add the newly-created div to the page
//////////////////////////////////////////////////////////////////


var geometry = new THREE.BoxGeometry();
//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//const material = new THREE.MeshPhongMaterial();
const material = new THREE.MeshStandardMaterial();
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

var animate = function () {
requestAnimationFrame( animate );

cube.rotation.x += 0.01;
cube.rotation.y += 0.01;

renderer.render( scene, camera );
};

animate();
