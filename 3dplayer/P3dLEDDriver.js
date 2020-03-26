


//-----------------------------------------
// REQUIRED TEXT/CHARACTERS:
//
// open disc play stop treb bass vol
// a b c d e f h i l n o p r s t u v 
//
//-----------------------------------------


const TOTAL_LED_DIGITS = 6;
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
        b: [1,0,0,1,1,1,1],
        c: [0,0,0,0,1,1,1],
        d: [0,0,1,1,1,1,1],
        e: [1,1,0,0,1,1,1],
        f: [1,1,0,0,0,1,1],
        h: [1,0,0,1,0,1,1],
        i: [0,0,0,1,0,0,0],
        l: [0,0,1,1,0,0,0],
        L: [1,0,0,0,1,1,0],
        n: [0,0,0,1,0,1,1],
        N: [1,1,1,1,0,1,0],
        o: [0,0,0,1,1,1,1],
        O: [1,1,1,1,1,1,0],
        p: [1,1,1,0,0,1,1],
        r: [0,0,0,0,0,1,1],
        s: [1,1,0,1,1,0,1],
        t: [1,0,0,0,1,1,1],
        v: [0,0,0,1,1,1,0],
        y: [1,0,1,1,1,0,1],
        blank: [0,0,0,0,0,0,0],
        X: [0,0,0,0,0,0,0]
};



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dLEDDriver
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene ) 
  {
    console.log("---->LED DRIVER CLASS CONSTRUCTOR: " );
    
    this.scene = scene;
    
    this.ledOnMaterial = null;
    this.ledDimMaterial = null;
    this.ledOffMaterial = null;
    this.displayGlassMaterial = null;
    
    this.mainLedArray = [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
                          [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ];
    this.highlightLedArray = [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], 
                               [0,0,0,0,0,0,0], [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ];
                               
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
        var mainObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "100", ledDigit+1 );
        this.mainLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( mainObjectName, true );
        
        var highlightObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "200", ledDigit+1 );
        this.highlightLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( highlightObjectName, true );
      }
    } //*/

    this.objectsLoaded = true;

    // CLEAR ALL SEGMENTS
    this.setString( 'XXXXXX' );
    
  }

  ////////////////////////////////////////////////////////////////////////
  setString( text )
  {
    for( let index=0; index<text.length; index++ )
    {
      this.setDigitCharacter( index, text[index] );
    }
  }

  ////////////////////////////////////////////////////////////////////////
  setDigitCharacter( ledDigit, character )
  {
    //console.log( "---->LED DRIVER->SET: ", SEGMENT_TABLE[character] );
    let segmentArray = SEGMENT_TABLE[character];
    for( let ledSegment=0; ledSegment<TOTAL_LED_SEGMENTS; ledSegment++ )
    {
      if( segmentArray[ledSegment] == 0 )
        this.segmentOff( ledDigit, ledSegment );
      else
        this.segmentOn( ledDigit, ledSegment );
    }
    
  }

  /////////////////////////////////////////////////////////////////////////
  segmentOn( ledDigit, ledSegment )
  {
    if( this.objectsLoaded == true )
    {
      this.mainLedArray[ledDigit][ledSegment].material = this.ledOnMaterial;
      this.highlightLedArray[ledDigit][ledSegment].material = this.ledDimMaterial;
    }
  }

  
  /////////////////////////////////////////////////////////////////////////
  segmentOff( ledDigit, ledSegment )
  {
    if( this.objectsLoaded == true )
    {
      this.mainLedArray[ledDigit][ledSegment].material = this.ledOffMaterial;
      this.highlightLedArray[ledDigit][ledSegment].material = this.displayGlassMaterial;
    }
  }
  
  
  
}
