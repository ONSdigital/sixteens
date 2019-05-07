$(document).ready(function() {
    $("#start-month").change(function() {
        var month = $(this).val();
        $("#end-month").val(month); // Set start month to be equal to the end
    })

    $("#start-year").change(function() {
        var year = $(this).val();

        if ($("#end-year").val() === "Select") {
            $("#end-year").val(year);
        }

        var currEndYear = parseInt($("#end-year").val());
        var currYear = parseInt(year);

        if (currEndYear > currYear) { // Add the missing end years if current start year is before end
            var diffYears = currEndYear - currYear;
            
            for(var i = 1; i <= diffYears; i++) {
                var optYear = currEndYear - i;
                if ($("#end-year option[value='"+optYear.toString()+"']").length == 0) {
                    $("#end-year").prepend($('<option>', {
                        value: optYear.toString(),
                        text: optYear.toString(),
                    }))
                }
            }
        } 

        if (currEndYear < currYear) {
            $("#end-year").val(year); // Set the end year to be equal to the start year
        }

        $("#end-year option").each(function() { // Remove all values before the current end year
            var optYear = parseInt($(this).val())
            if (optYear < currYear || $(this).val() === "Select") {
                $(this).remove();
            }
        })
    })
});