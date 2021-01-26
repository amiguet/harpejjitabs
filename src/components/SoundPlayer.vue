<template>
    <div>
    </div>
</template>

<script>
    import * as Tone from 'tone'
    import A2 from "../assets/samples/harp/A2.mp3";
    import A4 from "../assets/samples/harp/A4.mp3";
    import A6 from "../assets/samples/harp/A6.mp3";
    import B1 from "../assets/samples/harp/B1.mp3";
    /*import B3 from "../assets/samples/harp/B3.mp3";
    import B5 from "../assets/samples/harp/B5.mp3";
    import B6 from "../assets/samples/harp/B6.mp3";
    import C3 from "../assets/samples/harp/C3.mp3";
    import C5 from "../assets/samples/harp/C5.mp3";*/
    import D2 from "../assets/samples/harp/D2.mp3";
    import D4 from "../assets/samples/harp/D4.mp3";
    import D6 from "../assets/samples/harp/D6.mp3";
    import D7 from "../assets/samples/harp/D7.mp3";
    import E1 from "../assets/samples/harp/E1.mp3";
    /*import E3 from "../assets/samples/harp/E3.mp3";
    import E5 from "../assets/samples/harp/E5.mp3";
    import F2 from "../assets/samples/harp/F2.mp3";
    import F4 from "../assets/samples/harp/F4.mp3";
    import F6 from "../assets/samples/harp/F6.mp3";
    import F7 from "../assets/samples/harp/F7.mp3";*/
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
            /**
             * Play the sound of the note
             * @param {String} note in format C2 or D#4
             */
            playNote(note) {
                this.synth.triggerAttackRelease(note, 1);
            },
            /**
             * Add a note to the playlist, it need to contains x, y, and note
             * @param key
             */
            addKey(key) {
                this.playlist.push(key);
            },
            /**
             * Play a chord (playlist) simultaneously or sequentially
             * @param {Double} freq the time between each note
             */
            playChord(freq = 0) {
                // Sorts the keys from left to right then top to bottom
                let notes = this.playlist.sort((a, b) => { return b.y - a.y })
                    .sort((a, b) => { return a.x - b.x })
                    .map(a => a.note);

                const now = Tone.now();
                for (let i = 0; i < notes.length; i++) {
                    this.synth.triggerAttack(notes[i], now + i * freq);
                    setTimeout(() => {
                         document.getElementById('anim' + notes[i]).beginElement();
                    }, i * freq * 1000);

                }
                this.synth.triggerRelease(notes, now + notes.length * freq + 1.5,);

                this.playlist = [];
            }
        },
        mounted() {
            this.$root.$on('playNote', this.playNote);
            this.$root.$on('addKey', this.addKey);
            this.$root.$on('playChord', this.playChord);
            this.synth = new Tone.Sampler(
                //{A2, A4, A6, B1, B3, B5, B6, C3, C5, D2, D4, D6, D7, E1, E3, E5, F2, F4, F6, F7, G1, G3, G5}
                {A2, A4, A6, B1, D2, D4, D6, E1, D7, G1, G3, G5}
            ).toDestination();
        }
    }
</script>

<style scoped>

</style>