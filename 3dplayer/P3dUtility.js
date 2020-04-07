// P3dUtility.js
//
// VARIOUS UTILITY FUNCTIONS
//
///////////////////////////////////////////////////////////////////////////////////




//==============================================================================
export function random(max) 
{
    const min = 0;
    max = Math.floor(max-1);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//=====================================================================================
export function converge( currentValue, targetValue, rate )
{
  if( currentValue < targetValue )
  {
    currentValue += rate;
    if( currentValue > targetValue )
      currentValue = targetValue;
  }
  else
  {
    if( currentValue > targetValue )
    {
      currentValue -= rate;
      if( currentValue < targetValue )
        currentValue = targetValue;
    }
  }
  return currentValue;
}
  


