// P3dUIRoom.js
//
// ENVIROMENT CUBE WITH SHADERS AND ANIMATIONS.
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { roomVertexShaders, roomFragmentShaders } from "./P3dUIRoomShaders.js";
//-----------------------------------------------------------------------------------



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dRoom extends THREE.Mesh
{


  ///////////////////////////////////////////////////////////////////////
  constructor()
  {
    // ROOM CUBE
    //var geometry = new THREE.BoxGeometry( -70, -70, -70 ); // <-- ALTERNATE SIZE (DEBUG)
    let geometry = new THREE.BoxGeometry( -80, -40, -40 ); // <----------- CORRECT SIZE
    super( geometry, null );

    this.roomUniforms = {
        colorA: {type: "vec3", value: new THREE.Color(0x060607)},
        colorB: {type: "vec3", value: new THREE.Color(0x0A0B0A)},
        colorC: {type: "vec3", value: new THREE.Color(0x0A0B0A)}
    };

		this.numberOfShaders = roomFragmentShaders.length;
		this.roomMaterials = [];

		for( let i=0; i<this.numberOfShaders; i++ )
		{
			this.roomMaterials[i] = new THREE.ShaderMaterial({
      uniforms: this.roomUniforms,
      fragmentShader: roomFragmentShaders[i],
      vertexShader: roomVertexShaders[i],
    });
		}

    /*let roomMaterial =  new THREE.ShaderMaterial({
      uniforms: roomUniforms,
      fragmentShader: roomFragmentShaders[1],
      vertexShader: roomVertexShaders[0],
    }); //*/

    //this.material = this.roomMaterials[2];

    this.shaderMode = 0;
    this.setShaderMode( 3 );

    this.rotation.x = 3.2;
    this.rotation.y = 2;

    this.playing = false;
    this.backgroundSpinRate = 0.0;

  }



  ///////////////////////////////////////////////////////////////////////
  update()
  {
    // ROTATE ROOM CUBE...
    this.backgroundSpinRate += 0.00001; // <------------- ORIGINAL
    if( this.backgroundSpinRate > 0.04 )
      this.backgroundSpinRate = 0.04;
    if( this.playing == false )
    {
      this.backgroundSpinRate -= 0.0001; // <-- SLOW SPIN RATE WHEN NOT PLAYING
      if( this.backgroundSpinRate < 0.0002 )
        this.backgroundSpinRate = 0.0002;
    }

    this.rotation.x += this.backgroundSpinRate;
    this.rotation.y += this.backgroundSpinRate;
  }


	/////////////////////////////////////////////////////////////////////////////
	play()
	{
		this.playing = true;
	}

	////////////////////////////////////////////////////////////////////////////
	pause()
	{
		this.playing = false;
	}


	///////////////////////////////////////////////////////////////////////////
	setShaderMode( shaderNumber )
	{
		if( this.shaderMode != shaderNumber  &&  shaderNumber < this.numberOfShaders )
		{
			this.material = this.roomMaterials[ shaderNumber ];
			this.shaderMode = shaderNumber;
			this.backgroundSpinRate *= 0.3; // REDUCE BACKGROUND SPIN RATE
		}
	}

}






	//*********************************************************************************
	// SHADER NOTES (CAN EVENTUALLY BE DELETED)
	//*********************************************************************************

  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
  /* DIFFUSE VERT SHADER
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
  /* ORIGINAL VERT SHADER
    void main()
    {
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  //*/
  //-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -


		// FRAG SHADERS

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


