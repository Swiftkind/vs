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

        var voice_input = document.getElementById("voice-output").innerHTML;
        
        // Debugging purposes
        console.log("Text Output: " + "'" + voice_input + "'");

        if(voice_input != null) {
            console.log(voice_input);
            // Get speech content after recording and copy it to HTML input
            document.getElementById("search-engine-form-input").value = voice_input;
            $('#voice-search-modal').removeClass('open fadeIn');
        }
        if(voice_input == null || voice_input == ' ' || voice_input == '') {
            $("#speak-message").text("Didn't get that. Let's try again.");
            setInterval(function() {
                micOnClick();
            }, 3000);
        }
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

        $("#speak-message").text("Loading...");
        
        setInterval(function() {
            var micListening = $("#mic-btn").hasClass('listening');
            if(micListening == true) {
                setTimeout(function() {
                    stopRecording();
                }, 8000);
            }
        }, 3500);
    }
}