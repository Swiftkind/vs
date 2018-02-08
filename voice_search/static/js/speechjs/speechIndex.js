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

$(document).ready(function() {
    // Browser Compatibility Additions
    if(canWork || (isChrome && isFF && isOpera)) {
        $('.warnInfo').hide();
    } else {
        $('#btn-voice-search').hide();
        $('#search-engine-form-input').hide();
        $('.warnInfo').show();
    }

    // Trigger voice search on click
    $('#btn-voice-search').click(function() {
        // AnimateCSS modal animation
        $('#voice-search-modal').addClass('open animated fadeIn');

        // Execute recording process
        startButton(this);
    });
});

function startVoiceSearch() {
    $("#voice-output").empty();
    textDisplay = "";
}