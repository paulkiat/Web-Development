$(function() {
    $('.nav-item').click(function() {
        let to = $(this).data('to');
        if (to != '') {
            $('html,body').animate({
                scrollTop: $(`#${to}`).offset().top
            }, 800);
        }
    });
});
$(function() {
    let sliderowl;
    let slideChangeTimeout;
    $.ajax({
        url: '/controller/plugins/v4/slider/ajax.php',
        type: 'POST',
        data: {
            action: 'getTemplateData',
        },
        success: function(res) {
            res = JSON.parse(res);
            if (res.success == 1) {
                let list = res.list;
                let html = '';
                for (let slider of list) {
                    let autoplayTimeoutAttr = `data-autoplay_timeout="15000"`;
                    if (slider.time > 0) {
                        autoplayTimeoutAttr = `data-autoplay_timeout="${slider.time}"`;
                    }
                    let clickableClass = (slider.banner_clickable == 'yes') ? 'clickable' : '';
                    let clickableUrl = (slider.banner_clickable == 'yes') ? `data-clickable_url="${slider.clickable_url}"` : '';
                    html += `<div id="${slider.id}" class="owl-lazy item ${slider.class} ${slider.active} ${clickableClass}" ${clickableUrl} data-src="${slider.img}" data-src-retina="${slider.img}" ${autoplayTimeoutAttr} >
                    <div class="container" style="position: relative;">${slider.html}</div></div>`;
                }
                $("#slider").html(html);
                sliderowl = $('#slider').owlCarousel({
                    items: 1,
                    nav: true,
                    loop: true,
                    autoplay: true,
                    autoplayTimeout: 15000,
                    autoplayHoverPause: true,
                    lazyLoad: true,
                    lazyLoadEager: 1,
                });
                $('#slider').on('changed.owl.carousel', function(event) {
                    let currentIndex = event.item.index;
                    let slideElement = $('#slider .owl-item').eq(currentIndex);
                    let autoplayTimeout = slideElement.find('.item').data('autoplay_timeout');
                    if (sliderowl) {
                        autoplayTimeout = autoplayTimeout ? autoplayTimeout : 15000;
                        if (slideChangeTimeout) {
                            clearTimeout(slideChangeTimeout);
                        }
                        sliderowl.trigger('stop.owl.autoplay');
                        slideChangeTimeout = setTimeout(function() {
                            sliderowl.trigger('next.owl.carousel');
                            sliderowl.trigger('play.owl.autoplay');
                        }, autoplayTimeout);
                    }
                });
                $('#slider .item.clickable').click(function() {
                    console.log('clicked');
                    let url = $(this).data('clickable_url');
                    if (url) {
                        window.location = url;
                    }
                });
            }
        }
    });
    var sliders = Array();
    var storeViews = function(property) {
        var current = property.item.index;
        var element = $(property.target).find(".owl-item").eq(current).find(".banner4");
        if (!element.hasClass("viewed")) {
            var sid = element.attr('id');
            if (jQuery.inArray(sid, sliders) == -1) {
                console.log('sid', sid);
                sliders.push(sid);
                $.ajax({
                    url: '/controller/plugins/v4/slider/ajax.php',
                    type: 'POST',
                    data: {
                        action: 'sliderView',
                        sid
                    },
                    success: function(res) {
                        if (res == 1)
                            element.addClass('viewed');
                    }
                });
            }
        }
    }
    $('#slider').on('changed.owl.carousel', function(property) {
        storeViews(property);
    });
    $("#slider").on('initialized.owl.carousel', function(property) {
        storeViews(property);
    });
});
$(function() {});
$(function() {});
$(function() {});
$(function() {
    $('.brandLogos').owlCarousel({
        items: 1,
        nav: true,
        loop: false
    });
});
$(function() {
    var page = 2;
    $('#loadMoreNews').click(function() {
        $.ajax({
            url: `/controller/plugins/v4/news/ajax.php?action=getNews&page=${page++}`,
            beforeSend: function() {
                $('#loadMoreNews i').removeClass('fa-angle-down').addClass('fa-spinner fa-pulse fa-fw');
            },
            success: function(res) {
                let obj = jQuery.parseJSON(res);
                let list = obj.data;
                for (let news of list) {
                    let tmpl = `<div class="col-lg-4 col-xs-12">
                                <div class="newsItem">
                                    <a target="_blank" href="${news.url}">
                                        <div class="newsItem-image">
                                            <img  src="${news.image}">
                                        </div>
                                        <div class="title">
                                            ${news.title}
                                        </div>
                                        <div class="more">more..</div>
                                    </a>

                                </div>
                            </div>`;
                    $('#loadMoreNewsBox').before(tmpl);
                }
                if (obj.end == 1) {
                    $('#loadMoreNewsBox').hide();
                }
            },
            complete: function() {
                $('#loadMoreNews i').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-angle-down');
            }
        });
    });
});
$(function() {
    $('.courseBox').owlCarousel({
        items: 1,
        nav: true,
        loop: false,
        rewind: true
    });
});
$(function() {
    setTimeout(function() {
        $("#investvideo").html('<script src="https://fast.wistia.com/embed/medias/jusuoiwke2.jsonp" async></script><script src="https://fast.wistia.com/assets/external/E-v1.js" async></script> <div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"> <div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"> <div class="wistia_embed wistia_async_jusuoiwke2 videoFoam=true" style="height:100%;position:relative;width:100%">                    <div class="wistia_swatch" style="height:100%;left:0;opacity:0;overflow:hidden;position:absolute;top:0;transition:opacity 200ms;width:100%;">                                  <img aria-hidden="true" onload="this.parentNode.style.opacity=1;" src="https://fast.wistia.com/embed/medias/jusuoiwke2/swatch" style="filter:blur(5px);height:100%;object-fit:contain;width:100%;">                            </div>                          </div>                      </div></div>');
    }, 6000);
});
$(function() {
    $('.free-video-play-btn').click(function() {
        let videourl = $(this).data('video');
        $('#free-video-player').prop('src', videourl);
        $('#free-video-modal').modal();
    });
    $('#free-video-close').click(function() {
        $('#free-video-player').prop('src', '');
    });
})
$(function() {
    var distance = 10;
    var time = 250;
    var hideDelay = 500;
    var fieldVal = {
        bdmonth: 'Month',
        bdday: 'Day',
        bdyear: 'Year',
        FirstName: 'First Name',
        LastName: 'Last Name',
        Phone1: 'Phone Number',
        Email: 'Email',
        Email2: 'Confirm Email',
        StreetAddress1: 'Billing Address',
        State: 'State/Province',
        PostalCode: 'ZIP/Postal Code',
        coupon: 'Coupon (optional)',
        auth_card_num: 'Credit Card Number',
        auth_expire_month: 'Exp. Date',
        auth_expire_year: 'Exp. Date',
        cvv2_number: 'Card Security Code',
        areaCode: 'Phone',
        MobileNumber_1: 'Phone',
        MobileNumber_2: 'Phone',
        CellPhone: 'Phone'
    };
    var refre = $('input[name="refresh"]').val();
    var botd_data = {};
    var optin_id = '';
    $('body').delegate('#popjoin', 'submit', function(event) {
        if (undefined == site_url)
            var site_url = '/';
        event.preventDefault();
        $('#form-result-status').html('');
        var emchked = 0;
        botd_data.name = $("#FirstName").val();
        botd_data.email = $("#Email").val();
        if (typeof window.resubscribeForce != "undefined") {
            botd_data.resubscribe = '1';
        }
        botd_data.offerid = $("#continue_btn").data('id');
        botd_data.source = "BOTD";
        botd_data.funnel = $("#continue_btn").data('funnel');
        botd_data.subfunnel = $('input[name=subjoinid]').val();
        botd_data.record = $('input[name=trackid]').val();
        botd_data.optin = 0;
        window.botd_data = botd_data;
        var validation = function() {
            var chk = 1;
            $('#popjoin .require').each(function() {
                var thiz = $(this);
                var value = thiz.val();
                var name = thiz.attr('name');
                name = fieldVal[name] || name;
                if (value == '' || value == 0) {
                    var alertTxt = name + ' is required';
                    if (name == 'Sex') {
                        alertTxt = 'Please enter your gender.';
                    }
                    $('#form-result-status').html(alertTxt);
                    chk = 0;
                    return false;
                }
                if (thiz.attr('type') == 'checkbox' && !thiz.prop('checked')) {
                    $('#form-result-status').html('You must check the box to continue');
                    chk = 0;
                    return false;
                }
                switch (name) {
                case 'Email':
                    var pattern = /@/;
                    if (!pattern.test(value)) {
                        chk = 0;
                        $('#form-result-status').html('Not a valid email address!');
                        return false;
                    }
                    var uniq = true;
                    var gc = null;
                    var captcha = $('#captcha').val();
                    if (captcha === 'yes') {
                        gc = grecaptcha.getResponse();
                    }
                    var dataObj = {
                        'eml': value,
                        'captcha': captcha,
                        'g-recaptcha-response': gc,
                        'applyxverify': true
                    };
                    if (typeof window.resubscribeForce != "undefined") {
                        dataObj.resubscribe = '1';
                    } else {
                        dataObj.resubscribe = '0';
                    }
                    console.log(dataObj);
                    var dataObj = {
                        'eml': value,
                        'captcha': captcha,
                        'g-recaptcha-response': gc,
                        'applyxverify': true
                    };
                    if (typeof window.resubscribeForce != "undefined") {
                        dataObj.resubscribe = '1';
                    }
                    $.ajax({
                        url: site_url + 'newjoin.php',
                        data: dataObj,
                        type: 'POST',
                        async: false,
                        success: function(res) {
                            res = (JSON.parse(res));
                            if (res != '1' && res.status) {
                                if (res.status !== 'valid') {
                                    chk = 0;
                                    $('#errorBlockJoin').remove();
                                    if (res.captcha) {
                                        $("<div id='errorBlockJoin'> <div class='mark'>Email is " + res.status + " , " + res.responsecode_str + "</div> <div><input type='hidden' value='yes' name='captcha' id='captcha'></div> </div>").insertBefore('.terms');
                                        $('.g-recaptcha').show();
                                        $('.g-recaptcha').empty();
                                        if (window.captcha_tries > 0) {
                                            grecaptcha.reset();
                                            var widgetId = grecaptcha.render($('.g-recaptcha')[0], {
                                                sitekey: '6LcqEwwTAAAAAHDnl8xxRdNsvJDLPTz05VUeQvFF'
                                            });
                                            grecaptcha.reset(widgetId);
                                        } else {
                                            window.captcha_tries = 0;
                                            var widgetId = grecaptcha.render($('.g-recaptcha')[0], {
                                                sitekey: '6LcqEwwTAAAAAHDnl8xxRdNsvJDLPTz05VUeQvFF'
                                            });
                                            grecaptcha.reset(widgetId);
                                        }
                                        window.captcha_tries++;
                                    } else {
                                        $("<div id='errorBlockJoin'><div class='mark'>Email is " + res.status + " , " + res.responsecode_str + "</div></div>").insertBefore('.terms');
                                    }
                                    $('#header_res_box').html('<div style="font-weight: bold; padding-top: 10px; text-align: center; width: 300px;">Not a valid email address!' + '</div>');
                                    return false;
                                } else if (res.auto_corrected === 'true') {
                                    var new_verified_email = res.auto_corrected_address;
                                    $('#Email').val(new_verified_email);
                                }
                                emchked = 1;
                            }
                            if (res.responsecode == "-1") {
                                window.resubscribeForce;
                                uniq = false;
                            }
                        }
                    });
                    if (!uniq) {
                        window.resubscribeForce = true;
                        chk = 0;
                        $('#form-result-status').html('You have already signed up with this email address.<br/>Click again to resubscribe.');
                        $(".btn_submit[value=CONTINUE]").val("Resubscribe");
                        return false;
                    }
                    break;
                }
            });
            return chk
        }();
        if (!validation) {
            return false;
        }
        var paras = $(this).serialize();
        paras = paras + '&emchked=' + emchked;
        $('input[name="submit"]').attr('disabled', true);
        var botd_success = function(res) {
            var data = JSON.parse(res);
            if (data.hasOwnProperty("result")) {
                if (data.result == "success") {
                    console.log(window.joinstepBtn);
                    if (window.joinstepBtn === 'no') {
                        window.location.href = 'programs.php';
                    }
                } else {
                    window.location.href = 'index.php';
                }
            }
            return false;
        };
        window.botd_success = botd_success;
        var botd_option_no = function() {
            event.preventDefault();
            if (undefined == site_url)
                var site_url = '/';
            $.ajax({
                url: site_url + 'modmysite/ajax/botd_ajax.php',
                data: JSON.stringify(botd_data),
                type: 'POST',
                success: botd_success,
                error: function(jqXHR, status, err) {},
                complete: function(jqXHR, status) {}
            });
        };
        window.botd_option_no = botd_option_no;
        $.ajax({
            url: site_url + 'newjoin.php',
            data: paras,
            type: 'POST',
            success: function(res) {
                res = $.trim(res);
                $('input[name="submit"]').attr('disabled', false);
                var rf = $('input[name="refresh"]').val();
                if (rf == 'yes') {
                    var href = $("#t_href").val();
                    exit = false;
                    window.location = href;
                    return false;
                }
                $.ajax({
                    url: site_url + 'joinfire.php',
                    success: function(res) {
                        if (res) {
                            $('body').append(res);
                        }
                        $("#optin-btn-2").click(function() {
                            window.joinstepBtn = 'yes';
                            console.log(window.joinstepBtn);
                            event.preventDefault();
                            if (undefined == site_url)
                                var site_url = '/';
                            botd_data.optin = 1;
                            $.ajax({
                                url: site_url + 'modmysite/ajax/botd_ajax.php',
                                data: JSON.stringify(botd_data),
                                type: 'POST',
                                success: botd_success
                            });
                        });
                        $("#optin-btn-no").click(function() {
                            window.joinstepBtn = 'no';
                            window.botd_option_no();
                        });
                        $('.modal-backdrop').click(function() {
                            botd_data.optin = 2;
                            window.botd_option_no();
                        });
                        $('.modal_close').click(function() {
                            botd_data.optin = 2;
                            window.botd_option_no();
                        });
                    }
                });
                if (res != '') {
                    var p = $('input[name="page"]').val();
                    $('.step' + p).removeClass('active');
                    $('#form_container').html('').css({
                        opacity: 0
                    });
                    $('#form_container').append(res);
                    $('#form_container').animate({
                        opacity: 1,
                        display: 'block'
                    }, 1000);
                    var p = $('input[name="page"]').val();
                    $('.step' + p).addClass('active');
                } else {
                    $('#header_res_box').html('<div style="font-weight: bold; padding-top: 10px; text-align: center; width: 300px;">Thanks, You Are Signed Up!</div>');
                    setTimeout("hidehorizontaljointop1()", 3000);
                }
            }
        });
        return false;
    })
});
document.addEventListener("DOMContentLoaded", function() {
    var lazyImages = [].slice.call(document.querySelectorAll(".lazy"));
    if ("IntersectionObserver"in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    if (lazyImage.dataset.background) {
                        lazyImage.style.background = lazyImage.dataset.background;
                    }
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.srcset = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        }
        );
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        lazyImages.forEach(function(lazyImage) {
            if (lazyImage.dataset.background) {
                lazyImage.style.background = lazyImage.dataset.background;
            }
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
        });
    }
});
