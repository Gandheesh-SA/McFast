var map;
var latitude = [];
var longitude = [];
var query;


function initMap() {
  
  
 

  var style = [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }];

  var location = { lat: 12.954990815643217, lng: 77.6604692452247 }
  

  latitude.push(location.lat);
  longitude.push(location.lng);

  var position = new google.maps.LatLng(location.lat, location.lng);


  var options = { styles: style, center: position, zoom: 18 };

  const mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, options);

  let marker = new google.maps.Marker({ position: location, map: map, label: "You are Here" }); 


  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({ location: location, radius: 1000, type: ['hospital'], keyword: "((Hospitals) AND (24 hours)", }, getNearbyPlaces);


  autocomplete = new google.maps.places.Autocomplete(document.getElementById('search'),

    {
      componentRestriction: { 'country': ['in'] },
      fields: ['geometry', 'name'],
    });

  const originMarker = new google.maps.Marker({ map: map, label: 'You are Here' });
  originMarker.setVisible(false);
  let originLocation = map.getCenter();

  autocomplete.addListener("place_changed", () => {

    latitude = [];
    longitude = [];


    originMarker.setVisible(false);
    originLocation = map.getCenter();

    const place = autocomplete.getPlace();

    originLocation = place.geometry.location;
    console.log(originLocation)
    map.setCenter(originLocation);
    map.setZoom(18);

    originMarker.setPosition(originLocation);
    originMarker.setVisible(true);

    latitude.push(originLocation.lat());
    longitude.push(originLocation.lng());

    service.nearbySearch({ location: originLocation,  radius: 1000, type: ['hospital'], keyword: "((Hospitals) AND (24 hours)", }, getNearbyPlaces);


  });
}

// GET NEARBY PLACES
function getNearbyPlaces(results, status, pagination) {

  if (status !== 'OK') return;

  getLatLong(results);

  createMarkers(results);
  getNextPage = pagination.hasNextPage && function () {
    pagination.nextPage();
  };
}

// Latitude, Longitude & Distance
function getLatLong(coordinates) {

  // console.log(typeof(coordinates[0].geometry.location.lat()));

  //console.log(coordinates);

  var places = [];

  for (var i = 0; i < coordinates.length; i++) {

    places.push(coordinates[i].name);

    latitude.push(coordinates[i].geometry.location.lat());
    longitude.push(coordinates[i].geometry.location.lng());

  }

  console.log(places)
  //console.log(longitude)
  calculateDistance(latitude, longitude, places);

}

/* FUNCTION TO CREATE MARKERS */
function createMarkers(places) {

  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, place; place = places[i]; i++) {

    var image = {
      url: i,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      
      icon: image,
      label: place.name,
      position: place.geometry.location
    });
    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}

 
// FUNCTION TO CALCULATE DISTANCE

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}


function calculateDistance(lats, longs, places)  {

  var distance = [];

  var radius = 6371.0710;
  var rlat1, rlat2, difflat, difflon, dist, j;


  for (var i = 0; i < lats.length; i++) {
    j = i + 1;
    j = j == lats.length ? 0 : j;
    //console.log("Value of J", j);
    rlat1 = degrees_to_radians(lats[i]);
    rlat2 = degrees_to_radians(lats[j]);
    //console.log("Hello",rlat1)
    //console.log("W",rlat2)

    difflat = rlat2 - rlat1;
    //console.log("K", difflat);

    difflon = degrees_to_radians(longs[j] - longs[i]);

    //console.log("g", difflon);

    dist = 2 * radius * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));

    //console.log(dist)
    distance.push(dist);
  }
  //console.log(distance);

  solution(distance, places);

}

// Shortest Distance Code Using Dijiktr Algorithmn

function minDistance(dist, shortest, V) {

  let min = Number.MAX_VALUE;
  let min_index = -1;

  for (let v = 0; v < V; v++) {
    if (shortest[v] == false && dist[v] <= min) {
      min = dist[v];
      min_index = v;
    }
  }
  return min_index;
}

function display(dist,V, places) { 

  var dict ={};

  var items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });
  
 
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  

  for(var i=1;i<V;i++){
    dict[places[i-1]] = dist[i]
  }
  
  var items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });
  
  
  items.sort(function(first, second) {
    return first[1] - second[1];
  });

  console.log(items)

  var e = "<hr/>";

  for (let i = 0; i < items.length; i++) {

    e += '<h4>' + items[i][0] + " = " + items[i][1] + "<br/>";
    
  }
  document.getElementById("result").innerHTML = e;
}

function dijkstra(graph, source, V, places) {

  let dist = new Array(V);
  let Shortest = new Array(V);

  for (let i = 0; i < V; i++) {
    dist[i] = Number.MAX_VALUE;
    Shortest[i] = false;
  }


  dist[source] = 0;

  for (let count = 0; count < V - 1; count++) {


    let u = minDistance(dist, Shortest, V);

    Shortest[u] = true;


    for (let v = 0; v < V; v++) {

      if (!Shortest[v] && graph[u][v] != 0 &&
        dist[u] != Number.MAX_VALUE &&
        dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
 

  display(dist, V, places);
}
function solution(distance, places){

var graph = new Array(distance.length);
for (var i = 0; i < graph.length; i++) {
  graph[i] = new Array(distance.length);
}

for (var i = 0; i < distance.length; i++) {
  for (var j = 0; j < distance.length; j++) {
    graph[i][j] = 0;
  }
}
for (var i = 0; i < distance.length; i++) {
  for (var j = 0; j < distance.length; j++) {
    graph[i][j] = 0;
  }
}

for(var i=0; i<distance.length;i++){
  var j =i+1;
  j = j == distance.length ? 0 : j;
  graph[i][j] = distance[i];
  graph[j][i] = distance[i];
}

var n= distance.length;


dijkstra(graph,0,n, places);
}

function getHeading(){
 
  query = document.getElementsByTagName('a')[0].innerHTML;
  console.log(query);
}

getHeading()