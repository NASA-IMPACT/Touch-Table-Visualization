// Export the HTML template as a string
export const legendTemplate = (countyName, minSVI, maxSVI, sviPercentage, countySVI, minPOP, maxPOP, popPercentage, countyPOP) => `
<div style="max-width: 180px; display: flex; flex-direction: column; background-color: rgba(221, 219, 205, 0.4); border-radius: 4px; justify-content: center; overflow: auto; margin-top: 10px;">
  <div id="county-name" style="font-weight: bold; color: black; text-align: center; margin-top: 12px;">County : ${countyName}</div>

  <div class="color-legend-container" style="position: relative; width: 120px; height: 10px; margin: 5px auto;">
    <div class="color-legend" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; border: 1px solid #000; background: linear-gradient(to right, #ffc300, #ff2e00);"></div>
    <div class="legend-value" style="position: absolute; left: 0; top: 9px; color: black; font-size: 9px;">${minSVI}</div>
    <div class="legend-value" style="position: absolute; right: 0; top: 9px; color: black; font-size: 9px;">${maxSVI}</div>
    <div class="color-marker" style="position: absolute; left: ${sviPercentage}%; bottom: 0; top: 10px; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 8px solid #000;"></div>
  </div>

  <div id="svi-info" style="margin-top: 15px; color: black; margin-left: 5px;">SVI: ${countySVI}</div>
  <div class="triangle" style="width: 120px; height: 20px; border-right: 0; border-left: 120px solid transparent; border-bottom: 20px solid #ff8d19;"></div>
  <div class="color-legend-container1" style="position: relative; width: 120px; height: 10px; margin: 0px auto;">
    <div class="legend-value" style="position: absolute; left: 0; top: 2px; color: black; font-size: 9px;">${minPOP}</div>
    <div class="legend-value" style="position: absolute; right: 0; top: 9px; color: black; font-size: 9px;">${maxPOP}</div>
    <div class="color-marker" style="position: absolute; left: ${popPercentage}%; bottom: 0; top: 0px; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 8px solid #000;"></div>
  </div>
  <div id="population-info" style="margin-top: 15px; color: black; 5px; margin-left: 5px;">Variable: ${countyPOP}</div>
</div>
`;
