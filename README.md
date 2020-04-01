# 3dplayer
### 3D WebGL mp3 player using THREE.js and Web Audio API.

In early development -- most of the buttons now work, but needs some adjustments for mobile.  Works on iPad.

[Link to working project demo page](https://paulslocum.github.io/3dplayer/)

### Planned features: 
 - load an "album" by specifying a list of MP3 files in the script call parameters
 - simulated compact disc player operation including play, pause, stop, track forward and back, fast forward, rewind, etc.
 - disc player sound effects and animated disc drawer
 - working treble and bass tone controls
 - realtime spectrum analyzer display
 - realtime enviromental visualizations that respond to playing music
 
![screenshot](https://paulslocum.github.io/3dplayer/docs/screenshot.jpg)

### Usage

To load the player with an album, include the list of tracks in the script tag parameters:

```
<script type="module" src="3dplayer/3dplayer.js"
track1="music/expansion.mp3" 
track2="music/knight_rider.mp3" 
track3="music/one_person_might_not.mp3"
track4="music/okay_shorter_fade.mp3"
track5="music/trian.mp3"></script>
```

License forthcoming, probably MIT.
