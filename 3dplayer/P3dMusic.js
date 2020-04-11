// P3dMusic.js
//
// AUDIO PLAYER FOR MUSIC WITH MEMORY/CPU MANAGEMENT AND QUEUES SO THAT
// FILES CAN BE SEPARATELY DOWNLOADED, DECODED, AND PLAYED.
//
//////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------------
import { logger } from './P3dLog.js'
import { P3dAudioEffects } from './P3dAudioEffects.js'
import { P3dReverb } from './P3dAudioEffects.js'
//-----------------------------------------------------------------------------------


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


const TREBLE_BASS_MULTIPLIER = 2.0;


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dMusicPlayer
{

  ///////////////////////////////////////////////////////////////////////
  constructor( delegate ) 
  {
    logger("---->MUSIC CLASS CONSTRUCTOR");

    // MUSIC PLAYER    
    this.preloadContext = new (window.AudioContext || window.webkitAudioContext)();
    //this.musicContext = new (window.AudioContext || window.webkitAudioContext)();
    this.musicContext = null;
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

    this.bassValue = 0.0;
    this.trebleValue = 0.0;
    this.volumeValue = 1.0;

    this.delegate = delegate;
   
    this.effects = null;
    
    this.musicFiles = []; // ARRAY OF "MusicFile" CLASS/STRUCT

  }


  ///////////////////////////////////////////////////////////////////////////
  setVolume( value )
  {
    logger( "------> MUSIC PLAYER: SETTING VOLUME: ", value );
    this.volumeValue = value;
    if( this.musicPlaying == true )
      this.gainNode.gain.setTargetAtTime( value, this.musicContext.currentTime, 0.015 );
  }



  ///////////////////////////////////////////////////////////////////////////
  setBass( value )
  {
    logger( "------> MUSIC PLAYER: SETTING BASS: ", value );
    this.bassValue = value * TREBLE_BASS_MULTIPLIER;
    if( this.musicPlaying == true )
      this.lowFilter.gain.setTargetAtTime( value, this.musicContext.currentTime, 0.015 );
  }


  ///////////////////////////////////////////////////////////////////////////
  setTreble( value )
  {
    logger( "------> MUSIC PLAYER: SETTING TREBLE: ", value );
    this.trebleValue = value * TREBLE_BASS_MULTIPLIER;
    if( this.musicPlaying == true )
      this.highFilter.gain.setTargetAtTime( value, this.musicContext.currentTime, 0.015 );
  }


  
  //   ~      -         ~      -         ~      -         ~      -         ~     
  //   ~      -         ~      -         ~      -         ~      -         ~     


  /////////////////////////////////////////////////////////////////////////////
  // NOTE: DOWNLOADS BUT DOESN'T DECODE
  downloadMusic( musicFilename )
  {
    this.initMusicFile( musicFilename );

    //logger( "-----> MUSIC: DOWNLOAD MUSIC: ", musicFilename );
  
    if( this.musicFiles[musicFilename].downloadStarted == false  &&  
        this.musicDownloadQueue.includes( musicFilename ) == false )
    {
      //logger( "-----> MUSIC: ADDING TO DOWNLOAD QUEUE: ", musicFilename );
      this.musicDownloadQueue.push( musicFilename );
      this.processMusicQueues();
    }
  }
  
  
  ///////////////////////////////////////////////////////////////////////////////
  // NOTE: THIS ALSO DOWNLOADS IF NOT ALREADY DONE
  decodeMusic( musicFilename )
  {
    this.initMusicFile( musicFilename );
    
    logger( "-----> MUSIC: DECODE FILE: ", musicFilename );

    if( this.musicFiles[musicFilename].decodeStarted == false  &&  
        this.musicDecodeQueue.includes( musicFilename ) == false )
    {
      logger( "-----> MUSIC: ADDING TO DOWNLOAD QUEUE: ", musicFilename );
      this.downloadMusic( musicFilename ); // IN CASE MUSIC ISN'T ALREADY DOWNLOADED
      this.musicDecodeQueue.push( musicFilename );
      this.processMusicQueues();
    }
  }
  
  
  
  /////////////////////////////////////////////////////////////////////////////
  // CREATES CONTEXT IF IT DOESN'T ALREADY EXIST
  createContext()
  {
    if( this.musicContext == null )
    {
      this.musicContext = new (window.AudioContext || window.webkitAudioContext)();

	  	logger( "----->MUSIC: CREATING EFFECTS" );
      this.effects = new P3dAudioEffects( this.musicContext );
      //this.effects = new P3dReverb( this.musicContext );
      this.effects.connect( this.musicContext.destination ); //*/
      console.log( "----->PLAY MUSIC: CREATING CONTEXT: ", this.musicContext );
    }
  }
  
  

  /////////////////////////////////////////////////////////////////////////////
  // NOTE: THIS ALSO DOWNLOADS AND/OR DECODES IF NOT ALREADY DONE
  playMusic( musicFilename, offsetSet )
  {
    this.createContext();
  
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
      this.musicSource.onended = null;
      this.musicPlaying = false;
      this.musicPlayPending = false;
      logger( "-----> MUSIC PAUSE TIME / CONTEXT: ", this.musicPauseTime, this.musicContext, this.musicSource );
      if( this.musicContext.state == "running" )
        this.musicSource.stop(); //*/
    }
  }


  ///////////////////////////////////////////////////////////////////////////////
  // REWINDS TRACK TO BEGINNING AND ENDS PLAYBACK IF PLAYING
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
      //logger( "-----> MUSIC: NEW MUSIC FILE: ", musicFilename );
      this.musicFiles[musicFilename] = new MusicFile();
    }
  }



  //////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  processMusicQueues()
  {
    //logger( "------> PROCESS MUSIC QUEUES", this.musicDownloadQueue );

    // PROCESS DOWNLOAD QUEUE...
    if( this.musicDownloading == false  &&  this.musicDownloadQueue.length > 0 )
    {
      let downloadFilename = this.musicDownloadQueue.shift();
      this.musicFiles[downloadFilename].downloadStarted = true;
    
      //logger( "-----> MUSIC UPDATE: DOWNLOADING: ", downloadFilename );

      //this.musicSource = this.musicContext.createBufferSource();

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
        logger( "-----> MUSIC DOWNLOADED: ", downloadFilename, request );
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
        logger( "------> PROCESS MUSIC: DECODE QUEUE 0: ", this.musicDecodeQueue[0] );
        let decodeFilename = this.musicDecodeQueue.shift();
        this.musicFiles[decodeFilename].decodeStarted = true;
        this.musicDecoding = true;
        this.preloadContext.decodeAudioData( this.musicFiles[decodeFilename].fileData, function( decodeFilename, buffer)  
        { // DECODER CALLBACK:

          logger( "-----> MUSIC DECODED, CONTEXT: ", this.preloadContext, decodeFilename, buffer );
          this.musicFiles[decodeFilename].decodedData = buffer;
          this.musicDecoding = false;
   
          this.musicPauseTime = 0.0;
          this.processMusicQueues();

        }.bind(this, decodeFilename), function(e) {
          logger('Audio decode error! ', e);
        } );  
      }
    }
    
    // START PLAYBACK IF MUSIC FILE IS DECODED...
    if( this.musicPlayPending == true  &&  this.musicPlaying == false )
    {
      if( this.musicFiles[this.musicPlayingFilename].decodedData != null )
      {
        logger( "----> PLAYBACK STARTING: MUSIC SOURCE: ", this.musicSource, this.musicFiles[this.musicPlayingFilename].decodedData );

        // THIS IS TO POTENTIALLY FIX A BUG IN CHROME, NOT SURE IF IT WORKS YET...
        if( this.musicContext.state === 'suspended'  &&  typeof this.musicContext.resume === 'function' ) 
        {
          logger( "-----------> MUSIC CONTEXT RESUMED" );
          this.musicContext.resume();
        }

        // --> START PLAYBACK HERE <--
        this.musicSource = this.musicContext.createBufferSource();
        this.musicSource.buffer = this.musicFiles[this.musicPlayingFilename].decodedData;
        this.musicSource.connect( this.effects.getInput() );
        // ~    -   ~    -   ~    -   ~    -   
        this.musicSource.loop = false;
        this.musicSource.onended = this.musicEndedCallback.bind(this);
        // ~    -   ~    -   ~    -   ~    -   
        this.musicSource.start( 0.0, this.musicPauseTime ); //*/
        this.musicPlaying = true;  
        this.musicStartTime = this.musicContext.currentTime;        
      }
    } //*/

  }
  
  
  /////////////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  musicEndedCallback()
  {
    if( this.musicPlaying == true )
    {
      logger( "------> MUSIC PLAYER: MUSIC ENDED CALLBACK" );
      this.delegate.musicEndedCallback();
    }//*/
  }
  
}










