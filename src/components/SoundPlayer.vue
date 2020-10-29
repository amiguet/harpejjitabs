<template>
    <div>
        <img src="@/assets/icons/download.png" alt="">
    </div>
</template>

<script>
    //import {Synth} from '../js/audiosynth.js'
    import * as Tone from 'tone'
    import A2 from "../assets/samples/harp/A2.mp3";
    import A4 from "../assets/samples/harp/A4.mp3";
    import A6 from "../assets/samples/harp/A6.mp3";
    import B1 from "../assets/samples/harp/B1.mp3";
    import B3 from "../assets/samples/harp/B3.mp3";
    import B5 from "../assets/samples/harp/B5.mp3";
    import B6 from "../assets/samples/harp/B6.mp3";
    import C3 from "../assets/samples/harp/C3.mp3";
    import C5 from "../assets/samples/harp/C5.mp3";
    import D2 from "../assets/samples/harp/D2.mp3";
    import D4 from "../assets/samples/harp/D4.mp3";
    import D6 from "../assets/samples/harp/D6.mp3";
    import D7 from "../assets/samples/harp/D7.mp3";
    import E1 from "../assets/samples/harp/E1.mp3";
    import E3 from "../assets/samples/harp/E3.mp3";
    import E5 from "../assets/samples/harp/E5.mp3";
    import F2 from "../assets/samples/harp/F2.mp3";
    import F4 from "../assets/samples/harp/F4.mp3";
    import F6 from "../assets/samples/harp/F6.mp3";
    import F7 from "../assets/samples/harp/F7.mp3";
    import G1 from "../assets/samples/harp/G1.mp3";
    import G3 from "../assets/samples/harp/G3.mp3";
    import G5 from "../assets/samples/harp/G5.mp3";

    export default {
        name: "SoundPlayer",
        data() {
            return {
                synth: null,
                playlist: []
            }
        },
        methods: {
            getSynth() {
                if (this.synth == null) {
                    /*const vol = new Tone.Volume(-30).toDestination();
                    this.synth = new Tone.PolySynth().connect(vol).toDestination();
                    console.log(vol);*/
                }
                return this.synth;
            },
            playNote(note) {
                this.synth.triggerAttackRelease(note, 1);
            },
            addKey(key) {
                this.playlist.push(key);
            },
            playChord(freq = 0) {
                let notes = this.playlist.sort((a, b) => (a.y > b.y) ? 1 : -1)
                    .sort((a, b) => (a.x > b.x) ? 1 : -1)
                    .map(a => a.note);
                const now = Tone.now();
                for (let i = 0; i < notes.length; i++) {
                    this.synth.triggerAttack(notes[i], now + i * freq);
                }
                this.synth.triggerRelease(notes, now + Math.max(notes.length * freq, 1.5));
                //this.synth.triggerAttackRelease(notes, "8n");

                this.playlist = [];

            }
        },
        mounted() {
            this.$root.$on('playNote', this.playNote);
            this.$root.$on('addKey', this.addKey);
            this.$root.$on('playChord', this.playChord);
            this.synth = new Tone.Sampler(
                {A2, A4, A6, B1, B3, B5, B6, C3, C5, D2, D4, D6, D7, E1, E3, E5, F2, F4, F6, F7, G1, G3, G5}
            ).toDestination();
        }
    }
</script>

<style scoped>

</style>