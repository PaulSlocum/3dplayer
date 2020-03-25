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
    this.musicBuffer = null;
    this.musicContext = null;
    this.musicSource = null;
    this.musicPauseTime = 0.0;
    this.musicStartTime = 0.0;
    this.musicPlaying = false;
    
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
    if( this.loadedMusicFilename != soundFilename )
    {
      this.loadedMusicFilename = soundFilename;
      console.log( "-----> MUSIC LOAD: ", soundFilename );


      this.musicContext = new (window.AudioContext || window.webkitAudioContext)();
      this.musicSource = this.musicContext.createBufferSource();
      
      
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
        console.log( "-----> MUSIC LOADED, CONTEXT CREATED" );
        this.musicContext.decodeAudioData( request.response, function(buffer)  
        { // DECODER CALLBACK:

          console.log( "-----> MUSIC DECODED, CONTEXT: ", this.musicContext );
          this.musicBuffer = buffer;
          //this.bufferArray[soundFilename] = buffer;
   
          this.musicPauseTime = 0.0;

          this.startMusic();
          //this.startMusic().bind(this);
          //setTimeout( this.startMusic, 2000 );


    // Create a buffer for the incoming sound content
    /*this.musicSource = this.musicContext.createBufferSource();
    this.musicSource.buffer = this.musicBuffer;

    // Connect the audio to source (multiple audio buffers can be connected!)
    this.musicSource.connect( this.musicContext.destination );
    // Simple setting for the buffer
    this.musicSource.loop = false;
    // Play the sound!
      console.log( "-----> MUSIC PAUSE TIME (PLAY): ", this.musicPauseTime );
    this.musicSource.start( 0.0, this.musicPauseTime ); 
    this.musicPlaying = true;  
    this.musicStartTime = this.musicContext.currentTime;         //*/


        }.bind(this), function(e) {
          console.log('Audio error! ', e);
        } );  
      }.bind(this,request)
      // Send the request which kicks off 
      request.send(); //*/
      
      console.log( "--->SEND COMPLETE!" );
    }
    else
    {
      console.log( "-----> MUSIC QUICKSTART" );
      this.musicContext = new (window.AudioContext || window.webkitAudioContext)();
      this.musicSource = this.musicContext.createBufferSource();
      this.startMusic();
    }
  }
  
  
  ///////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  startMusic()
  {
    console.log( "------->MUSIC CONTEXT: ", this.musicContext );
    
  
    // Create a buffer for the incoming sound content
    //this.musicSource = this.musicContext.createBufferSource();
    this.musicSource.buffer = this.musicBuffer;

    // Connect the audio to source (multiple audio buffers can be connected!)
    this.musicSource.connect( this.musicContext.destination );
    // Simple setting for the buffer
    this.musicSource.loop = false;
    // Play the sound!
      console.log( "-----> MUSIC PAUSE TIME (PLAY): ", this.musicPauseTime );
    this.musicSource.start( 0.0, this.musicPauseTime ); //*/
    this.musicPlaying = true;  
    this.musicStartTime = this.musicContext.currentTime;        
  }
  


  /////////////////////////////////////////////////////////////////////////////
  pauseMusic()
  {
    if( this.musicPlaying == true )
    {
      this.musicPauseTime += this.musicContext.currentTime - this.musicStartTime;
      this.musicSource.stop(); //*/
      this.musicPlaying = false;
      console.log( "-----> MUSIC PAUSE TIME: ", this.musicPauseTime );
    }
  }


  /////////////////////////////////////////////////////////////////////////////
  getMusicTime()
  {
    if( this.musicContext == null )
      return 0.0;
    else
    {
      if( this.musicPlaying == true )
        return this.musicContext.currentTime - this.musicStartTime + this.musicPauseTime;
      else
        return this.musicPauseTime;
    }
  }
  

  //   ~      -         ~      -         ~      -         ~      -         ~     

  
  
}
