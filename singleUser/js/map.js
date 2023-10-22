mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';

const map = new mapboxgl.Map({
    container: 'map-container',
   style: "mapbox://styles/paridhi12/clkvrhtwx00a101p72ddj8r6v",//"mapbox://styles/paridhi12/clmferuo003iv01ns96c2ghue",//,////"mapbox://styles/paridhi12/cljj53fma008r01pag74jczge",//'mapbox://styles/mapbox/dark-v9',
    //style : 'mapbox://styles/yunjieli/ciu7h63gy00052inrtutrxnfp',
    center: [-100.786052, 36.830348],
    zoom: 4.0,
    pitch : 32,
    //maxZoom: 4.7
  });

var years = ["2014", "2016", "2018", "2020"];
var riskLayers =["","AVLN_", "CFLD_","CWAV_","DRGT_","ERQK_","HAIL_",
                  "HWAV_","HRCN_","ISTM_","LNDS_","RFLD_","SWND_","TRND_","TSUN_",
                  "VLCN_", "WFIR_","WNTW_","LTNG_"];
var colorStops = ["#000000", "#222", "#ffc300", "#ff8d19", "#ff5733", "#ff2e00"]; 
const urlMap = {
    'Sea Level': 'https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_1ft/MapServer/tile/{z}/{y}/{x}',
    'Sea Vulnerability': 'https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/SOVI/MapServer/tile/{z}/{y}/{x}', 
    'High Risk Flood': 'https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/Flood_Frequency/MapServer/tile/{z}/{y}/{x}', 
  };

  map.on('style.load', () => {
    map.addSource('states', {
      type: 'geojson',
      data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
    });
    map.addLayer({
      id: 'state-area',
      type: 'fill',
      source: 'states',
      paint: 
        {
        'fill-color': 'black',
        'fill-opacity': 0
  
        }
    });
    map.addSource('disaster', {
      type: 'geojson',
      data: '../data/final.geojson'
  
    });  
    map.addLayer({
      'id':'state-boundaries',
      'type': 'line',
      'source':'states',
      'paint': 
          {
          'line-color':'white',
          'line-width':2,
          'line-opacity':0.1
          }
      });
      map.addLayer(
        {
        'id': 'add-3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
        }
        }
        );
  
  });


const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    flyTo: false, 
  });
  
  map.addControl(geocoder);
  
  geocoder.on('result', (event) => {
    const { geometry } = event.result;
    map.flyTo({
        center: geometry.coordinates,
        zoom: 16,
        speed: 1,
        pitch: 60,
        essential: true,
      });
  });

