<template>
  <div id="app">
    <Toolsbar>yo</Toolsbar>
    <div id="main">
      <Tablature class="tablature"></Tablature>
    </div>
  </div>
</template>

<script>
import Tablature from './components/Tablature.vue'
import Toolsbar from './components/Toolsbar.vue'

export default {
  name: 'App',
  components: {
    Tablature,
    Toolsbar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#main {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}
.tablature {
  margin-top: 10px;
}

body {
  background-color: #eee;
}

  body, html {
    margin: 0;
    padding: 0;
  }
</style>
