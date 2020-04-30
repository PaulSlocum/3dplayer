//
// P3dLog.js
//
// CONSOLE LOG REPLACEMENT THAT CAN BE EASILY TURNED OFF.
//
//////////////////////////////////////////////////////////////////////////



const LOG_ENABLED = true;

const ERROR_LOG_ENABLED = true;


//====================================================================================
export function logger()
{
  if( LOG_ENABLED == true )
    console.log( ...arguments );
}


//====================================================================================
export function logerr()
{
  if( ERROR_LOG_ENABLED == true )
    console.log( "(ERROR) - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n", ...arguments );
    console.log( "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  " );
}


