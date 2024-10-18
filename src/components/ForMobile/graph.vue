<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: "graph",
  mounted() {
    const ctx = this.$refs.canvas.getContext('2d');
    const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const data = {
      labels: labels,
      datasets: [{
        axis: 'y',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1
      }]
    };
    const config = {
      type: 'bar',
      data,
      options: {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false // Remove the legend
          }
        },
        scales: {
          y: {
            ticks: {
              font: {
                size: 10 // Reduce the font size of the labels
              }
            }
          }
        }
      }
    };
    new Chart(ctx, config);
  }
}
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
/* Add any necessary styles here */
</style>