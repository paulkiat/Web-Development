function makeCellphoneCountry(remove_error_div, default_value, numberfield) {
    remove_error_div = remove_error_div ? remove_error_div : false;
    default_value = default_value ? default_value : false;
    window.numberfield = numberfield ? numberfield : 0;
    window.alreadysetcellphone_value = $('#CellPhone').val();
    $('#CellPhone').val('');
    var input = document.querySelector("#CellPhone");
    var intl_init = window.intlTelInput(input, {
        initialCountry: "auto",
        separateDialCode: true,
        customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
            console.log(selectedCountryPlaceholder);
            console.log(selectedCountryData);
            return "Ex. " + selectedCountryPlaceholder;
        },
        geoIpLookup: function(callback) {
            $.get("/modmysite/ajax/getip.php", function(resp) {
                resp = JSON.parse(resp);
                var countryCode = (resp && resp.country) ? resp.country : "";
                console.log(countryCode);
                callback(countryCode);
                if (!remove_error_div) {
                    $(".intl-tel-input").after('<div class="popup phone_err"><span class="help-block txt"></span></div>');
                }
                if (default_value) {
                    setTimeout(function() {
                        input.value = default_value;
                        console.log('default value set =' + default_value);
                    }, 1000);
                } else if (window.alreadysetcellphone_value) {
                    setTimeout(function() {
                        input.value = window.alreadysetcellphone_value;
                        console.log('default value set to old one =' + window.alreadysetcellphone_value);
                    }, 1000);
                }
            });
        },
        utilsScript: "../../inc/js/intl-tel-input-14.0.6/build/js/utils.js"
    });
    intl_init.promise.then(function() {
        console.log("Initialised!");
    });
    input.addEventListener("countrychange", function() {
        console.log('change');
        $('#CountryCode').val(getCountryCode());
        var code = intl_init.getSelectedCountryData().iso2;
        updatePhoneFormat(code);
    });
    $(function() {
        $("#CellPhone").after('<input type="hidden" id="CountryCode" name="CountryCode" value="">');
        $("#CellPhone").change(function() {
            console.log('change');
            $('#CountryCode').val(getCountryCode());
            updatePhoneFormat();
        });
        $("#CellPhone").blur(function() {
            console.log('blur');
            $('#CountryCode').val(getCountryCode());
            updatePhoneFormat();
        });
        $("#CellPhone").focus(function() {
            console.log('focus');
            $('#CountryCode').val(getCountryCode());
            updatePhoneFormat();
        });
    });
    $("#CellPhone").on("change paste keyup", function() {
        updatePhoneFormat();
    });
}
function getCountryCode() {
    var ccode = $('.country-list').children('.active').children('.dial-code').html();
    if (!ccode || ccode.length < 1) {
        ccode = $('.selected-dial-code').html();
    }
    return ccode;
}
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '')
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null;
}
function formatPhoneNumber_v2(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    console.log(cleaned);
    var length = cleaned.length;
    if (length >= 3) {
        var str = '(' + cleaned.substr(0, 3) + ') ';
        if (length == 3) {
            str = cleaned.substr(0, 3);
        }
        if (length >= 4) {
            str += cleaned.substr(3, 3);
        }
        if (length >= 7) {
            str += '-' + cleaned.substr(6);
        }
        return str;
    }
    return null;
}
function removeFormat(val) {
    val = val.replaceAll('(', '');
    val = val.replaceAll(')', '');
    val = val.replaceAll('-', '');
    return val;
}
function updatePhoneFormat(ccode) {
    if (window.numberfield) {
        var type = $('#CellPhone').attr('type');
        if (type == 'text') {
            $('#CellPhone').attr('type', 'number');
        }
        return;
    }
    ccode = ccode ? ccode : null;
    var val = $("#CellPhone").val();
    var cc = $('#CountryCode').val();
    if ((cc == '+1' && !ccode) || (ccode == 'us' || ccode == 'ca')) {
        var retval = formatPhoneNumber_v2(val);
        if (retval) {
            $("#CellPhone").val(retval);
        }
    } else {
        val = removeFormat(val);
        $("#CellPhone").val(val);
    }
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}
;
$(document).ready(function() {
    window.__cfRLUnblockHandlers = true;
});
