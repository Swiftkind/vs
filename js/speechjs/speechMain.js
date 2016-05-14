window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var audioRecorder = null;
var isRecording = false;
var audioSource = null;

if(AudioContext) {
    audioContext = new AudioContext();
}

// Checks if audio was recognized
function gotAudioStream(stream) {
    this.audioSource = stream;
    var inputPoint = this.audioContext.createGain();
    this.audioContext.createMediaStreamSource(this.audioSource).connect(inputPoint);
    this.audioRecorder = new Recorder(inputPoint);
    startWebSocketForMic();
    this.isRecording = true;
}

// Start recording if audio was recognized
function startRecording() {
    if(!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    }

    navigator.getUserMedia({
        "audio": true,
    }, gotAudioStream.bind(this), function(e) {
        window.alert("Microphone Access Was Rejected.");
    });
}

// Stop recording
function stopRecording() {
    if(this.isRecording) {
        this.isRecording = false;

        if(audioSource.stop) {
            audioSource.stop();
        }
        audioRecorder.stop();
        stopWebSocket();
        $("#mic-btn").removeClass("listening");
        $(".speak-message").text("Click Microphone to Begin.");
        
        // Get speech content after recording and copy it to HTML input
        var voice_input = document.getElementById("voice-output");
        document.getElementById("search-engine-form-input").value = voice_input.innerHTML;
    }
}

// Stop Web socket 
function stopWebSocket() {
    if(websocket) {
        websocket.onmessage = function() {};
        websocket.onerror = function() {};
        websocket.onclose = function() {};
        websocket.close();
    }
}

// Microphone start/stop record trigger
function micOnClick() {
    if(this.isRecording) {
        this.stopRecording();
    }
    else {
        this.startRecording();
        $(".speak-message").text("Recording Input...");
    }
}