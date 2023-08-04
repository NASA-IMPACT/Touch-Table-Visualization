export const popupTemplate = (stateId, stateName) => `
<style>
  .custom-popup${stateId} .mapboxgl-popup-content {
    background-color: rgba(0, 0, 0, 0.9);
    color: #fff;
  }

  .custom-popup${stateId} .mapboxgl-popup-tip {
    filter: invert(100%);
    opacity: 0.0;
    display: none;
  }

  .custom-popup${stateId} .mapboxgl-popup-close-button {
    display: none;
    color: #fff;
    padding-right: 6px;
    padding-bottom: 100px;
  }

  input[type="checkbox"] {
    /* Hide the default checkbox */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 5px;
    border: 1px solid #fff;
    outline: none;
    cursor: pointer;
  }

  /* Style the checked checkbox */
  input[type="checkbox"]:checked {
    /* Change the background color of the checkbox */
    background-color: #ff8d19;
  }

  .data${stateId} {
    max-width: 180px;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 4px;
    justify-content: center;
    align-items: flex-start;
  }

  /* Style the submit buttons */
  button[name="submit"] {
    background-color: #ffc300;
    border: none;
    color: #000000;
    padding: 4px 8px;
    padding-bottom: 2px;
    border-radius: 3px;
    font-size: 10px;
    cursor: pointer;
    width: 40px;
    height: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .header1 {
    font-family: Arial, sans-serif;
    font-size: 16px;
    color: #ffc300;
    margin: 1px 0 0 0;
    text-align: center;
    padding: 5px;
    cursor: move;
    background-color: rgba(0, 0, 0, 0.8);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .header {
    font-family: Arial, sans-serif;
    font-size: 16px;
    color: #ffc300;
    cursor: grab;
    margin: 1px 0 0 0;
    text-align: center;
    justify-content: flex-end;
    padding: 5px;
    cursor: move;
    background-color: rgba(0, 0, 0, 0.8);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .minimize-button {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 16px;
    cursor: pointer;
  }


</style>

<div id="pp" class="data${stateId}">
<div id="show-header${stateId}">
<div class="minimize-button" id="minimize-button${stateId}">&#9477;</div>
<div class="header" style="align:right; align-content:right;" draggable="true">&#9776;</div>
 <div class="header1">${stateName}</div>
 </div
  <div id="hide${stateId}" class=hide${stateId}">
  <h5 style="font-family: Arial, sans-serif; font-size: 13px; color: #ffc300; margin: 0; text-align: center;">Select Visualization(s)</h5>

  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; align-items: center;">
      <input type="checkbox" id="svi-checkbox${stateId}" name="svi-checkbox" value="SVI">
      <label class="option" for="svi-checkbox${stateId}" style="margin: 0; padding: 2px 4px; background-color: rgba(0, 0, 0, 0.6); border-radius: 2px; cursor: pointer; font-size: 8px; color: #fff;">SVI</label>
    </div>

    <div style="display: flex; align-items: center;">
      <input type="checkbox" id="sea-level-checkbox${stateId}" name="sea-level-checkbox" value="SeaLevel" style="margin-left: 5px;">
      <label class="option" for="sea-level-checkbox${stateId}" style="margin: 0; padding: 2px 4px; background-color: rgba(0, 0, 0, 0.6); border-radius: 2px; cursor: pointer; font-size: 8px; color: #fff;">Sea Level</label>
    </div>
  </div>

  <div style="display: flex; flex-direction: column; align-items: center;">
    <input name="slider${stateId}" type="range" min="0" max="9" value="0" class="slider" id="height${stateId}" disabled>
    <span id="selected-height${stateId}" style="font-size: 8px; margin-left: 5px;"> 0 ft</span>
  </div>

  <div style="display: flex; flex-direction: row; align-items: center; margin: auto; padding-top: 5px;">
    <button name="submit" id="done-button${stateId}">Done</button>
    <button name="submit" id="close-button${stateId}">Close</button>
  </div>
  </div>
</div>
`;
