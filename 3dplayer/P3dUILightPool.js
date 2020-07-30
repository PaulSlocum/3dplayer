//
// P3dLightPool.js
//
// CREATES A POOL OF PERSISTENT LIGHTS THAT CAN BE CHECKED OUT.  AVOIDS THE
// OVERHEAD OF ACTUALLY CREATING NEW LIGHTS IN THE SCENE.
//
/////////////////////////////////////////////////////////////////////////////////////////



export class P3dLightPool
{
	//////////////////////////////////////////////////////////////////////////////////////
	constructor( scene, maxLights )
	{
		this.scene = scene;
		this.maxLights = maxLights;

		this.lights = [];
		this.lightIsUsed = [];

		for( let i=0; i<maxLights; i++ )
		{
			let light = new THREE.PointLight( 0xCCBBBB, 0.6, 100, 10.0 );
			light.castShadow = false;
			light.intensity = 0.0;
			this.scene.add( light );
			this.lights.push( light );
			this.lightIsUsed.push( false );
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////
	getLight()
	{
		for( let i=0; i<this.maxLights; i++ )
		{
			if( this.lightIsUsed[i] == false )
			{
				this.lights[i].intensity = 0.3;
				this.lightIsUsed[i] = true;
				return( this.lights[i] ); // <------- RETURN
			}
		}
		return null; // NO MORE LIGHTS LEFT
	}


	/////////////////////////////////////////////////////////////////////////////////////
	freeLight( lightToFree )
	{
		for( let i=0; i<this.maxLights; i++ )
		{
			if( this.lights[i] == lightToFree )
			{
				this.lights[i].intensity = 0.0;
				this.lightIsUsed[i] = false;
				return; // <------- RETURN
			}
		}
	}

}



