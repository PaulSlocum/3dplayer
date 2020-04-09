// P3dUserInterface.js
//
// HANDLES MOUSE/TOUCH EVENTS AND SETS UP THE GRAPHICS SUBSYSTEM CLASS (P3dGraphics)
//
/////////////////////////////////////////////////////////////////////////////////////



//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import P3dGraphics from './P3dGraphics.js'
import { ButtonEvent } from './P3dController.js'
import { logger } from './P3dLog.js'
//-----------------------------------------------------------------------------------


//=====================================================================================
function getRelativeMousePosition(event, target) {
  target = target || event.target;
  var rect = target.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

//=====================================================================================
// assumes target or event.target is canvas
function getNoPaddingNoBorderCanvasRelativeMousePosition(event, target) {
  target = target || event.target;
  var pos = getRelativeMousePosition(event, target);
  pos.x = pos.x * target.width  / target.clientWidth;
  pos.y = pos.y * target.height / target.clientHeight;
  return pos;  
}


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dUserInterface 
{


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer ) 
  {
    //console.log("---->DISPLAY CLASS CONSTRUCTOR" );
    logger( "---->DISPLAY CLASS CONSTRUCTOR" );

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;
    
    window.onresize = this.resizeCallback.bind(this);

    this.graphics = new P3dGraphics( appController, windowWidth, windowHeight, renderer );

    // MOUSE/TOUCH HANDLING
    document.addEventListener( 'mousedown', this.mouseDown.bind(this), false );
    document.addEventListener( 'mouseup', this.mouseUp.bind(this), false );
    document.addEventListener('touchstart', this.touchDown.bind(this), false);
    document.addEventListener('touchcancel', this.touchUp.bind(this), false);
    document.addEventListener('touchend', this.touchUp.bind(this), false);
  }


  //////////////////////////////////////////////////////////////////////////
  resizeCallback()
  {
    logger( "!!!!!!!!!!!!!!!!!!!!!!!! WINDOWS RESIZED !!!!!!!!!!!!!!!!!!!!!!!" );
    //this.windowWidth = window.innerWidth;
    //this.windowHeight = window.innerHeight;
  }


  //////////////////////////////////////////////////////////////////////////
  mouseDown( event )
  {
    this.touchMouseDown( event );
  }
  
  /////////////////////////////////////////////////////////////////////////
  mouseUp( event )
  {
    this.touchMouseUp( event );
  }


  //////////////////////////////////////////////////////////////////////////
  touchDown( event )
  {
    this.touchMouseDown( event.targetTouches[0] );
    event.targetTouches[0].preventDefault();
  }
  
  
  /////////////////////////////////////////////////////////////////////////
  touchUp( event )
  {
    this.touchMouseUp( event.targetTouches[0] );
    event.targetTouches[0].preventDefault();
  }


  ///////////////////////////////////////////////////////////////////////
  touchMouseDown( event )
  {
    logger( "---> PAGE X OFFSET: ", window.pageXOffset );
    logger( "----> COORDS: ", event.clientX, event.clientY );
    logger( "-----> WINDOW SIZE: ", this.windowWidth, this.windowHeight );
    logger( "------> CANVAS SIZE: ", this.renderer.width, this.renderer.height );
  
    //To convert that to a WebGL coordinate
    var pos = getRelativeMousePosition( event, this.renderer.domElement );
    //const x = pos.x / gl.canvas.width  *  2 - 1;
    //const y = pos.y / gl.canvas.height * -2 + 1;
    let mouse = new THREE.Vector2();
    mouse.x = pos.x / this.renderer.domElement.width  *  2 - 1;
    mouse.y = pos.y / this.renderer.domElement.height * -2 + 1;

    // ORIGINAL
    /*let mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / this.windowWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / this.windowHeight ) * 2 + 1; //*/

    // DEBUG
    //console.log( "---->DISPLAY MOUSE X: ", mouse.x );
    //this.graphics.debugIndicator( mouse.x );

    let intersects = this.graphics.getIntersectionsAtPixel( mouse );
    for ( let i = 0; i < intersects.length; i++ ) 
    {
      let objectName = intersects[i].object.name;
      if( objectName.startsWith( "Button" ) )
      {
        this.appController.processButtonEvent( objectName ); 
        //this.graphics.playAnimation( objectName ); // STILL DECIDING ABOUT BUTTON ANIMATIONS
      }
      switch( objectName )
      {
        case ButtonEvent.BUTTON_DOWN_BASS_DOWN:
        case ButtonEvent.BUTTON_DOWN_BASS_UP:
          this.graphics.numericDisplay.showBass();
          break;
        case ButtonEvent.BUTTON_DOWN_TREBLE_DOWN:
        case ButtonEvent.BUTTON_DOWN_TREBLE_UP:
          this.graphics.numericDisplay.showTreble();
          break;
        case ButtonEvent.BUTTON_DOWN_VOL_DOWN:
        case ButtonEvent.BUTTON_DOWN_VOL_UP:
          this.graphics.numericDisplay.showVolume();
          break;
      }
    } //*/



  }


  ///////////////////////////////////////////////////////////////////////
  touchMouseUp( event )
  {
    //this.graphics.resetAnimation(); // STILL DECIDING ABOUT BUTTON ANIMATIONS

    if( this.buttonDown == true )
    {
      this.buttonDown = false;
      this.appController.processButtonEvent( ButtonEvent.BUTTON_UP ); 
    }
  }


  ////////////////////////////////////////////////////////////////////////
  run()
  {
    this.graphics.run();
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  openTray()
  {
    this.graphics.openTray();
  }


  ////////////////////////////////////////////////////////////////////////
  closeTray()
  {
    this.graphics.closeTray();
  }


  ////////////////////////////////////////////////////////////////////////
  // STILL DECIDING ON IMPLEMENTATION OF THIS...
  /*playAnimation( animationName )
  {
    this.graphics.playAnimation( animationName );
  }//*/
  


  ///////////////////////////////////////////////////////////////////////////
  setBackgroundColor( color )
  {
    this.graphics.setBackgroundColor( color );
  }


}



