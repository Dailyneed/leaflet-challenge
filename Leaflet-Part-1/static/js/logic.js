
    // Store the API endpoint as url.   
    let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    
    d3.json(url).then(function(response) {    
      console.log(response);
          // Once we get a response, send the data.feature object to the createFeatures function.
      createFeatures(response.features);      
      
    }); 
           
    function createFeatures(earthquakeResponse) {
      // Give each feature a popup that describes the magnitude and depth of the earthquake.
      function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>Location: ${feature.properties.place}</p><hr><p>Depth: ${
          feature.geometry.coordinates[2]}</p><hr><p>Time: ${new Date(feature.properties.time)}</p>`);
        
      }
      // Change marker to circle
      function createCircleMarker( feature, latlng) {
        let options = {
          radius: feature.properties.mag*3,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: getColor(feature.geometry.coordinates[2]),
          weight: 0.5,
          opacity: 1,
          fillOpacity: 1
        }
        return L.circleMarker(latlng, options);
      }
      // Create the GeoJSON layer that contains the features array on the earthquakeResponse object.
      // Run the onEachFeature function once for each piece of data in the array.
      let earthquakes = L.geoJSON(earthquakeResponse, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
      });
                       
      // Send earthquakes layer to the createMap function
      createMap(earthquakes);
    }

  //Determines the color of the marker based on the depth of the eartquake
  function getColor(depth) {
    if (depth > 250) {
      return "#582a50";
    } else  if (depth > 200 ) {
      return "#9d434f";
    } else  if (depth > 150) {
      return "#c2763c";
    } else if (depth > 100) {
      return  "#c39637";
    } else if (depth > 50) {
      return "#b8b841";      
    } else {
      return "#6efa96";
    } 
  }
  // Create legend
  let legend = L.control({position: "bottomright"});  
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend'), 
     depth = [0, 50, 100, 150, 200, 250],
     labels = ['<strong>Depth</strong>'];
    
    
    // loop through the intervals and generate a label with a colored square for each interval
       
    for (let i = 0; i < depth.length; i++) {      
      labels.push('<ul styles="background-color:' + getColor(depth[i] + 1) + '"><span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') +'</span></ul>');
            
      }

      div.innerHTML += "<ul>" + labels.join("") + "</ul>";

  return div;
  };
  
    function createMap(earthquakes) {
      // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let world = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });
  
    
    // would like to change this to satellite view but don't know how yet.
    // Need help with it.
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
      // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo,
      "WorldImaagery Map": world
        
    };
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
    /// Creating the map object
    let myMap = L.map("map", {
      center: [40.7, -73.95],
      zoom: 3,
      layers: [street, earthquakes]
    
    });
    // Create a layer control, pass it to baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    legend.addTo(myMap);
    }
  
    
    
  
    
  
  
  
    
  