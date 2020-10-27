<template>
    <div></div>
</template>

<script>
    import {Synth} from '../js/audiosynth.js'

    export default {
        name: "SoundPlayer",
        data() {
            return {
                piano: null
            }
        },
        methods: {
            playNote(note, octave) {
                this.piano.play(note, octave, 2);
            }
        },
        mounted() {
            this.piano = Synth.createInstrument('piano');
            this.$root.$on('playNote', this.playNote);
        }
    }
</script>

<style scoped>

</style>