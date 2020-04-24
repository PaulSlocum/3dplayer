//
// P3dAudioEffects.js
//
// WEB AUDIO EFFECTS MODULE WITH PRESETS
//
////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
import { logger } from "./P3dLog.js";
import { P3dReverb } from "./P3dAudioReverb.js";
//-----------------------------------------------------------------------------------



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  SIGNAL PATH:                              (nodes in parenthesis are TBI)


                                           <input>
                                              *
                                              |
 note: there are two delay               INPUT_GAIN
 sections but only one is shown            /      \
                                    FX_INPUT_GAIN  \
                                        |           \
        _________________________  (FX_EQ_FILTER_1)  \
      /                          \      |             \
     /                            (FX_EQ_FILTER_2)     \
    /                   _________/          \           \
   /             DELAY1+2                  (PRE_DELAY)   \
  /             /       \                       |         |
 | (FEEDBACK_GAIN1+2) (DELAY_PAN1+2)          REVERB      |
 |______|                 \                     |         |
                     DELAY_GAIN1+2          REVERB_GAIN   |
                             \___________       |        /
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

    90"S GENERAL MOTORS CARS: "Jazz Club", "Hall", "Church", "Stadium", "News"

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//*/





export const EffectsPreset = {
  CLEAN: "EffectClean",
  ROOM: "EffectRoom",
  CLUB: "EffectClub",
  CHURCH: "EffectChurch",
  STADIUM: "EffectStadium",
  CAVE: "EffectCave",
  PLATE: "EffectPlate",
  LOFI: "EffectLofi",
  SLAPBACK: "EffectSlapback"
};





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dAudioEffects
{

  ///////////////////////////////////////////////////////////////////////
  constructor( audioContext )
  {
    logger( "----->AUDIOEFFECTS CONSTRUCTOR" );

    this.audioContext = audioContext;
    this.setupNodes();
    this.loadPreset( EffectsPreset.CLEAN );
  }

  /////////////////////////////////////////////////////////////////////////
  loadPreset( preset )
  {
    logger( "----->AUDIOEFFECTS: LOAD PRESET: ", preset );

    switch( preset )
    {
      case EffectsPreset.CLEAN:
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.0;
        this.delayGain.gain.value = 0.0;
        this.reverbGain.gain.value = 0.0;
        this.mainEqHigh.gain.value = 0.0;
        this.mainEqLow.gain.value = 0.0;
        break;
      case EffectsPreset.ROOM:
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.2;
        this.reverbGain.gain.value = 0.4;
        this.mainEqHigh.gain.value = 0.0;
        this.mainEqLow.gain.value = 0.0;
        break;
      case EffectsPreset.CLUB:
        this.inputGain.gain.value = 0.9;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.2;
        this.reverbGain.gain.value = 0.5;
        this.mainEqHigh.gain.value = 2.0;
        this.mainEqLow.gain.value = 2.0;
        break;
      case EffectsPreset.CHURCH:
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.2;
        this.reverbGain.gain.value = 1.0;
        this.mainEqHigh.gain.value = -5.0;
        this.mainEqLow.gain.value = -2.0;
        break;
      case EffectsPreset.STADIUM:
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.3;
        this.reverbGain.gain.value = 0.6;
        this.mainEqHigh.gain.value = -5.0;
        this.mainEqLow.gain.value = -5.0;
        break;
      case EffectsPreset.CAVE:
        this.inputGain.gain.value = 1.2;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.5;
        this.reverbGain.gain.value = 0.8;
        this.mainEqHigh.gain.value = -5.0;
        this.mainEqLow.gain.value = -5.0;
        break;
      case EffectsPreset.PLATE:
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.3;
        this.reverbGain.gain.value = 0.5;
        this.mainEqHigh.gain.value = 0.0;
        this.mainEqLow.gain.value = 0.0;
        break;
      case EffectsPreset.LOFI:
        this.inputGain.gain.value = 2.1;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.1;
        this.reverbGain.gain.value = 0.1;
        this.mainEqHigh.gain.value = -20.0;
        this.mainEqLow.gain.value = -7.0;
        break;
      case EffectsPreset.SLAPBACK:
        this.inputGain.gain.value = 1.0;
        this.effectsInputGain.gain.value = 0.8;
        this.delayGain.gain.value = 0.4;
        this.reverbGain.gain.value = 0.0;
        this.mainEqHigh.gain.value = 0.0;
        this.mainEqLow.gain.value = 0.0;
        break;
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
    this.mainEqLow.gain.value = 0.0;

    this.mainEqHigh = this.audioContext.createBiquadFilter();
    this.mainEqHigh.type = "highshelf";
    this.mainEqHigh.frequency.value = 3200.0;
    this.mainEqHigh.gain.value = 0.0;

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



