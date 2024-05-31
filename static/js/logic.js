let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    });
  
  // Create the map object with options.
  let map = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
  });
  // Add our 'basemap' tile layer to the map.
  basemap.addTo(map);

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then((data)=> {
    function radius(magnitude){
        if (magnitude===0){
            return 1;

        }
        return magnitude*4;
    }
    // Circles color palette based on depth of the earthquake (with greater depth appearing darker in color).
    function getColor(depth) {
        switch (true) {
          case depth > 90:
            return "#ea2c2c";
          case depth > 70:
            return "#ea822c";
          case depth > 50:
            return "#ee9c00";
          case depth > 30:
            return "#eecc00";
          case depth > 10:
            return "#d4ee00";
          default:
            return "#98ee00";
        }
      }
      // Create a GeoJson layer containing the features array 
      function styles(feature){
        return {
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: radius(feature.properties.mag),
            fillOpacity: 1,
            weight: 0.5,
            stroke: true,
        }
      }
     
    L.geoJson(data,{
      pointToLayer: function(feature, latlng){
          return L.circleMarker(latlng);
      },

      style: styles,

      onEachFeature: function (feature, layer) {
        layer. bindPopup (
          "magnitude: "+ feature.properties.mag + "<br>depth:" + feature.geometry.coordinates[2]+"<br>location:"+feature.properties.place
        );
      }


    

    }).addTo(map)

    let legend = L.control({
      position: "bottomright"
    });

    legend. onAdd = function(){
      let div = L. DomUtil. create("div", "info legend");

      let grade = []
      let color = []

      for (let i=0; i <grade.length; i ++){
        div.innerHTML += "<i syle = 'background:" + color[i]+ "'></i> " + grade[i] + (grade[i + 1] ? "&ndash;" + grade[i + 1] + "br" : "+");
      }
      return div;
    };

    legend.addTo(map);
  });