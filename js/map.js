mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';
// Create a new map instance
export const map = new mapboxgl.Map({
    container: 'map-container',
   style: "mapbox://styles/paridhi12/clkvrhtwx00a101p72ddj8r6v",//"mapbox://styles/paridhi12/cljj53fma008r01pag74jczge",//'mapbox://styles/mapbox/dark-v9',
    //style : 'mapbox://styles/yunjieli/ciu7h63gy00052inrtutrxnfp',
    center: [-100.786052, 36.830348],
    zoom: 4.0,
    pitch : 28,
    dragPan: false
    //maxZoom: 4.7
  });
  
  // add restrictions to map
  map.scrollZoom.disable();
  map.boxZoom.disable();
  map.doubleClickZoom.disable();
  map.touchZoomRotate.disable();
  
  // Load the US states GeoJSON data
  map.on('style.load', () => {
    map.addSource('states', {
      type: 'geojson',
      data: 'https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson'
    });
    // add states layer
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
      data: 'data/final.geojson'
  
    });  
    // add state boundaries
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
      },'state-area');
  
  });