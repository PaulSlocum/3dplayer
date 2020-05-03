



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
    this.windAmountX = 0.0;
	  this.windAmountY = 0.0;
    this.windScale = 0.0;
    this.windActive = false;
    this.windBuilding = false;
  }

	////////////////////////////////////////////////////////////////////////////
	update( frameCounter, timeDeltaMSec )
	{
    if( frameCounter%780 == 0 )
    {
    	this.startWind( 0.0, 0.0 );
    }//*/

    if( this.windActive == true )
    {
      if( this.windBuilding == true )
      {
        this.windScale = converge( this.windScale, 1.0, 0.01  );
        if( this.windScale == 1.0 )
          this.windBuilding = false;
      }
      else
      {
        this.windScale = converge( this.windScale, 0.0, 0.005  );
        if( this.windScale == 0.0 )
          this.windActive = false;
      }
    }
	}


	//////////////////////////////////////////////////////////////////////////////
	startWind( extraWindX, extraWindY )
	{
  	if( this.windActive == false )
  	{
			this.windActive = true;
			this.windBuilding = true;
			this.windScale = 0.0;
			this.windAmountX = (random(100)-0) * 0.00014 + extraWindX;
			this.windAmountY = (random(100)-50) * 0.00014 + extraWindY;
		}
	}


}
