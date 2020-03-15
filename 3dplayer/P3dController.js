

import P3dDisplay from './P3dDisplay.js'
import P3dInput from './P3dInput.js'
import P3dTransport from './P3dTransport.js'


export default class P3dController {


  constructor( windowWidth, windowHeight, renderer ) 
  {
    this.height = windowWidth;
    this.width = windowHeight;

    // ~     -    ~     -    ~     -    ~     -    ~    

    console.log("CONTROLLER CONSTRUCTOR");

    this.transport = new P3dTransport();

    console.log("AFTER TRANSPORT INIT");

    //this.display = new P3dDisplay( windowWidth, windowHeight, renderer );
    this.display = new P3dDisplay();

    console.log("AFTER DISPLAY INIT");

    this.input = new P3dInput();
    
    // ~     -    ~     -    ~     -    ~     -    ~    
  

  }



}
