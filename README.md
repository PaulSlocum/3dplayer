# 3dplayer

A Javascript audio player with a stylized 3D compact disc player interface that includes visual effects and audio effects.  It uses WebGL and Web Audio and works in all modern browsers.  The project is fully working but the API and details are still being finalized.

[>> LINK TO WORKING PROJECT DEMO PAGE <<](https://paulslocum.github.io/3dplayer/)

### Features: 
 - simple interface to load an album by including a list of MP3 files and CD image in the script call 
 - CD player sound effects and animated disc drawer
 - simulated CD player button interface with play, pause, stop, skip forward, skip back, repeat, etc.
 - realtime reverb and echo room effects
 - optional background and particle system visualizer effects
 
### Technical features:
 - custom optical disc GLSL shader
 - Web Audio sound library with effects processor, background pre-loading, and automatic memory management
 - Blender CD player 3D model that can be easily customized

### Screenshot: 

![screenshot](https://paulslocum.github.io/3dplayer/notes/screenshot.jpg)

### Usage

To load the player with an album, include the list of tracks in the script tag parameters.  
The final version will also have a number of other parameters that can be configured.

```
<script type="module" src="3dplayer/3dplayer.js"
track1="music/expansion.mp3" 
track2="music/knight_rider.mp3" 
track3="music/one_person_might_not.mp3"
track4="music/okay_shorter_fade.mp3"
track5="music/trian.mp3"></script>
```

License forthcoming, probably MIT.
