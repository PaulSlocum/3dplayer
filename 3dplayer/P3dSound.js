// P3dSound.js
//
// WEB AUDIO API WRAPPER THAT ALLOWS LOADING OF AUDIO FILES INTO MEMORY AND 
// PLAYBACK OF BOTH SHORT AUDIO EFFECTS AND ALSO THE LONGER MAIN AUDIO TRACK.
//
//////////////////////////////////////////////////////////////////////////////

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSoundPlayer
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->SOUND CLASS CONSTRUCTOR");

    this.bufferArray = {};
    this.contextArray = {};
    this.sourceArray = {};
    
    this.loadedMusicFilename = null;
    this.musicStartTime = 0.0;
    
  }
  
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
    this.sourceArray[soundFilename] = this.contextArray[soundFilename].createBufferSource();
    this.sourceArray[soundFilename].buffer = this.bufferArray[ soundFilename ];

    // Connect the audio to source (multiple audio buffers can be connected!)
    this.sourceArray[soundFilename].connect( this.contextArray[soundFilename].destination );
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
  
  
  
  //   ~      -         ~      -         ~      -         ~      -         ~     


  /////////////////////////////////////////////////////////////////////////////
  playMusic( soundFilename, offsetSec=0.0 )
  {
    if( loadedMusicFilename != soundFilename )
    {
      // Create the XHR which will grab the audio contents
      /*let request = new XMLHttpRequest();
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
      request.send(); //*/
    }
    else
    {
    }
  }


  /////////////////////////////////////////////////////////////////////////////
  pauseMusic()
  {
  }


  /////////////////////////////////////////////////////////////////////////////
  getMusicTime()
  {
  }
  

  //   ~      -         ~      -         ~      -         ~      -         ~     

  
  /////////////////////////////////////////////////////////////////////////
  // TEMPORARY FUNCTION UNTIL MUSIC SYSTEM IS WORKING
  getPlaybackTime( soundFilename )
  {
    //console.log('Playback time: ', soundFilename );
    
    let returnValue = 0.0;
    if( this.contextArray[soundFilename] )
    {
      returnValue = this.contextArray[soundFilename].currentTime;
    }
    
    //console.log('Playback time: ', returnValue, ' ', soundFilename );
    return returnValue;
  }
  
  
}
