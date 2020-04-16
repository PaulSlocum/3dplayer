// P3dSound.js
//
// WEB AUDIO API WRAPPER FOR SHORT SOUND EFFECTS PLAYER THAT ALLOWS PRE-LOADING OF DECODED
// AUDIO FILES INTO MEMORY.
//
//////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { logger } from "./P3dLog.js";
///-----------------------------------------------------------------------------------


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dSoundPlayer
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    logger("---->SOUND CLASS CONSTRUCTOR");

    // SOUND EFFECT PLAYER
    this.bufferArray = {};
    this.sourceArray = {};
    this.audioContext = null;
  }
  
  //   ~      -         ~      -         ~      -         ~      -         ~     
  
  //////////////////////////////////////////////////////////////////////////
  loadSound( soundFilename )
  {
    // REQUEST FILE...
    let request = new XMLHttpRequest();
    request.open("GET", soundFilename, true);
    request.responseType = "arraybuffer";
    request.onload = function() 
    { // FILE LOADER CALLBACK
      
      if( this.audioContext == null )
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioContext.decodeAudioData( request.response, function(buffer)  
      { // DECODER CALLBACK:

        this.bufferArray[soundFilename] = buffer;

      }.bind(this), function(e) {
        console.log("Audio error! ", e);
      } );  
    }.bind(this,request);

    request.send();
  }


  //////////////////////////////////////////////////////////////////////////
  playSound( soundFilename )
  {
    this.sourceArray[soundFilename] = this.audioContext.createBufferSource();
    this.sourceArray[soundFilename].buffer = this.bufferArray[ soundFilename ];
    this.sourceArray[soundFilename].connect( this.audioContext.destination );
    this.sourceArray[soundFilename].loop = false;
    this.sourceArray[soundFilename].start(0); //*/
  }
  
  
  ///////////////////////////////////////////////////////////////////////////
  stopSound( soundFilename )
  {
    this.sourceArray[soundFilename].stop(); //*/
  }
  
  
}







