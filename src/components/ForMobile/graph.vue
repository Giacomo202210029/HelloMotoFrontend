<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  props: ['labels', 'data'],
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      this.chart = new Chart(this.$refs.canvas, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Horas Trabajadas',
              data: this.data,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
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
    updateChart(labels, data) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    },
  },
};
</script>

<style scoped>
/* Estilos opcionales para el gráfico */
</style>
