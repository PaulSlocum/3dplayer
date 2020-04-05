// P3dSound.js
//
// WEB AUDIO API WRAPPER FOR SHORT SOUND EFFECTS THAT ALLOWS PRE-LOADING OF DECODED
// AUDIO FILES INTO MEMORY AND PLAYBACK.
//
//////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { logger } from './P3dLog.js'
///-----------------------------------------------------------------------------------


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSoundPlayer
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    logger("---->SOUND CLASS CONSTRUCTOR");

    // SOUND EFFECT PLAYER
    this.bufferArray = {};
    //this.contextArray = {};
    this.sourceArray = {};

    //this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioContext = null;

  }
  
  //   ~      -         ~      -         ~      -         ~      -         ~     
  //   ~      -         ~      -         ~      -         ~      -         ~     
  
  //////////////////////////////////////////////////////////////////////////
  loadSound( soundFilename )
  {
    // Create the XHR which will grab the audio contents
    let request = new XMLHttpRequest();
    // Set the audio file src here
    request.open('GET', soundFilename, true);
    //this.request.open('GET', '3dplayer/sounds/clickDown.wav', true);
    // Setting the responseType to arraybuffer sets up the audio decoding
    request.responseType = 'arraybuffer';
    request.onload = function() 
    { // FILE LOADER CALLBACK:
      
      if( this.audioContext == null )
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.audioContext.decodeAudioData( request.response, function(buffer)  
      
      // Decode the audio once the require is complete
      //this.contextArray[soundFilename] = new (window.AudioContext || window.webkitAudioContext)();
      //this.contextArray[soundFilename].decodeAudioData( request.response, function(buffer)  
      { // DECODER CALLBACK:

        this.bufferArray[soundFilename] = buffer;

      }.bind(this), function(e) {
        console.log('Audio error! ', e);
      } );  
    }.bind(this,request)
    // Send the request which kicks off 
    request.send();
  }


  //////////////////////////////////////////////////////////////////////////
  playSound( soundFilename )
  {
    // Create a buffer for the incoming sound content
    this.sourceArray[soundFilename] = this.audioContext.createBufferSource();
    //this.sourceArray[soundFilename] = this.contextArray[soundFilename].createBufferSource();
    this.sourceArray[soundFilename].buffer = this.bufferArray[ soundFilename ];

    // Connect the audio to source (multiple audio buffers can be connected!)
    this.sourceArray[soundFilename].connect( this.audioContext.destination );
    //this.sourceArray[soundFilename].connect( this.contextArray[soundFilename].destination );
    // Simple setting for the buffer
    this.sourceArray[soundFilename].loop = false;
    // Play the sound!
    this.sourceArray[soundFilename].start(0); //*/
  }
  
  
  ///////////////////////////////////////////////////////////////////////////
  stopSound( soundFilename )
  {
    this.sourceArray[soundFilename].stop(); //*/
  }
  
  
}
