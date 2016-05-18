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
        return true;
    }
    else {
        stopWebSocket();
    }
}

// Stop Web socket 
function stopWebSocket() {
    console.log(websocket);
    if(websocket) {
        websocket.onmessage = function() {};
        websocket.onerror = function() {};
        if(websocket.onerror()) {
            console.log("WS Error");
        }
        websocket.onclose = function() {};
        websocket.close();
    }
}

// Microphone start/stop record trigger
function micOnClick() {    
    this.startRecording();
    getConvertedSpeechToText();
}

// Get converted speech text and stop recording after x no. of seconds
function getConvertedSpeechToText() {

    // Clear currently stored text from voice-output selector
    $("#voice-output").empty();
    textDisplay = "";

    $("#speak-message").text("Loading...");
        
    setInterval(function() {
        var micListening = $("#mic-btn").hasClass('listening');
        if(micListening == true) {
            setTimeout(function() {
                var voice_input = document.getElementById("voice-output").innerHTML;

                if(voice_input != null && voice_input != '' && voice_input != ' ') {

                    stopRecording();
                    setTimeout(function() {            
                        // Get speech content after recording and copy it to HTML input
                        document.getElementById("search-engine-form-input").value = voice_input;
                        $('#voice-search-modal').removeClass('open fadeIn');
                    }, 3500);
                }
                else {
                    $("#speak-message").text("Didn't get that. Let's try again.");
                    setTimeout(function() {
                        stopRecording();
                        setTimeout(function() {
                            getConvertedSpeechToText();
                        }, 3500);
                    }, 3500);
                }
            }, 8000);
        }
    }, 3500);
}