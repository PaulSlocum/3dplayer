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
    this.forceVectorX = 0.0;
	  this.forceVectorY = 0.0;

		this.startingForceX = 0.0;
		this.startingForceY = -0.5;
	  this.varianceX = 1.0;
	  this.varianceY = 0.0;

	  this.intervalMSec = 10000;
	  this.frameTimeMSec = 0;
	  this.lastTimeMSec = 0;

    this.scale = 0.0;
    this.isBlowing = false;
    this.isBuilding = false;
    this.enabled = true;
  }

	////////////////////////////////////////////////////////////////////////////
	update( frameCounter, timeDeltaMSec )
	{
		this.frameTimeMSec += timeDeltaMSec;

		if( this.enabled == false )
		{
       this.scale = converge( this.scale, 0.0, 0.005  );
		}
		else
		{
			if( this.frameTimeMSec  >  this.lastTimeMSec + this.intervalMSec )
			{
				this.startWind( 0.0, 0.0 );
				this.lastTimeMSec = this.frameTimeMSec;
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
			const BASE_WIND_AMOUNT = 0.024;
			this.forceVectorX =
				(random(200)-100.0)/100.0 * BASE_WIND_AMOUNT * this.varianceX + BASE_WIND_AMOUNT * this.startingForceX + extraWindX;
			this.forceVectorY =
				(random(200)-100.0)/100.0 * BASE_WIND_AMOUNT * this.varianceY + BASE_WIND_AMOUNT * this.startingForceY + extraWindY;
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


	////////////////////////////////////////////////////////////////////////////////
	getCurrentForceX()
	{
		return this.scale * this.forceVectorX;
	}

	////////////////////////////////////////////////////////////////////////////////
	getCurrentForceY()
	{
		return this.scale * this.forceVectorY;
	}


	/////////////////////////////////////////////////////////////////////////////////
	setDirection( newAmountX, newAmountY, newVarianceX, newVarianceY )
	{
		this.startingForceX = newAmountX;
		this.startingForceY = newAmountY;
		this.varianceX = newVarianceX;
		this.varianceY = newVarianceY;
	}

	/////////////////////////////////////////////////////////////////////////////////
	setIntervalMSec( newIntervalMSec )
	{
		this.intervalMSec = newIntervalMSec;
	}


}















