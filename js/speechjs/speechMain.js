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

        $("#mic-btn").removeClass("listening");
        
        console.log("Stop Recording...");
        console.log(websocket);
    } 
}

// Stop Web socket 
function stopWebSocket() {
    if(websocket) {
        websocket.onmessage = function() {
            var data = event.data.toString();
            if (data == null || data.length <= 0) {
                return;
            }
            else if (data == "Throttled" || data == "Captcha Fail") {
                $('#voice-output').text(data);
                reCaptchaSdk.ProcessReCaptchaStateCode(data, 'reCaptcha-Speech2Text-demo');
                stopSounds();
                return;
            }
            else {
                reCaptchaSdk.RemoveReCaptcha();
            }
            if (data == null || data.length <= 0) {
                return;
            }

            var ch = data.charAt(0);
            var message = data.substring(1);
            if (ch == 'e') {
                stopRecording();
            }
            else {
                var text = textDisplay + message;
                if (ch == 'f') {
                    textDisplay = text + " ";
                }

                $('#voice-output').text(text);
                console.log(text);
            }
        };
        websocket.onerror = function(event) {
            console.log("WebSocket Error: " + event);
            websocket.close();
            stopRecording();
        };
        window.onbeforeunload = function() {
            websocket.onclose = function() {
                console.log("Closing WebSocket Connection..");
                websocket.close();
            };
        };
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
    }, 8000);
}

// Get converted speech text and stop recording after x no. of seconds
function getConvertedSpeechToText() {
    var micListening = $("#mic-btn").hasClass('listening');
    var voice_input = document.getElementById("voice-output").innerHTML;

    if(voice_input != null && voice_input != '' && voice_input != ' ') {       

        // Get speech content after recording and copy it to HTML input
        document.getElementById("search-engine-form-input").value = voice_input;
        $('#voice-search-modal').removeClass('open animated fadeIn');

        // Stop recording to give way for short delay to register voice text
        stopRecording();
    }
    else {
        stopRecording();

        setTimeout(function() {
            $("#speak-message").text("Trying again.");            
            micOnClick();
        }, 1500);
    }   
}