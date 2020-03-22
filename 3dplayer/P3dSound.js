

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSound
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->SOUND CLASS CONSTRUCTOR");

    // Create an AudioContext instance for this sound
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.bufferArray = [];
    this.contextArray = [];
    

    /*
    // Create a buffer for the incoming sound content
    this.source = this.audioContext.createBufferSource();
    // Create the XHR which will grab the audio contents
    this.request = new XMLHttpRequest();
    // Set the audio file src here
    this.request.open('GET', '3dplayer/sounds/clickDown.wav', true);
    // Setting the responseType to arraybuffer sets up the audio decoding
    this.request.responseType = 'arraybuffer';
    this.request.onload = () => {
      console.log("---->SOUND CLASS ONLOAD", );
      // Decode the audio once the require is complete
      this.audioContext.decodeAudioData(this.request.response, (buffer) => {
        this.source.buffer = buffer;
        // Connect the audio to source (multiple audio buffers can be connected!)
        this.source.connect(this.audioContext.destination);
        // Simple setting for the buffer
        this.source.loop = false;
        // Play the sound!
        this.source.start(0);
      }, function(e) {
        console.log('Audio error! ', e);
      });  
    }
    // Send the request which kicks off 
    this.request.send();
    //*/
    

  }
  
  //////////////////////////////////////////////////////////////////////////
  loadSound( soundFilename )
  {
    // Create a buffer for the incoming sound content
    this.source = this.audioContext.createBufferSource();
    // Create the XHR which will grab the audio contents
    this.request = new XMLHttpRequest();
    // Set the audio file src here
    this.request.open('GET', '3dplayer/sounds/clickDown.wav', true);
    // Setting the responseType to arraybuffer sets up the audio decoding
    this.request.responseType = 'arraybuffer';
    this.request.onload = () => {
      console.log("---->SOUND CLASS ONLOAD", );
      // Decode the audio once the require is complete
      this.audioContext.decodeAudioData(this.request.response, (buffer) => {
        this.source.buffer = buffer;
        // Connect the audio to source (multiple audio buffers can be connected!)
        this.source.connect(this.audioContext.destination);
        // Simple setting for the buffer
        this.source.loop = false;
        // Play the sound!
        this.source.start(0);
      }, function(e) {
        console.log('Audio error! ', e);
      });  
    }
    // Send the request which kicks off 
    this.request.send();
  }

  //////////////////////////////////////////////////////////////////////////
  playSound( soundFilename )
  {
  }
  
  
}
