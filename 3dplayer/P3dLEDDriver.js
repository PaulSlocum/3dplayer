












//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dLEDDriver
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene ) 
  {
    console.log("---->LED DRIVER CLASS CONSTRUCTOR: ", scene );
    
    this.scene = scene;
    
    this.ledOnMaterial = null;
    this.ledDimMaterial = null;
    this.displayGlassMaterial = null;
  }


  /////////////////////////////////////////////////////////////////////////
  load()
  {
    //var object = this.scene.getObjectByName( "Seg1a1.001", true );
    //var object = this.scene.getObjectByName( "ButtonPlay", true );
    //var object = this.scene.getObjectByName( "Seg1a1001", true );
    //console.log("---->LED DRIVER->OBJECT: ", object);
    
    
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
      if( this.displayGlassMaterial == null  &&  child.material  &&  child.material.name == "displayGlass" )
      {
        console.log( "---->LED DRIVER: 'displayGlass' MATERIAL FOUND" );
        this.displayGlassMaterial = child.material;
      }
      //console.log("---->LED DRIVER->CHILD: ", child.material);
    }.bind(this) ); //*/
    
    
    this.scene.getObjectByName( "Seg1a1001", true ).material = this.displayGlassMaterial;
    this.scene.getObjectByName( "Seg1a2001", true ).material = this.displayGlassMaterial;
    this.scene.getObjectByName( "Seg1b1001", true ).material = this.displayGlassMaterial;
    this.scene.getObjectByName( "Seg1b2001", true ).material = this.displayGlassMaterial;
    
  }


  ////////////////////////////////////////////////////////////////////////
  setDigitCharacter( character, digit )
  {
  }

  /////////////////////////////////////////////////////////////////////////
  segmentOn( segment, digit )
  {
  }
  
  /////////////////////////////////////////////////////////////////////////
  segmentOff( segment, digit )
  {
  }
  
}
