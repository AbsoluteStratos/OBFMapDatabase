/**
 * Created by Nick on 3/11/2016.
 */
$(document).ready(function() {

    var map = L.map('map').setView([-45, 30], 4);
    L.tileLayer('/OBFMapDatabase/img/Maps/FullMap/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 5,
        attribution: 'Full Map',
        tms: true
    }).addTo(map);


});