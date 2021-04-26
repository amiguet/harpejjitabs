<template>
    <div id="app">
        <Toolsbar></Toolsbar>
        <div id="hidden">
            <SoundPlayer></SoundPlayer>
            <label for="loadFile">Load a file</label>
            <input type="file" name="loadFile" id="loadFile">
        </div>
        <div id="main">
            <Tablature class="tablature"></Tablature>
        </div>
        <Contextual></Contextual>
        <Informations></Informations>
    </div>
</template>
<script>
    import './js/util.js';
    import Tablature from './components/Tablature.vue';
    import Toolsbar from './components/Toolsbar.vue';
    import Contextual from "./components/Contextual.vue";
    import SoundPlayer from "@/components/SoundPlayer";
    import Informations from "@/components/Informations";

    export default {
        name: 'App',
        components: {
            Informations,
            SoundPlayer,
            Contextual,
            Tablature,
            Toolsbar,
        }
    }
</script>

<style>
    #app {
        font-family: Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    #main {
        max-width: 800px;
        width: 100%;
        margin: 0 auto;
        /*padding-top: 10px;*/
    }


    body, html {
        background-color: #eee !important;
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
