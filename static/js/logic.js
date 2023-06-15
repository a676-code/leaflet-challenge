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
            fillColor:"green",
            radius: 20000
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

  
    var markers = [];

    d3.json(url).then(function (data) {
        for (var i = 0; i < data.features.length; i++) {
            markers.push(
                L.circle(data.features[i].geometry.coordinates, {
                    stroke: false,
                    fillOpacity:0.75,
                    color:"black",
                    fillColor:markerColor(data.features[i].properties.mag),
                    radius: markerSize(data.features[i].properties.mag)
                })
            )
        }
    });

    console.log("markers:", markers);

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
  
}  

// note that some magnitudes may be negative
function markerSize(magnitude) {
    return magnitude * 50;
}

// https://htmlcolorcodes.com/colors/shades-of-red/
function markerColor(depth) {
    if (depth < 1) {
        return "rgb(218, 247, 166)";
    } else if (depth >= 1 && depth < 2) {
        return "rgb(255, 195, 0)";
    } else if (depth >= 2 && depth < 4) {
        return "rgb(255, 87, 51)";
    } else if (depth >= 4 && depth < 6) {
        return "rgb(199, 0, 57)";
    } else if (depth >= 6 && depth < 8) {
        return "rgb(144, 12, 63)";
    } else {
        return "rgb(74, 4, 4)";
    }
}