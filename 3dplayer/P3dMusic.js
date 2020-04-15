// P3dMusic.js
//
// AUDIO PLAYER FOR MUSIC WITH MEMORY/CPU MANAGEMENT AND QUEUES SO THAT
// FILES CAN BE SEPARATELY DOWNLOADED, DECODED, AND PLAYED.
//
//////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------------
import { logger } from './P3dLog.js'
import { P3dAudioEffects, EffectsPreset } from './P3dAudioEffects.js'
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


//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
/*class QueueStack
{
  constructor()
  {
    this.stack = [];
  }
  
  // PUSHES ITEM ON TOP, OR MOVES ITEM TO TOP IF ALREADY IN STACK...
  pushToTop( item )
  {
    //this.stack 
  }
  
  popFromBottom()
  {
  }
   
  remove( item )
  {
  }
}//*/



const TREBLE_BASS_MULTIPLIER = 2.0;


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dMusicPlayer
{

  ///////////////////////////////////////////////////////////////////////
  constructor( delegate ) 
  {
    logger("---->MUSIC CLASS CONSTRUCTOR");

    // MUSIC PLAYER    
    this.preloadContext = new (window.AudioContext || window.webkitAudioContext)();
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

    this.volumeValue = 1.0;

    // THIS IS DISABLED PENDING REWORKING OF EFFECTS SYSTEM
    //this.bassValue = 0.0;
    //this.trebleValue = 0.0;

    this.delegate = delegate;
   
    this.effects = null;
    this.mainVolumeGain = null;
    
    this.musicFiles = []; // ARRAY OF "MusicFile" CLASS/STRUCT

  }


  ///////////////////////////////////////////////////////////////////////////
  setVolume( value )
  {
    this.volumeValue = value;
    if( this.musicPlaying == true )
      this.mainVolumeGain.gain.setTargetAtTime( value, this.musicContext.currentTime, 0.015 ); //*/
  }



  ///////////////////////////////////////////////////////////////////////////
  setBass( value )
  {
    // THIS IS DISABLED PENDING REWORKING OF EFFECTS SYSTEM
    /*this.bassValue = value * TREBLE_BASS_MULTIPLIER;
    if( this.musicPlaying == true )
      this.lowFilter.gain.setTargetAtTime( value, this.musicContext.currentTime, 0.015 ); //*/
  }


  ///////////////////////////////////////////////////////////////////////////
  setTreble( value )
  {
    // THIS IS DISABLED PENDING REWORKING OF EFFECTS SYSTEM
    /*this.trebleValue = value * TREBLE_BASS_MULTIPLIER;
    if( this.musicPlaying == true )
      this.highFilter.gain.setTargetAtTime( value, this.musicContext.currentTime, 0.015 ); //*/
  }


  //////////////////////////////////////////////////////////////////////////////
  setFxMode( fxMode )
  {
    this.effects.loadPreset( fxMode );
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
  manageMemory()
  {
    let totalSamples = 0;
    for( let musicFile in this.musicFiles )
    {
      logger( "=======> MUSIC FILE: ", musicFile, this.musicFiles[musicFile] );
      if( this.musicFiles[musicFile].decodedData != null )
        totalSamples += this.musicFiles[musicFile].decodedData.length * this.musicFiles[musicFile].decodedData.numberOfChannels;
    }
    const BYTES_PER_SAMPLE = 2;  // <-- NOTE: ASSUMES 16 BIT SAMPLES
    let totalMemoryUsedMb = Math.floor( totalSamples / 1024 / 1024 * BYTES_PER_SAMPLE );
    logger( "=======> TOTAL AUDIO MEMORY USED (MB): ", totalMemoryUsedMb );
    const MAX_MEMORY_USAGE_MB = 200;
    
    
    /*for( let musicFile in this.musicFiles )
    {
      
    }


    while( totalMemoryUsedMb > MAX_MEMORY_USAGE_MB  &&   //*/
  }
  
  
  ///////////////////////////////////////////////////////////////////////////////
  // NOTE: THIS ALSO DOWNLOADS IF NOT ALREADY DONE
  decodeMusic( musicFilename )
  {
    this.initMusicFile( musicFilename );
    
    this.manageMemory();
      
    //logger( "-----> MUSIC: DECODE FILE: ", musicFilename );

    if( this.musicFiles[musicFilename].decodeStarted == false  &&  
        this.musicDecodeQueue.includes( musicFilename ) == false )
    {
      //logger( "-----> MUSIC: ADDING TO DOWNLOAD QUEUE: ", musicFilename );
      this.downloadMusic( musicFilename ); // IN CASE MUSIC ISN'T ALREADY DOWNLOADED
      this.musicDecodeQueue.push( musicFilename );
      this.processMusicQueues();
    }
  }
  
  
  
  /////////////////////////////////////////////////////////////////////////////
  // NOTE: THIS ALSO DOWNLOADS AND/OR DECODES IF NOT ALREADY DONE
  playMusic( musicFilename, offsetSec )
  {
    this.createContext();
    if( offsetSec != null )
      this.musicPauseTime = offsetSec;
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

  
  /////////////////////////////////////////////////////////////////////////////
  getCurrentTrackLengthSec()
  {
    if( this.musicContext == null )
      return 0.0;
    else
    {
      if( this.musicPlayingFilename != null )
        return this.musicFiles[this.musicPlayingFilename].decodedData.duration
      else
        return 0.0;
    }
  }


  /////////////////////////////////////////////////////////////////////////////
  getTrackLengthSec( filename )
  {
    if( this.musicFiles[filename].decodedData != null )
      return this.musicFiles[filename].decodedData.duration;
    else
      return 0.0;
  }


  //   ~      -         ~      -         ~      -         ~      -         ~     
  //   ~      -         ~      -         ~      -         ~      -         ~     


  /////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  // CREATES CONTEXT IF IT DOESN'T ALREADY EXIST
  createContext()
  {
    if( this.musicContext == null )
    {
      this.musicContext = new (window.AudioContext || window.webkitAudioContext)();

      this.effects = new P3dAudioEffects( this.musicContext );
      
      this.mainVolumeGain = this.musicContext.createGain();
      this.mainVolumeGain.gain.value = 1.0;

      this.effects.connect( this.mainVolumeGain );
      this.mainVolumeGain.connect( this.musicContext.destination );
    }
  }



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
      //logger( "-----> MUSIC UPDATE: DOWNLOADING: ", downloadFilename );
      this.musicFiles[downloadFilename].downloadStarted = true;
      this.musicDownloading = true;
      
      let request = new XMLHttpRequest();
      request.open('GET', downloadFilename, true);
      request.responseType = 'arraybuffer';
      request.onload = function() 
      { // FILE LOADER CALLBACK:
      
        //logger( "-----> MUSIC DOWNLOADED: ", downloadFilename, request );
        this.musicFiles[downloadFilename].fileData = request.response;
        this.musicDownloading = false;
        this.processMusicQueues();
      }.bind(this,request,downloadFilename)
      
      request.send(); 
    }

    // PROCESS DECODE QUEUE...
    if( this.musicDecoding == false  &&  this.musicDecodeQueue.length > 0 )
    {
      // MAKE SURE FILE IS FINISHED DOWNLOADING
      if( this.musicFiles[this.musicDecodeQueue[0]].fileData != null )
      {
        //logger( "------> PROCESS MUSIC: DECODE QUEUE 0: ", this.musicDecodeQueue[0] );
        let decodeFilename = this.musicDecodeQueue.shift();
        this.musicFiles[decodeFilename].decodeStarted = true;
        this.musicDecoding = true;
        this.preloadContext.decodeAudioData( this.musicFiles[decodeFilename].fileData, function( decodeFilename, buffer)  
        { // DECODER CALLBACK:

          //logger( "-----> MUSIC DECODED, CONTEXT: ", this.preloadContext, decodeFilename, buffer );
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
        //logger( "----> PLAYBACK STARTING: MUSIC SOURCE: ", this.musicSource, this.musicFiles[this.musicPlayingFilename].decodedData );

        // THIS IS TO POTENTIALLY FIX A BUG IN CHROME, NOT SURE IF IT WORKS...
        // DISABLED FOR NOW BECAUSE I'M NOT SURE IT'S NECESSARY
        /*if( this.musicContext.state === 'suspended'  &&  typeof this.musicContext.resume === 'function' ) 
        {
          logger( "-----------> MUSIC CONTEXT RESUMED" );
          this.musicContext.resume();
        } //*/

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
      //logger( "------> MUSIC PLAYER: MUSIC ENDED CALLBACK" );
      this.delegate.musicEndedCallback();
    }//*/
  }
  
}










