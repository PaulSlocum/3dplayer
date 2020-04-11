
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
		this.effect = this.context.createConvolver();

		this.inputGain = this.context.createGain();
    this.inputGain.gain.value = 0.7;
    this.inputGain.connect( this.effect );

		this.outputGain = this.context.createGain();
    this.outputGain.gain.value = 10.0;
    this.effect.connect( this.outputGain );
		
		logger( "----->REVERB: LOADING IMPULSE FILE" );
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
        this.effect.buffer = buffer;
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
    this.outputGain.connect( inputToConnect );
  }
	
	///////////////////////////////////////////////////////////////////////////////
	getInput()
	{
	  return( this.inputGain );
	}

}


// -   ~    -   ~    -   ~    - 
// COMPONENTS TO ADD:
// - dry mix gain
// - predelays (2-3?)
// - predelay feedback gain
// - compressor
// -   ~    -   ~    -   ~    - 
// - wet filter (maybe 2?)
// -   ~    -   ~    -   ~    - 




//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dAudioEffects
{

  ///////////////////////////////////////////////////////////////////////
  constructor( audioContext )
  {
    this.audioContext = audioContext;
    this.setupNodes();    
  }
  
/*
                               (input)
                                 |
                             INPUT_GAIN
                              /      \
                       FX_INPUT_GAIN  \  
                           |           \
        ____________  FX_EQ_FILTER_1    \
       /            \     |              \
      /              FX_EQ_FILTER_2       \
     /              /          \           \
    /           DELAY1         REVERB       \  
   /           /      \            |         |
  | FEEDBACK_GAIN1  DELAY_GAIN   REVERB_GAIN |
  |_______|               \        |        /
                           \       |       /        
                            MAIN_BASS_FILTER       
                                   |
                            MAIN_TREBLE_FILTER       
                                   |
                               COMPRESSOR
                                   |
                                   *
                                (output)
                                
                                
REVERB TIMINGS             PRE_DELAY  DECAY_TIME  TOTAL_TIME                              
Hall (2 Bars)	             62.5 ms    3937.50 ms  4000 ms
Large Room (1 Bar)	       31.25 ms   1968.75 ms  2000 ms
Small Room (1/2 Note)      15.63 ms   984.37 ms   1000 ms
Tight Ambience (1/4 Note) 	3.91 ms   496.09 ms   500 ms

//*/  
  
  ///////////////////////////////////////////////////////////////////////
  setupNodes()
  {
    /*this.mainEqLow = this.audioContext.createBiquadFilter();
    this.mainEqLow.type = "lowshelf";
    this.mainEqLow.frequency.value = 320.0;
    this.mainEqLow.gain.value = this.bassValue;

    this.mainEqHigh = this.audioContext.createBiquadFilter();
    this.mainEqHigh.type = "highshelf";
    this.mainEqHigh.frequency.value = 3200.0;
    this.mainEqHigh.gain.value = this.trebleValue;
  
    const MAX_DELAY_SEC = 5.0;
    this.delay = this.audioContext.createDelay( MAX_DELAY_SEC );
    this.delay.delayTime.value = 0.3;

    this.delayGain = this.audioContext.createGain();
    this.delayGain.gain.value = 0.5; //*/

    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         

    this.inputGain = this.audioContext.createGain();
    this.inputGain.gain.value = 1.0;
  
    this.effectsInputGain = this.audioContext.createGain();
    this.effectsInputGain.gain.value = 0.2;
    
    this.reverb = new P3dReverb( this.audioContext );
  
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime( -24, this.audioContext.currentTime );
    this.compressor.knee.setValueAtTime( 40, this.audioContext.currentTime );
    this.compressor.ratio.setValueAtTime( 12, this.audioContext.currentTime );
    this.compressor.attack.setValueAtTime( 0, this.audioContext.currentTime );
    this.compressor.release.setValueAtTime( 0.25, this.audioContext.currentTime );

    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         

    this.inputGain.connect( this.compressor );
    this.inputGain.connect( this.effectsInputGain );
    this.effectsInputGain.connect( this.reverb.getInput() );
    this.reverb.connect( this.compressor ); 

    // ~   -   ~   -   ~   -   ~   -   ~   -   ~   -         

    /*this.mainEqLow.connect( this.mainEqHigh );
    this.mainEqHigh.connect( this.inputGain );
    this.mainEqHigh.connect( this.delay );
    this.delay.connect( this.delayGain );
    this.delayGain.connect( this.mainVolume );  //*/

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







/*

var OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;



class SimpleReverb extends Effect 
{
	constructor( context ) 
	{
		super(context);
		this.name = "SimpleReverb";
	}

	setup( reverbTime=1 ) 
	{
		this.effect = this.context.createConvolver();

		this.reverbTime = reverbTime;

		this.attack = 0.0001;
		this.decay = 0.1;
		this.release = reverbTime;

		this.wet = this.context.createGain();
    this.input.connect(this.wet);
    this.wet.connect(this.effect);
		this.effect.connect(this.output);    
		
		this.renderTail();
	}

	renderTail () 
	{
	  console.log("renderTail")
    const tailContext = new OfflineAudioContext( 2, this.context.sampleRate * this.reverbTime, this.context.sampleRate );
					tailContext.oncomplete = (buffer) => {
						this.effect.buffer = buffer.renderedBuffer;
					}
		
    const tailOsc = new Noise(tailContext, 1);
          tailOsc.init();
          tailOsc.connect(tailContext.destination);
          tailOsc.attack = this.attack;
          tailOsc.decay = this.decay;
          tailOsc.release = this.release;
		
      
      tailOsc.on({frequency: 500, velocity: 1});
			tailContext.startRendering();
		setTimeout(()=>{
			tailOsc.off(); 
		},1);
	}

	set decayTime(value) 
	{
		let dc = value/3;
		this.reverbTime = value;
		this.release = dc;
    return this.renderTail();
	}

}

class AdvancedReverb extends SimpleReverb 
{
	constructor (context) 
	{
		super(context);
		this.name = "AdvancedReverb";
	}

	setup (reverbTime=1, preDelay = 0.03) 
	{
		this.effect = this.context.createConvolver();

		this.reverbTime = reverbTime;

		this.attack = 0.0001;
		this.decay = 0.1;
		this.release = reverbTime/3;

    this.preDelay = this.context.createDelay(reverbTime);
    this.preDelay.delayTime.setValueAtTime(preDelay, this.context.currentTime);
    
    this.multitap = [];
    
    for(let i = 2; i > 0; i--) {
      this.multitap.push(this.context.createDelay(reverbTime));
    }
    this.multitap.map((t,i)=>{
      if(this.multitap[i+1]) {
        t.connect(this.multitap[i+1])
      }
      t.delayTime.setValueAtTime(0.001+(i*(preDelay/2)), this.context.currentTime);
    })
    
    this.multitapGain = this.context.createGain();
    this.multitap[this.multitap.length-1].connect(this.multitapGain);
    
    this.multitapGain.gain.value = 0.2;
    
    this.multitapGain.connect(this.output);
    
		this.wet = this.context.createGain();
     
    this.input.connect(this.wet);
    this.wet.connect(this.preDelay);
    this.wet.connect(this.multitap[0]);
    this.preDelay.connect(this.effect);
		this.effect.connect(this.output);
	}
	
	renderTail () 
	{

    const tailContext = new OfflineAudioContext( 2, this.context.sampleRate * this.reverbTime, this.context.sampleRate );
					tailContext.oncomplete = (buffer) => {
						this.effect.buffer = buffer.renderedBuffer;
					}
    const tailOsc = new Noise(tailContext, 1);
    const tailLPFilter = new Filter(tailContext, "lowpass", 5000, 1);
    const tailHPFilter = new Filter(tailContext, "highpass", 500, 1);
    
    tailOsc.init();
		tailOsc.connect(tailHPFilter.input);
    tailHPFilter.connect(tailLPFilter.input);
    tailLPFilter.connect(tailContext.destination);
		tailOsc.attack = this.attack;
		tailOsc.decay = this.decay;
		tailOsc.release = this.release;
    
		tailContext.startRendering()

		tailOsc.on({frequency: 500, velocity: 1});
		setTimeout(()=>{
					tailOsc.off();
		},1)
	}

	set decayTime(value) 
	{
		let dc = value/3;
		this.reverbTime = value;
		this.release = dc;
   this.renderTail();
	}
}


let Audio = new (window.AudioContext || window.webkitAudioContext)();     

let filter = new Filter(Audio, "lowpass", 50000, 0.8);
    filter.setup();
let verb = new SimpleReverb(Audio); 
			verb.decayTime = 0.8;
      verb.wet.gain.value = 2;
   
 
let compressor = Audio.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, Audio.currentTime);
    compressor.knee.setValueAtTime(40, Audio.currentTime);
    compressor.ratio.setValueAtTime(12, Audio.currentTime);
    compressor.attack.setValueAtTime(0, Audio.currentTime);
    compressor.release.setValueAtTime(0.25, Audio.currentTime);
    compressor.connect(Audio.destination);

filter.connect(verb.input);
verb.connect(compressor);


let drySound = new Sample(Audio);    
    drySound.load("https://mwmwmw.github.io/files/Instruments/DrumBeat.mp3").then((s)=>{
      drySound.connect(compressor);
    });

let wetSound = new Sample(Audio);    
    wetSound.load("https://mwmwmw.github.io/files/Instruments/DrumBeat.mp3").then((s)=>{ 
      wetSound.connect(filter.input);
    });

let combined = new Sample(Audio);    
    combined.load("https://mwmwmw.github.io/files/Instruments/DrumBeat.mp3").then((s)=>{
      combined.connect(filter.input);
      combined.connect(compressor);
    });




document.getElementById("dry").addEventListener("mousedown",(e)=>{
  drySound.play();
});
document.getElementById("wet").addEventListener("mousedown",(e)=>{
  wetSound.play();
})
document.getElementById("combined").addEventListener("mousedown",(e)=>{
  combined.play();
})


//*/
