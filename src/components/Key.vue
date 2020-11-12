<template>
    <g :transform="'translate(' + posX + ', ' + posY + ')'"
       @click="toggleVisible">
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
    import {mapState} from 'vuex'

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
            toggleVisible() {
                if (this.playNotes) {
                    this.playNote();
                }
                if (this.$parent.editingZone) return;
                this.isVisible = !this.isVisible;
                if (this.isVisible)
                    this.$refs.finger.startEdit();
                else {
                    this.$refs.finger.color = '#000000';
                    this.$refs.finger.hand = 0;
                    this.$refs.finger.value = '1';
                    this.$refs.finger.editing = false;
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
            resetKey() {
                this.isVisible = false;
            },
            unselectAll() {
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
            isBlack() {
                if (this.y % 2) {
                    return mod(Math.floor((this.x - 1 - (this.y - 1) / 2) / 3), 2);
                } else {
                    return mod(this.x - 1 - this.y / 2, 6) <= 1;
                }
            },
            keyColor() {
                if (this.isBlack) {
                    return "#999";
                } else {
                    return "#FFF";
                }
            },
            isDo() {
                return this.y % 2 && mod(this.x - 1 - (this.y - 1) / 2, 6) === 0;
            },
            note() {
                let index = 0;
                if (this.y % 2) {
                    index = this.x * 2 - 1 - this.y;
                } else {
                    index = this.x * 2 - this.y - 1;
                }
                return notes[mod(index, notes.length)];
            },
            octave() {
                if (this.y % 2) {
                    return Math.floor((this.x + 5 - Math.floor(this.y / 2)) / 6) + 1;
                } else {
                    return Math.floor((this.x + 5 - Math.floor(this.y / 2)) / 6) + 1;
                }
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
            this.$root.$on('resetTablature', this.resetKey);
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