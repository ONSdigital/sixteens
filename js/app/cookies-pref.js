$(function () {
    if ($(".cookies-no-js").length > 0) {
        $(".cookies-no-js").addClass('hidden');
    }
    if ($(".cookies-js").length > 0) {
            $(".cookies-js").removeClass('hidden');
    }
});


