var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    $('#start_icon').css({"color":"#0000ff"});
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
    stopRecording(this);
    $('#start_icon').css({"color":"#000000"});
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.value = linebreak(final_transcript);
  };
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.start();
  startRecording(this)
  ignore_onend = false;
  final_span.innerHTML = '';
  start_timestamp = event.timeStamp;
}

// Recorder code
  var audio_context;
  var recorder;
  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    
    recorder = new Recorder(input);
  }
  function startRecording(button) {
    recorder && recorder.record();
  }
  function stopRecording(button) {
    recorder && recorder.stop();
    
    // create WAV download link using audio data blob
    createDownloadLink();
    
    recorder.clear();
  }
  function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
      var fd = new FormData();
      fd.append('filename',name);
      fd.append('data',blob);
      $.ajax({
        type: "POST",
        url: 'http://127.0.0.1:5000/upload',
        data: fd,
        processData: false,
        contentType: false
      });
    });
  }
  window.onload = function init() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      
      audio_context = new AudioContext;
    } catch (e) {
      alert('No web audio support in this browser!');
    }
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {

    });
  };