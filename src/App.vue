<template>
  <div id="app">
    <Toolsbar></Toolsbar>
    <div id="main">
      <Tablature class="tablature"></Tablature>
    </div>
    <div id="hidden">
      <input type="file" name="loadFile" id="loadFile">
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

  #hidden {
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
  }
</style>
