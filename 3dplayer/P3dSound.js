

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSound
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->SOUND CLASS CONSTRUCTOR");

    this.bufferArray = {};
    this.contextArray = {};
  }
  
  //////////////////////////////////////////////////////////////////////////
  loadSound( soundFilename )
  {
    // Create the XHR which will grab the audio contents
    var request = new XMLHttpRequest();
    // Set the audio file src here
    request.open('GET', soundFilename, true);
    //this.request.open('GET', '3dplayer/sounds/clickDown.wav', true);
    // Setting the responseType to arraybuffer sets up the audio decoding
    request.responseType = 'arraybuffer';
    request.onload = function() 
    { // FILE LOADER CALLBACK:
      
      // Decode the audio once the require is complete
      this.contextArray[soundFilename] = new (window.AudioContext || window.webkitAudioContext)();
      this.contextArray[soundFilename].decodeAudioData( request.response, function(buffer)  
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
    var source = this.contextArray[soundFilename].createBufferSource();
    source.buffer = this.bufferArray[ soundFilename ];

    // Connect the audio to source (multiple audio buffers can be connected!)
    source.connect( this.contextArray[soundFilename].destination );
    // Simple setting for the buffer
    source.loop = false;
    // Play the sound!
    source.start(0); //*/
  }
  
  
}
