// 
// P3dLog.js
//
// CONSOLE LOG REPLACEMENT THAT CAN BE EASILY TURNED OFF
// NOTE: ONLY SUPPORTS 4 ARGUMENTS
//
//////////////////////////////////////////////////////////////////////////



const LOG_ENABLED = true;
//const LOG_ENABLED = false;



//--------------------------------------------------------------------------------
export function logger( arg1, arg2, arg3, arg4 )
{
  if( LOG_ENABLED == true )
  { 
    if( arg2 == null )
      console.log( arg1 );
    else
    {
      if( arg3 == null )
        console.log( arg1, arg2 );
      else
      {
        if( arg4 == null )
          console.log( arg1, arg2, arg3 );
        else
          console.log( arg1, arg2, arg3, arg4 );
      }
    } //*/
  }
}


