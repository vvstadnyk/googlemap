jQuery.noConflict();
jQuery('document').ready(function() {
    jQuery('body').attr('onload', 'initialize()');
});

var map;
var markers = new Array();
var image_all = "/images/img_yellow.png";
var image_my = "/images/img_blue.png";

function loadMarkers() {
    clearMap();
    jQuery.ajax({
        type: "GET",
        dataType: "xml",
        url: document.location.href +"/map/places.xml",
        success: function(result){
           jQuery(result).find("place").each(function () {
                var image;
                var dragg;
                var Latlng = new google.maps.LatLng(parseFloat(jQuery(this).find("lat").text()), parseFloat(jQuery(this).find("lng").text()));
               if (jQuery(this).find("userId").text() == jQuery(this).find("currentUserId").text())
                {
                    image = image_my;
                    dragg = true;
                } else
                {
                    image = image_all;
                    dragg = false;
                }
                addMarker(Latlng, image, jQuery(this).find("name").text()+'('+jQuery(this).find("user").text()+')', dragg);
           })
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
    var infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(infoWindow, 'domready', function(event) {
       saveEvent(marker, infoWindow);
    });

    for (var i = 0; i < markers.length; i++) {
      if (markers[i] == marker)
      {
          is_new = false;
      }
    }
      if (is_new) {
          jQuery.ajax({
              type: "GET",
              dataType: "html",
              url: "/map/new",
              success: function(result){
                  infoWindow.setContent(result);
                  jQuery('#place_lat').val(marker.getPosition().lat());
                  jQuery('#place_lng').val(marker.getPosition().lng());
                }
              });

      } else
      {
          infoWindow.setContent("<h2>is from base</h2>");
      }
    infoWindow.open(map, marker);
    map.setCenter(marker.getPosition());
}

function addMarker(location, img, title, dragg) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: img,
        draggable: dragg,
        title: title
    });
    if (title.length > 0)
    {
        markers.push(marker);
    }
    google.maps.event.addListener(marker, 'click', function(event) {
        showWindow(marker);
    });

    google.maps.event.addListener(marker, 'rightclick', function(event) {
        dropMarker(marker);
    });
}

function dropMarker(marker) {
    if (marker.getDraggable() && confirm('Удалить маркер?')) {
        marker.setMap(null);
    }
}

function saveEvent (marker, infoWindow) {
    var content = infoWindow.getContent();
    var options = {
        success: function(data) {
            if (data == 'ok')
            {
                infoWindow.close();
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
     for (var i = 0; i < markers.length; i++) {
       markers[i].setMap(null);
     }
     markers.length = 0;
}