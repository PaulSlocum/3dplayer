//
// P3dUIRoomShaders.js
//
// CONTAINS ARRAYS OF VERT AND FRAG SHADERS USED BY ROOM CLASS FOR THE BACKGROUND.
//
/////////////////////////////////////////////////////////////////////////////////////



//  ~    -      ~    -      ~    -      ~    -      ~    -      ~    -      ~    -



export const roomVertexShaders = [
	// VERT SHADER 0
	`
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// VERT SHADER 1
  `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// VERT SHADER 2
  `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// VERT SHADER 3
  `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// VERT SHADER 4
  `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// VERT SHADER 5
  `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// VERT SHADER 6
  `
  varying vec3 vUv;

  void main() {
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
  }
  `
];




//  ~    -      ~    -      ~    -      ~    -      ~    -      ~    -      ~    -




export const roomFragmentShaders = [
	// FRAG SHADER 0
	`
	uniform vec3 colorA;
	uniform vec3 colorB;
	varying vec3 vUv;

	float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	void main() {
		float i = mod( gl_FragCoord.x + gl_FragCoord.y, 30.0 );
		float noise = rand(vUv.xy)*0.2 - 0.1;
		gl_FragColor = vec4(mix(colorA, colorB, vUv.y ), 1.0);
		gl_FragColor = vec4( gl_FragColor.x * (i/15.0) - noise, gl_FragColor.y * (i/25.0) - noise, gl_FragColor.z * (i/20.0) - noise*2.0, 1.0 );
		//gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 ); // DEBUG!
	}
	`
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// FRAG SHADER 1
	`
	uniform vec3 colorA;
	uniform vec3 colorB;
	varying vec3 vUv;

	float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	void main() {
		float i = mod( gl_FragCoord.x, 60.0 );
		float noise = rand(vUv.xy)*0.2 - 0.1;
		gl_FragColor = vec4(mix(colorA, colorB, vUv.y ), 1.0);
		gl_FragColor = vec4( gl_FragColor.x * (i/15.0) - noise, gl_FragColor.y * (i/25.0) - noise, gl_FragColor.z * (i/20.0) - noise*2.0, 1.0 );
		//gl_FragColor = vec4( 0.0, 1.0, 0.0, 1.0 ); // DEBUG!
	}
	`
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// FRAG SHADER 2
	`
	uniform vec3 colorA;
	uniform vec3 colorB;
	varying vec3 vUv;

	float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	void main() {
		float i = mod( gl_FragCoord.x - gl_FragCoord.y, 15.0 );
		float noise = rand(vUv.xy)*0.2 - 0.1;
		gl_FragColor = vec4(mix(colorA, colorB, vUv.y ), 1.0);
		gl_FragColor = vec4( gl_FragColor.x * (i/15.0) - noise, gl_FragColor.y * (i/25.0) - noise, gl_FragColor.z * (i/20.0) - noise*2.0, 1.0 );
		//gl_FragColor = vec4( 0.0, 0.0, 1.0, 1.0 ); // DEBUG!
	}
	`
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// FRAG SHADER 3
	`
	uniform vec3 colorA;
	uniform vec3 colorB;
	varying vec3 vUv;

	float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	void main() {
		float i = mod( gl_FragCoord.y, 60.0 );
		float noise = rand(vUv.xy)*0.2 - 0.1;
		gl_FragColor = vec4(mix(colorA, colorB, vUv.y ), 1.0);
		gl_FragColor = vec4( gl_FragColor.x * (i/15.0) - noise, gl_FragColor.y * (i/25.0) - noise, gl_FragColor.z * (i/20.0) - noise*2.0, 1.0 );
		//gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 ); // DEBUG!
	}
	`
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// FRAG SHADER 4
	`
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
	}
	`
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// FRAG SHADER 5
	`
	uniform vec3 colorA;
	uniform vec3 colorB;
	varying vec3 vUv;

	float rand(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	void main() {
		float i = mod( gl_FragCoord.x - gl_FragCoord.y, 90.0 );
		float noise = rand(vUv.xy)*0.2 - 0.1;
		gl_FragColor = vec4(mix(colorA, colorB, vUv.y ), 1.0);
		gl_FragColor = vec4( gl_FragColor.x * (i/15.0) - noise, gl_FragColor.y * (i/25.0) - noise, gl_FragColor.z * (i/20.0) - noise*2.0, 1.0 );
		//gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 ); // DEBUG!
	}
	`
  , // --   ~~   --   ~~   --   ~~   --   ~~   --   ~~   --   ~~
	// FRAG SHADER 6
	`
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
		gl_FragColor = vec4( 0.025, 0.02, 0.02, 1.0 ); // DEBUG!
	}
	`
];





