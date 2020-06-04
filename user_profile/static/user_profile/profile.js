let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
mapboxgl.accessToken = 'pk.eyJ1IjoibGVucm9uIiwiYSI6ImNrOTNqOTNnczAyOGszbXFlaHdreWJsNngifQ.GB1wrdn1Bud9R9UHZPTY-g';

//getting data from views
var info = JSON.parse(document.getElementById('data').textContent);
console.log(info);

//loading map and controls
const map = new mapboxgl.Map({
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v11',
   center: [info.coor_long, info.coor_lat],
   zoom: 15,
});

const geoloc =  new mapboxgl.GeolocateControl({
   positionOptions: {
      enableHighAccuracy: true
   },
   trackUserLocation: true,
});

const geocoder = new MapboxGeocoder({
   accessToken: mapboxgl.accessToken,
   mapboxgl: mapboxgl,
   placeholder: 'Seach',
   marker: false,
   zoom: 14 ,
});

const marker = new mapboxgl.Marker({
   draggable: true
   })
   .setLngLat([info.coor_long, info.coor_lat])
   .addTo(map);

//variables for controls, txtfield, buttons, and state
var gecod_add   = document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
var geloc_add   = document.getElementById('geoloc').appendChild(geoloc.onAdd(map));
var txtField_lat = document.getElementById('id_coor_lat');
var txtField_long = document.getElementById('id_coor_long');
var txtField_tmOpen = document.getElementById('id_time_open');
var txtField_tmClose = document.getElementById('id_time_close');
var layer_btn = document.getElementById('btn_layer');
var d3_btn = document.getElementById('btn_3d');
var satId = 'satellite-streets-v11';
var streetId = 'streets-v11';
var isSat = false;
var is3d = false;


//functions
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

//setting up the value in time open and close
txtField_tmClose.value = info.time_close;
txtField_tmOpen.value = info.time_open;