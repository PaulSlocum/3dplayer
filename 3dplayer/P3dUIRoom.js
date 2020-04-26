// P3dUIRoom.js
//
// ENVIROMENT CUBE WITH SHADERS AND ANIMATIONS
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { TransportMode } from "./P3dController.js";
//-----------------------------------------------------------------------------------



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dRoom extends THREE.Mesh
{


  ///////////////////////////////////////////////////////////////////////
  constructor( appController )
  {
    // ROOM CUBE
    let geometry = new THREE.BoxGeometry( -80, -40, -40 ); // <----------- CORRECT SIZE
    //var geometry = new THREE.BoxGeometry( -70, -70, -70 ); // <-- ALTERNATE SIZE (DEBUG)

    let roomUniforms = {
        colorB: {type: "vec3", value: new THREE.Color(0x0A0B0A)},
        colorA: {type: "vec3", value: new THREE.Color(0x060607)}
    };

    let roomMaterial =  new THREE.ShaderMaterial({
      uniforms: roomUniforms,
      fragmentShader: roomFragmentShader(),
      vertexShader: roomVertexShader(),
    });

    super( geometry, roomMaterial );

    this.rotation.x = 200;
    this.rotation.y = 120;

    this.backgroundSpinRate = 0.0;
    this.roomUniforms = roomUniforms;
    this.appController = appController;
  }



  ///////////////////////////////////////////////////////////////////////
  update()
  {
    // ROTATE ROOM CUBE...
    this.backgroundSpinRate += 0.00001; // <------------- ORIGINAL
    if( this.backgroundSpinRate > 0.04 )
      this.backgroundSpinRate = 0.04;
    if( this.appController.getStatus() != TransportMode.PLAYING )
    {
      this.backgroundSpinRate -= 0.0001;
      if( this.backgroundSpinRate < 0.0002 )
        this.backgroundSpinRate = 0.0002;
    }

    this.rotation.x += this.backgroundSpinRate;
    this.rotation.y += this.backgroundSpinRate;
  }


}




//================================================================================
function roomVertexShader()
{
  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  /* DIFFUSE SHADER
    varying vec3 normal;
    varying vec3 vertex_to_light_vector;

    void main()
    {
        // Transforming The Vertex
        gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

        // Transforming The Normal To ModelView-Space
        normal = gl_NormalMatrix * gl_Normal;

        // Transforming The Vertex Position To ModelView-Space
        vec4 vertex_in_modelview_space = gl_ModelViewMatrx * gl_Vertex;

        // Calculating The Vector From The Vertex Position To The Light Position
        vertex_to_light_vector = vec3(gl_LightSource[0].position Â– vertex_in_modelview_space);
    }
  //*/
  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  /* ORIGINAL
    void main()
    {
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  //*/
  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

  return `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
    `
}


//================================================================================
function roomFragmentShader()
{
  	//-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    //float colorValue = gl_PointCoord.y/100.0+0.2;
    //gl_FragColor = vec4( colorValue, colorValue, colorValue+0.05, 1.0);
    //float colorValue = gl_PointCoord.y/100.0+0.2 + rand(gl_PointCoord.xy)*0.02;
	  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    /* ORIGINAL GRADIENT
      float colorValue = gl_PointCoord.y/100.0;
      colorValue = clamp( colorValue, 0.0, 1.0 );
      gl_FragColor = vec4( colorValue, colorValue, colorValue, 1.0);
    //*/
	  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    /* SOLID COLOR
            gl_FragColor = vec4( 0.0, 0.0, 0.1, 1.0);
            //*/
	  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    /* DIFFUSE SHADER
      varying vec3 normal;
      varying vec3 vertex_to_light_vector;

      void main()
      {
          // Defining The Material Colors
          const vec4 AmbientColor = vec4(0.1, 0.0, 0.0, 1.0);
          const vec4 DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);

          // Scaling The Input Vector To Length 1
          vec3 normalized_normal = normalize(normal);
          vec3 normalized_vertex_to_light_vector = normalize(vertex_to_light_vector);

          // Calculating The Diffuse Term And Clamping It To [0;1]
          float DiffuseTerm = clamp(dot(normal, vertex_to_light_vector), 0.0, 1.0);

          // Calculating The Final Color
          gl_FragColor = AmbientColor + DiffuseColor * DiffuseTerm;
      }
            //*/
	  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  return `
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec3 vUv;

    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      float i = mod( gl_FragCoord.x, 30.0 );
      float noise = rand(vUv.xy)*0.2 - 0.1;
      gl_FragColor = vec4(mix(colorA, colorB, vUv.y ), 1.0);
      gl_FragColor = vec4( gl_FragColor.x * (i/15.0) - noise, gl_FragColor.y * (i/25.0) - noise, gl_FragColor.z * (i/20.0) - noise*2.0, 1.0 );
    }        `
}



