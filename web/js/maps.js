jQuery.noConflict();
jQuery('document').ready(function() {
    jQuery('body').attr('onload', 'initialize()');
    jQuery('#test').attr('onclick', 'test()');

});

var map;
var markers = new Array();
var image_all = "/images/img_yellow.png";
var image_my = "/images/img_blue.png";
var text_title = "hello World";
var contentWindow = "<div id='popup_window'>" +
                      "<label>Коментарий</label><br />" +
                      "<textarea id='my_description' name='my_description' style='my_description'></textarea><br />" +
                      "<input type='submit' onclick='ClickSave()' value='Добавить'>" +
                    "</div>";
var infoWindow = new google.maps.InfoWindow();

function ClickSave() {
    jQuery.ajax({
        type: "POST",
        dataType: "html",
        data: {
                description:  jQuery('#my_description').val()
        },
        url: document.location.href +"/map/save",
        success: function(html){
            jQuery('#places').html(html);
          }
        });
}

function test()
{
    for (var i = 0; i < markers.length; i++) {
        alert(markers[i].getTitle());
    }
}


function initialize() {
    var Latlng = new google.maps.LatLng(49.438, 32.067);
    var Options = {
        zoom: 12,
        center: Latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    }
    map = new google.maps.Map(document.getElementById('map'), Options);

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, image_my, text_title, contentWindow);
    })
}

function dropMarker(marker)
{
    if (confirm('Удалить маркер?')) {
        marker.setMap(null);
    }
}

function showWindow(marker)
{
    infoWindow.setContent(marker.getTitle());
    infoWindow.open(map, marker);
}

function addMarker(location, img, title, contentWindow) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: img,
        draggable: true,
        title: "marker_"+markers.length
    })
    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function(event) {
        showWindow(marker);
    })

    google.maps.event.addListener(marker, 'rightclick', function(event) {
        dropMarker(marker);
    })
}