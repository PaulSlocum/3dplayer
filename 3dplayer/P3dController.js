

import P3dDisplay from './P3dDisplay.js'
import P3dInput from './P3dInput.js'
import P3dTransport from './P3dTransport.js'


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dController {


  ///////////////////////////////////////////////////////////////////////
  constructor( windowWidth, windowHeight, renderer ) 
  {
    console.log("CONTROLLER CONSTRUCTOR");

    this.height = windowWidth;
    this.width = windowHeight;

    this.transport = new P3dTransport();
    this.input = new P3dInput();

    this.display = new P3dDisplay( windowWidth, windowHeight, renderer );
    this.display.run();

  }

}
