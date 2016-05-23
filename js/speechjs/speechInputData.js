/**
 * Speech JS Integration
 */

var client;

// Oxford key
var oxfordKey = "d159e6db7be440e88267a657cc56322e";

// Apply long dictation mode for speech recognition
var longDictation = Microsoft.ProjectOxford.SpeechRecognition.SpeechRecognitionMode.longDictation;

// Charset Language/s
var en_US = "en-US";

// Get Oxford key from Microsoft Account
function getOxfordKey() {
    return oxfordKey;
}

// Set longDictation mode as default speech recognition approach
function setSpeechRecognitionMode() {
    return longDictation;
}

// Set default charset language
function getLanguage() {
    return en_US;
}

// Clear text for every speech recognition input
function clearText() {
    document.getElementById("voice-output").value = "";
}  

// Log Reporting
function logReporting(text) {
    document.getElementById("voice-output") += text;
    document.getElementById("search-engine-form-input") += text;
}

function startVoiceRecognitionInput() {
    
    var mode = setSpeechRecognitionMode();
    
    clearText();
    
    client = Microsoft.ProjectOxford.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
                mode,
                getLanguage(),
                getOxfordKey(),
                getOxfordKey());

    console.log("Info: " + client);

    client.startMicAndRecognition();

    // Set timeout to before ending speech recognition
    setTimeout(function() {
        client.endMicAndRecognition();
    }, 5000); 

    client.onPartialResponseReceived = function(response) {
        logReporting(response);
    }

    client.onFinalResponseReceived = function(response) {
        logReporting(JSON.stringify(response));
    }

    client.onIntentReceived = function (response) {
        logReporting(response);
    };
}

$(document).ready(function() {
    $("#mic-btn").click(function() {
        startVoiceRecognitionInput();
    });
});