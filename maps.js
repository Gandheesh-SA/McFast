var map;
var latitude = [];
var longitude = [];


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

    service.nearbySearch({ location: originLocation, radius: 1000, type: ['hospital'], keyword: "((Hospitals) AND (24 hours)", }, getNearbyPlaces);


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

  for (var i = 0; i < coordinates.length; i++) {

    latitude.push(coordinates[i].geometry.location.lat());
    longitude.push(coordinates[i].geometry.location.lng());

  }

  //console.log(typeof(latitude))
  //console.log(longitude)
  calculateDistance(latitude, longitude);

}

/* FUNCTION TO CREATE MARKERS */
function createMarkers(places) {

  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, place; place = places[i]; i++) {

    var image = {
      //url: i,
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

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}


function calculateDistance(lats, longs) {

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

  solution(distance);

}

// Shortest Distance Code Usind Dijiktr Algorithmn

function minDistance(dist, sptSet, V) {

  let min = Number.MAX_VALUE;
  let min_index = -1;

  for (let v = 0; v < V; v++) {
    if (sptSet[v] == false && dist[v] <= min) {
      min = dist[v];
      min_index = v;
    }
  }
  return min_index;
}

function printSolution(dist,V) {
  //document.write("Vertex \t\t Distance from Source<br>");
  for (let i = 0; i < V; i++) {

    console.log(i, dist[i])
    
  }
}


function dijkstra(graph, src, V) {
  let dist = new Array(V);
  let sptSet = new Array(V);

  for (let i = 0; i < V; i++) {
    dist[i] = Number.MAX_VALUE;
    sptSet[i] = false;
  }


  dist[src] = 0;

  for (let count = 0; count < V - 1; count++) {


    let u = minDistance(dist, sptSet, V);

    sptSet[u] = true;


    for (let v = 0; v < V; v++) {

      if (!sptSet[v] && graph[u][v] != 0 &&
        dist[u] != Number.MAX_VALUE &&
        dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }

  printSolution(dist, V);
}
function solution(distance){

//var distance = [40,10,30,20,60];

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
 
console.log(graph);
dijkstra(graph,0,n);
}
