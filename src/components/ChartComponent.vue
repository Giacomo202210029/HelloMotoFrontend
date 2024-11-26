<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";

export default {
  name: "ChartComponent",
  props: ["labels", "datasets"],
  data() {
    return {
      chartInstance: null,
    };
  },
  watch: {
    labels: "renderChart",
    datasets: "renderChart",
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.labels,
          datasets: this.datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: "Días" },
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: "Horas" },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>
