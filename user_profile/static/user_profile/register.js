let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

mapboxgl.accessToken = 'pk.eyJ1IjoibGVucm9uIiwiYSI6ImNrOTNqOTNnczAyOGszbXFlaHdreWJsNngifQ.GB1wrdn1Bud9R9UHZPTY-g';
var map = new mapboxgl.Map({
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v11',
   center: [124.620937, 8.442380],
   zoom: 15,
});

console.log('load')

const geoloc =  new mapboxgl.GeolocateControl({
   positionOptions: {
      enableHighAccuracy: true
   },
   trackUserLocation: true,
});

var geocoder = new MapboxGeocoder({
   accessToken: mapboxgl.accessToken,
   mapboxgl: mapboxgl,
   placeholder: 'Seach',
   marker: false,
   zoom: 14 ,
});


var gecod_add   = document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
var geloc_add   = document.getElementById('geoloc').appendChild(geoloc.onAdd(map));
var txtField_lat = document.getElementById('id_coor_lat');
var txtField_long = document.getElementById('id_coor_long');
var layer_btn = document.getElementById('btn_layer');
var d3_btn = document.getElementById('btn_3d');
var satId = 'satellite-streets-v11';
var streetId = 'streets-v11';
var isSat = false;
var is3d = false;


var marker = new mapboxgl.Marker({
   draggable: true
   })
   .setLngLat([124.620937, 8.44238])
   .addTo(map);

// marker.setStyle('z-index:5;');

function onDrag() {
   var lngLat = marker.getLngLat();
   txtField_lat.value = parseFloat(lngLat.lat.toFixed(8));
   txtField_long.value = parseFloat(lngLat.lng.toFixed(8));
}
marker.on('drag', onDrag);

function clickMap(e) {
   marker.setLngLat(e.lngLat);
   txtField_lat.value = parseFloat(e.lngLat['lat'].toFixed(8));
   txtField_long.value = parseFloat(e.lngLat['lng'].toFixed(8));
}
map.on('click', clickMap)

layer_btn.addEventListener(touchEvent, clicked_layer);
function clicked_layer(e) {
   if(isSat) {
      map.setStyle('mapbox://styles/mapbox/' + streetId);
      isSat = false;
   } else {
      map.setStyle('mapbox://styles/mapbox/' + satId);
      isSat = true;
   }
}


d3_btn.addEventListener(touchEvent, clicked_3d);
function clicked_3d(e) {
   if(is3d) {
      map.setBearing(0);
      map.setPitch(0);
      is3d = false;
   } else {
      map.setBearing(-60);
      map.setPitch(60);
      is3d = true;
   }
}