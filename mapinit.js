//initializing map and tileset
var mapquestUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/{styleID}/{z}/{x}/{y}.{ext}',
	mqAttribution = 'Map data &copy; <a href="http://www.mapquest.com">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://www.openstreetmap.org">OpenStreetMap</a>';
	mqSubdomain = ["oatile1", "oatile2", "oatile3", "oatile4"];
	
var street = L.tileLayer(mapquestUrl, {
		maxZoom: 19, 
		styleID: 'osm', 
		ext: 'png',
		subdomains: ["otile1", "otile2", "otile3", "otile4"],
		attribution: mqAttribution}),
	sat = L.tileLayer(mapquestUrl, {
		maxZoom: 18, 
		styleID: 'sat', 
		ext: 'jpg',
		subdomains: mqSubdomain,
		attribution: mqAttribution}),
	hyb = L.layerGroup([L.tileLayer(mapquestUrl, {
		maxZoom: 18, 
		styleID: 'sat',
		ext: 'jpg',
		subdomains: mqSubdomain,
		attribution: mqAttribution}),
		L.tileLayer(mapquestUrl, {
		maxZoom: 19, 
		styleID: 'hyb', 
		ext: 'png',
		subdomains: mqSubdomain,
		attribution: mqAttribution})]);

var map = L.map('map', {
	center: new L.LatLng(42.3935, -71.1062),
	zoom: 14,
	layers: [street]
});

//add control features to map
var baseMap = {
	"Street": street,
	"Satellite": sat,
	"Hybrid": hyb
};

L.control.layers(baseMap).addTo(map);

//event handlers
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Coordinates at this location: " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

//style geojson data
var histStyle = {
		radius: 5,
	    fillColor: "#ff7800",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.8
};

var activityStyle = {
		radius: 5,
		fillColor: "#2567F3",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
};

var borderStyle = {
		stroke: true,
		color: "#111",
		weight: 4,
		fill: false,
		clickable: false
};

//add geojson data to map
L.geoJson(border, {
	style: borderStyle
}).addTo(map);

var historical = new L.geoJson(historical, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, histStyle);
	},
	onEachFeature: onEachFeature
}).addTo(map);

var activities = new L.geoJson(activities, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, activityStyle);
	},
	onEachFeature: onEachFeature
}).addTo(map);


//initialize popup function
function onEachFeature(feature, layer) {
	if (feature.properties) {
		layer.bindPopup("Name: " + feature.properties.name + "</br>"
				+ "Info: " + feature.properties.info + "</br>"
				+ "Address: " + feature.properties.address + "</br>");
	}
}
