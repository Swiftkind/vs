var final_transcript = '';
var recognizing = false;
var ignore_onend;
var audio_key;
var csrf_token = $('meta[name="csrf-token"]').attr('content');
var two_line = /\n\n/g;
var one_line = /\n/g;
var first_char = /\S/;
var audio_context;
var recorder;
var recognition = new webkitSpeechRecognition();

recognition.continuous = false;
recognition.interimResults = true;

// Will trigger when user click the mic icon
function startButton(event) {
  $("#speak-message").text("Loading...");
  $("#speak-message").show();
  $('#mic-btn').show();
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.start();
  startRecording(this)
  ignore_onend = false;
}

// Triggered by recognition.start()
recognition.onstart = function() {
  recognizing = true;
};

// This will be called after the app doesn't hear any words anymore or the recognition.stop()
recognition.onend = function() {
  recognizing = false;
  if (ignore_onend) {
    return;
  }
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
    var range = document.createRange();
    range.selectNode(document.getElementById('voice_output'));
    window.getSelection().addRange(range);
  }
  stopRecording(this);
  // If the app didn't catch any words
  if (voice_output.text == null || voice_output.text == '') {
    $("#speak-message").show();
    $('#speak-message').text("Try again.");
  } else {
    submitToGoogle();
  }
  $('#voice_output').text(voice_output.text);
};

// This will display the words
recognition.onresult = function(event) {
  var interim_transcript = '';
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
    } else {
      interim_transcript += event.results[i][0].transcript;
    }
  }
  $("#speak-message").hide();
  final_transcript = capitalize(final_transcript);
  voice_output.text = linebreak(final_transcript);
  $('#voice_output').text(interim_transcript);
};

function submitToGoogle() {
  // Submit keywords to google
  var query = voice_output.text;
  var url ='https://www.googleapis.com/customsearch/v1?key='+GOOGLE_API_KEY+'&cx=017576662512468239146:omuauf_lfve&q='+query+'';
  localStorage.setItem('queryset', url);
  localStorage.setItem('voice_text', query);

  $.get(url, function(data){
    var data = data.items; // Contains the data from google
  });
}

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

// Recorder code
function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  
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
// Create a download link to save the audio file
function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
    uploadToS3(blob);
  });
}
// Upload to s3
function uploadToS3(blob) {
  var fd = new FormData();
  fd.append('filename',name);
  fd.append('data',blob);
  fd.append('csrf_token',csrf_token);
  $.ajax({
    type: "POST",
    url: window.location.origin + '/upload',
    data: fd,
    processData: false,
    contentType: false
  }).done(function(data){
    uploadToDatabase(data);
    window.location.href = window.location.origin + '/results';
  }).fail(function(error){
    console.log(error);
  });
}
// Upload to database
function uploadToDatabase(data) {
  audio_key = data.key;

  var postUrl = window.location.origin + '/queries';
  var voice = voice_output.text || '';
  // Upload the keyword and key of the audio file to database
  $.post(postUrl, {'query': voice, 'key':audio_key, 'csrf_token':csrf_token}).done(function(data){

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
    alert('No live audio input!');
  });
};
