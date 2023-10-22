
done.addEventListener("click", async (e)=>{
    const svi = document.getElementById("svi");
    const risk = document.getElementById("risk");
    const sl= document.getElementById("sl");
    const sv= document.getElementById("sv");
    const fl= document.getElementById("fl");
    const height = document.getElementById("height");
    const year = document.getElementById("year");
    const type = document.getElementById("type");
    const veda = document.getElementById("veda");
    


    if (veda.checked){
      
      const layerSelect = document.getElementById("veda-data");
      const selected_layer = layerSelect.value;
      const datePicker = document.getElementById("datepicker");
      const selected_date = datePicker.value;
      const legendElement = document.getElementById(`legend-category-veda`);
      const rasterUrl = "https://staging-raster.delta-backend.com/mosaic/register";
      const response1 = await postData(rasterUrl, {
          collections: [selected_layer],
          datetime: selected_date
      });
      response1.searchid;
      

      const jsonUrl = 'js/output.json';
      const response = await fetch(jsonUrl);
      const jsonData = await response.json();
      
      if (jsonData.hasOwnProperty(selected_layer)) {
        const selectedCollectionData = jsonData[selected_layer];
        

        // Extract colormapName, rescale, and nodata from selectedCollectionData
        const colormapName = selectedCollectionData.colormap;
        const rescale = selectedCollectionData.rescale;
        const stacCol = selected_layer;
        const type = selectedCollectionData.type;
        const colormapScale = selectedCollectionData.stops;
        const name = selectedCollectionData.name;

        if (available_dates.includes(selected_date) && selected_layer === stacCol) {
            
            const url = `https://staging-raster.delta-backend.com/mosaic/tiles/${response1.searchid}/WebMercatorQuad/{z}/{x}/{y}@1x?assets=cog_default&colormap_name=${colormapName}&rescale=${rescale[0]}%2C${rescale[1]}&nodata=0`;
            updateMapWithRaster(url);
            legendElement.innerHTML = '';
            const stacColParagraph = document.createElement('p');
            stacColParagraph.className = 'legend-title';
            stacColParagraph.textContent = `${name} - ${selected_date}`;
            legendElement.appendChild(stacColParagraph);

            if (type === "categorical") {
                renderCategoricalLegend(legendElement, colormapScale);
            } else if (type === "gradient") {
                renderGradientLegend(legendElement, colormapScale, rescale);
            }
        }
        else {
          
          const url = `https://staging-raster.delta-backend.com/mosaic/tiles/${response1.searchid}/WebMercatorQuad/{z}/{x}/{y}@1x?assets=cog_default&nodata=0`;
          updateMapWithRaster(url);
      }
    }
    }
    else{
      const existingLayerId = `veda-layer`;
      if (map.getLayer(existingLayerId)) {
      map.removeLayer(existingLayerId);
      }
      if (map.getSource(`veda-layer`)) {
      map.removeSource(`veda-layer`);
    }
    }

    if ((risk.checked)&(svi.checked)){
        const allLayers = map.getStyle().layers;
        allLayers.forEach(layer => {
          
          if (layer.id.substring(0, 3) === "svi" ) {
            map.removeLayer(layer.id);
          }
          if (layer.id.substring(0, 4) === "risk" ) {
            map.removeLayer(layer.id);
          }
          if (layer.id.substring(0, 4) === "veda" ) {
            map.removeLayer(layer.id);
          }
          if (layer.id.substring(0, 6) === "merged" ) {
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
          const layerName = "risk"  + l;
          if (map.getLayer(layerName)) {
              map.removeLayer(layerName);
          }
        });
        const filteredYears = years.filter(y => y !== year);
        filteredYears.forEach(year => {
          const layerName = "svi"  + year;
          if (map.getLayer(layerName)) {
              map.removeLayer(layerName);
          }
      });
      if (!map.getLayer("merged"+year.value+type.value ))
      {
        
        map.addLayer({
          id: "merged"  +year.value+ type.value,
          type: "fill-extrusion",
          source: 'disaster',
          paint: {
            'fill-extrusion-color': {
                property: 'RPL_THEMES_'+year.value ,
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
                0.0, 
                2000, 
                100.0,
                200000, 
          ],
            'fill-extrusion-height-transition':{
              duration: 2000,
              delay: 0
          },
            'fill-extrusion-opacity': 0.7,
            'fill-extrusion-base':0,
            }
        });
      }
      }




    if ((risk.checked) & (!svi.checked)){
        
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
          const layerName = "risk"  + l;
          if (map.getLayer(layerName)) {
              map.removeLayer(layerName);
          }
        });
        const allLayers = map.getStyle().layers;
        allLayers.forEach(layer => {
          if (layer.id.substring(0, 6) === "merged" ) {
            map.removeLayer(layer.id);
          }
        });
        
        
        if (!map.getLayer("risk"+type.value))
        {
          map.addLayer({
            id: "risk"  + type.value,
            type: "fill-extrusion",
            source: 'disaster',
            paint: {
              'fill-extrusion-color': {
                  property: data,
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
              } 
          });
        }
      }
      if (!risk.checked) {
        riskLayers.forEach(function(layer) {
          var layerId = "risk"  + layer;
          if (map.getLayer(layerId)) {
              map.removeLayer(layerId);
          }
      });
      }

      if ((svi.checked)&(!risk.checked)) {
        const filteredYears = years.filter(y => y !== year);
        filteredYears.forEach(year => {
          const layerName = "svi"  + year;
          if (map.getLayer(layerName)) {
              map.removeLayer(layerName);
          }
      });
      const allLayers = map.getStyle().layers;
        allLayers.forEach(layer => {
          
          if (layer.id.substring(0, 8) === "merged" ) {
            map.removeLayer(layer.id);
          }
        });

        
     
        if (!map.getLayer("svi" + year.value)){
          map.addLayer({
            id: "svi" +year.value ,
            type: 'fill-extrusion',
            source: 'disaster',
            paint: {
            'fill-extrusion-color': {
                property: 'RPL_THEMES_' + year.value,
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
                120000, 
          ],
            'fill-extrusion-height-transition':{
              duration: 2000,
              delay: 0
          },
            'fill-extrusion-opacity': 0.7,
            'fill-extrusion-base':0,
            }     
          });  
    
        }
        
    }
    if (!svi.checked){
        years.forEach(function(year) {
            var layerId = "svi"  + year;
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
        });
    }

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
    
        if (!map.getSource('raster-source'+"Sea Level" +height.value)){
        map.addSource('raster-source'+"Sea Level" +height.value, {
          type: 'raster',
          tiles: [`https://maps.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_${height.value}ft/MapServer/tile/{z}/{y}/{x}`],
          tileSize: 256,
        }); 
      }
    
        map.addLayer({
          id: 'raster-layer'+"Sea Level" + height.value,
          type: 'raster',
          source: 'raster-source'+"Sea Level" + height.value,
          paint: {
            'raster-opacity': 0.7,
        }
        },"add-3d-buildings");
    
      }



      if (sv.checked){
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
          paint: {
            'raster-opacity': 0.5,
        }
        },"add-3d-buildings");
      }
      }
      else{
        if (map.getLayer('raster-layer'+"Sea Vulnerability")){
        map.removeLayer('raster-layer'+"Sea Vulnerability");}
        
      }


      if (fl.checked){
        // if (map.getLayer('raster-layer'+"Sea Vulnerability")){ map.removeLayer('raster-layer'+"Sea Vulnerability");}
        // [1,2,3,4,5,6,7,8,9,10].forEach(function(h) {
        //   var layerId = 'raster-layer'+"Sea Level" +h;
        //   if (map.getLayer(layerId)) {
        //       map.removeLayer(layerId);
        //   }
        // });
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
          paint: {
            'raster-opacity': 0.7,
        }
        },"add-3d-buildings");
      }
      }
      else{
        if (map.getLayer('raster-layer'+"High Risk Flood")){
        map.removeLayer('raster-layer'+"High Risk Flood");}
      }


const allLayers = map.getStyle().layers;

allLayers.forEach(layer => {
  if (layer.id.substring(0, 6) === "merged" ) {
    
    map.on("click", layer.id , (e)=>{
        
        const countyName = e.features[0].properties.NAME;
        const stateName = e.features[0].properties.STATEABBRV;
        const year = layer.id.substring(6,11);
        const x ='RPL_THEMES_'+year;
        const countySVI = parseFloat(e.features[0].properties[x]).toFixed(2);
        const countyPOP = parseInt(e.features[0].properties.POPULATION  );
        const maxPOP = 10005712;
        const minPOP = 64;
        var type = "";
        if (layer.id.substring(10)){
            type = layer.id.substring(10);
        }
        var data = "RISK_SCORE";
        var rating = "RISK_RATNG";
            if (type !== ''){
              data = type+ "RISKS";
              rating = type +"RISKR"
               
            }
        const popup = new mapboxgl.Popup({className: 'custom-popup',closeOnClick:"false" }).setLngLat(e.lngLat).
            setHTML(`
            <style>  .custom-popup .mapboxgl-popup-content {
                background-color: rgba(20, 20, 20, 1);
                color: #fff;
              }
              .custom-popup .mapboxgl-popup-tip {
                color : rgba(20, 20, 20, 1);
                border-top-color: black !important;
              }
            
              .custom-popup .mapboxgl-popup-close-button {
                color: #fff;
                padding-right: 5px;
                padding-left: 5px;
                padding-top:1px;
                }</style>
            <div>
            <h2 style="font-weight: bold;margin-bottom: 10px;color:#aaa; font-size:16px;">${countyName}, ${stateName}</h2>
            
            <p> SVI-${year}: ${countySVI}</p>
            <p> Population: ${countyPOP}</p>
            <p> ${type} Risk: ${parseFloat(e.features[0].properties[data]).toFixed(2)}</p>
            <p>Rating: ${(e.features[0].properties[rating])}</p>
            </div>
            `);
        popup.addTo(map);
  
    });
  }

  if (layer.id.substring(0,3)==="svi") {

    map.on("click", layer.id , (e)=>{
        
      const countyName = e.features[0].properties.NAME;
      const stateName = e.features[0].properties.STATEABBRV;
      const year = layer.id.substring(3);
      const x ='RPL_THEMES_'+year;
      const countySVI = parseFloat(e.features[0].properties[x]).toFixed(2);
      const countyPOP = parseInt(e.features[0].properties.POPULATION  );
      const maxPOP = 10005712;
      const minPOP = 64;
      const popup = new mapboxgl.Popup({className: 'custom-popup',closeOnClick:"false" }).setLngLat(e.lngLat).
          setHTML(`
          <style>  .custom-popup .mapboxgl-popup-content {
              background-color: rgba(20, 20, 20, 1);
              color: #fff;
            }
            .custom-popup .mapboxgl-popup-tip {
              color : rgba(20, 20, 20, 1);
              border-top-color: black !important;
            }
          
            .custom-popup .mapboxgl-popup-close-button {
              color: #fff;
              padding-right: 5px;
              padding-left: 5px;
              padding-top:1px;
              }</style>
          <div>
          <h2 style="font-weight: bold;margin-bottom: 10px;color:#aaa; font-size:16px;">${countyName}, ${stateName}</h2>
          
          <p> SVI-${year}: ${countySVI}</p>
          <p> Population: ${countyPOP}</p>
          </div>
          `);
      popup.addTo(map);

  });
  }

  if (layer.id.substring(0, 4) === "risk" ) {
    map.on("click", layer.id , (e)=>{
        
        const countyName = e.features[0].properties.NAME;
        const stateName = e.features[0].properties.STATEABBRV;
  
        const countyPOP = parseInt(e.features[0].properties.POPULATION  );
        const maxPOP = 10005712;
        const minPOP = 64;
        var type = "";
        if (layer.id.substring(4)){
            type = layer.id.substring(4);
        }
        var data = "RISK_SCORE";
        var rating = "RISK_RATNG";
            if (type !== ''){
              data = type+ "RISKS";
              rating = type +"RISKR"
               
            }
        const popup = new mapboxgl.Popup({className: 'custom-popup',closeOnClick:"false" }).setLngLat(e.lngLat).
            setHTML(`
            <style>  .custom-popup .mapboxgl-popup-content {
                background-color: rgba(20, 20, 20, 1);
                color: #fff;
              }
              .custom-popup .mapboxgl-popup-tip {
                color : rgba(20, 20, 20, 1);
                border-top-color: black !important;
              }
            
              .custom-popup .mapboxgl-popup-close-button {
                color: #fff;
                padding-right: 5px;
                padding-left: 5px;
                padding-top:1px;
                }</style>
            <div>
            <h2 style="font-weight: bold;margin-bottom: 10px;color:#aaa; font-size:16px;">${countyName}, ${stateName}</h2>
            
            <p> ${type} Risk: ${parseFloat(e.features[0].properties[data]).toFixed(2)}</p>
            <p>Rating: ${(e.features[0].properties[rating])}</p>
            <p> Population: ${countyPOP}</p>
            </div>
            `);
        popup.addTo(map);
    });
  }
});
});




reset.addEventListener("click", (e)=>{
    if (map.getLayer('raster-layer'+"High Risk Flood")){
        map.removeLayer('raster-layer'+"High Risk Flood");}
    if (map.getLayer('raster-layer'+"Sea Vulnerability")){
        map.removeLayer('raster-layer'+"Sea Vulnerability");}
    [1,2,3,4,5,6,7,8,9,10].forEach(function(h) {
        var layerId = 'raster-layer'+"Sea Level" +h;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        });
    years.forEach(function(year) {
        var layerId = "svi"  + year;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });
    riskLayers.forEach(function(layer) {
        var layerId = "risk"  + layer;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });
    const existingLayerId = `veda-layer`;
    if (map.getLayer(existingLayerId)) {
    map.removeLayer(existingLayerId);
    }
    if (map.getSource(`veda-layer`)) {
    map.removeSource(`veda-layer`);
    }

    const allLayers = map.getStyle().layers;
        allLayers.forEach(layer => {
          if (layer.id.substring(0, 6) === "merged" ) {
            map.removeLayer(layer.id);
          }
        });
    svi.checked= false;
    risk.checked=false;
    sl.checked=false;
    sv.checked = false;
    fl.checked=false;
    var vedaData = document.getElementById("veda-data");
    vedaData.setAttribute("disabled", "disabled");
    year.setAttribute("disabled", "disabled");
    type.setAttribute("disabled", "disabled");
    height.setAttribute("disabled", "disabled");

});



