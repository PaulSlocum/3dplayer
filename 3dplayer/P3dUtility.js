// P3dUtility.js
//
// VARIOUS UTILITY FUNCTIONS
//
///////////////////////////////////////////////////////////////////////////////////




//==============================================================================
export function random( max ) 
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
  

//=====================================================================================
// ASSUMES TARGET OR EVENT.TARGET IS CANVAS AND THAT IT HAS NO BORDER/PADDING
export function getCanvasMousePosition(event, target) 
{
  target = target || event.target;
  let rect = target.getBoundingClientRect();
  let pos = rect;
  pos.x = (event.clientX - rect.left) * target.width  / target.clientWidth;
  pos.y = (event.clientY - rect.top) * target.height / target.clientHeight;
  return pos;  
}
