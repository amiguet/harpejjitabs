<template>
    <g :transform="'translate(' + posX + ', ' + posY + ')'"
       @click="clickKey">
        <rect
                width="15"
                height="25"
                transform="translate(-7.5, 0)"
                :style="{stroke: '#666', strokeWidth: '1px', fill: keyColor}">
        </rect>
        <rect
                v-if="isDo"
                width="10"
                height="5"
                transform="translate(-5, 7)"
                style="fill:transparent;stroke:black;">
        </rect>
        <text v-if="showNotes" style="font-size: 7px; font-family: Helvetica, Arial, sans-serif;" text-anchor="middle"
              x="0" y="7" :fill="textColor">{{note}}{{octave}}
        </text>
        <Finger :isVisible="isVisible" @deleteFinger="toggleVisible" :note="noteOctave" ref="finger"></Finger>
    </g>
</template>

<script>

    import Finger from './Finger.vue'
    import {mapState, mapGetters} from 'vuex'

    let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    export default {
        name: "Key",
        components: {
            Finger
        },
        props: [
            'posX',
            'posY',
            'x',
            'y'
        ],
        data: function () {
            return {
                isVisible: false
            }
        },
        methods: {
            clickKey() {
                if (this.playNotes) {
                    this.playNote();
                }
                this.toggleVisible();
            },
            toggleVisible(newValue = null) {

                if (this.$parent.editingZone) return;

                if (this.isVisible !== newValue) {
                    this.isVisible = !this.isVisible;


                    if (this.isVisible)
                        this.$refs.finger.startEdit();
                    else {
                        this.$refs.finger.color = '#000000';
                        this.$refs.finger.hand = 0;
                        this.$refs.finger.value = '1';
                        this.$refs.finger.editing = false;
                    }
                }
            },
            playChord() {
                if (this.isVisible && this.$el.style.display !== "none") {
                    this.$root.$emit('addKey', {note: this.noteOctave, x: this.x, y: this.y});
                }
            },
            playNote() {
                this.$root.$emit('playNote', this.noteOctave);
            },
            resetKey(onlySelected = false) {
                if (!onlySelected || this.$refs.finger && this.$refs.finger.isSelected)
                    this.toggleVisible(false);
            },
            unselectAll() {
                if (this.$refs.finger)
                    this.$refs.finger.isSelected = false;
            },
            selectKey(rect) {
                if (this.isVisible
                    && this.posX > rect.x1 && this.posX < rect.x2
                    && this.posY + 20 > rect.y1 && this.posY + 20 < rect.y2) {
                    this.$refs.finger.isSelected = true;
                    this.$store.commit('addToSelection', this);
                }
            }
        },
        computed: {
            ...mapState(['showNotes', 'playNotes']),
            ...mapGetters(['getCurrentHarpejji']),
            isBlack() {
                /*if (this.y % 2) {
                    return mod(Math.floor((this.x - 1 - (this.y - 1) / 2) / 3), 2);
                } else {
                    return mod(this.x - 1 - this.y / 2, 6) <= 1;
                }*/
                return this.note.length === 2
            },
            keyColor() {
                if (this.isBlack) {
                    return "#999";
                } else {
                    return "#FFF";
                }
            },
            isDo() {
                //return this.y % 2 && mod(this.x - 1 - (this.y - 1) / 2, 6) === 0;
                return this.note === "C";
            },
            note() {
                /*//return notes[mod(this.x * 2 - 1 - this.y, notes.length)];
                //24
                let c1 = -1;

                //12
                c1 = 2;

                //16
                c1 = 6;*/
                let c1 = this.getCurrentHarpejji.c1;

                return notes[mod(this.x * 2 + c1 - this.y, notes.length)];
            },
            octave() {
                /*if (this.y % 2) {
                    return Math.floor((this.x + 5 - Math.floor(this.y / 2)) / 6) + 1;
                } else {
                    return Math.floor((this.x + 5 - Math.floor(this.y / 2)) / 6) + 1;
                }
                //24
                let c2 = 5;
                let c3 = 1;

                //12
                c2 = 1;
                c3 = 3;

                //16
                c2 = 3;
                c3 = 3;*/

                let c2 = this.getCurrentHarpejji.c2;
                let c3 = this.getCurrentHarpejji.c3;


                return Math.floor((this.x + c2 - Math.floor(this.y / 2)) / 6) + c3;
            },
            noteOctave() {
                return this.note + this.octave;
            },
            textColor() {
                if (this.isBlack) {
                    return "#EEE";
                } else {
                    return "#555";
                }
            }
        },
        mounted() {
            this.$root.$on('deleteKeys', this.resetKey);
            this.$root.$on('unselectAll', this.unselectAll);
            this.$root.$on('selectKey', this.selectKey);
        }
    }

    function mod(n, m) {
        return ((n % m) + m) % m;
    }
</script>

<style scoped>

</style>