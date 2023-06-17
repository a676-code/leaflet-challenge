var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(url).then(function (data) {
    console.log("data:", data)
    console.log("features:", data.features)

    createFeatures(data.features)
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    function createMarker(feature, coord) {
        return new L.circle(coord, {
            stroke: false,
            fillOpacity:0.75,
            color:"black",
            // The third coordinate is depth
            fillColor:markerColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag)
        })
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    // https://geospatialresponse.wordpress.com/2015/07/26/leaflet-geojson-pointtolayer/
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
    };

    // Create an overlay object.
    var overlayMaps = {
    "Earthquakes": earthquakes
    };

    // Define a map object.
    var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
    });

    // Pass our map layers to our layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

    // https://codepen.io/haakseth/pen/KQbjdO
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    div.innerHTML += '<span style="background:rgb(125, 249, 255)">depth&lt;1</span><br>';
    div.innerHTML += '<span style="background:rgb(0, 150, 255)">1&lt;depth&lt;2</span><br>';
    div.innerHTML += '<span style="background:rgb(31, 81, 255);color:white">2&lt;depth&lt;4</span><br>';
    div.innerHTML += '<span style="background:rgb(0, 0, 255);color:white">4&lt;depth&lt;6</span><br>';
    div.innerHTML += '<span style="background:rgb(0, 71, 171);color:white">6&lt;depth&lt;8</span><br>';
    div.innerHTML += '<span style="background:rgb(25, 25, 112);color:white">depth&gt;8</span><br>';

    return div;
    };

    legend.addTo(myMap);
}  

// note that some magnitudes may be negative
function markerSize(magnitude) {
    return magnitude * 14000;
}

// https://htmlcolorcodes.com/colors/shades-of-blue/
function markerColor(depth) {
    if (depth < 1) {// lightest
        return "rgb(125, 249, 255)";
    } else if (depth >= 1 && depth < 2) {
        return "rgb(0, 150, 255)";
    } else if (depth >= 2 && depth < 4) {
        return "rgb(31, 81, 255)";
    } else if (depth >= 4 && depth < 6) {
        return "rgb(0, 0, 255)";
    } else if (depth >= 6 && depth < 8) {
        return "rgb(0, 71, 171)";
    } else { // darkest
        return "rgb(25, 25, 112)";
    }
}