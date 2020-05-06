//
// P3dUIParticleWind.js
//
// WIND SYSTEM FOR PARTICLE SYSTEM.
//
/////////////////////////////////////////////////////////////////////////////////////////



//---------------------------------------------------------------------------------
import { random, converge } from "./P3dUtility.js";
import { logger, logerr } from "./P3dLog.js";
//---------------------------------------------------------------------------------












//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dParticleWind
{


  ////////////////////////////////////////////////////////////////////////////
  constructor()
  {
    this.currentForceX = 0.0;
	  this.currentForceY = 0.0;
    this.scale = 0.0;
    this.isBlowing = false;
    this.isBuilding = false;
    this.enabled = true;
  }

	////////////////////////////////////////////////////////////////////////////
	update( frameCounter, timeDeltaMSec )
	{
		if( this.enabled == false )
		{
       this.scale = converge( this.scale, 0.0, 0.005  );
		}
		else
		{
			if( frameCounter%780 == 0 )
			{
				this.startWind( 0.0, 0.0 );
			}//*/

			if( this.isBlowing == true )
			{
				if( this.isBuilding == true )
				{
					this.scale = converge( this.scale, 1.0, 0.01  );
					if( this.scale == 1.0 )
						this.isBuilding = false;
				}
				else
				{
					this.scale = converge( this.scale, 0.0, 0.005  );
					if( this.scale == 0.0 )
						this.isBlowing = false;
				}
			}
		}
	}


	//////////////////////////////////////////////////////////////////////////////
	startWind( extraWindX, extraWindY )
	{
  	if( this.isBlowing == false )
  	{
			this.isBlowing = true;
			this.isBuilding = true;
			this.scale = 0.0;
			this.currentForceX = (random(100)-0) * 0.00014 + extraWindX;
			this.currentForceY = (random(100)-50) * 0.00014 + extraWindY;
		}
	}

	///////////////////////////////////////////////////////////////////////////////
	enable()
	{
		this.enabled = true;
	}


	///////////////////////////////////////////////////////////////////////////////
	disable()
	{
		this.enabled = false;
	}



}















