jQuery.noConflict();
jQuery('document').ready(function() {
    jQuery('body').attr('onload', 'initialize()');
});

var map;
var objects = new Array();
var image_all = "/images/img_yellow.png";
var image_my = "/images/img_blue.png";
var infoWindow = new google.maps.InfoWindow();

function loadMarkers() {
    clearMap();
    jQuery.ajax({
        type: "GET",
        dataType: "xml",
        url: document.location.href +"/map/places.xml",
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

               var Latlng = new google.maps.LatLng(place.lat, place.lng);
               var image = place.userId != place.currentUserId ? image_all : image_my;
               var marker = addMarker(Latlng, image, place.name + '(' + place.user + ')', false);
               place.marker = marker;
               objects.push(place);

           }
          }
        });
}

function initialize() {
    var Latlng = new google.maps.LatLng(49.438, 32.067);
    var Options = {
        zoom: 12,
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

function showWindow(marker) {
    var is_new = true;
    var contentText;
    infoWindow.close();
    google.maps.event.addListener(infoWindow, 'domready', function(event) {
        saveEvent(marker, infoWindow);
    });

    for (var i = 0; i < objects.length; i++) {
        if (objects[i].marker == marker) {
            is_new = false;
            contentText = "<p>" + objects[i].name + "</p>" +
                    "<p>" + objects[i].user + "</p>" +
                    "<p>" + objects[i].description + "</p>";
        }
    }
    if (is_new) {
        jQuery.ajax({
            type: "GET",
            dataType: "html",
            url: document.location.href + "/map/new",
            success: function(result) {
                infoWindow.setContent(result);
                jQuery('#place_lat').val(marker.getPosition().lat());
                jQuery('#place_lng').val(marker.getPosition().lng());
            }
        });

    } else infoWindow.setContent(contentText);
    infoWindow.open(map, marker);
    map.setCenter(infoWindow.getPosition());
}

function addMarker(location, img, title, dragg) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: img,
        draggable: dragg,
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
                url: document.location.href + "/map/"+id,
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
