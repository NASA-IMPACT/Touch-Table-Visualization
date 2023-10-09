import { map } from './map.js';
const urlMap = {
    'Sea Level': 'https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_1ft/MapServer/tile/{z}/{y}/{x}',
    'Sea Vulnerability': 'https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/SOVI/MapServer/tile/{z}/{y}/{x}', 
    'High Risk Flood': 'https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/Flood_Frequency/MapServer/tile/{z}/{y}/{x}', 
  };
  

  var slider = document.getElementById("height-sea");
  var clear = document.getElementById("clear");
  var selectedHeight = document.getElementById("selected-height");
  slider.addEventListener("change", (e)=>{
    selectedHeight.textContent = slider.value + " ft";
  });
  
  document.addEventListener("DOMContentLoaded", function() {
  const sl = document.getElementById("sl");
  const sv = document.getElementById("sv");
  const fl = document.getElementById("fl");
  
  
  sl.addEventListener("click",()=>{
    if (sl.checked){
      if (map.getLayer('raster-layer'+"High Risk Flood")){ map.removeLayer('raster-layer'+"High Risk Flood");}
      if (map.getLayer('raster-layer'+"Sea Vulnerability")){ map.removeLayer('raster-layer'+"Sea Vulnerability")};
  
      [1,2,3,4,5,6,7,8,9,10].forEach(function(h) {
        var layerId = 'raster-layer'+"Sea Level" +h;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
      });
      [1,2,3,4,5,6,7,8,9,10].forEach(function(h) {
        var layerId = 'raster-layer'+"Sea Level" +h;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
      });
  
      if (!map.getSource('raster-source'+"Sea Level" +slider.value)){
      map.addSource('raster-source'+"Sea Level" +slider.value, {
        type: 'raster',
        tiles: [`https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_${slider.value}ft/MapServer/tile/{z}/{y}/{x}`],
        tileSize: 256,
      }); 
    }
  
      map.addLayer({
        id: 'raster-layer'+"Sea Level" + slider.value,
        type: 'raster',
        source: 'raster-source'+"Sea Level" + slider.value,
      });
  
    }
  } );
  
  sv.addEventListener("change",()=>{
    if (sv.checked){
      console.log("jj", slider.value);
      if (map.getLayer('raster-layer'+"High Risk Flood")){ map.removeLayer('raster-layer'+"High Risk Flood");}
      [1,2,3,4,5,6,7,8,9,10].forEach(function(h) {
        var layerId = 'raster-layer'+"Sea Level" +h;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
      });
      if (!map.getSource('raster-source'+"Sea Vulnerability" )){
        map.addSource('raster-source'+"Sea Vulnerability" , {
          type: 'raster',
          tiles: [`https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/SOVI/MapServer/tile/{z}/{y}/{x}`],
          tileSize: 256,
        }); 
      }
      if (!map.getLayer('raster-layer'+"Sea Vulnerability")){
  
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
      [1,2,3,4,5,6,7,8,9,10].forEach(function(h) {
        var layerId = 'raster-layer'+"Sea Level" +h;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
      });
      if (!map.getSource('raster-source'+"High Risk Flood" )){
        map.addSource('raster-source'+"High Risk Flood" , {
          type: 'raster',
          tiles: [`https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/Flood_Frequency/MapServer/tile/{z}/{y}/{x}`],
          tileSize: 256,
        }); 
      }
      if (!map.getLayer('raster-layer'+"High Risk Flood")){
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
  

  clear.addEventListener("click", ()=>{
    if (map.getLayer('raster-layer'+"Sea Vulnerability")){ map.removeLayer('raster-layer'+"Sea Vulnerability");}
    [1,2,3,4,5,6,7,8,9,10].forEach(function(h) {
      var layerId = 'raster-layer'+"Sea Level" +h;
      if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
      }
    });
      if (map.getLayer('raster-layer'+"High Risk Flood")){ map.removeLayer('raster-layer'+"High Risk Flood");}

  });
  