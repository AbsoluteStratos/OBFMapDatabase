/**
 * Created by Nick on 3/11/2016.
 */
$(document).ready(function() {
    var zoneName = $(document).find("title").text().replace(/\s/g, '');

    $('.dropdown-button').dropdown({
            inDuration: 0,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            gutter: 0, // Spacing from edge
            belowOrigin: true // Displays dropdown below the button
        }
    );

    $("*").each( function () {
        var $this = $(this);
        if (parseInt($this.css("fontSize")) < 12) {
            $this.css({ "font-size": "12px" });
        }
    });

    //Load map tile layers
    var fullMap = L.tileLayer('/OBFMapDatabase/img/Maps/FullMap/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 5,
        attribution: 'Full Map',
        tms: true
    });
    var localMap = L.tileLayer('/OBFMapDatabase/img/Maps/'+zoneName+'/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 5,
        attribution: zoneName,
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

    /*//add standard controls
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
    }).addTo(map);*/

    icons = createIcons();

    var itemNames = ["lifeCell","energyCell","abilityPoint","spiritContainer","mapStoneFrag","keystone",
        "spiritGate","energyGate","breakableWall","ancestralTree","mapStone","spiritWell"];
    var itemData = new Array(12);
    console.log("mapJSONData/"+zoneName+".json");
    //Load Map Data JSON
    $.ajax({
        dataType: "json",
        url: "mapJSONData/"+zoneName+".json",
        success: function(data) {
            var itemKey;
            for (itemKey in itemNames) {
                var newData = getObjects(data, 'class', itemNames[itemKey]);
                itemData[itemKey] = L.geoJson(newData, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: icons[feature.iconIndex][itemKey]});
                    },
                    onEachFeature: createMapPopup
                });
            }
            //Auto turn on spirit wells, mapstone, and trees
            for (index = itemData.length - 3; index < itemData.length; ++index) {
                itemData[index].addTo(map);
            }
        }
    }).error(function() {});

    $(".controlCheck[type=checkbox]").on( "click", function(){
        for (itemKey in itemNames) {
            if($(this).attr("id") == itemNames[itemKey]+"Check"){
                if(this.checked){

                    itemData[itemKey].addTo(map);
                }else{
                    map.removeLayer(itemData[itemKey]);
                }
            }
        }
    });

});

// Generate Popup content
function createMapPopup(feature, layer) {

    var popTemplate =  "<div class='popTypeDiv noselect'><img class ='popUpIcon' src='img/MapIcons/{img}' alt='{name} Icon'><span id = 'popName'>{name}</span></div>" +
        "<div class='popAbilityDiv'>Skills Needed: {abilities}</div>" +
        "<div class='popEventDiv'>Events Needed: {events}</div>";
    //If the feature isn't a collectable (so a wall, save point, etc)
    if(!feature.collectible){
        popTemplate =  "<div class='popTypeDiv noselect'><img class ='popUpIcon' src='img/MapIcons/{img}' alt='{name} Icon'><span id = 'popName'>{name}</span></div>" +
            "<div class='popDiscDiv'>{desc}</div>";
    }

    var popContent = "failed to load pop-up content!";
    if(feature.properties){
        try {
            popContent = L.Util.template(popTemplate, feature.properties);
        }catch(err) {
            popContent = "Wrong template used for content! Or content error!";
        }

    }else{
        popContent = "No properties found!";
    }
    layer.bindPopup(popContent, {
        offset: new L.Point(0, 0),
        maxWidth: 500
    }); //Add stuff to popup and set offset from point
}
//Get correct centering for the map based on the zone name
//For some reason we need to do latitude, longitude
function getCenter(){
    var pageTitle = $(document).find("title").text().replace(/\s/g, '');
    if(pageTitle == 'SunkenGlades') {
        return [-50.01,3.25];
    }else if(pageTitle == 'HollowGrove') {
        return [-38.89,24.61];
    }else if(pageTitle == 'ThornfeltSwamp') {
        return [-40.73,90.60];
    }else if(pageTitle == 'MoonGrotto') {
        return [-52.59,71.00];
    }else if(pageTitle == 'GinsoTree') {
        return [-5.81,74.36];
    }else if(pageTitle == 'MistyWoods') {
        return [-30.60,-86.64];
    }else if(pageTitle == 'ValleyoftheWind') {
        return [-37.72,-41.22];
    }else if(pageTitle == 'ForlornRuins') {
        return [-55.03,-83.30];
    }else if(pageTitle == 'SorrowPass') {
        return [7.71,-49.87];
    }else if(pageTitle == 'MountHoru') {
        return [0.00,20.34];
    }else{
        return [-50.01,3.25];
    }
}

function createIcons(){
    var myIcons = new Array(2);
    myIcons[0] = new Array(12);
    myIcons[1] = new Array(12);

    myIcons[0][0] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/life-cell.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][1] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/energy-cell.png',

        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][2] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/ability-point.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][3] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/spirit-light-container.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][4] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/map-stone-fragment.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][5] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/keystone.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][6] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/spirit-gate-2.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[1][6] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/spirit-gate-4.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][7] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/energy-gate.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][8] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/breakable-wall.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[1][8] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/stompable-floor.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][9] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/ancestral-tree.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][10] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/map-stone.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    myIcons[0][11] = L.icon({
        iconUrl: '/OBFMapDatabase/img/MapIcons/spirit-well.png',
        iconSize:     [25, 25], // size of the icon
        iconAnchor:   [12.5, 12.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });

    return myIcons;
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