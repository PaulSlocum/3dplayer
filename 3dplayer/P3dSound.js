

//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSound
{

  ///////////////////////////////////////////////////////////////////////
  constructor() 
  {
    console.log("---->SOUND CLASS CONSTRUCTOR");

    // Create an AudioContext instance for this sound
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Create a buffer for the incoming sound content
    var source = audioContext.createBufferSource();
    // Create the XHR which will grab the audio contents
    var request = new XMLHttpRequest();
    // Set the audio file src here
    request.open('GET', '3dplayer/sounds/cdDiscIn.wav', true);
    // Setting the responseType to arraybuffer sets up the audio decoding
    request.responseType = 'arraybuffer';
    request.onload = function() {
      // Decode the audio once the require is complete
      audioContext.decodeAudioData(request.response, function(buffer) {
        source.buffer = buffer;
        // Connect the audio to source (multiple audio buffers can be connected!)
        source.connect(audioContext.destination);
        // Simple setting for the buffer
        source.loop = false;
        // Play the sound!
        source.start(0);
      }, function(e) {
        console.log('Audio error! ', e);
      });
    }
    // Send the request which kicks off 
    request.send();

  }

  
}
