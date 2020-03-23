






const TOTAL_LED_DIGITS = 6;
const TOTAL_LED_SEGMENTS = 7;



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
  }


  /////////////////////////////////////////////////////////////////////////
  load()
  {
    //var object = this.scene.getObjectByName( "Seg1a1.001", true );
    //var object = this.scene.getObjectByName( "ButtonPlay", true );
    //var object = this.scene.getObjectByName( "Seg1a1001", true );
    //console.log("---->LED DRIVER->OBJECT: ", object);
    
    // FIND THE MATERIALS USED FOR THE LEDS...
    this.scene.traverse( function(child) 
    {
      if( this.ledOnMaterial == null  &&  child.material  &&  child.material.name == "ledOn" )
      {
        console.log( "---->LED DRIVER: 'ledOn' MATERIAL FOUND" );
        this.ledOnMaterial = child.material;
      }
      if( this.ledDimMaterial == null  &&  child.material  &&  child.material.name == "ledDim" )
      {
        console.log( "---->LED DRIVER: 'ledDim' MATERIAL FOUND" );
        this.ledDimMaterial = child.material;
      }
      if( this.ledOffMaterial == null  &&  child.material  &&  child.material.name == "ledOff" )
      {
        console.log( "---->LED DRIVER: 'ledOff' MATERIAL FOUND" );
        this.ledOffMaterial = child.material;
      }
      if( this.displayGlassMaterial == null  &&  child.material  &&  child.material.name == "displayGlass" )
      {
        console.log( "---->LED DRIVER: 'displayGlass' MATERIAL FOUND" );
        this.displayGlassMaterial = child.material;
      }
      //console.log("---->LED DRIVER->CHILD: ", child.material);
    }.bind(this) ); //*/
    
    
    for( var ledDigit=0; ledDigit<TOTAL_LED_DIGITS; ledDigit++ )
    {
      for( var ledSegment=0; ledSegment<TOTAL_LED_SEGMENTS; ledSegment++ )
      {
        var mainObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "100", ledDigit+1 );
        //console.log( "---->LED DRIVER->NAME: ", mainObjectName );
        this.mainLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( mainObjectName, true );
        
        var highlightObjectName = "Seg1".concat( String.fromCharCode(ledSegment+97), "200", ledDigit+1 );
        this.highlightLedArray[ledDigit][ledSegment] = this.scene.getObjectByName( highlightObjectName, true );

        //console.log( "---->LED DRIVER->MAIN: ", this.mainLedArray[ledDigit][ledSegment] );
        //console.log( "---->LED DRIVER->HIGHLIGHT: ", this.highlightLedArray[ledDigit][ledSegment] );
        
        if( ledSegment%1 == 0 )
        {        
          this.mainLedArray[ledDigit][ledSegment].material = this.ledOffMaterial;
          this.highlightLedArray[ledDigit][ledSegment].material = this.displayGlassMaterial;
        }
      }
    } //*/
    
    // DEBUG...
    /*var test = this.scene.getObjectByName( "Seg1a1001", true );
    console.log( "---->LED DRIVER->TEST: ", test );
    this.mainLedArray[0][0] = test; //*/
    
    
    /*this.scene.getObjectByName( "Seg1a1001", true ).material = this.displayGlassMaterial;
    this.scene.getObjectByName( "Seg1a2001", true ).material = this.displayGlassMaterial;
    this.scene.getObjectByName( "Seg1b1001", true ).material = this.displayGlassMaterial;
    this.scene.getObjectByName( "Seg1b2001", true ).material = this.displayGlassMaterial; //*/
    
  }


  ////////////////////////////////////////////////////////////////////////
  setDigitCharacter( character, digit )
  {
  }

  /////////////////////////////////////////////////////////////////////////
  segmentOn( digit, segment )
  {
  }
  
  /////////////////////////////////////////////////////////////////////////
  segmentOff( digit, segment )
  {
  }
  
  ///////////////////////////////////////////////////////////////////////////
  getObjectName( digit, segment )
  {
  }
  
  
  
}
