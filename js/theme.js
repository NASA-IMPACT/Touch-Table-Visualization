// Change the map themes
import { map } from './map.js';
const layerList = document.getElementById('menu'); // light/dark selection menu
const inputs = layerList.getElementsByTagName('input');
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