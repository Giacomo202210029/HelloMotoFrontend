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
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.$refs.canvas, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: 'Horas Trabajadas',
              data: this.data,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Días',
              },
              ticks: {
                autoSkip: true, // Omitir etiquetas si hay demasiadas
                maxTicksLimit: 10, // Limitar a 10 etiquetas visibles
                maxRotation: 0,
                minRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Horas',
              },
              ticks: {
                stepSize: 1, // Asegurar incrementos claros
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      });
    },
    updateChart(labels, data) {
      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    },
  },
  watch: {
    labels: 'renderChart',
    data: 'renderChart',
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  max-height: 200px; /* Ajustar la altura del gráfico */
}
</style>
