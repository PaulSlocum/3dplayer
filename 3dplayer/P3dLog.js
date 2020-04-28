//
// P3dLog.js
//
// CONSOLE LOG REPLACEMENT THAT CAN BE EASILY TURNED OFF.
//
//////////////////////////////////////////////////////////////////////////



const LOG_ENABLED = true;
//const LOG_ENABLED = false;



//====================================================================================
export function logger()
{
  if( LOG_ENABLED == true )
    console.log( ...arguments );
}


