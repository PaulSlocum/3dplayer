//
// P3dLEDDriver.js
//
// CLASS TO SET UP LED MATERIALS AND SHOW ALPHANUMERIC CHARACTERS ON 7-SEGMENT 
// LED DISPLAYS
//
//////////////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------------
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------
 
 
 
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~
  LED SEGMENT ORDER:

          1 
         --
     0 |    | 2
         __ 
     5 |  6 | 3
         __
          4
      
~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const TOTAL_LED_DIGITS = 7;
const TOTAL_LED_SEGMENTS = 7;
const SEGMENT_TABLE = 
{ 
        0: [1,1,1,1,1,1,0],
        1: [0,0,1,1,0,0,0],
        2: [0,1,1,0,1,1,1],
        3: [0,1,1,1,1,0,1],
        4: [1,0,1,1,0,0,1],
        5: [1,1,0,1,1,0,1],
        6: [1,1,0,1,1,1,1],
        7: [0,1,1,1,0,0,0],
        8: [1,1,1,1,1,1,1],
        9: [1,1,1,1,0,0,1],
        a: [1,1,1,1,0,1,1],
        A: [1,1,1,1,0,1,1],
        b: [1,0,0,1,1,1,1],
        B: [1,0,0,1,1,1,1],
        c: [0,0,0,0,1,1,1],
        C: [1,1,0,0,1,1,0],
        d: [0,0,1,1,1,1,1],
        D: [0,0,1,1,1,1,1],
        e: [1,1,0,0,1,1,1],
        E: [1,1,0,0,1,1,1],
        f: [1,1,0,0,0,1,1],
        F: [1,1,0,0,0,1,1],
        h: [1,0,0,1,0,1,1],
        H: [1,0,1,1,0,1,1],
        i: [0,0,0,1,0,0,0],
        I: [0,0,1,1,0,0,0],
        l: [0,0,1,1,0,0,0],
        L: [1,0,0,0,1,1,0],
        n: [0,0,0,1,0,1,1],
        N: [1,1,1,1,0,1,0],
        o: [0,0,0,1,1,1,1],
        O: [1,1,1,1,1,1,0],
        p: [1,1,1,0,0,1,1],
        P: [1,1,1,0,0,1,1],
        r: [0,0,0,0,0,1,1],
        R: [0,0,0,0,0,1,1],
        s: [1,1,0,1,1,0,1],
        S: [1,1,0,1,1,0,1],
        t: [1,0,0,0,1,1,1],
        T: [1,0,0,0,1,1,1],
        v: [0,0,0,1,1,1,0],
        u: [0,0,0,1,1,1,0],
        V: [1,0,1,1,1,1,0],
        U: [1,0,1,1,1,1,0],
        y: [1,0,1,1,1,0,1],
        Y: [1,0,1,1,1,0,1],
        blank: [0,0,0,0,0,0,0],
        X: [0,0,0,0,0,0,0],
        W: [0,0,0,0,0,0,1], // DASH
        M: [0,1,0,0,1,0,1], // TO BE DETERMINED (NOT CURRENTLY USED)
        m: [0,1,0,0,1,0,1]  // TO BE DETERMINED (NOT CURRENTLY USED)
};



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dLEDDriver
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene ) 
  {
    logger("---->LED DRIVER CLASS CONSTRUCTOR: " );
    
    this.scene = scene;
    
    this.ledOnMaterial = null;
    this.ledDimMaterial = null;
    this.ledOffMaterial = null;
    this.displayGlassMaterial = null;
    
    this.mainLedArray = [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
                          [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ];
    this.highlightLedArray = [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
                               [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ];
    this.colonObject = null;
    this.colonHighlight = null;
                               
    this.objectsLoaded = false;
    
  }


  /////////////////////////////////////////////////////////////////////////
  // SET UP MATERIALS AND OBJECTS -- MUST BE CALLED AFTER SCENE IS LOADED
  load()
  {
    // FIND THE MATERIALS USED FOR THE LEDS...
    this.scene.traverse( function(child) 
    {
      if( this.ledOnMaterial == null  &&  child.material  &&  child.material.name == "ledOn" )
      {
        //console.log( "---->LED DRIVER: 'ledOn' MATERIAL FOUND" );
        this.ledOnMaterial = child.material;
      }
      if( this.ledDimMaterial == null  &&  child.material  &&  child.material.name == "ledDim" )
      {
        //console.log( "---->LED DRIVER: 'ledDim' MATERIAL FOUND" );
        this.ledDimMaterial = child.material;
      }
      if( this.ledOffMaterial == null  &&  child.material  &&  child.material.name == "ledOff" )
      {
        //console.log( "---->LED DRIVER: 'ledOff' MATERIAL FOUND" );
        this.ledOffMaterial = child.material;
      }
      if( this.displayGlassMaterial == null  &&  child.material  &&  child.material.name == "displayGlass" )
      {
        //console.log( "---->LED DRIVER: 'displayGlass' MATERIAL FOUND" );
        this.displayGlassMaterial = child.material;
      }

      //console.log("---->LED DRIVER->CHILD: ", child.material);
    }.bind(this) ); //*/
    
    // FIND AND LOAD ALL THE SEGMENT OBJECTS INTO ARRAYS...
    for( let ledDigit=0; ledDigit<TOTAL_LED_DIGITS; ledDigit++ )
    {
      for( let ledSegment=0; ledSegment<TOTAL_LED_SEGMENTS; ledSegment++ )
      {
        var mainObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "100", ledDigit );
        //logger( ">>>>>>>>>>>>> MAIN OBJECT NAME: ", mainObjectName );
        this.mainLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( mainObjectName, true );
        
        var highlightObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "200", ledDigit );
        //logger( ">>>>>>>>>>>>> HIGHLIGHT OBJECT NAME: ", highlightObjectName );
        this.highlightLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( highlightObjectName, true );
      }
    } //*/

    this.colonObject = this.scene.getObjectByName( "Colon1a" );
    this.colonHighlight = this.scene.getObjectByName( "Colon1b" );
    
    this.objectsLoaded = true;

    // CLEAR ALL SEGMENTS
    this.setString( 'XXXXXX' );
  }


  ////////////////////////////////////////////////////////////////////////
  // SET A STRING, STARTING FROM THE LEFTMOST 7-SEGMENT DISPLAY
  setString( text )
  {
    for( let index=0; index<text.length; index++ )
    {
      this.setDigitCharacter( index, text[index] );
    }
  }


  ////////////////////////////////////////////////////////////////////////
  // SET A CHARACTER ON ONE 7-SEGMENT DISPLAY
  setDigitCharacter( ledDigitOffset, character )
  {
    //console.log( "---->LED DRIVER->SET: ", SEGMENT_TABLE[character] );
    let segmentArray = SEGMENT_TABLE[character];
    
    for( let ledSegment=0; ledSegment<TOTAL_LED_SEGMENTS; ledSegment++ )
    {
      if( segmentArray[ledSegment] == 0 )
        this._segmentOff( ledDigitOffset, ledSegment );
      else
        this._segmentOn( ledDigitOffset, ledSegment );
    }
  }


  //////////////////////////////////////////////////////////////////////////
  colonOn()
  {
    if( this.objectsLoaded == true )
    {
      this.colonObject.material = this.ledOnMaterial;
      this.colonHighlight.material = this.ledDimMaterial;
    }
  }  
  

  //////////////////////////////////////////////////////////////////////////
  colonOff()
  {
    if( this.objectsLoaded == true )
    {
      this.colonObject.material = this.ledOffMaterial;
      this.colonHighlight.material = this.displayGlassMaterial;
    }
  }  
  

  //  -    ~       -    ~       -    ~       -    ~       -    ~       -    ~        
  
 
  
  /////////////////////////////////////////////////////////////////////////
  _segmentOn( ledDigit, ledSegment )
  {
    if( this.objectsLoaded == true )
    {
      this.mainLedArray[ledDigit][ledSegment].material = this.ledOnMaterial;
      this.highlightLedArray[ledDigit][ledSegment].material = this.ledDimMaterial;
    }
  }

  
  /////////////////////////////////////////////////////////////////////////
  _segmentOff( ledDigit, ledSegment )
  {
    if( this.objectsLoaded == true )
    {
      this.mainLedArray[ledDigit][ledSegment].material = this.ledOffMaterial;
      this.highlightLedArray[ledDigit][ledSegment].material = this.displayGlassMaterial;
    }
  }

  
  
}
