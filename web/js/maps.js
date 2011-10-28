var map;
var image_my = "/images/img_yellow.png";
var image_all = "/images/img_blue.png";
var text_title = "hello World";
var contentWindow = "<div id='comment_label'>Введите коментарий</div>" +
                    "<textarea id='infotext' name='infotext' style='infotext'></textarea><br />" +
                    "<a id='marker_save' href='http://localhost/maps'>Сохранить</a>";
var infoWindow = new google.maps.InfoWindow({
content: contentWindow
})

function initialize() {
  var Latlng = new google.maps.LatLng(49.438, 32.067);
  var Options = {
      zoom: 12,
      center: Latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  }
map = new google.maps.Map(document.getElementById("map"), Options);

function addMarker(location, img, hint, description) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: img,
        draggable: true,
        title: hint
    })

    google.maps.event.addListener(marker, 'click', function(event) {
        infoWindow.open(map, marker);
    })
    google.maps.event.addListener(marker, 'rightclick', function(event) {
        if (confirm('Удалить маркер?')) {
            marker.setMap(null);
        }
    })
}

google.maps.event.addListener(map, 'click', function(event) {
    addMarker(event.latLng, image_all, text_title, contentWindow);
})
}