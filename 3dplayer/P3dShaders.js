



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dShaders
{

  ///////////////////////////////////////////////////////////////////////
  cdVertexShader() 
  {
    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
      ` 
      //*/
  }


  ///////////////////////////////////////////////////////////////////////
  cdFragmentShader() 
  {   
    return `
      uniform vec3 colorC; 
      uniform vec3 colorD; 
      varying vec3 vUv;

      float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      /**
       * Returns accurate MOD when arguments are approximate integers.
       */
      float modI(float a,float b) {
          float m=a-floor((a+0.5)/b)*b;
          return floor(m+0.5);
      }

      void main() {
        float noise = rand(vUv.xy)*0.15 - 0.07;
        float i = mod( gl_FragCoord.x, 15.0 );
        gl_FragColor = vec4( i/35.0+0.28 - noise, i/45.0+0.18 - noise, 0.17 - noise, 0.0 );
      }        ` //*/

    /*return `
      uniform vec3 colorC; 
      uniform vec3 colorD; 
      varying vec3 vUv;

      float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        gl_FragColor = vec4(mix(colorC, colorD, vUv.y + rand(vUv.xy)*17.0 ), 1.0);
      }        ` //*/
  }  




  ///////////////////////////////////////////////////////////////////////
  roomVertexShader() 
  {
    //---------------------------------------------------------------------
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
    //-------------------------------------------------------------------------
    /* ORIGINAL
      void main()
      {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    //*/
    //-------------------------------------------------------------------------

    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }

      `
  }

  ///////////////////////////////////////////////////////////////////////
  roomFragmentShader() 
  {   
      //----------------------------------------------------------------------------
      //float colorValue = gl_PointCoord.y/100.0+0.2;
      //gl_FragColor = vec4( colorValue, colorValue, colorValue+0.05, 1.0);
      //float colorValue = gl_PointCoord.y/100.0+0.2 + rand(gl_PointCoord.xy)*0.02;
      //----------------------------------------------------------------------------
      /* ORIGINAL GRADIENT
        float colorValue = gl_PointCoord.y/100.0;
        colorValue = clamp( colorValue, 0.0, 1.0 );
        gl_FragColor = vec4( colorValue, colorValue, colorValue, 1.0);
      //*/
      //----------------------------------------------------------------------------
      /* SOLID COLOR
              gl_FragColor = vec4( 0.0, 0.0, 0.1, 1.0);
              //*/
      //----------------------------------------------------------------------------
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
      //----------------------------------------------------------------------------
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



}





