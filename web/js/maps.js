jQuery.noConflict();
jQuery('document').ready(function() {
    jQuery('body').attr('onload', 'initialize()');
});

var map;
var objects = new Array();
var infoWindow = new google.maps.InfoWindow();
var currentMarker;

//параметры
//получать нужно от симфони
var image_all = "/images/img_yellow.png";
var image_my = "/images/img_blue.png";
var url_markers = document.location.href +"/map/places.xml";
var url_new = document.location.href + "/map/new"
var url_delete = document.location.href + "/map/"
var radiusFind = 30

function loadMarkers() {
    clearMap();
    jQuery.ajax({
        type: "GET",
        dataType: "xml",
        url: url_markers,
        success: function(placesXml){
           var count = placesXml.getElementsByTagName('place').length;
           for(var i=0; i < count; i++) {
               var place = new Object();
               place.id = parseInt(getXmlValue(placesXml, 'id', i));
               place.userId = parseInt(getXmlValue(placesXml, 'userId', i));
               place.currentUserId = parseInt(getXmlValue(placesXml, 'currentUserId', i));
               place.category = getXmlValue(placesXml, 'category', i);
               place.user = getXmlValue(placesXml, 'user', i);
               place.lat = parseFloat(getXmlValue(placesXml, 'lat', i));
               place.lng = parseFloat(getXmlValue(placesXml, 'lng', i));
               place.name = getXmlValue(placesXml, 'name', i);
               place.description = getXmlValue(placesXml, 'description', i);
               place.myMarker = place.userId == place.currentUserId ? true : false;

               var Latlng = new google.maps.LatLng(place.lat, place.lng);
               var image = place.myMarker ? image_my : image_all;
               var visibleMarker = place.myMarker ? true : false;

               var marker = addMarker(Latlng, image, place.name + '(' + place.user + ')', false, visibleMarker);
               place.marker = marker;
               place.checked = false;
               objects.push(place);
           }
          }
        });
}

function initialize() {
    var Latlng = new google.maps.LatLng(49.438, 32.067);
    var Options = {
        zoom: 9,
        center: Latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    }
    loadMarkers();
    map = new google.maps.Map(document.getElementById('map'), Options);
    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, image_my, '', true);
    })
}

function visibilityMarkers(centerPoint, visible) {

    for (var i = 0; i < objects.length; i++) {
        if (!objects[i].myMarker) {
            if (distHaversine(objects[i].marker.getPosition(), centerPoint) < radiusFind)
            {
                objects[i].marker.setVisible(visible);
            }
        }
    }
}

function clickCheck() {
    var marker = currentMarker;
    for (var i = 0; i < objects.length; i++) {
        if ((objects[i].marker == marker) && objects[i].myMarker) {
            objects[i].checked = !objects[i].checked;
            visibilityMarkers(marker.getPosition(), objects[i].checked);
        }
    }
}

function showWindow(marker) {
    var is_new = true;
    var contentText;
    var showallmarkersText = "";
    var addCheck = false;
    var chekText = "";
    infoWindow.setContent(null);
    infoWindow.close();

    google.maps.event.addListener(infoWindow, 'domready', function(event) {
        saveEvent(marker, infoWindow);
    });

    for (var i = 0; i < objects.length; i++) {
        if (objects[i].marker == marker) {
            is_new = false;
            if (objects[i].myMarker) {
                chekText = objects[i].checked ? "checked='checked'" : "";
                showallmarkersText = "<div><input type='checkbox' id='showallmarkers' onclick='clickCheck()' "+chekText+">Показати всі маркери</div>";
//                addCheck = objects[i].checked ? true : false;
            }

            contentText =
                    "<div id='window_view'>"+
                    "<div id='lab_user'><label>Власник:</label><span>" + objects[i].user + "</span></div>" +
                    "<div id='lab_category'><label>Категорія:</label><span>" + objects[i].category + "</span></div>" +
                    "<div id='lab_name'><label>Назва:</label><span>" + objects[i].name + "</span></div>" +
                    "<div id='lab_description'><label>Примітки:</label><span>" + objects[i].description + "</span></div>" +
                    showallmarkersText+
                    "</div>";
        }
    }
    if (is_new) {
        jQuery.ajax({
            type: "GET",
            dataType: "html",
            url: url_new,
            success: function(result) {
                infoWindow.setContent(result);
                jQuery('#place_lat').val(marker.getPosition().lat());
                jQuery('#place_lng').val(marker.getPosition().lng());
            }
        });

    } else infoWindow.setContent(contentText);
    infoWindow.open(map, marker);
    currentMarker = marker;

//    if (addCheck) {
//        jQuery.elementReady('showallmarkers', function(){
//            jQuery(this).attr("checked","checked");
//        });
//    }
}

function addMarker(location, icon, title, draggable, visible) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: icon,
        draggable: draggable,
        visible: visible,
        title: title
    });
    google.maps.event.addListener(marker, 'click', function(event) {
        showWindow(marker);
    });

    google.maps.event.addListener(marker, 'rightclick', function(event) {
        dropMarker(marker);
    });
    return marker;
}

function dropMarker(marker) {
    if (confirm('Удалить маркер?')) {
        var is_new = true;
        var id = 0;
        for (var i = 0; i < objects.length; i++) {
          if (objects[i].marker == marker)
          {
              is_new = false;
              id = objects[i].id;
          }
        }
        if (is_new)
        {
            marker.setMap(null);
        } else
        {
            jQuery.ajax({
                type: "DELETE",
                dataType: "html",
                data: "id="+id,
                url: url_delete+id,
                success: function(result) {
                    if (result == 'ok') {
                        marker.setMap(null);
                    } else
                    {
                      alert(result);
                    }
                }
            });
        }
    }
}

function saveEvent (marker, infoWindow) {
    var options = {
        success: function(data) {
            if (data == 'ok')
            {
                infoWindow.close();
                marker.setMap(null);
                loadMarkers();
            } else
            {
                infoWindow.close();
                infoWindow.setContent(data);
                infoWindow.open(map, marker);
            }
        }
    };
    jQuery("#div_place_new").find('form').ajaxForm(options);
}

function clearMap() {
     for (var i = 0; i < objects.length; i++) {
       objects[i].marker.setMap(null);
     }
     objects.length = 0;
}

function getXmlValue(xmlDoc, name, i) {
    var value = "";
    if(xmlDoc.getElementsByTagName(name)[i].childNodes[0])
    {
        value = xmlDoc.getElementsByTagName(name)[i].childNodes[0].nodeValue;
    }
    return value;
}

function rad (x) {
    return x*Math.PI/180;
}

function distHaversine(p1, p2) {
    var R = 6371; // earth's mean radius in km
    var dLat  = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d.toFixed(3);
}