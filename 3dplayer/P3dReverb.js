//
// P3dReverb.js
//
// SIMPLE WET CONVOLUTION REVERB MODULE FOR WEB AUDIO
//
////////////////////////////////////////////////////////////////////




//-----------------------------------------------------------------------------------
import { logger } from "./P3dLog.js";
//-----------------------------------------------------------------------------------


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dReverb 
{

	///////////////////////////////////////////////////////////////////////////////
	constructor( context ) 
	{
		logger( "----->REVERB: CONSTRUCTOR" );
		
		this.context = context;
		this.setup();
	}


	///////////////////////////////////////////////////////////////////////////////
	setup() 
	{
		this.reverb = this.context.createConvolver();

		let fileRequest = new XMLHttpRequest();
    //fileRequest.open("GET", "3dplayer/sounds/reverb1500ms1a.wav", true);
    //fileRequest.open("GET", "3dplayer/sounds/reverb1500ms1b.wav", true);
    fileRequest.open("GET", "3dplayer/sounds/reverb1500ms1c.wav", true);
    
    fileRequest.responseType = "arraybuffer";
    fileRequest.onload = function() 
    {
		  //logger( "----->REVERB: IMPULSE FILE LOADED. DECODING...", this, fileRequest );
      let audioData = fileRequest.response;
      this.context.decodeAudioData( audioData, function(buffer) 
      { // DECODE SUCCESS
  		  //logger( "----->REVERB: DECODED.", buffer );
        this.reverb.buffer = buffer;
      }.bind(this), function(e)
      { // ERROR HANDLER
        console.log("Error with decoding audio data" + e.err);
      } //*/
      ); 

    }.bind(this);

    fileRequest.send();
	}

  ///////////////////////////////////////////////////////////////////////
  connect( inputToConnect )
  {
    this.reverb.connect( inputToConnect );
  }
	
	///////////////////////////////////////////////////////////////////////////////
	getInput()
	{
	  return( this.reverb );
	}

}









