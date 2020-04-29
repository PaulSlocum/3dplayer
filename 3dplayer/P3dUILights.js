//
// P3dUILights.js
//
// LIGHT CONTROLLER FOR SPOTLIGHT AND MAYBE OTHER LIGHTS.
//
////////////////////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
import { logger } from "./P3dLog.js";
import { converge, random } from "./P3dUtility.js";
//-----------------------------------------------------------------------------------



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dLights
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene )
  {
  	this.scene = scene;

		this._lightSetup();

    this.targetColor = new THREE.Color(0xffffff);
    this.currentColor = new THREE.Color(0xffffff);

    this.frameCounter = 0;
    this.strobeColor = new THREE.Color( 0x888888 );
    this.strobeEnabled = false;
  }


	///////////////////////////////////////////////////////////////////////////////
	_lightSetup()
	{
    // SPOTLIGHT
    this.spotlight = new THREE.SpotLight(0xffffff);
    const spotlightDistance = 1.5;
    this.spotlight.position.set( -0, 1.2*spotlightDistance, 3.6*spotlightDistance ); //<--------------
    this.spotlight.angle = Math.PI / 3.0;
    this.spotlight.castShadow = true;
    this.spotlight.shadow.mapSize.width = 420;
    this.spotlight.shadow.mapSize.height = 420;
    this.spotlight.target.position.z = -3;

    // ---> OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
    this.spotlight.shadow.camera = new THREE.OrthographicCamera( -4, 4, 4, -4, 4, 8 );

    this.spotlight.intensity = 1.0;
    this.scene.add( this.spotlight );
    this.scene.add( this.spotlight.target );
	}

	////////////////////////////////////////////////////////////////////////////////
	// TO BE USED FOR ANIMATIONS
	update()
	{
		this.frameCounter++;

		if( (this.frameCounter/5)&2 != 0  ||  this.strobeEnabled === false )
		{
			//this.spotlight.color = this.targetColor;

			this.currentColor.r = converge( this.currentColor.r, this.targetColor.r, 0.01 );
			this.currentColor.g = converge( this.currentColor.g, this.targetColor.g, 0.01 );
			this.currentColor.b = converge( this.currentColor.b, this.targetColor.b, 0.01 );
			this.spotlight.color = this.currentColor;
		}
		else
		{
			this.spotlight.color = this.strobeColor;
		} //*/
	}


	////////////////////////////////////////////////////////////////////////////////
	setColor( newColor )
	{
		this.targetColor = newColor;
	}


	/////////////////////////////////////////////////////////////////////////////////
	enableStrobe()
	{
		this.strobeEnabled = true;
	}

	/////////////////////////////////////////////////////////////////////////////////
	disableStrobe()
	{
		this.strobeEnabled = false;
	}

}


