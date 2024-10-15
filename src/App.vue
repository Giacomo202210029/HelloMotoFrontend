<template>
  <div id="app">
    <router-view></router-view> <!-- Aquí se renderizarán tus rutas -->
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

/* Aplicar la fuente Poppins en todo el cuerpo */
body {
  font-family: 'Roboto Thin', sans-serif;
}

h1, h2, h3, h4, h5, h6, p, a, span, div, input, button {
  font-family: 'Roboto Thin', sans-serif;
}
</style>