// js-embed-code-copy

// inspiration of using live region for accessibility taken from:
// https://inclusive-components.design/tooltips-toggletips/

$(function() {

    var embedButtons = document.getElementsByClassName('js-embed-code-copy');

    if (!embedButtons.length) {
        return;
    }

    for (var i = 0; i < embedButtons.length; i++) {
        embedButtons[i].addEventListener("click", function(){
            var id = this.getAttribute('data-id');
            handleEmbedCopyClick(this)
        }, false);
    }

    function handleEmbedCopyClick(button) {
        var id = button.getAttribute('data-id');
        var embedCodeFieldId = "embed-" + id;
        copyEmbedCode(embedCodeFieldId);
        showCopySuccess(button)
    }

    function copyEmbedCode(id) {
        var embedCodeText = document.getElementById(id);
        embedCodeText.select();
        document.execCommand("Copy");
    }

    function showCopySuccess(button) {
        var liveRegion = button.nextElementSibling;
        liveRegion.innerHTML = '';
        liveRegion.innerHTML = '<span class="embed-code__success-message">Copied to clipboard</span>';
        setTimeout(function(){ hideCopySuccess(liveRegion) }, 5000);
    }

    function hideCopySuccess(liveRegion) {
        liveRegion.innerHTML = '';
    }

});