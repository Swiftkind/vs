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
            audioRecorder.stop();
        }

        stopWebSocket();

        setTimeout(function() {
            $("#mic-btn").removeClass("listening");
        }, 3500);
    } 
}

// Stop Web socket 
function stopWebSocket() {
    if(websocket) {
        websocket.onmessage = function() {};
        websocket.onerror = function() {};
        window.onbeforeunload = function() {};
    }
}

// Microphone start/stop record trigger
function micOnClick() { 
    $("#speak-message").text("Loading...");  

    // Start recording
    this.startRecording();
    
    setTimeout(function() {

        // Capture text/s then add them to HTML input
        getConvertedSpeechToText(); 
    }, 12000);
}

// Get converted speech text and stop recording after x no. of seconds
function getConvertedSpeechToText() {
    var micListening = $("#mic-btn").hasClass('listening');
    var voice_input = document.getElementById("voice-output").innerHTML;

    if(voice_input != null && voice_input != '' && voice_input != ' ') {       
        setTimeout(function() {
            // Get speech content after recording and copy it to HTML input
            document.getElementById("search-engine-form-input").value = voice_input;
            $('#voice-search-modal').removeClass('open animated fadeIn');
        }, 3500);

        // Stop recording to give way for short delay to register voice text
        stopRecording();
    }
    else {
        setTimeout(function() {
            $("#speak-message").text("Trying again.");  

            setTimeout(function() {
                micOnClick();
            }, 3500);          
        }, 3500);

        stopRecording();
    }   
}