// Graph.vue
<template>
  <canvas id="myChart"></canvas>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.chart = new Chart(document.getElementById('myChart'), {
      type: 'bar',
      data: {
        labels: [], // Etiquetas de días
        datasets: [
          {
            label: 'Horas Trabajadas',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Horas',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Días',
            },
          },
        },
      },
    });
  },
  methods: {
    updateChart(labels, data) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    },
  },
};
</script>
