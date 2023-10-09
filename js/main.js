// importing files
import { legendTemplate } from './legend.js';
import { legendTemplate2 } from './legend.js';
import { legendTemplate3 } from './legend.js';
import { popupTemplate } from './popupTemplate.js';
import {map} from './map.js'
var years = ["2014", "2016", "2018", "2020"];
var riskLayers =["","AVLN_", "CFLD_","CWAV_","DRGT_","ERQK_","HAIL_",
"HWAV_","HRCN_","ISTM_","LNDS_","RFLD_","SWND_","TRND_","TSUN_",
"VLCN_", "WFIR_","WNTW_","LTNG_"]

// declaring global vars

var colorStops = ["#000000", "#222", "#ffc300", "#ff8d19", "#ff5733", "#ff2e00"]; 
var popups= {}; // to store all the pop ups
var selectedStateIds =[]; // to store the currently selected/active states
var isDragging={}


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
  var mini = document.getElementById("minimize-button"+stateId);
  var show = document.getElementById("show-header"+stateId);
  var hide = document.getElementById("hide"+stateId);
  var info = document.querySelector('.info'+stateId);
  //var p = document.getElementById("pp");



  mini.addEventListener("click", (event) => {
    event.stopPropagation();
    const isMinimized = hide.style.display == "block";
    console.log("this time", isMinimized);
  
    if (!isMinimized) {
      hide.style.display = "block";
      if (info) {
        info.style.display = "block";
      }
    } else {
      hide.style.display = "none";
  
      if (info) {
        info.style.display = "none";
      }
    }
  });



  var type =document.getElementById("type"+stateId);
  var year_slider =document.getElementById("year-slider"+stateId);
  type.addEventListener('mouseend', (event) => {
    event.stopPropagation();
  });
  year_slider.addEventListener('mouseend', (event) => {
    event.stopPropagation();
  });

  var riskCheckbox =document.getElementById("risk-checkbox"+stateId);
  riskCheckbox.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });

  // Change the slider based on sea level 

  riskCheckbox.addEventListener("change", function() {
    if (this.checked) 
    {
      type.removeAttribute("disabled");

    } 
    else 
    {
      type.setAttribute("disabled", "disabled");
    }
  });

  var sviCheckbox =document.getElementById("svi-checkbox"+stateId);
  sviCheckbox.addEventListener("change", function() {
    if (this.checked) 
    {
      year_slider.removeAttribute("disabled");
      var selectedYear = document.getElementById("selected-year"+stateId);
    
      selectedYear.textContent = year_slider.value ;
      year_slider.addEventListener("input", function() {
          selectedYear.textContent = year_slider.value ;
        });
    } 
    else 
    {
      year_slider.setAttribute("disabled", "disabled");
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
    const year = document.getElementById("selected-year"+stateId).textContent;
    var riskCheckbox =document.getElementById("risk-checkbox"+stateId)

    if ((riskCheckbox.checked)&(sviCheckbox.checked)){
      const allLayers = map.getStyle().layers;
      allLayers.forEach(layer => {
        console.log(layer.id.substring(0, 13));
        if (layer.id.substring(0, 13) === "county-area" +stateId) {
          map.removeLayer(layer.id);
        }
        if (layer.id.substring(0, 13) === "county-risk" +stateId) {
          map.removeLayer(layer.id);
        }
        if (layer.id.substring(0, 8) === "merged" +stateId) {
          map.removeLayer(layer.id);
        }
        
      });
      var data= null;
      var rating = null ;
      if (type.value == ''){
         data = "RISK_SCORE";
         rating = "RISK_RATNG";
      }
      else{
         data = type.value+ "RISKS";
         rating = type.value +"RISKR"
      }
      const filteredLayers = riskLayers.filter(y => y !== type.value);
      filteredLayers.forEach(l => {
        const layerName = "county-risk" + stateId + l;
        if (map.getLayer(layerName)) {
            map.removeLayer(layerName);
        }
      });
      const filteredYears = years.filter(y => y !== year);
      filteredYears.forEach(year => {
        const layerName = "county-area" + stateId + year;
        if (map.getLayer(layerName)) {
            map.removeLayer(layerName);
        }
    });
    if (!map.getLayer("merged"+stateId+type.value + year))
    {
      map.addLayer({
        id: "merged" + stateId + type.value+year,
        type: "fill-extrusion",
        source: 'disaster',
        paint: {
          'fill-extrusion-color': {
              property: 'RPL_THEMES_'+year ,
              stops: [
                [0.20, '#FFA500'],  
                [0.5, "#FF7F50"],    
                [0.8, "#800080"],    
                [1.0, '#4B0082']     
              ]
          }  ,                      
          'fill-extrusion-height':[
              'interpolate',
              ['linear'],
              ['to-number', ['get', data]],
              0.0, //min
              2000, 
              100.0, //max
              200000, 
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
  
  
    
    // Add sea level layer when it is selected else remove if any
    if ((riskCheckbox.checked) & (!sviCheckbox.checked)){
      console.log("risk checked")
      var data= null;
      var rating = null ;
      if (type.value == ''){
         data = "RISK_SCORE";
         rating = "RISK_RATNG";
      }
      else{
         data = type.value+ "RISKS";
         rating = type.value +"RISKR"
      }
      const filteredLayers = riskLayers.filter(y => y !== type.value);
      filteredLayers.forEach(l => {
        const layerName = "county-risk" + stateId + l;
        if (map.getLayer(layerName)) {
            map.removeLayer(layerName);
        }
      });
      const allLayers = map.getStyle().layers;
      allLayers.forEach(layer => {
        console.log(layer.id.substring(0, 13));
        if (layer.id.substring(0, 8) === "merged" +stateId) {
          map.removeLayer(layer.id);
        }
      });
      

      if (!map.getLayer("county-risk"+stateId+type.value))
      {
        map.addLayer({
          id: "county-risk" + stateId + type.value,
          type: "fill-extrusion",
          source: 'disaster',
          paint: {
            'fill-extrusion-color': {
                property: data ,
                stops: [
                    [0.0, '#ff5255'],
                    [40.0, "#de2d71"],
                    [70.0, "#7d0e86"],
                    [100.0, "#4c077c"]
                ]
            }  ,                      
            'fill-extrusion-height':[
                'interpolate',
                ['linear'],
                ['to-number', ['get', 'POPULATION' ]],
                6000, //min
                12000, 
                500000, //max
                190000, 
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
    if (!riskCheckbox.checked) {
      riskLayers.forEach(function(layer) {
        var layerId = "county-risk" + stateId + layer;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });
    }
    // Add svi layer when it is selected else remove if any
    if ((sviCheckbox.checked)&(!riskCheckbox.checked)) {
      const filteredYears = years.filter(y => y !== year);
      console.log(filteredYears)
      filteredYears.forEach(year => {
        const layerName = "county-area" + stateId + year;
        if (map.getLayer(layerName)) {
            map.removeLayer(layerName);
        }
    });
    const allLayers = map.getStyle().layers;
      allLayers.forEach(layer => {
        console.log(layer.id.substring(0, 13));
        if (layer.id.substring(0, 8) === "merged" +stateId) {
          map.removeLayer(layer.id);
        }
      });
   
      if (!map.getLayer("county-area"+stateId + year)){

        console.log("SVI checkbox checked",'RPL_THEMES' + stateId+ document.getElementById("selected-year"+stateId).textContent, "add garnu paro");
        map.addLayer({
          id: "county-area"+stateId +year ,
          type: 'fill-extrusion',
          source: 'disaster',
          paint: {
          'fill-extrusion-color': {
              property: 'RPL_THEMES_' + year,
              stops: [
                  [0.20, colorStops[2]],
                  [0.5, colorStops[3]],
                  [0.8, colorStops[4]],
                  [1.0, colorStops[5]]
              ]
          }  ,                      
          'fill-extrusion-height':[
              'interpolate',
              ['linear'],
              ['to-number', ['get', 'POPULATION' ]],
              6000, //min
              12000, 
              500000, //max
              190000, 
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
  
    if (!sviCheckbox.checked){
        
        years.forEach(function(year) {
            var layerId = "county-area" + stateId + year;
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
        });
    }
  });


var closeButton = document.getElementById("close-button"+stateId)
  //Remove dragging effect when close is clicked
  closeButton.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });
  // when close button is clicked, remove everything - all layers if any, popup, selected state etc
  closeButton.addEventListener("click", function() {
 
  const allLayers = map.getStyle().layers;
      allLayers.forEach(layer => {
        console.log(layer.id.substring(0, 13));
        if (layer.id.substring(0, 8) === "merged" +stateId) {
          map.removeLayer(layer.id);
        }
        if (layer.id.substring(0, 13) === "county-area" +stateId) {
          map.removeLayer(layer.id);
        }
        if (layer.id.substring(0, 13) === "county-risk" +stateId) {
          map.removeLayer(layer.id);
        }
      });


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
  map.off("click", "county-area"+stateId + document.getElementById("selected-year"+stateId).textContent, handleCountyAreaClick);
  const countyName = e.features[0].properties.NAME;

  const year = document.getElementById("selected-year"+stateId).textContent;
  const x ='RPL_THEMES_'+year;
  const countySVI = parseFloat(e.features[0].properties[x]).toFixed(2);
  const maxSVI = 1;
  const minSVI = 0;
  const countyPOP = e.features[0].properties.POPULATION ;
  const maxPOP =10005712;
  const minPOP =64;

  // Calculate relative position
  const sviPercentage = (countySVI - 0) / (1.0 - 0) * 100;
  const popPercentage = (countyPOP - minPOP) / (maxPOP - minPOP) * 100;

  const pp =popups[stateId];
  const pp_content = pp._content;

  // Remove previous info borad if any
  if (document.getElementById('info-svi'+stateId )){
    (document.getElementById('info-svi'+stateId )).remove()

  }
  if (document.getElementById('info-disaster'+stateId )){
    (document.getElementById('info-disaster'+stateId )).remove()

  }
  if (document.getElementById('info-merged'+stateId )){
    (document.getElementById('info-merged'+stateId )).remove()

  }

  // create new info board and append to the popup
  const newDiv = document.createElement('div');
  newDiv.className = 'info-svi'+stateId; 
  newDiv.id = 'info-svi'+stateId;
  //newDiv.style.display="block";
  newDiv.innerHTML = legendTemplate(countyName, minSVI, maxSVI, sviPercentage, countySVI, minPOP, maxPOP, popPercentage, countyPOP, year);
  document.getElementById("hide"+stateId).appendChild(newDiv);
  

}

function handleCountyAreaClick2(e) {
  // Remove the event listener to prevent multiple executions
  map.off("click", "county-risk"+stateId + document.getElementById("type"+stateId).value, handleCountyAreaClick2);
  const type = document.getElementById("type"+stateId).value;
  var data = "RISK_SCORE";
  var rating = "RISK_RATNG";
      if (type !== ''){
        data = type+ "RISKS";
        rating = type +"RISKR"
         
      }
  const countyName = e.features[0].properties.NAME;
  const countyType = parseFloat(e.features[0].properties[data]).toFixed(2);
  const countyRating = e.features[0].properties[rating]
  const countyPOP = parseInt(e.features[0].properties.POPULATION  );
  const maxType =100;
  const minType = 0;
  const maxPOP = 10005712;
  const minPOP = 64;

  // Calculate relative position
  const typePercentage = (countyType - 0) / (100.0 - 0) * 100;
  const popPercentage = (countyPOP - minPOP) / (maxPOP - minPOP) * 100;

  const pp =popups[stateId];
  const pp_content = pp._content;

  // Remove previous info borad if any
  if (document.getElementById('info-disaster'+stateId )){
    (document.getElementById('info-disaster'+stateId )).remove()

  }
  if (document.getElementById('info-svi'+stateId )){
    (document.getElementById('info-svi'+stateId )).remove()

  }
  if (document.getElementById('info-merged'+stateId )){
    (document.getElementById('info-merged'+stateId )).remove()

  }

  // create new info board and append to the popup
  const newDiv = document.createElement('div');
  newDiv.className = 'info' + stateId
  newDiv.id = 'info-disaster'+stateId;
  //newDiv.style.display="block";
  newDiv.innerHTML = legendTemplate2(countyName, minType, maxType, typePercentage, countyType, minPOP, maxPOP, popPercentage, countyPOP, type,countyRating);
  document.getElementById("hide"+stateId).appendChild(newDiv);

}


function handleCountyAreaClick3(e) {
  // Remove the event listener to prevent multiple executions
  map.off("click", "county-risk"+stateId + document.getElementById("type"+stateId).value, handleCountyAreaClick2);
  const year = document.getElementById("selected-year"+stateId).textContent;
  const x ='RPL_THEMES_'+year;
  const countySVI = parseFloat(e.features[0].properties[x]).toFixed(2);
  const maxSVI = 1;
  const minSVI = 0;
  const type = document.getElementById("type"+stateId).value;
  var data = "RISK_SCORE";
  var rating = "RISK_RATNG";
  // var data= null;
  // var rating = null ;
      if (type !== ''){
        data = type+ "RISKS";
        rating = type +"RISKR"
         
      }
  const countyName = e.features[0].properties.NAME;
  const countyType = parseFloat(e.features[0].properties[data]).toFixed(2);
  const countyRating = e.features[0].properties[rating]
  const maxType =100;
  const minType = 0;


  // Calculate relative position
  const typePercentage = (countyType - 0) / (100.0 - 0) * 100;
  const sviPercentage = (countySVI - 0) / (1.0 - 0) * 100;

  const pp =popups[stateId];
  const pp_content = pp._content;

  // Remove previous info borad if any
  if (document.getElementById('info-disaster'+stateId )){
    (document.getElementById('info-disaster'+stateId )).remove()

  }
  if (document.getElementById('info-svi'+stateId )){
    (document.getElementById('info-svi'+stateId )).remove()

  }
  if (document.getElementById('info-merged'+stateId )){
    (document.getElementById('info-merged'+stateId )).remove()

  }

  // create new info board and append to the popup
  const newDiv = document.createElement('div');
  newDiv.className = 'info' + stateId
  newDiv.id = 'info-merged'+stateId;
  //newDiv.style.display="block";
  newDiv.innerHTML = legendTemplate3(countyName, minSVI, maxSVI, sviPercentage,countyType, countySVI, minType, maxType, typePercentage, countyRating, year,type);
  document.getElementById("hide"+stateId).appendChild(newDiv);

}


map.on("click", "county-area"+stateId + document.getElementById("selected-year"+stateId).textContent, handleCountyAreaClick);
map.on("click", "county-risk"+stateId + document.getElementById("type"+stateId).value, handleCountyAreaClick2);
map.on("click", "merged"+stateId +document.getElementById("type"+stateId).value+ document.getElementById("selected-year"+stateId).textContent, handleCountyAreaClick3);

});


