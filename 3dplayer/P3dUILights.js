//
// P3dUILights.js
//
// LIGHT CONTROLLER FOR SPOTLIGHT AND MAYBE OTHER LIGHTS.
//
////////////////////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
import { logger } from "./P3dLog.js";
//-----------------------------------------------------------------------------------



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dLights
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene )
  {
  	this.scene = scene;

    // SPOTLIGHT
    this.spotLight = new THREE.SpotLight(0xffffff);
    const spotlightDistance = 1.5;
    this.spotLight.position.set( -0, 1.2*spotlightDistance, 3.6*spotlightDistance ); //<--------------
    this.spotLight.angle = Math.PI / 3.0;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 420;
    this.spotLight.shadow.mapSize.height = 420;
    this.spotLight.target.position.z = -3;

    // ---> OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
    this.spotLight.shadow.camera = new THREE.OrthographicCamera( -4, 4, 4, -4, 4, 8 );

    this.spotLight.intensity = 1.0;
    this.scene.add( this.spotLight );
    this.scene.add( this.spotLight.target );
  }


	////////////////////////////////////////////////////////////////////////////////
	// TO BE USED FOR ANIMATIONS
	update()
	{
	}


}
