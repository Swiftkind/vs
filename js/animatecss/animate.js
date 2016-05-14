/**
 * Reveal Search Input
 */
$(document).ready(function() {
    $('#btn-voice-search').click(function() {
        $('#voice-search-modal').addClass('open animated fadeIn');
    });
    $('#voice-search-close a').click(function() {
        $('#voice-search-modal').removeClass('open animated fadeIn');
    });
});