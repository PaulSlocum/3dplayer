
//-----------------------------------------------------------------------------------
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dReverb 
{

	///////////////////////////////////////////////////////////////////////////////
	constructor( context ) 
	{
		logger( "----->REVERB: CONSTRUCTOR" );
		
		this.context = context;
		this.setup();
	}


	///////////////////////////////////////////////////////////////////////////////
	setup() 
	{
		this.reverb = this.context.createConvolver();

		let fileRequest = new XMLHttpRequest();
    //fileRequest.open('GET', '3dplayer/sounds/reverb1500ms1a.wav', true);
    //fileRequest.open('GET', '3dplayer/sounds/reverb1500ms1b.wav', true);
    fileRequest.open('GET', '3dplayer/sounds/reverb1500ms1c.wav', true);
    
    fileRequest.responseType = 'arraybuffer';
    fileRequest.onload = function() 
    {
		  logger( "----->REVERB: IMPULSE FILE LOADED. DECODING...", this, fileRequest );
      let audioData = fileRequest.response;
      this.context.decodeAudioData( audioData, function(buffer) 
      { // DECODE SUCCESS
  		  logger( "----->REVERB: DECODED.", buffer );
        this.reverb.buffer = buffer;
      }.bind(this), function(e)
      { // ERROR HANDLER
        console.log("Error with decoding audio data" + e.err);
      } //*/
      ); 

    }.bind(this);

    fileRequest.send();
	}

  ///////////////////////////////////////////////////////////////////////
  connect( inputToConnect )
  {
    this.reverb.connect( inputToConnect );
  }
	
	///////////////////////////////////////////////////////////////////////////////
	getInput()
	{
	  return( this.reverb );
	}

}



export const EffectPreset = {
  CLEAN: 'EffectClean',
  CHURCH: 'EffectChurch',
  CLUB: 'EffectClub',
  PLATE: 'EffectPlate', 
  LOFI: 'EffectLofi',
  SLAPBACK: 'EffectSlapback',
  CAVE: 'EffectCave',
  ROOM: 'EffectRoom'
}


/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  SIGNAL PATH:                              (nodes in parenthesis are TBI)
 
  
                                <input>
                                   *
                                   |
                               INPUT_GAIN
                                /      \
                         FX_INPUT_GAIN  \  
                             |           \
        ______________  (FX_EQ_FILTER_1)  \
       /              \     |              \
      /                (FX_EQ_FILTER_2)     \
     /                /          \           \
    /             DELAY1        (PRE_DELAY)   \  
   /             /      \            |         |
  | (FEEDBACK_GAIN1) (DELAY_PAN)   REVERB      |
  |_______|               \          |         |
                     DELAY_GAIN  REVERB_GAIN   |
                             \       |        /        
                              MAIN_BASS_FILTER       
                                     |
                              MAIN_TREBLE_FILTER       
                                     |
                                 COMPRESSOR
                                     |
                                     *
                                  <output>

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  REVERB NOTES:                   
                                
  REVERB TYPE               PRE_DELAY  DECAY_TIME  TOTAL_TIME                              
  Hall (2 Bars)	             62.5 ms    3937.50 ms  4000 ms
  Large Room (1 Bar)	       31.25 ms   1968.75 ms  2000 ms
  Small Room (1/2 Note)      15.63 ms   984.37 ms   1000 ms
  Tight Ambience (1/4 Note) 	3.91 ms   496.09 ms   500 ms

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  CONSUMER REVERB NAMES:
    "Jazz Club", "Hall", "Church", "Stadium", "News"
    

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//*/  
  
  

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dAudioEffects
{

  ///////////////////////////////////////////////////////////////////////
  constructor( audioContext )
  {
    this.audioContext = audioContext;
    this.setupNodes();  
    this.loadPreset( EffectPreset.PLATE );  
  }
  
  /////////////////////////////////////////////////////////////////////////
  loadPreset( preset )
  {
    switch( preset )
    {
      case EffectPreset.CLEAN: 
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.0;
        this.delayGain.gain.value = 0.0;
        this.reverbGain.gain.value = 0.0;
        break;
      case EffectPreset.CHURCH: break;
      case EffectPreset.CLUB: break;
      case EffectPreset.PLATE: 
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.0;
        this.reverbGain.gain.value = 0.5;
        break;
      case EffectPreset.LOFI: break;
      case EffectPreset.SLAPBACK: break;
      case EffectPreset.CAVE: break;
      case EffectPreset.ROOM: break;
    }
  }
  
  
  //////////////////////////////////////////////////////////////////////////
  setupNodes()
  {
    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         
    // CREATE INPUT GAINS

    this.inputGain = this.audioContext.createGain();
    this.inputGain.gain.value = 1.0;
  
    this.effectsInputGain = this.audioContext.createGain();
    this.effectsInputGain.gain.value = 0.8;
    
    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         
    // CREATE DELAY CHAIN

    const MAX_DELAY_SEC = 5.0;
    this.delay = this.audioContext.createDelay( MAX_DELAY_SEC );
    this.delay.delayTime.value = 0.06;

    this.delayGain = this.audioContext.createGain();
    this.delayGain.gain.value = 0.3;

    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         
    // CREATE REVERB CHAIN

    this.reverb = new P3dReverb( this.audioContext );

    this.reverbGain = this.audioContext.createGain();
    this.reverbGain.gain.value = 0.05;
  
    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         
    // CREATE OUTPUT CHAIN

    this.mainEqLow = this.audioContext.createBiquadFilter();
    this.mainEqLow.type = "lowshelf";
    this.mainEqLow.frequency.value = 320.0;
    this.mainEqLow.gain.value = 1.0;

    this.mainEqHigh = this.audioContext.createBiquadFilter();
    this.mainEqHigh.type = "highshelf";
    this.mainEqHigh.frequency.value = 3200.0;
    this.mainEqHigh.gain.value = 1.0;
  
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime( -24, this.audioContext.currentTime );
    this.compressor.knee.setValueAtTime( 40, this.audioContext.currentTime );
    this.compressor.ratio.setValueAtTime( 12, this.audioContext.currentTime );
    this.compressor.attack.setValueAtTime( 0, this.audioContext.currentTime );
    this.compressor.release.setValueAtTime( 0.25, this.audioContext.currentTime );

    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         
    // LINK EVERYTHING TOGETHER

    this.inputGain.connect( this.mainEqLow );
    this.inputGain.connect( this.effectsInputGain );
    
    this.effectsInputGain.connect( this.reverb.getInput() );
    this.reverb.connect( this.reverbGain ); 
    this.reverbGain.connect( this.mainEqLow );

    this.effectsInputGain.connect( this.delay );
    this.delay.connect( this.delayGain );
    this.delayGain.connect( this.mainEqLow );  //*/

    this.mainEqLow.connect( this.mainEqHigh );
    this.mainEqHigh.connect( this.compressor );

  }
  
  
  ///////////////////////////////////////////////////////////////////////
  connect( inputToConnect )
  {
    this.compressor.connect( inputToConnect );
  }
  
  
  ///////////////////////////////////////////////////////////////////////
  getInput()
  {
    return( this.inputGain );
  }
  
  

}



