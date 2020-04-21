//
// P3dShaders.js
//
// CONTAINS SHADER CODE, THIS WILL PROBABLY BE SPLIT UP LATER
//
/////////////////////////////////////////////////////////////////////////////////



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dShaders
{

  ///////////////////////////////////////////////////////////////////////
  cdVertexShader() 
  {
    return `
      varying vec3 localPosition; 
      varying vec4 vertexWorldPosition;
      varying vec3 vertexNormal;

      void main() {
        localPosition = position; 

        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        vertexWorldPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 

        //mat4 modelViewProjection = projectionMatrix * modelView;
        //gl_Position = modelViewProjection * vec4(P, 1.0);
  
        //mat4 modelView = viewMatrix * modelMatrix;
        //normal = modelView * vec4(N, 0.0);
        
        //vec4 vertexNormal2 = modelMatrix * vec4( normal, 1.0 );
        //vertexNormal = vertexNormal2.xyz;
        //vertexNormal = normal;
        vertexNormal = vec3( 0.0, 1.0, 0.0 );
      }
    ` 
      //*/
  }


  ///////////////////////////////////////////////////////////////////////
  cdFragmentShader() 
  {   
    return `
      uniform vec3 lightPosition;
  		//attribute vec3 normal;
      varying vec3 localPosition;
      varying vec4 vertexWorldPosition;
      varying vec3 vertexNormal;

      //===============================================================================
      float rand(vec2 co)
      {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      //===============================================================================
      // Returns accurate MOD when arguments are approximate integers.
      float modI(float a,float b) 
      {
          float m=a-floor((a+0.5)/b)*b;
          return floor(m+0.5);
      }

      //==============================================================================
      vec3 hsv2rgb(vec3 c)
      {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      } //*/
  

      //===============================================================================
      void main() 
      {
        float centerDistance = distance( localPosition, vec3( 0.0, 0.0, 0.0 ) );
        const float TRANSPARENT_RING_RADIUS = 0.3;
        if( centerDistance < TRANSPARENT_RING_RADIUS )
        {
          // DRAW TRANSPARENT CD CENTER RING
          gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.3 );
        }
        else //*/
        {
          // CALCULATIONS          
          vec3 worldPosition = vertexWorldPosition.xyz;
          float lightDistance = distance( worldPosition, lightPosition );
          float adjustedCenterDistance = mod( lightDistance*15.0, 5.0 ) * 0.1 - 0.7;
          float cdFoilAlphaValue = 1.0;

          // NEW CALCULATIONS
          vec3 lightDirection = lightPosition - vertexWorldPosition.xyz;
          vec3 clampNormal = normalize( vertexNormal );
          //vec3 lightDirection = p3d_LightSource[i].position.xyz - vertexPosition.xyz * p3d_LightSource[i].position.w;


          vec3 clampNormalIn = normalize( clampNormal - (normalize(localPosition)*0.4 + localPosition * 0.2) );
          vec3 clampNormalOut = normalize( clampNormal + (normalize(localPosition)*0.4 + localPosition * 0.0) );
          
          //vec3 clampNormalIn = normalize( clampNormal - normalize(localPosition) * 0.6 );
          //vec3 clampNormalOut = normalize( clampNormal + normalize(localPosition) * 0.6 );

          vec3 unitLightDirection = normalize( lightDirection );
          vec3 eyeDirection       = normalize( cameraPosition.xyz - vertexWorldPosition.xyz ); // I DON'T THINK THIS IS CORRECT, NEED THE CAMERA POSITION
          vec3 reflectedDirectionIn  = normalize( -reflect( unitLightDirection, clampNormalIn )  );
          vec3 reflectedDirectionOut = normalize( -reflect( unitLightDirection, clampNormalOut )  );

          float specularIntensityIn = max( dot( reflectedDirectionIn, eyeDirection ), 0.0 );
          float adjustedSpecularIn = clamp( pow( specularIntensityIn, 4.0 ), 0.0, 1.0 );

          float specularIntensityOut = max( dot( reflectedDirectionOut, eyeDirection ), 0.0 );
          float adjustedSpecularOut = clamp( pow( specularIntensityOut, 4.0 ), 0.0, 1.0 );

          float finalSpecular = adjustedSpecularIn + adjustedSpecularOut;
          
          vec3 finalColor = hsv2rgb( vec3( centerDistance*0.5 - 0.1, finalSpecular*0.3 + 0.05, finalSpecular*0.3 + 0.05 ) );
          //vec3 finalColor = hsv2rgb( vec3( centerDistance*0.5, finalSpecular*0.3, finalSpecular+0.1 ) );
          //vec3 finalGray = hsv2rgb( vec3( centerDistance*0.5, 0.2, finalSpecular+0.0 ) );
          //finalColor += 0.3;

          // DRAW CD REFLECTIVE FOIL 
          float noise = rand( localPosition.xy ) * 0.15 - 0.07;
          float i = mod( gl_FragCoord.x, 15.0 );
          //gl_FragColor = vec4( finalSpecular, finalSpecular, finalSpecular, cdFoilAlphaValue ); //*/
          gl_FragColor = vec4( finalColor, cdFoilAlphaValue ); //*/
          
          
          /*gl_FragColor = vec4( i/37.0+0.25 - noise + adjustedSpecularIn, 
                                i/42.0+0.14 - noise + adjustedSpecularIn, 
                                0.15 - noise + adjustedSpecularIn, cdFoilAlphaValue ); //*/
          /*gl_FragColor = vec4( i/37.0+0.25 - noise - adjustedCenterDistance * 0.5, 
                                i/42.0+0.14 - noise - adjustedCenterDistance, 
                                0.15 - noise - adjustedCenterDistance, cdFoilAlphaValue ); //*/
        }

      } 
      
             `
      //*/

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /*return `
      uniform vec3 cdPosition; 
      uniform vec3 lightPosition; 
      varying vec3 vUv;

      float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      //
       / Returns accurate MOD when arguments are approximate integers.
       //
      float modI(float a,float b) {
          float m=a-floor((a+0.5)/b)*b;
          return floor(m+0.5);
      }

      void main() {
        float distance = 0.3 - distance( vUv, cdPosition )*0.3;
        //float actualDistance = distance( vUv, cdPosition );
        float alphaValue = 1.0;
        if( distance > 0.2 )
        {
          gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.3 );
          //discard;
          //alphaValue = 0.2;
        }
        else
        {
          float noise = rand(vUv.xy)*0.15 - 0.07;
          float i = mod( gl_FragCoord.x, 15.0 );
          gl_FragColor = vec4( i/37.0+0.25 - noise - distance*0.5, 
                                i/42.0+0.14 - noise - distance, 
                                0.15 - noise - distance, alphaValue );
        }
        //gl_FragColor = vec4( i/35.0+0.28 - noise + cdPosition.x, i/45.0+0.18 - noise, 0.17 - noise, 0.0 );
        //gl_FragColor = vec4( i/35.0+0.28 - noise + cdPosition.x * 0.1, i/45.0+0.18 - noise, 0.17 - noise, 0.0 );
      }        ` //*/
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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





