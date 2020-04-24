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
    fileRequest.open("GET", "3dplayer/sounds/reverb1500ms1c.wav", true); // <--- THIS ONE SOUNDS BEST PROBABLY

    fileRequest.responseType = "arraybuffer";
    fileRequest.onload = function()
    {
      let audioData = fileRequest.response;
      this.context.decodeAudioData( audioData, function(buffer)
      { // DECODE SUCCESS
        this.reverb.buffer = buffer;
      }.bind(this), function(e)
      { // ERROR HANDLER
        logger("Error with decoding audio data" + e.err);
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









