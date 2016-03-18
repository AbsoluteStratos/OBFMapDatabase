/**
 * Created by Nick on 2/20/2016.
 */
$(document).ready(function(){
    $('.parallax').parallax();

    $('.mainNavZone').hover(function(){
        $(".mainFadeUp",this).fadeIn(150);
    }, function() {
        $('.mainFadeUp',this).fadeOut(150);
    });

    /*Would prefer css but this works*/
    var width = $(window).width() - 100;
    $("#parallax-container").height(width);

});

