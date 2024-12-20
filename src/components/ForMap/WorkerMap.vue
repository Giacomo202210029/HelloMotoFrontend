<template>
  <div id="map" style="height: 500px; width: 100%;"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Define custom icon settings using Leaflet's built-in marker
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

export default {
  name: "WorkerMap",
  props: {
    workers: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      if (this.map) {
        this.map.off();
        this.map.remove();
      }

      // Initialize the map with the CartoDB Positron layer
      this.map = L.map("map").setView([-12.0464, -77.0428], 12);
      L.tileLayer("https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      }).addTo(this.map);

      // Initialize marker cluster group with custom cluster styling
      const markers = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
          return L.divIcon({
            html: `<div style="background-color:#007bff; color:white; font-weight:bold; font-size:16px; width:35px; height:35px; display:flex; align-items:center; justify-content:center; border-radius:50%;">${cluster.getChildCount()}</div>`,
            className: "cluster-icon",
            iconSize: L.point(35, 35),
          });
        },
      });

      // Add markers to the cluster group
      this.workers.forEach((worker) => {
        if (worker.latitude && worker.longitude) {
          const marker = L.marker([worker.latitude, worker.longitude], {icon: customIcon});
          marker.bindPopup(`
            <div style="font-size:14px; font-weight:bold;">${worker.name}</div>

            <div>Área: ${worker.areaNames.join(", ")}</div>
            <div>Teléfono: ${worker.phone}</div>
          `);
          markers.addLayer(marker);
        }


      });

      // Add the marker cluster group to the map
      this.map.addLayer(markers);
    },
  },
  watch: {
    workers() {
      this.initializeMap();
    },
  },
};
</script>

<style scoped>
#map {
  height: 500px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cluster-icon {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
</style>
