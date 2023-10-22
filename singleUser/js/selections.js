function renderCategoricalLegend(legendElement, stops) {

    stops.forEach((stop, index) => {
        const color = stop.color;
        const label = stop.label;

        const item = document.createElement('div');
        item.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = color;

        const labelSpan = document.createElement('div');
        labelSpan.className = 'legend-label';
        labelSpan.textContent = label;

        item.appendChild(colorBox);
        item.appendChild(labelSpan);

        legendElement.appendChild(item);
    });

    
}

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
  } 
  let response;
  let jsonData;
  
  const jsonUrl = 'js/output.json';
  
  fetch(jsonUrl)
      .then(function (res) {
          if (!res.ok) {
              throw new Error(`Network response was not ok (${res.status})`);
          }
          response = res;
          return res.json();
      })
      .then(function (data) {
          jsonData = data;
      })
      .catch(function (error) {
          console.error('Error:', error);
      });

function renderGradientLegend(legendElement, colormapScale, rescale) {
    const stops = colormapScale;
    const min = rescale[0];
    const max = rescale[1];
    const range = max - min;

    stops.forEach((stopColor, index) => {
        const value = min + (index / (stops.length - 1)) * range;
        const item = document.createElement('div');
        item.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = stopColor;

        const labelSpan = document.createElement('spadivn');
        labelSpan.className = 'legend-label';
        labelSpan.textContent = value.toFixed(2);

        item.appendChild(colorBox);
        item.appendChild(labelSpan);

        legendElement.appendChild(item);
    });
}



async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}
function getAvailableDatesFromDashboard(collection) {
    const isPeriodic = collection["dashboard:is_periodic"];
    const timeDensity = collection["dashboard:time_density"];
    const summaries = collection.summaries.datetime;
  
    if (!isPeriodic || !summaries) {
      return summaries || null;
    }
  
    const startDate = new Date(summaries[0]);
    const endDate = new Date(summaries[summaries.length - 1]);
  
    const availableDates = [];
  
    if (isPeriodic) {
      if (timeDensity === "day") {
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          availableDates.push(currentDate.toISOString());
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else if (timeDensity === "month") {
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          availableDates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString());
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      } else if (timeDensity === "year") {
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          availableDates.push(currentDate.toISOString());
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
      }
    }
    return availableDates.map(date => date.slice(0, 19) + 'Z')
  }
  
function formatDateToYYYYMMDD(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
  }


function updateMapWithRaster(url) {
    const existingLayerId = `veda-layer`;
    if (map.getLayer(existingLayerId)) {
    map.removeLayer(existingLayerId);
    }
    if (map.getSource(`veda-layer`)) {
    map.removeSource(`veda-layer`);
    }

    const source_id = `veda-layer`;
    map.addSource(source_id, {
    type: 'raster',
    tiles: [url],
    });
    map.addLayer({
        id: `veda-layer`,
        type: 'raster',
        source: source_id,
        paint: {
            'raster-opacity': 0.70,
        },
    });
}



var svi = document.getElementById("svi");
var risk = document.getElementById("risk");
var sl= document.getElementById("sl");
var sv= document.getElementById("sv");
var fl= document.getElementById("fl");
var done= document.getElementById("done");
var reset = document.getElementById("reset");
var height = document.getElementById("height");
var year = document.getElementById("year");
var type = document.getElementById("type")
var veda = document.getElementById("veda");
var vedaData = document.getElementById("veda-data");
var zoom = document.getElementById("zoom");
const div = document.getElementById('veda-div'); 

zoom.addEventListener("click",()=>{
    if ((map.getZoom())>=6){
        map.flyTo({
            center: [-100.786052, 36.830348],
            zoom: 4.0,
            speed: 2,
            pitch: 32,
            bearing: 0,
            essential: true,
          });}
});

svi.addEventListener("change",()=>{if (svi.checked){year.removeAttribute("disabled");}else{year.setAttribute("disabled", "disabled");}});
risk.addEventListener("change", ()=>{if (risk.checked){type.removeAttribute("disabled");}else{type.setAttribute("disabled", "disabled");}});
sl.addEventListener("change", ()=>{if (sl.checked){height.removeAttribute("disabled");}else{height.setAttribute("disabled", "disabled");}});
sl.addEventListener("change", ()=>{if (sl.checked){height.removeAttribute("disabled");}else{height.setAttribute("disabled", "disabled");}});

var selectedHeight = document.getElementById("selected-height");
height.addEventListener("change", (e)=>{
  selectedHeight.textContent = height.value + " ft";
});



veda.addEventListener("change",()=>{
    if (veda.checked){
        vedaData.removeAttribute("disabled");
        const datePicker = document.getElementById("datepicker");
        var selectTimeFrame, isPeriodic, timeDensity, description;

        fetch("https://staging-stac.delta-backend.com/collections")
        .then(response => response.json())
        .then(response => {
            const layerSelect = document.getElementById("veda-data");
            response.collections.forEach(collection => {
                var opt = document.createElement("option");
                opt.value = collection.id;
                opt.label = collection.title;
                layerSelect.appendChild(opt);
                selectTimeFrame = collection.summaries.datetime;
                isPeriodic = collection["dashboard:is_periodic"];
                timeDensity = collection["dashboard:time_density"];
                description = collection.description;

                const availableDates = getAvailableDatesFromDashboard(collection).map(dateString => formatDateToYYYYMMDD(dateString));
                //console.log("Available dates for", collection.title, ":", availableDates);

                // Store the date and time range as data attributes on the option element
                opt.setAttribute('data-select-timeframe', JSON.stringify(availableDates));
                opt.setAttribute('data-description', description);
                opt.setAttribute('is-periodic', isPeriodic);
                opt.setAttribute('time-density', timeDensity);

            });
        });
    }
    else{
        vedaData.setAttribute("disabled", "disabled");
    }
});


let available_dates = [];
vedaData.addEventListener("change", (e)=>{
    const layerSelect = document.getElementById("veda-data");
    const selectedOption = layerSelect.options[layerSelect.selectedIndex];
    let available_dates_str = selectedOption.getAttribute('data-select-timeframe');
    try {
        available_dates = JSON.parse(available_dates_str); // Update the available_dates array
    } catch (error) {
        console.error("Error parsing available_dates:", error);
        available_dates = [];
    }
    console.log("Updating available_dates");
    if (document.getElementById("datepicker")){
        //$(document.getElementById("datepicker")).datepicker("destroy");
        document.getElementById("datepicker").remove()
    }
    const datePicker = document.createElement('input');
    datePicker.id = "datepicker";
    div.appendChild(datePicker);

    // Get the minDate and maxDate
    var maxDateStr = available_dates[available_dates.length - 1];
    var minDateStr = available_dates[0];
    var maxDate = new Date(maxDateStr);
    var minDate = new Date(minDateStr);
    maxDate.setDate(maxDate.getDate() + 1);
    // Initialize the datepicker with minDate and maxDate for this mapIndex
    
    $(datePicker).datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd',
        maxDate: maxDate,
        minDate: minDate,
        beforeShowDay: function (date) {
            var formattedDate = $.datepicker.formatDate('yy-mm-dd', date);
            // Check if the formatted date is in the available_dates array
            if ($.inArray(formattedDate, available_dates) != -1) {
                return [true];
            } else {
                return [false];
            }
        },
    });

});
$(vedaData).trigger("change");
// veda.addEventListener("change", ()=>{
//     if (veda.checked){
//         vedaData.removeAttribute("disabled");
//     var selectTimeFrame,isPeriodic, timeDensity,description;
//     fetch("https://dev-stac.delta-backend.com/api/stac/collections")
//     .then(response => response.json())
//     .then(response => {
//         const vedaDataSelect = document.getElementById("veda-data");
//         vedaDataSelect.innerHTML = '';
//         response.collections.forEach(collection => {
//             const option = document.createElement("option");
//             option.value = collection.id;
//             option.label = collection.title;
//             vedaDataSelect.appendChild(option);
//             selectTimeFrame = collection.summaries;
//             isPeriodic = collection["dashboard:is_periodic"];
//             timeDensity = collection["dashboard:time_density"];
//             description = collection.description;
//             option.setAttribute('data-description', description);
//             option.setAttribute('is-periodic', isPeriodic);
//             option.setAttribute('time-density', timeDensity);
//             option.setAttribute("selectTimeFrame",selectTimeFrame );

//             option.setAttribute("minDate",null);
//             option.setAttribute("maxDate", null);
//             option.setAttribute("dates",null);
//             option.setAttribute("flag",null);

//             if (isPeriodic){
//               if (selectTimeFrame){
//                 option.setAttribute("minDate", selectTimeFrame.datetime[0]);
//                 option.setAttribute("maxDate", selectTimeFrame.datetime[selectTimeFrame.datetime.length-1]);
//                 option.setAttribute("dates",collection.summaries.datetime);
//                 option.setAttribute("flag","1");

//               }
//             }
//             else{
//               if (selectTimeFrame){
//                 option.setAttribute("dates",selectTimeFrame.datetime);
//                 option.setAttribute("flag","2");

//               }
//             }
            
//         });
//         vedaDataSelect.disabled = false;
//     });
//     }
//     else{
//         vedaData.setAttribute("disabled", "disabled");
//     }});


//     vedaData.addEventListener("change", (e)=>{

//         if (document.getElementById("v-day")){ document.getElementById("v-day").remove()}
//         if (document.getElementById("veda-year")){document.getElementById("veda-year").remove()}
//         if (document.getElementById("v-year")){document.getElementById("v-year").remove()}
//         if (document.getElementById("v-month")){document.getElementById("v-month").remove()}
//         if (document.getElementById("datepicker")){document.getElementById("datepicker").remove()}
        
//         var vedaData = document.getElementById("veda-data");
//         const selectedOption = vedaData.options[vedaData.selectedIndex];
//         const isPeriodic = selectedOption.getAttribute("is-periodic");
//         const desc = selectedOption.getAttribute("data-description");
//         const minDate = selectedOption.getAttribute("minDate");
//         const maxDate = selectedOption.getAttribute("maxDate");
//         const timeDensity = selectedOption.getAttribute("time-density");
//         const flag = selectedOption.getAttribute("flag");
        
        
//         const div = document.getElementById('veda-div'); 
//         if (flag==="1"){
//           console.log("flag1");
//         if (timeDensity==='day'){
//           console.log("a");
//           const datePicker = document.createElement('input');
//           datePicker.type = 'date';
//           datePicker.id='v-day';
//           datePicker.min = minDate.substring(0, 10);
//           datePicker.max= maxDate.substring(0, 10);
//           datePicker.value = minDate.substring(0, 10);
//           div.appendChild(datePicker);
    
//         }
//         if (timeDensity == 'year'){
//           const yearSelect = document.createElement('select');
//           yearSelect.name = 'year';
//           yearSelect.id = 'veda-year';
          
        
//           for (let year = parseInt(minDate.substring(0, 4)); year <= parseInt(maxDate.substring(0, 4)); year++) {
            
//             const option = document.createElement('option');
//             option.value = year;
//             option.id = year;
//             option.text = year;
//             option.setAttribute("val", year);
//             yearSelect.appendChild(option);
//           }
          
//           div.appendChild(yearSelect);
    
//         }
//         if (timeDensity==="month"){
//           const yearSelect = document.createElement('select');
//           yearSelect.name = 'year';
//           yearSelect.id='v-year'
//           yearSelect.value= parseInt(minDate.substring(0, 4));
    
//           console.log(minDate.substring(0, 4),maxDate.substring(0, 4));
//           for (let year = parseInt(minDate.substring(0, 4)); year <= parseInt(maxDate.substring(0, 4)); year++) {
//             const option = document.createElement('option');
//             option.value = year;
//             option.text = year;
//             option.setAttribute("val",year);
            
//             if  (year === parseInt(minDate.substring(0, 4))) {
              
//               option.setAttribute('startMonth', parseInt(minDate.substring(5, 7)));
//               option.setAttribute("endMonth", 12);
    
             
//             }
//             if  (year === parseInt(maxDate.substring(0, 4))) {
//               option.setAttribute('startMonth', 1);
//               option.setAttribute("endMonth", parseInt(maxDate.substring(5, 7)));
              
//             }
//             if ((year===parseInt(minDate.substring(0, 4))) &&(year === parseInt(maxDate.substring(0, 4)))){
//               option.setAttribute('startMonth', parseInt(minDate.substring(5, 7)));
//               option.setAttribute("endMonth", parseInt(maxDate.substring(5, 7)));
//             }
//             if ((year!==parseInt(minDate.substring(0, 4))) &&(year !== parseInt(maxDate.substring(0, 4)))){
//               option.setAttribute("endMonth", 12);
//               option.setAttribute("startMonth", 1);
    
//             }
//             var result=[]
//             for (let i = option.getAttribute("startMonth"); i <= option.getAttribute("endMonth"); i++) {
//               result.push(i);
//             }
//             console.log(year +"::"+ result);
//             option.setAttribute("monthList", Array(result));
//             yearSelect.appendChild(option);
//         }
//           div.appendChild(yearSelect);
//           const vedaYear = document.getElementById("v-year");
//           console.log("lu",vedaYear.value);
//           vedaYear.addEventListener('click', function() {
//             if (document.getElementById("v-month")){document.getElementById("v-month").remove()}
//             const selectedYear = this.options[this.selectedIndex];
//             const monthSelect = document.createElement('select');
//             div.appendChild(monthSelect);
//             monthSelect.id= 'v-month';
            
//             for (let i = parseInt(selectedYear.getAttribute("startMonth")); i <= parseInt(selectedYear.getAttribute("endMonth")); i++) {
//               const option = document.createElement('option');
//               option.value = i;
//               option.text = i;
//               option.setAttribute("val",i);
//               monthSelect.appendChild(option);
//             }
    
//         });
//       }
//     }
//     else{
//       const dates = selectedOption.getAttribute("dates");
//     console.log("flag2");
//     if (dates) {
//       const datePicker1 = document.createElement('input');
//       datePicker1.id = "datepicker";
//       div.appendChild(datePicker1);
    
//       const initialDate = new Date(dates[0]); 
//       $(datePicker1).datepicker({
//         dateFormat: "yy-mm-dd",
//         beforeShowDay: function(date) {
//           var formattedDate = $.datepicker.formatDate("yy-mm-dd", date);
//           return [dates.indexOf(formattedDate) !== -1];
//         },
//         changeYear: true, 
//         changeMonth: true, 
//       });
    
//       $(datePicker1).datepicker("setDate", initialDate);
//     }
//     }
//     });