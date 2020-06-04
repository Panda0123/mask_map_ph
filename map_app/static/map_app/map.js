import credentials
// First we check if you support touch, otherwise it's click:
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

//add mapbox accesstoken here
mapboxgl.accessToken = credentials.accessToken;

// retrieve information
var geojson = JSON.parse(document.getElementById('data').textContent);
var is_logged_in =  JSON.parse(document.getElementById('data2').textContent)== 1;
if(is_logged_in) {
   var username = JSON.parse(document.getElementById('data3').textContent);
}
console.log(geojson);
console.log(is_logged_in);


var map = new mapboxgl.Map({
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v11',
   center: [124, 10.470548],
   zoom: 11
});


var geocoder = new MapboxGeocoder({
   accessToken: mapboxgl.accessToken,
   mapboxgl: mapboxgl,
   placeholder: 'Search location',
   zoom: 14 ,
});

const geoloc =  new mapboxgl.GeolocateControl({
   positionOptions: {
      enableHighAccuracy: true
   },
   trackUserLocation: true,
});


var gecod_add   = document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
var geloc_add   = document.getElementById('geoloc').appendChild(geoloc.onAdd(map));
var cur_loc;
const closeModalBtn = document.querySelectorAll('[data-close-btn]')
const overlay = document.getElementById('overlay')
const dir_btn = document.getElementById('dir_btn')
const geoloc_btn = document.getElementById('geoloc')
const notif_loc = document.getElementById('info_notif_loc')
var layer_btn = document.getElementById('btn_layer')
var d3_btn = document.getElementById('btn_3d')

var mark_clicked_el;
var mark_clicked_info;
var mark_target_el;
var geo_loc_btn;
var satId = 'satellite-streets-v11';
var streetId = 'streets-v11';
var isSat = false;
var is3d = false;
var isDir = false;
var layer;
//handling geolocation object
geoloc.on('geolocate', function(e) {
   cur_loc = [e.coords.longitude, e.coords.latitude];
});

// Then we bind via thát event. This way we only bind one event, instead of the two as below
layer_btn.addEventListener(touchEvent, clicked_layer);
function clicked_layer(e) {
   if(isSat) {
      map.setStyle('mapbox://styles/mapbox/' + streetId);
      isSat = false;
   } else {
      map.setStyle('mapbox://styles/mapbox/' + satId);
      isSat = true;
   }
  setTimeout(function() {
      if(isDir) {
         if(map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
         }
         map.addLayer(layer);
         console.log('wassup');
         console.log(layer)
      }
   }, 1000);
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



map.on('load', function(e) {
   /* Add the data to your map as a layer */ 
   // map.addSource('places', {
   //    type: 'geojson',
   //    data: geojson
   // });
   addMarkers();
});

function flyToStore(marker) {
   map.flyTo({
      center: [marker.coor_long, marker.coor_lat],
      // zoom: 18
   });
}

function openPopUp(marker) {
   // const modal = document.querySelector(button.dataset.modalTarget)
   var el_cont = document.getElementById('info_cont');
   if(el_cont == null) return
   el_cont.classList.add('active');
   overlay.classList.add('active');

   //send info about marker
   document.getElementById('id_title').textContent = marker.store_name;
   document.getElementById('id_quant').textContent = marker.quantity;
   document.getElementById('id_price').textContent = marker.min_price + " - " + marker.max_price + " Php";
   document.getElementById('id_contact').textContent = marker.contact_num;
   document.getElementById('id_time').textContent = marker.time_in + " - " + marker.time_out;

   if(marker.quantity <= 0) {
      var el = document.getElementById('id_avail');
      el.textContent = 'No Stock';
      el.style.color = '#d64545';
   } else {
      var el = document.getElementById('id_avail');
      el.textContent = 'Available';
      el.style.color = 'rgb(100, 175, 111)';
   }
}

function closePopUp(modal){
   if(modal == null) return
   modal.classList.remove('active')
   overlay.classList.remove('active')
   notif_loc.textContent = ""
}

//settings click event for the overlay
overlay.addEventListener('click', () =>{
   const modals = document.querySelectorAll('.info_cont.active')
   modals.forEach(modal => {
      closePopUp(modal)
   })
});


//dir btn clicked
dir_btn.addEventListener('click', () => {
   var active = (geo_loc_btn.getAttribute("aria-pressed") == "true");
   if(active) {
      this.isDir = true;
      set_Dir();
   } else {
      notif_loc.textContent = "Turn on your locaiton first";
   }
});


//set direction
function set_Dir() {
   //delete old layer
   var coor = cur_loc[0] + ',' +cur_loc[1] + ';' +  mark_clicked_info.coor_long + ','+  mark_clicked_info.coor_lat;

   var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + coor 
              + '?geometries=geojson&steps=true&access_token=' + mapboxgl.accessToken; 
   var req = new XMLHttpRequest();
   req.responseType = 'json';
   req.open('GET', url, true);
   req.onload = function() {
      var jsonresponse = req.response;
      console.log(jsonresponse);
      var distance = jsonresponse.routes[0].distance*0.001; //returns metters
      var duration = jsonresponse.routes[0].duration/60; //in minutes bec of /60
      var steps = jsonresponse.routes[0].legs[0].steps;
      var coords = jsonresponse.routes[0].geometry;
      addRoute(coords);
   };
   
   req.send();
}

function addRoute(coords) {
   if(map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
   }
   if(!map.getSource('route'))  {
      layer = {
         'id': 'route',
         'type': 'line',
         'source': {
            'type': 'geojson',
            'data': {
               'type': 'Feature',
               'properties': {},
               'geometry':coords
            }
         },
         'layout': {
            'line-join': 'round',
            'line-cap': 'round',
         },
         'paint': {
            'line-color': '#4264fb',
            'line-width': 15,
            'line-opacity': 1
         },
      };

      map.addLayer(layer);
   };

   const modals = document.querySelectorAll('.info_cont.active')
   modals.forEach(modal => {
      closePopUp(modal)
   })

   //zoom to current position
   map.flyTo({
      center: coords[0],
      zoom: 15
   });


   mark_clicked_el.classList.add('active');

   if( mark_target_el != null){
      mark_target_el.classList.remove('active');
   }
   mark_target_el = mark_clicked_el;
}

//setting the events for the close btn
closeModalBtn.forEach(button => {
   button.addEventListener('click', () => {
      const modal = button.closest('.info_cont');
      closePopUp(modal);
      notif_loc.textContent = "";
   })
}
)

geojson.forEach(function(store, i) {
   store.id = i;
});

function addMarkers() {
   /* For each feature in the GeoJSON object above: */
   geojson.forEach(function(marker) {
      /* Create a div element for the marker. */
      var el = document.createElement('div');
      /* Assign a unique `id` to the marker. */
      el.id = "marker-" + marker.id;
      /* Assign the `marker` class to each marker for styling. */
      // el.className = 'marker';
      
      el.classList.add('marker')
      el.style = 'z-index:1;'

      if(is_logged_in) {
         if(username== marker.username) {
            el.classList.add('user') //add new style to marker of currently logged in user
         }
      }

      if(marker.quantity <= 0) {
         el.classList.add('out')
      }
      /**
      * Create a marker using the div element
      * defined above and add it to the map.
      **/
      new mapboxgl.Marker(el, { offset: [0, -23] })
         .setLngLat([marker.coor_long, marker.coor_lat])
         .addTo(map);
      el.addEventListener('click', function(e){
         /* Fly to the point */
         flyToStore(marker);
         /* Close all other popups and display popup for clicked store */
         openPopUp(marker);
         mark_clicked_el = el;
         mark_clicked_info = marker;
         geo_loc_btn = document.getElementsByClassName('mapboxgl-ctrl-geolocate')[0];
      });
   });
}

