

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dInput {


  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->INPUT CLASS CONSTRUCTOR");

    document.addEventListener( 'mousedown', this.mouseDown, false );
  }

  mouseDown( event )
  {
    console.log("---->MOUSE DOWN EVENT");
  }
  
}
