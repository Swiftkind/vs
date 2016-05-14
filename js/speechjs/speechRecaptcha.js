var reCaptchaSdk = {
    sitekey: '6LemihkTAAAAAKBFxFpiFlrhOTkB6HpaCJQDRc7b',
    theme: 'light', //dark,light
    size: 'normal', //compact, normal
    type: 'image',   //audio image

    reCaptchaHtml: '<div class="g-recaptcha" id="ReCaptcha"></div><script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>',
    isDisplayCaptcha: false,
    g_Recaptcha_Response: null,
    reCaptcha: null,
    isNeedVerify: false,
    currentDemoTypeClass:'',

    PassReCaptchaCallback: function (response) {
        reCaptchaSdk.g_Recaptcha_Response = grecaptcha.getResponse(reCaptchaSdk.reCaptcha);
        $(".googleReCaptcha").empty();
        $('.maskLayer').hide();
        var removeRecaptchaStatus = reCaptchaSdk.PassReCaptchaCallbackDict[currentDemoTypeClass];
        if (removeRecaptchaStatus != null) {
            removeRecaptchaStatus();
        }
      
    },
    DataExpiredCallback: function(){
        grecaptcha.reset(reCaptchaSdk.reCaptcha);
    },
    ProcessReCaptchaStateCode: function (e,demoTypeClass) {
        if (e.responseText == "Throttled" || e == "Throttled" ||e.responseText == "Captcha Fail" || e == "Captcha Fail") {
            if ($(".g-recaptcha").length <= 0) {
                $('.maskLayer').show();
                if (typeof (demoTypeClass) == 'undefined') {
                    $('.googleReCaptcha').append(reCaptchaSdk.reCaptchaHtml);
                }
                else {
                    $('.' + demoTypeClass + ' .googleReCaptcha').append(reCaptchaSdk.reCaptchaHtml);
                }
            }
        }
        reCaptchaSdk.isDisplayCaptcha = true;
        currentDemoTypeClass = demoTypeClass;
    },

    RemoveReCaptcha: function () {
        reCaptchaSdk.isNeedVerify = false;
    },

    PassReCaptchaCallbackDict:{
        'reCaptcha-WebLM-demo': function () { $('.reCaptcha-WebLM-demo #bestCandidate').html(''); $('.reCaptcha-WebLM-demo #jsonOutput').html(''); },
        //'reCaptcha-VisionThumbnail-demo': function () { visionsdk.handleError(1, ''); },
        'reCaptcha-VisionThumbnail-demo': function () { },
        'reCaptcha-VisionOcr-demo': function () { $(".reCaptcha-VisionOcr-demo #ocrTextTab .code ").html(''); },
        'reCaptcha-VisionCelebrity-demo': function () { $(".reCaptcha-VisionCelebrity-demo .Celebrity-demo-right .code ").html(''); },
        //'reCaptcha-VisionAnalysis-demo': function () { visionsdk.handleError(0, ''); },
        'reCaptcha-VisionAnalysis-demo': function () {  },
        'reCaptcha-SpellCheck-demo': function () { $('.reCaptcha-SpellCheck-demo #correctedQuery').html(''); $('.reCaptcha-SpellCheck-demo #jsonOutput').html(''); },
        'reCaptcha-Speech2Text-demo': function () { $('.reCaptcha-Speech2Text-demo #messages').text(''); },
        'reCaptcha-Text2Speech-demo': function () { $(".reCaptcha-Text2Speech-demo #TextBoxSpeakText").val(''); },
        'reCaptcha-SpeakerVerification-demo': function () { $(".reCaptcha-SpeakerVerification-demo div[data-name='NotificationText']").text(''); },
        'reCaptcha-SpeakerIdentification-demo': function () { $(".reCaptcha-SpeakerIdentification-demo .detection-demo-codes .code").html(''); },
        'reCaptcha-FaceVerification-demo': function () { $('.reCaptcha-FaceVerification-demo .verification-demo-codes .code').html(''); },
        'reCaptcha-FaceDetection-demo': function () { $('.reCaptcha-FaceDetection-demo .detection-demo-codes .code').html(''); },
        'reCaptcha-EntityLinking-demo': function () { $('.reCaptcha-EntityLinking-demo #highlightContent').html(''); $('.reCaptcha-EntityLinking-demo #jsonOutput').html(''); },
        'reCaptcha-Emotion-demo': function () { $('.reCaptcha-Emotion-demo .detection-demo-codes .code').html(''); },
    }
}
var onloadCallback = function () {
    if (!reCaptchaSdk.isNeedVerify) {
        reCaptchaSdk.reCaptcha = grecaptcha.render('ReCaptcha', {
            'sitekey': reCaptchaSdk.sitekey,
            'theme': reCaptchaSdk.theme,
            'size': reCaptchaSdk.size,
            'type': reCaptchaSdk.type,
            'callback': reCaptchaSdk.PassReCaptchaCallback,
            'expired-callback': reCaptchaSdk.DataExpiredCallback
        });
        reCaptchaSdk.isNeedVerify = true;
    }
};
$(function () {
    $('#modal-wrapper').reCaptcha();
})
;(function ($) {
    $.fn.extend({
        "reCaptcha": function () {
            if ($(this).length<=0) {
                return;
            }
            $(this).css('position', 'relative');
            $(this).append('<div class="maskLayer">  <div class="googleReCaptcha-normal googleReCaptcha"> </div></div><div style="clear:both"></div>');
        }
    });
})(jQuery);
