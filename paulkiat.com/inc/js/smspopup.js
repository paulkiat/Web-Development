function setUserDeviceData() {
    var n = navigator.platform;
    var osname = 'unknown';
    var device = 'Desktop';
    if (/Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        device = 'Mobile';
        if (n.indexOf("iPhone") != -1) {
            osname = 'IOS';
        } else if (n.indexOf("Android") != -1) {
            osname = 'Android';
        }
        if (osname == 'unknown') {
            if (/Android/i.test(navigator.userAgent)) {
                osname = 'Android';
            } else if (/iPhone/i.test(navigator.userAgent)) {
                osname = 'IOS';
            }
        }
    }
    window.TL_USERDEVICE = device;
    window.TL_OSNAME = osname;
}
function getSmsLink(number, body) {
    var link = 0;
    if (window.TL_OSNAME == 'IOS') {
        link = 'sms:' + number + '&body=' + body;
    } else if (window.TL_OSNAME == 'Android') {
        link = 'sms://' + number + '?body=' + body;
    }
    return link;
}
function GetUserCountry() {
    var country_id = 0;
    $.ajax({
        url: "/modmysite/worldcities/geo_data_provider_craigslist.php?action=getc",
        async: false,
        success: function(data) {
            country_id = data;
            return country_id;
        }
    });
    return country_id;
}
function getPopup(flowid, container, show, frequency, delay, existing_joinform, nocoookie, hidemodal, notimes, countries, cookiename) {
    console.log('main function called');
    console.log(new Date());
    delay = delay ? delay : 0;
    frequency = frequency ? frequency : 24 * 60;
    notimes = notimes ? notimes : 1;
    countries = countries ? countries : 0;
    if (countries) {
        var user_country = GetUserCountry();
        countries = countries.split(",");
        if (!countries.includes(user_country)) {
            console.log("do not show popup as country not allowed!");
            return;
        }
    }
    show = show ? show : 'loggedout';
    var data = {};
    data.flowid = flowid;
    data.show = show;
    var lp_params = getUrlVars_lpparam();
    console.log(lp_params);
    for (var p in lp_params) {
        data[p] = lp_params[p];
    }
    console.log(data);
    nocoookie = nocoookie ? nocoookie : 0;
    hidemodal = hidemodal ? hidemodal : 0;
    window.show_sms_tl_popup = 1;
    cookiename = cookiename ? cookiename : 'tl_dbarn_sms_';
    var cookie_shown = cookiename + 'shown';
    var cookie_frequency = cookiename + 'frequency';
    var no_of_times = getTLCookie(cookie_shown);
    if (!no_of_times) {
        setTLCookie(cookie_shown, 1, frequency);
    }
    if (!nocoookie) {
        var next_show = getTLCookie(cookie_frequency);
        var show_popup = 0;
        if (!next_show) {
            var d = new Date();
            d.setMinutes(d.getMinutes() + frequency);
            next_show = d.getTime();
            setTLCookie(cookie_frequency, next_show, frequency);
        } else {
            var d = new Date();
            if (d.getTime() < next_show) {
                if (no_of_times) {
                    if (no_of_times < notimes) {
                        console.log('show popup');
                        show_popup = 1;
                        no_of_times++;
                        setTLCookie(cookie_shown, no_of_times, frequency);
                    }
                } else {
                    show_popup = 1;
                }
                if (!show_popup) {
                    console.log('Do not show popup');
                    window.show_sms_tl_popup = -1;
                    return;
                }
            }
        }
    }
    setTimeout(function() {
        console.log('ajax call');
        console.log(new Date());
        if (existing_joinform) {
            $('#joinform').attr('id', 'joinform_existing');
        }
        console.log('sending this data:');
        console.log(data);
        $.ajax({
            url: '/modmysite/ajax/smspopup.php',
            data: data,
            type: 'POST',
            success: function(data) {
                console.log('ajax response');
                console.log(new Date());
                $(container).html(data);
                if (!hidemodal) {
                    $('#tl_dbarn_sms').modal('show');
                    $('#tl_dbarn_sms').on('hidden.bs.modal', function(e) {
                        $('#joinform_existing').attr('id', 'joinform');
                        $('#tl_dbarn_sms').remove();
                    })
                }
            }
        });
    }, delay * 1000);
}
function getInlineForm(flowid, container, show, defaultEmail) {
    show = show ? show : 'both';
    defaultEmail = defaultEmail ? defaultEmail : 0;
    var data = {};
    data.flowid = flowid;
    data.show = show;
    $.ajax({
        url: '/modmysite/ajax/smspopup.php',
        data: data,
        type: 'POST',
        success: function(data) {
            $('#loadericon').remove();
            console.log('ajax response');
            console.log(new Date());
            $(container).html(data);
            if (defaultEmail) {
                $('#Email').val(defaultEmail);
            }
        }
    });
}
function setTLCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getTLCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function getUrlVars_lpparam() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function sameFunnelBootstrapPopup(number, m, custombtnContainer, norid) {
    var rid = window.TL_FROM;
    norid = norid ? norid : 0;
    if (!norid) {
        m = m + '(ref:' + rid + ') ';
    }
    var msg = encodeURIComponent(m);
    var link = getSmsLink(number, msg);
    console.log(link);
    if (link == 0) {
        $('.fordesktop').show();
    } else {
        $('.formobile').show();
        $('#p_CellPhone').hide();
        $('#smsbtnpopup').attr('href', link);
        if (custombtnContainer) {
            $(custombtnContainer).attr('href', link);
        }
    }
}
function bootstrapPopup(number, m, custombtnContainer) {
    window.TL_FROM = $("[name='from']").val();
    var s = setInterval(function() {
        if ($("#formExtendBox").is(":visible")) {
            clearInterval(s);
            $('.hidethisone').hide();
            var rid = $("[name='from']").val();
            m = m + '(ref:' + rid + ') ';
            var msg = encodeURIComponent(m);
            var link = getSmsLink(number, msg);
            if (link == 0) {} else {
                $('#smsbtnpopup').attr('href', link);
                if (custombtnContainer) {
                    $(custombtnContainer).attr('href', link);
                }
            }
        }
    }, 50);
}
$(document).ready(function() {
    window.__cfRLUnblockHandlers = true;
    setUserDeviceData();
});
