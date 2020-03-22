

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSound
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->SOUND CLASS CONSTRUCTOR");

    // Create an AudioContext instance for this sound
    //this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.bufferArray = {};
    this.contextArray = {};
    
    this.testBuffer = null;
    

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
    //this.source = this.audioContext.createBufferSource();

    // Create the XHR which will grab the audio contents
    var request = new XMLHttpRequest();
    // Set the audio file src here
    request.open('GET', soundFilename, true);
    //this.request.open('GET', '3dplayer/sounds/clickDown.wav', true);
    // Setting the responseType to arraybuffer sets up the audio decoding
    request.responseType = 'arraybuffer';
    request.onload = function() 
    { // FILE LOADER CALLBACK:
      
      console.log("---->SOUND CLASS ONLOAD", soundFilename, request.response );
      // Decode the audio once the require is complete
      this.contextArray[soundFilename] = new (window.AudioContext || window.webkitAudioContext)();
      this.contextArray[soundFilename].decodeAudioData( request.response, function(buffer)  
      { // DECODER CALLBACK:
        
        this.bufferArray[soundFilename] = buffer;
        this.testBuffer = buffer;

        //console.log("---->SOUND CLASS LOADED: ", soundFilename, "<-" );
        console.log("---->SOUND CLASS LOADED: ", buffer, soundFilename, this.bufferArray);

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
    console.log("---->SOUND CLASS PLAY: ", soundFilename, this.bufferArray, this.contextArray );

        // Create a buffer for the incoming sound content
        var source = this.contextArray[soundFilename].createBufferSource();

     console.log("---->SOUND SOURCE: ", source );


        source.buffer = this.bufferArray[ soundFilename ];
        //this.source.buffer = this.testBuffer;

        console.log("---->SOUND CLASS BUFFER PLAY: ", source.buffer );
        // Connect the audio to source (multiple audio buffers can be connected!)
        source.connect( this.contextArray[soundFilename].destination );
        // Simple setting for the buffer
        source.loop = false;
        // Play the sound!
        source.start(0); //*/
  }
  
  
}
