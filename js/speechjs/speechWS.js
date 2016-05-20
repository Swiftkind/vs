var websocket = null;
var textDisplay = "";

function startWebSocketForMic() {
    /// TODO: Hack to get around restrictions of Akamai on websocket.
    var hostString = "cog-web-wu.azurewebsites.net";
    if (window.location.port != "80" && window.location.port != "") {
        hostString = hostString.concat(":").concat(window.location.port);
    }
    var uri = 'wss://' + hostString + '/cognitive-services' + '/ws/speechtotextdemo?language=' + 'en-US'
            + '&g_Recaptcha_Response=' + reCaptchaSdk.g_Recaptcha_Response + '&isNeedVerify=' + reCaptchaSdk.isNeedVerify;
    websocket = getWebSocket(uri);

    websocket.onopen = function () {
        audioRecorder.sendHeader(websocket);
        audioRecorder.record(websocket);

        console.log("Start Recording...");
        console.log(websocket);

        $("#mic-btn").addClass("listening");
        $("#speak-message").text("Speak Now...");
    };
}

// Check if WebSockets is available and browser-compatible
function webSocketSupported() {
    return "WebSocket" in window;
}

function getWebSocket(uri) {
    if(webSocketSupported() == true) {

        // Establish new WebSocket connection
        websocket = new WebSocket(uri);

        return websocket;
    } else {
        // Send alert to user if WebSocket is not available in user's current browser version
        alert("Hello user! Some functionalities of the site need specific versions of browsers. Its highly recommended you update your browser version.");
    }
}
