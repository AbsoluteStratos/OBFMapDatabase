/**
 * Created by Nick on 3/11/2016.
 */
$(document).ready(function() {

    var map = L.map('map').setView([-45, 30], 4);
    L.tileLayer('/Ori/img/Maps/FullMap/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 5,
        attribution: 'Full Map',
        tms: true
    }).addTo(map);


    $(".mapContainer").mousemove(function(e){
        var bgImage = new Image();
        bgImage.src = $(this).css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");

        var imgWidth = bgImage.width;  // The actual image width
        var imgHeight = bgImage.height;  // The actual image height

        //var height = (imgHeight-$(this).height()) / $(window).height();
        var width = (imgWidth-$(window).width()) / $(window).width();


        var yMargin = 50;
        if(imgHeight > $(this).height()){
            yMargin = (imgHeight-$(this).height())/2;
        }
        var yStart = imgHeight-yMargin;

        var xMargin = (imgWidth-$(this).width())/2;
        var xStart = imgHeight-xMargin;

        var parentOffset = $(this).offset();

        var pageX = e.pageX - parentOffset.left;
        var pageY = e.pageY - parentOffset.top;
        var newvalueX = -1*(2*xMargin)/(imgWidth-2*xMargin)*pageX;
        var newvalueY = -1*(2*yMargin)/(imgHeight-2*yMargin)*pageY;
        $(this).css("background-position", newvalueX+"px     "+newvalueY+"px");
    });
});