/**
 * Created by Nick on 3/11/2016.
 */
$(document).ready(function() {
    //Load map tile layers
    var fullMap = L.tileLayer('/OBFMapDatabase/img/Maps/FullMap/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 5,
        attribution: 'Full Map',
        tms: true
    });
    var localMap = L.tileLayer('/OBFMapDatabase/img/Maps/'+
        $(document).find("title").text().replace(/\s/g, '')+'/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 5,
        attribution: 'Full Map',
        tms: true
    });
    //Create map object
    var centers = getCenter();
    var map = L.map('map',{
        center: [centers[0],centers[1]],
        zoom: 4,
        layers: [fullMap,localMap]});
    var baseMaps = {
        "Full Map": fullMap,
        "Local Map": localMap
    };
    L.control.layers(baseMaps).addTo(map); //Add layer control

    //add standard controls
    L.control.coordinates().addTo(map);
    //add configured controls
    L.control.coordinates({
        position:"bottomleft",
        decimals:2,
        decimalSeperator:",",
        labelTemplateLat:"Latitude: {y}",
        labelTemplateLng:"Longitude: {x}"
    }).addTo(map);
    L.control.coordinates({
        position:"topright",
        useDMS:true,
        labelTemplateLat:"N {y}",
        labelTemplateLng:"E {x}",
        useLatLngOrder:true
    }).addTo(map);

    icons = createIcons();
    var lifeCell = icons[0]; var energyCell = icons[1]; var spiritContainer = icons[2]; var mapStone = icons[3];

    var lifeCellData; var energyCellData; var spiritContainerData; var mapStoneData;
    $.ajax({
        dataType: "json",
        url: "SunkenGlades.json",
        success: function(data) {
            var newData = getObjects(data,'class','Life Cell');
            lifeCellData = L.geoJson(newData,{
                pointToLayer: function(feature,latlng){
                    return L.marker(latlng,{icon: lifeCell});
                }
            });

            energyCellData = L.geoJson(getObjects(data,'class','Energy Cell'),{
                pointToLayer: function(feature,latlng){
                    return L.marker(latlng,{icon: energyCell});
                }
            });

            spiritContainerData = L.geoJson(getObjects(data,'class','Spirit Container'),{
                pointToLayer: function(feature,latlng){
                    return L.marker(latlng,{icon: spiritContainer});
                }
            });

            mapStoneData = L.geoJson(getObjects(data,'class','Map Stone'),{
                pointToLayer: function(feature,latlng){
                    return L.marker(latlng,{icon: mapStone});
                }
            });
        }
    }).error(function() {});

    $(".controlCheck[type=checkbox]").on( "click", function(){
        if($(this).attr("id") == "lifeCheck"){
            if(this.checked){
                lifeCellData.addTo(map);
            }else{
                map.removeLayer(lifeCellData);
            }
        }else if($(this).attr("id") == "energyCheck"){
            if(this.checked){
                energyCellData.addTo(map);
            }else{
                map.removeLayer(energyCellData);
            }
        }else if($(this).attr("id") == "spiritCheck"){
            if(this.checked){
                spiritContainerData.addTo(map);
            }else{
                map.removeLayer(spiritContainerData);
            }
        }else if($(this).attr("id") == "mapCheck"){
            if(this.checked){
                mapStoneData.addTo(map);
            }else{
                map.removeLayer(mapStoneData);
            }
        }
    })
});

function createIcons(){
    var lifeCell = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/life-cell.png',

        iconSize:     [25, 25], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [12.5, 25], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var energyCell = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/energy-cell.png',

        iconSize:     [25, 25], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [12.5, 25], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var spiritContainer = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/spirit-light-container.png',

        iconSize:     [25, 25], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [12.5, 25], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var mapStone = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/map-stone-fragment.png',

        iconSize:     [25, 25], // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [12.5, 25], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    return [lifeCell, energyCell, spiritContainer, mapStone]
}

function getCenter(){
    var pageTitle = $(document).find("title").text().replace(/\s/g, '');
    if(pageTitle == 'SunkenGlades') {
        return [-50.01,3.25];
    }else{
        return [-50.01,3.25];
    }
}

// General util stuffs
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}