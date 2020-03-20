

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dInput 
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->INPUT CLASS CONSTRUCTOR");

    //this.raycaster = new THREE.Raycaster();

    //document.addEventListener( 'mousedown', this.mouseDown, false );
  }

  mouseDown( event )
  {
    console.log("---->MOUSE DOWN EVENT");

/*class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }
 //*/
    // cast a ray through the frustum
    //this.raycaster.setFromCamera( normalizedPosition, camera );
    
    // get the list of objects the ray intersected
    /*const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
    }
  } 
}
 //*/ 
  }
  
}
