jQuery.noConflict();
jQuery('document').ready(function() {
    jQuery('body').attr('onload', 'initialize()');


});

var map, curmarker, contentWindow;
var markers = new Array();
var image_all = "/images/img_yellow.png";
var image_my = "/images/img_blue.png";

var contentAdd =
     "<div id='window_add'>" +
        "<div id='row_name'><label>Назва:</label><input type='text' id='add_name' name='add_name' value=''></div>" +
        "<div id='row_category'><label>Категорія:</label><select id='add_category' name='add_category' value=''></select></div>" +
        "<div id='row_description'><label>Назва:</label><textarea id='add_description' name='add_description'></textarea></div>" +
        "<div id='row_button'><input id='btsave' type='submit' onclick='saveMarker()' value='Добавить'></div>" +
    "</div>";

var infoWindow = new google.maps.InfoWindow();

function loadMarkers() {
    clearMap();
    jQuery.ajax({
        type: "GET",
        dataType: "xml",
        url: document.location.href +"/map/categoryes.xml",
        success: function(result){
           jQuery(result).find("category").each(function () {

           })
          }
        });

    jQuery.ajax({
        type: "GET",
        dataType: "xml",
        url: document.location.href +"/map/places.xml",
        success: function(result){
           jQuery(result).find("place").each(function () {
                var image;
                var Latlng = new google.maps.LatLng(parseFloat(jQuery(this).find("lat").text()), parseFloat(jQuery(this).find("lng").text()));
                if (jQuery(this).find("userId").text() == jQuery(this).find("currentUserId").text())
                {
                    image = image_my;
                } else
                {
                    image = image_all;
                }
                addMarker(Latlng, image, jQuery(this).find("name").text());
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
        contentWindow = contentAdd;
        addMarker(event.latLng, image_my, '');
    })
}

function showWindow(marker)
{
    curmarker = marker;
    var is_new = true;
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
              url: document.location.href +"/map/new",
              success: function(result){
                  infoWindow.setContent(result);
                }
              });

      } else
      {
          infoWindow.setContent("<h2>is from base</h2>");
      }
    infoWindow.setContent('test');
    infoWindow.open(map, marker);
}

function addMarker(location, img, title) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: img,
        draggable: true,
        title: title
    });
//    if (title.length() > 0)
//    {
//        markers.push(marker);
//    }
    google.maps.event.addListener(marker, 'click', function(event) {
        showWindow(marker);
    });

    google.maps.event.addListener(marker, 'rightclick', function(event) {
        dropMarker(marker);
    });
}

function saveMarker() {
    jQuery.ajax({
        type: "POST",
        dataType: "html",
        data: {
                description:  jQuery('#my_description').val(),
                lat:          curmarker.getPosition().lat(),
                lng:          curmarker.getPosition().lng(),
                category:     1
        },
        url: document.location.href +"/map/save",
        success: function(){
            loadMarkers();
            infoWindow.close();
          }
        });
}

function dropMarker(marker)
{
    if (confirm('Удалить маркер?')) {
        marker.setMap(null);
    }
}

function clearMap()
{
     infoWindow.close();
     for (var i = 0; i < markers.length; i++) {
       markers[i].setMap(null);
     }
     markers.length = 0;
}