// importing files
import { legendTemplate } from './legend.js';
import { popupTemplate } from './popupTemplate.js';

const urlMap = {
  'Sea Level': 'https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_1ft/MapServer/tile/{z}/{y}/{x}',
  'Sea Vulnerability': 'https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/SOVI/MapServer/tile/{z}/{y}/{x}', // Replace with the actual URL for Sea Vulnerability
  'High Risk Flood': 'https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/Flood_Frequency/MapServer/tile/{z}/{y}/{x}', // Replace with the actual URL for High Risk Flood
};


// declaring global vars
mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaWRoaTEyIiwiYSI6ImNsaWMxcnRwejBnYXkzZG1ub21xbmxjdWcifQ.xfiUnCHe2s0IX5NeJ0qSxQ';
var colorStops = ["#000000", "#222", "#ffc300", "#ff8d19", "#ff5733", "#ff2e00"]; 
var geojson;
const container = document.getElementById('map-container');
const layerList = document.getElementById('menu'); // light/dark selection menu
const inputs = layerList.getElementsByTagName('input');
var popups= {}; // to store all the pop ups
var selectedStateIds =[]; // to store the currently selected/active states
var isDragging={}

// Create a new map instance
const map = new mapboxgl.Map({
  container: 'map-container',
  //style: 'mapbox://styles/paridhi12/clj31l7oj02yj01qhdhtb300t', 
  style: "mapbox://styles/paridhi12/clkvrhtwx00a101p72ddj8r6v",//"mapbox://styles/paridhi12/cljj53fma008r01pag74jczge",//'mapbox://styles/mapbox/dark-v9',
  //style : 'mapbox://styles/yunjieli/ciu7h63gy00052inrtutrxnfp',
  center: [-100.786052, 36.830348],
  zoom: 5.8,
  pitch : 28,
  dragPan: false
  //maxZoom: 4.7
});

// add restrictions to map
map.scrollZoom.disable();
map.boxZoom.disable();
map.doubleClickZoom.disable();
map.touchZoomRotate.disable();


// Change the map themes
var mapContainer = map.getContainer();
for (const input of inputs) {
  input.onclick = (layer) => {
    const layerId = layer.target.id;

    // Show a confirmation dialog before changing the style
    const confirmed = window.confirm("Are you sure you want to change the map style? It might affect other users and you might have to re-submit visualizations");
    if (confirmed) {
      map.setStyle(layerId);
    }
  };
}



// Load the US states GeoJSON data
map.on('style.load', () => {
    //add the sea level source
    map.addSource('raster-source'+"Sea Level", {
      type: 'raster',
      tiles: [urlMap["Sea Level"]],
      tileSize: 256,
    }); 
    map.addSource('raster-source'+"Sea Vulnerability", {
      type: 'raster',
      tiles: [urlMap["Sea Vulnerability"]],
      tileSize: 256,
    }); 
    map.addSource('raster-source'+"High Risk Flood", {
      type: 'raster',
      tiles: [urlMap["High Risk Flood"]],
      tileSize: 256,
    }); 

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
  //add sea level raster data
  // map.addLayer({
  //   id: 'raster-layer',
  //   type: 'raster',
  //   source: 'raster-source',
  // });


  map.addSource('counties', {
    type: 'geojson',
    data: 'counties-data.geojson'
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


// Event listener on first click on states
map.on("click",'state-area',(e)=> {
  
  const stateId = e.features[0].properties.STATE_ID; // id of the clicked state
  const names = "visualization"+ stateId;
  const stateName = e.features[0].properties.STATE_NAME; // name of the clicke state
  selectedStateIds.push(stateId); // push state id to the active states list


  // Check if a popup already exists for the state
  if (popups[stateId]) 
  {
    // Reuse the existing popup
    console.log("already existing pop up for ", stateId);
    const popup=popups[stateId];
    
    
  } else 
  {
    // Create a new popup for the state
    const popup = new mapboxgl.Popup({className: 'custom-popup'+stateId,closeOnClick:"false" }).setLngLat(e.lngLat).
    setHTML(popupTemplate(stateId, stateName));
    popups[stateId] = popup; 
    isDragging[stateId]=false;
  }
  // To make the popup draggable
  for (const stateId of selectedStateIds) {
    const popup = popups[stateId];
    popup.addTo(map);
    const popupHeader = popup._content.querySelector(".header");
    // Add the mousedown event listener to the popup content
    popupHeader.addEventListener('touchstart', (e) => {
      //e.stopPropagation();
      e.preventDefault();
      isDragging[stateId] = true;
    });
  
    // Add the mousemove event listener to the document
    document.addEventListener('touchmove', (e) => {
      if (isDragging[stateId]) {
        // Get the current popup for the item and update its position
        const popup = popups[stateId];
        const { clientX, clientY } = e.type.startsWith('touch') ? e.touches[0] : e;
        const pos = map.unproject([clientX, clientY]);
        popup.setLngLat(pos);
      }
    });
  
    // Add the mouseup event listener to the document
    document.addEventListener('touchend', (e) => {
      isDragging[stateId] = false;
    });
  }


  

  // why not working??
  // var mini = document.getElementById("minimize-button"+stateId);
  // var show = document.getElementById("show-header"+stateId);
  // //var hide = document.getElementById("hide"+stateId);
  // var p = document.getElementById("pp");

  // console.log("eta", pp);

  // mini.addEventListener("click",(event)=>{
  //   const isMinimized = true;
  //   if (isMinimized) {
  //     // If it was minimized, make it visible again
  //     p.style.height = "10px";
  //   } else {
  //     // If it was not minimized, hide it
  //     p.style.height = "100px";
  //   }

  // } );



  var slider =document.getElementById("height"+stateId);
  slider.addEventListener('mouseend', (event) => {
    event.stopPropagation();
  });

  var seaLevelCheckbox =document.getElementById("sea-level-checkbox"+stateId);
  seaLevelCheckbox.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });

  // Change the slider based on sea level 
  seaLevelCheckbox.addEventListener("change", function() {
    if (this.checked) 
    {
      slider.removeAttribute("disabled");
      var selectedHeight = document.getElementById("selected-height"+stateId);
    
      selectedHeight.textContent = slider.value + " ft";
      slider.addEventListener("input", function() {
          selectedHeight.textContent = slider.value + " ft";
        });
    } 
    else 
    {
      slider.setAttribute("disabled", "disabled");
    }
  });

  // when done button is clicked
  var doneButton = document.getElementById("done-button"+stateId)
  doneButton.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });

  var sviCheckbox =document.getElementById("svi-checkbox"+stateId);
  // Remove dragging effect when done is clicked
  sviCheckbox.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });

  doneButton.addEventListener("click", function() {
  var sviCheckbox =document.getElementById("svi-checkbox"+stateId);
  var seaLevelCheckbox =document.getElementById("sea-level-checkbox"+stateId)
  
  // Add sea level layer when it is selected else remove if any
  if (seaLevelCheckbox.checked){
    console.log("sea level checked")
    if (!map.getLayer("county-border"+stateId))
    {
      map.addLayer({
        id: "county-border" + stateId,
        type: "line",
        source: 'counties',
        paint:{
          'line-color': "#aaa",
          "line-width": 1,
          "line-opacity":1
        },
        filter: ['==','STATEFP',stateId]
      });
    }
  }
  else {
    if (map.getLayer("county-border"+stateId)){
      map.removeLayer("county-border"+stateId)
    }
  }
  // Add svi layer when it is selected else remove if any
  if (sviCheckbox.checked) {
    console.log("SVI checkbox checked");
    if (!map.getLayer("county-area"+stateId)){
      map.addLayer({
        id: "county-area"+stateId,
        type: 'fill-extrusion',
        source: 'counties',
        paint: {
        'fill-extrusion-color': {
            property: 'E_UNEMP',
            stops: [
                [20, colorStops[2]],
                [100, colorStops[3]],
                [240, colorStops[4]],
                [400, colorStops[5]]
            ]
        }  ,                      
        'fill-extrusion-height':[
            'interpolate',
            ['linear'],
            ['to-number', ['get', 'COUNTYFP']],
            0, //min
            12000, 
            500, //max
            120000, 
      ],
        'fill-extrusion-height-transition':{
          duration: 2000,
          delay: 0
      },
        'fill-extrusion-opacity': 0.7,
        'fill-extrusion-base':0,
        },
        filter: ['==', 'STATEFP', stateId] ,      
      });  

    }

}

  else{
    if (map.getLayer("county-area"+stateId)){
      map.removeLayer("county-area"+stateId)
    }
  }
});


var closeButton = document.getElementById("close-button"+stateId)
  //Remove dragging effect when close is clicked
  closeButton.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });
  // when close button is clicked, remove everything - all layers if any, popup, selected state etc
  closeButton.addEventListener("click", function() {
  if (map.getLayer("county-area"+stateId)){
    map.removeLayer("county-area"+stateId);
  }
  if (map.getLayer("county-border"+stateId)){
    map.removeLayer("county-border"+stateId);
  }
  const pp = popups[stateId];
  if (popups.hasOwnProperty(stateId)) {
    console.log("removed for state ", stateId);
    delete popups[stateId];
  }
  selectedStateIds = selectedStateIds.filter((id) => id !== stateId);
  pp.remove();

});


// When a county is clicked (only if there is svi layer)
function handleCountyAreaClick(e) {
  // Remove the event listener to prevent multiple executions
  map.off("click", "county-area"+stateId, handleCountyAreaClick);

  const countyName = e.features[0].properties.NAME;
  const countySVI = parseFloat(e.features[0].properties.E_UNEMP).toFixed(2);
  const countyPOP = parseFloat(e.features[0].properties.E_TOTPOP).toFixed(2);
  const maxSVI = parseInt(e.features[0].properties.maxSVI);
  const minSVI = parseInt(e.features[0].properties.minSVI);
  const maxPOP = parseInt(e.features[0].properties.maxPOP);
  const minPOP = parseInt(e.features[0].properties.minPOP);

  // Calculate relative position
  const sviPercentage = (countySVI - minSVI) / (maxSVI - minSVI) * 100;
  const popPercentage = (countyPOP - minPOP) / (maxPOP - minPOP) * 100;

  const pp =popups[stateId];
  const pp_content = pp._content;

  // Remove previous info borad if any
  if (document.querySelector('.info'+stateId)){
    (document.querySelector('.info'+stateId)).remove()

  }

  // create new info board and append to the popup
  const newDiv = document.createElement('div');
  newDiv.className = 'info'+stateId; 
  newDiv.id = 'info'+stateId;
  newDiv.innerHTML = legendTemplate(countyName, minSVI, maxSVI, sviPercentage, countySVI, minPOP, maxPOP, popPercentage, countyPOP);
  pp_content.appendChild(newDiv);

}
map.on("click", "county-area"+stateId, handleCountyAreaClick);
});


document.addEventListener("DOMContentLoaded", function() {

const sl = document.getElementById("sl");
const sv = document.getElementById("sv");
const fl = document.getElementById("fl");

console.log(sl.value);

sl.addEventListener("change",()=>{
  if (sl.checked){
    if (map.getLayer('raster-layer'+"High Risk Flood")){ map.removeLayer('raster-layer'+"High Risk Flood");}
    if (map.getLayer('raster-layer'+"Sea Vulnerability")){ map.removeLayer('raster-layer'+"Sea Vulnerability");}
    console.log("dd");
    if (~map.getLayer('raster-layer'+"Sea Level")){
    map.addLayer({
      id: 'raster-layer'+"Sea Level",
      type: 'raster',
      source: 'raster-source'+"Sea Level",
    });
  }
  }
  else{
    map.removeLayer('raster-layer'+"Sea Level");
    
  }

} );

sv.addEventListener("change",()=>{
  if (sv.checked){
    console.log("jj");
    if (map.getLayer('raster-layer'+"High Risk Flood")){ map.removeLayer('raster-layer'+"High Risk Flood");}
    if (map.getLayer('raster-layer'+"Sea Level")){ map.removeLayer('raster-layer'+"Sea Level");}
    if (~map.getLayer('raster-layer'+"Sea Vulnerability")){
    map.addLayer({
      id: 'raster-layer'+"Sea Vulnerability",
      type: 'raster',
      source: 'raster-source'+"Sea Vulnerability",
    });
  }
  }
  else{
    map.removeLayer('raster-layer'+"Sea Vulnerability");
    
  }
} );

fl.addEventListener("change",()=>{
  if (fl.checked){
    if (map.getLayer('raster-layer'+"Sea Vulnerability")){ map.removeLayer('raster-layer'+"Sea Vulnerability");}
    if (map.getLayer('raster-layer'+"Sea Level")){ map.removeLayer('raster-layer'+"Sea Level");}
    if (~map.getLayer('raster-layer'+"High Risk Flood")){
    map.addLayer({
      id: 'raster-layer'+"High Risk Flood",
      type: 'raster',
      source: 'raster-source'+"High Risk Flood",
    });
  }
  }
  else{
    map.removeLayer('raster-layer'+"High Risk Flood");
  }
} );
});



