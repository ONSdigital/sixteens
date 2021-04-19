var mainFeatureExpand = $(".js-main-expanded");
var mainFeatureExpandButton = $(".js-main-feature-expand-button");
var mainFeatureCompressButton = $(".js-main-feature-compress-button");

document.addEventListener("DOMContentLoaded", hideFewerButton());

function hideFewerButton() {
    mainFeatureCompressButton.addClass("hidden");
    mainFeatureExpand.addClass("hidden");
}

$(function () {
    $(mainFeatureExpandButton).click(function (e) {
        mainFeatureExpand.removeClass("hidden");
        mainFeatureCompressButton.removeClass('hidden');
        mainFeatureExpandButton.addClass('hidden');
    });
});

$(function () {
    $(mainFeatureCompressButton).click(function (e) {
        mainFeatureExpand.addClass("hidden");
        mainFeatureCompressButton.addClass('hidden');
        mainFeatureExpandButton.removeClass('hidden');
    });
});