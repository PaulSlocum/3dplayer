// P3dMusic.js
//
// WEB AUDIO API WRAPPER THAT ALLOWS LOADING OF AUDIO FILES INTO MEMORY AND 
// PLAYBACK OF BOTH SHORT AUDIO EFFECTS AND ALSO THE LONGER MAIN AUDIO TRACK.
//
//////////////////////////////////////////////////////////////////////////////



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
class MusicFile
{
  constructor()
  {
    this.downloadStarted = false;
    this.fileData = null;
    this.decodeStarted = false;
    this.decodedData = null;
  }
}



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dMusicPlayer
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->MUSIC CLASS CONSTRUCTOR");

    // MUSIC PLAYER    
    this.musicContext = new (window.AudioContext || window.webkitAudioContext)();
    this.musicSource = null;

    this.musicPauseTime = 0.0;
    this.musicStartTime = 0.0;
    this.musicPlaying = false;
    this.musicPlayPending = false;
    this.musicPlayingFilename = null; // NEW!
    this.musicDownloadQueue = []; // NEW!
    this.musicDecodeQueue = []; // NEW!
    
    this.musicDownloading = false;
    this.musicDecoding = false;
    
    this.musicFiles = []; // ARRAY OF "MusicFile" CLASS/STRUCT

  }
  
  //   ~      -         ~      -         ~      -         ~      -         ~     
  //   ~      -         ~      -         ~      -         ~      -         ~     


  /////////////////////////////////////////////////////////////////////////////
  downloadMusic( musicFilename )
  {
    this.initMusicFile( musicFilename );

    console.log( "-----> SOUND: DOWNLOAD MUSIC: ", musicFilename );
  
    if( this.musicFiles[musicFilename].downloadStarted == false  &&  
        this.musicDownloadQueue.includes( musicFilename ) == false )
    {
      console.log( "-----> SOUND: ADDING TO DOWNLOAD QUEUE: ", musicFilename );
      this.musicDownloadQueue.push( musicFilename );
      this.processMusicQueues();
    }
  }
  
  ///////////////////////////////////////////////////////////////////////////////
  decodeMusic( musicFilename )
  {
    this.initMusicFile( musicFilename );
    
    console.log( "-----> SOUND: DECODE MUSIC: ", musicFilename );

    if( this.musicFiles[musicFilename].decodeStarted == false  &&  
        this.musicDecodeQueue.includes( musicFilename ) == false )
    {
      console.log( "-----> SOUND: ADDING TO DOWNLOAD QUEUE: ", musicFilename );
      this.downloadMusic( musicFilename ); // IN CASE MUSIC ISN'T ALREADY DOWNLOADED
      this.musicDecodeQueue.push( musicFilename );
      this.processMusicQueues();
    }
  }
  
  

  /////////////////////////////////////////////////////////////////////////////
  playMusic( musicFilename, offsetSet )
  {
    this.decodeMusic( musicFilename );
    this.musicPlayingFilename = musicFilename;
    this.musicPlayPending = true;
    this.processMusicQueues();
  }


  /////////////////////////////////////////////////////////////////////////////
  pauseMusic()
  {
    if( this.musicPlaying == true )
    {
      this.musicPauseTime += this.musicContext.currentTime - this.musicStartTime;
      this.musicSource.stop(); //*/
      this.musicPlaying = false;
      this.musicPlayPending = false;
      console.log( "-----> MUSIC PAUSE TIME: ", this.musicPauseTime );
    }
  }


  ///////////////////////////////////////////////////////////////////////////////
  // REWINDS TRACK TO BEGINNING AND STOPS PLAYBACK IF PLAYING
  rewindMusic()
  {
    this.pauseMusic();
    this.musicPauseTime = 0;
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
  //   ~      -         ~      -         ~      -         ~      -         ~     


  /////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  initMusicFile( musicFilename )
  {
    if( this.musicFiles[musicFilename] == null )
    {
      console.log( "-----> SOUND: NEW MUSIC FILE: ", musicFilename );
      this.musicFiles[musicFilename] = new MusicFile();
    }
  }



  //////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  processMusicQueues()
  {
    console.log( "------> PROCESS MUSIC QUEUES", this.musicDownloadQueue );

    // PROCESS DOWNLOAD QUEUE...
    if( this.musicDownloading == false  &&  this.musicDownloadQueue.length > 0 )
    {
      let downloadFilename = this.musicDownloadQueue.shift();
      this.musicFiles[downloadFilename].downloadStarted = true;
    
      console.log( "-----> MUSIC UPDATE: DOWNLOADING: ", downloadFilename );

      this.musicSource = this.musicContext.createBufferSource();

      this.musicDownloading = true;
      
      // Create the XHR which will grab the audio contents
      let request = new XMLHttpRequest();
      // Set the audio file src here
      request.open('GET', downloadFilename, true);
      //this.request.open('GET', '3dplayer/sounds/clickDown.wav', true);
      // Setting the responseType to arraybuffer sets up the audio decoding
      request.responseType = 'arraybuffer';
      request.onload = function() 
      { // FILE LOADER CALLBACK:
      
        // Decode the audio once the require is complete
        console.log( "-----> MUSIC DOWNLOADED: ", downloadFilename, request );
        this.musicFiles[downloadFilename].fileData = request.response;
        this.musicDownloading = false;
        this.processMusicQueues();
        
        //this.musicContext.decodeAudioData( request.response, function(buffer)  
      // Send the request which kicks off 
      }.bind(this,request,downloadFilename)
      
      request.send(); 
    }

    // PROCESS DECODE QUEUE...
    if( this.musicDecoding == false  &&  this.musicDecodeQueue.length > 0 )
    {
      // MAKE SURE FILE IS FINISHED DOWNLOADING
      if( this.musicFiles[this.musicDecodeQueue[0]].fileData != null )
      {
        console.log( "------> PROCESS MUSIC: DECODE QUEUE 0: ", this.musicDecodeQueue[0] );
        let decodeFilename = this.musicDecodeQueue.shift();
        this.musicFiles[decodeFilename].decodeStarted = true;
        this.musicDecoding = true;
        this.musicContext.decodeAudioData( this.musicFiles[decodeFilename].fileData, function( decodeFilename, buffer)  
        { // DECODER CALLBACK:

          console.log( "-----> MUSIC DECODED, CONTEXT: ", this.musicContext, decodeFilename, buffer );
          this.musicFiles[decodeFilename].decodedData = buffer;
          this.musicDecoding = false;
   
          this.musicPauseTime = 0.0;
          this.processMusicQueues();

        }.bind(this, decodeFilename), function(e) {
          console.log('Audio decode error! ', e);
        } );  
      }
    }
    
    // START PLAYBACK IF MUSIC FILE IS DECODED...
    if( this.musicPlayPending == true  &&  this.musicPlaying == false )
    {
      if( this.musicFiles[this.musicPlayingFilename].decodedData != null )
      {
        console.log( "----> PLAYBACK STARTING: MUSIC SOURCE: ", this.musicSource, this.musicFiles[this.musicPlayingFilename].decodedData );

        // --> START PLAYBACK HERE <--
        // Create a buffer for the incoming sound content
        this.musicSource = this.musicContext.createBufferSource();
        this.musicSource.buffer = this.musicFiles[this.musicPlayingFilename].decodedData;

        // Connect the audio to source (multiple audio buffers can be connected!)
        this.musicSource.connect( this.musicContext.destination );
        // Simple setting for the buffer
        this.musicSource.loop = false;
        // Play the sound!
        this.musicSource.start( 0.0, this.musicPauseTime ); //*/
        this.musicPlaying = true;  
        this.musicStartTime = this.musicContext.currentTime;        
      }
    } //*/

  }
  
  
}
