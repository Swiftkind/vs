var ua = navigator.userAgent.toLowerCase();
var check = function(r) {
    return r.test(ua);
};

// Browser Compatibility Checking
var isOpera = check(/opera/);
var isChrome = check(/chrome/);
var isFF = check(/firefox/);
var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;
var isIE = !isOpera && (isIE11 || check(/msie/));
var canWork = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

$(document).ready(function($) {

    // Trigger voice search on click
    $('#mic-btn').click(function() {
        micOnClick();
    });
});

function startVoiceSearch() {
    stopRecording();
    $("#voice-output").empty();
    textDisplay = "";
}