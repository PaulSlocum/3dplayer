# 3dplayer
### 3D WebGL mp3 player using THREE.js and Web Audio API.

In early development -- all the buttons now work, but needs some adjustments for mobile 
and the visualizations are not yet complete.

[Link to working project demo page](https://paulslocum.github.io/3dplayer/)

### Planned features: 
 - load an album by specifying a list of MP3 files in the script call parameters
 - simulated CD player operation including play, pause, stop, track forward and back, fast forward, rewind, etc.
 - CD player sound effects and animated disc drawer
 - realtime reverb and echo room simulator effects
 - realtime spectrum analyzer display
 
![screenshot](https://paulslocum.github.io/3dplayer/docs/screenshot_20-04-23.png)

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
