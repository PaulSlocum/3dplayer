//
// P3dUIConpactDisc.js
//
// CONTAINS COMPACT DISC SHADER CODE.
//
/////////////////////////////////////////////////////////////////////////////////



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dCDShaders
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
      uniform sampler2D cdTexture;

  		//attribute vec3 normal;
      varying vec3 localPosition;
      varying vec4 vertexWorldPosition;
      varying vec3 vertexNormal;

      //===============================================================================
      // NOT CURRENTLY USED
      /*float rand(vec2 co)
      {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      } //*/

      //===============================================================================
      // NOT CURRENTLY USED
      // Returns accurate MOD when arguments are approximate integers.
      /*float modI(float a,float b)
      {
          float m=a-floor((a+0.5)/b)*b;
          return floor(m+0.5);
      } //*/

      //==============================================================================
      vec3 hsv2rgb(vec3 c)
      {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      } //*/


      //==============================================================================
      float calculateCdColor( vec3 clampNormal, vec3 normLocalPosition,
                              vec3 clampLightDirection, vec3 eyeDirection, float ridgePitch )
      {
        vec3 clampNormalIn = normalize( clampNormal - (normLocalPosition * ridgePitch) );
        vec3 reflectedDirectionIn  = normalize( -reflect( clampLightDirection, clampNormalIn )  );
        float specularIntensityIn = max( dot( reflectedDirectionIn, eyeDirection ), 0.0 );
        float adjustedSpecularIn = clamp( pow( specularIntensityIn, 4.0 ), 0.0, 1.0 );
        return adjustedSpecularIn;
      } //*/

      //===============================================================================
      void main()
      {
        float centerDistance = distance( localPosition, vec3( 0.0, 0.0, 0.0 ) );
        const float TRANSPARENT_RING_RADIUS = 0.3;
        if( centerDistance < TRANSPARENT_RING_RADIUS )
        {
          // DRAW TRANSPARENT CD CENTER RING
          gl_FragColor = vec4( 0.2, 0.2, 0.2, 0.25 );
        }
        else //*/
        {
          // INTIAL CALCULATIONS
          vec3 worldPosition = vertexWorldPosition.xyz;
          float lightDistance = distance( worldPosition, lightPosition );
          float cdFoilAlphaValue = 1.0;
          //float patternedCenterDistance = mod( lightDistance*15.0, 5.0 ) * 0.1 - 0.7; // DEBUG - PROBABLY NO LONGER NEEDED

          // NEW LIGHT CALCULATIONS
          vec3 lightDirection = lightPosition - vertexWorldPosition.xyz; // <---------
          //vec3 lightDirection = lightPosition; // <---------
          vec3 clampNormal = normalize( vertexNormal );
          vec3 clampLightDirection = normalize( lightDirection );
          vec3 eyeDirection       = normalize( cameraPosition.xyz - vertexWorldPosition.xyz );
          vec3 normLocalPosition = normalize(localPosition);

          // CALCULATE SPECULAR AMOUNT FROM DISK RIDGES...
          float adjustedSpecularIn = calculateCdColor( clampNormal, normLocalPosition, clampLightDirection, eyeDirection, 0.3 );
          float adjustedSpecularOut = calculateCdColor( clampNormal, normLocalPosition, clampLightDirection, eyeDirection, -0.3 );

          // CALCULATE RAINBOW COLOR FOR SPECULAR...
          float finalSpecular = adjustedSpecularIn + adjustedSpecularOut;
          vec3 finalColor = hsv2rgb( vec3( centerDistance*0.5 - 0.1, finalSpecular*0.3 + 0.05, finalSpecular*0.3 + 0.05 ) );

          // CD FOIL SLIGHTLY DARKENS RINGS...
          if( centerDistance > 0.91  ||  centerDistance < 0.34 )
            finalColor = finalColor * 0.92;

          // SET FINAL COLOR
          vec2 mapPosition = localPosition.xz* 0.5 + 0.5;
          mapPosition.y = localPosition.z * -0.5 + 0.5;
          //gl_FragColor = texture2D( cdTexture, localPosition.xz );
          vec4 textureColor = texture2D( cdTexture, mapPosition );
          // SUBTLE CD FOIL RING TEXTURE...
          if( centerDistance > 0.94  ||  centerDistance < 0.34 )
            textureColor.a = 0.0;


          gl_FragColor = mix( vec4(finalColor,1.0), vec4( textureColor.xyz, 1.0), textureColor.a );
          //gl_FragColor = vec4( finalColor, 1.0 );
          //gl_FragColor = textureColor;


          //gl_FragColor = texture2D( cdTexture, localPosition.xy ) * finalColor;

          // OLD VERSIONS...
          //float noise = rand( localPosition.xy ) * 0.15 - 0.07;
          //float i = mod( gl_FragCoord.x, 15.0 );
          //gl_FragColor = vec4( finalSpecular, finalSpecular, finalSpecular, cdFoilAlphaValue ); //*/
          /*gl_FragColor = vec4( i/37.0+0.25 - noise + adjustedSpecularIn,
                                i/42.0+0.14 - noise + adjustedSpecularIn,
                                0.15 - noise + adjustedSpecularIn, cdFoilAlphaValue ); //*/
          /*gl_FragColor = vec4( i/37.0+0.25 - noise - patternedCenterDistance * 0.5,
                                i/42.0+0.14 - noise - patternedCenterDistance,
                                0.15 - noise - patternedCenterDistance, cdFoilAlphaValue ); //*/
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





}





