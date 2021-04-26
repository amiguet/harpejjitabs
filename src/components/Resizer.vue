<template>
    <g>
        <rect
                :x="x1 * string_spacing"
                :y="(y1 * frets_spacing + frets_spacing / 2)"
                :width="(x2 - x1) * string_spacing" :height="(y2 - y1) *  frets_spacing"
                style="fill: rgba(46, 213, 115, 0.2); cursor: grab;"
                ref="grabZone"
                @mousedown.stop="startDragRect"
                @touchstart.stop="startDragRect"
        ></rect>

        <!-- top left -->
        <g :transform="'translate(' + (x1 * string_spacing) + ', ' + (y1 * frets_spacing + frets_spacing / 2) + ')'">
            <polygon
                    v-show="true"
                    points="0,0 10,0 10,4, 4,4 4,10, 0,10"
                    fill="green"
                    class="resize tl"></polygon>
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x1" y="y1" cursor="nwse-resize"></circle>
        </g>


        <!-- top right -->
        <g :transform="'translate(' + (x2 * string_spacing - 10) + ', ' + (y1 * frets_spacing + frets_spacing / 2) + ')'">
            <polygon
                    v-show="true"
                    points="0,0 10,0 10,10, 6,10 6,4 0,4"
                    fill="green"
                    class="resize tr"></polygon>
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x2" y="y1" cursor="nesw-resize"></circle>
        </g>

        <!-- bottom left -->
        <g :transform="'translate(' + (x1 * string_spacing) + ', ' + (y2 * frets_spacing + frets_spacing / 2 - 10) + ')'">
            <polygon
                    v-show="true"
                    points="0,0 4,0 4,6 10,6 10,10 0,10"
                    fill="green"
                    class="resize bl"></polygon>
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x1" y="y2" cursor="nesw-resize"></circle>
        </g>

        <!-- bottom right -->
        <g :transform="'translate(' + (x2 * string_spacing - 10) + ', ' + (y2 * frets_spacing + frets_spacing / 2 - 10) + ')'">
            <polygon
                    v-show="true"
                    points="6,0 10,0 10,10 0,10 0,6 6,6"
                    fill="green"
                    class="resize br"></polygon>
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x2" y="y2" cursor="nwse-resize"></circle>
        </g>
        <transition name="fade">
            <text
                    v-show="displayConfirm"
                    :x="(x1 + x2) / 2 * string_spacing"
                    :y="y1 * frets_spacing + frets_spacing / 2 - 7"
                    text-anchor="middle"
                    fill="#448aff"
                    style="font-size: 23px; cursor: pointer"
                    @click="exitEditZone"
            >Confirm
            </text>
        </transition>

    </g>
</template>

<script>

    import {mapState, mapGetters} from 'vuex'
    import {getCursorPos} from '../js/cursorPoint'

    export default {
        name: "Resizer",
        data() {
            return {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,

                xGrab: 0,
                yGrab: 0,
                widthGrab: 0,
                heightGrab: 0,

                // Reference to the corner currently dragged
                dragged: null,

                saved: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0
                },
                // Display the confirm button
                displayConfirm: true
            }
        },
        methods: {
            /**
             * When the user start to drag a corner
             * @param e Event
             */
            startDrag(e) {
                this.dragged = e.target;
                document.addEventListener('mousemove', this.onMove, false);
                document.addEventListener('mouseup', this.stopDrag, false);
                document.addEventListener('touchmove', this.onMove, false);
                document.addEventListener('touchend', this.stopDrag, false);

                document.getElementById('app').style.cursor = this.dragged.getAttribute('cursor');
                this.$refs.grabZone.style.cursor = this.dragged.getAttribute('cursor');
                e.preventDefault();
            },
            /**
             * When the user move the corner
             * @param e Event
             */
            onMove(e) {
                let pos = getCursorPos(e); // Get the mouse position relative to the svg transformation
                this.savePosition();
                this[this.dragged.getAttribute('x')] = Math.floor(pos.x / this.string_spacing);
                this[this.dragged.getAttribute('y')] = Math.floor((pos.y - this.frets_spacing / 2) / this.frets_spacing);
                if (this.notValidPosition()) {
                    this.restorePosition();
                }
                //if (e instanceof MouseEvent)
                e.preventDefault();
                this.displayConfirm = false;
            },
            /**
             * When the user release the corner
             * Save the position and remove the listeners
             * @param e
             */
            stopDrag(e) {
                document.removeEventListener('mousemove', this.onMove, false);
                document.removeEventListener('mouseup', this.stopDrag, false);
                document.removeEventListener('touchmove', this.onMove, false);
                document.removeEventListener('touchend', this.stopDrag, false);
                this.dragged = null;

                this.$store.dispatch('changeZone', {
                    'x1': this.x1,
                    'x2': this.x2,
                    'y1': this.y1,
                    'y2': this.y2,
                });
                document.getElementById('app').style.cursor = "";
                this.$refs.grabZone.style.cursor = "grab";
                this.displayConfirm = true;
                e.preventDefault();
            },

            /**
             * When the user start to drag the rectangle selection
             * @param e Event
             */
            startDragRect(e) {
                document.body.style.cursor = "grabbing";
                this.$refs.grabZone.style.cursor = "grabbing";
                let pos = getCursorPos(e);
                this.xGrab = pos.x - this.x1 * this.string_spacing;
                this.yGrab = pos.y - this.y1 * this.frets_spacing;
                this.widthGrab = this.x2 - this.x1;
                this.heightGrab = this.y2 - this.y1;
                document.addEventListener('mousemove', this.onMoveRect, false);
                document.addEventListener('mouseup', this.stopDragRect, false);
                document.addEventListener('touchmove', this.onMoveRect, false);
                document.addEventListener('touchend', this.stopDragRect, false);
                e.preventDefault();
            },
            /**
             * When the user move the rectangle selection
             * @param e Event
             */
            onMoveRect(e) {
                this.savePosition();
                let pos = getCursorPos(e);
                this.x1 = Math.floor((pos.x - this.xGrab) / this.string_spacing);
                this.y1 = Math.floor((pos.y - this.yGrab) / this.frets_spacing);
                this.x2 = this.x1 + this.widthGrab;
                this.y2 = this.y1 + this.heightGrab;
                if (this.notValidPosition()) {
                    this.restorePosition();
                }
                e.preventDefault();
                this.displayConfirm = false;
            },
            /**
             * When the user release the rectangle selection
             * Save the position and remove the listeners
             * @param e
             */
            stopDragRect(e) {
                document.body.style.cursor = "";
                this.$refs.grabZone.style.cursor = "grab";
                document.removeEventListener('mousemove', this.onMoveRect, false);
                document.removeEventListener('mouseup', this.stopDragRect, false);
                document.removeEventListener('touchmove', this.onMoveRect, false);
                document.removeEventListener('touchend', this.stopDragRect, false);
                this.$store.dispatch('changeZone', {
                    'x1': this.x1,
                    'x2': this.x2,
                    'y1': this.y1,
                    'y2': this.y2,
                });
                this.displayConfirm = true;
                e.preventDefault();
            },
            /**
             * Create a temporary save of the position before each movement
             */
            savePosition() {
                this.saved.x1 = this.x1;
                this.saved.y1 = this.y1;
                this.saved.x2 = this.x2;
                this.saved.y2 = this.y2;
            },
            /**
             * Restore the position if the new movement is not valid
             */
            restorePosition() {
                this.x1 = this.saved.x1;
                this.y1 = this.saved.y1;
                this.x2 = this.saved.x2;
                this.y2 = this.saved.y2;
            },
            /**
             * Check if a current position is valid or not
             * @returns {boolean} false if valid, true if not valid
             */
            notValidPosition() {
                if (this.x1 > this.x2 - 2 || this.y1 > this.y2 - 1 || this.x1 < 0 || this.x2 > this.getCurrentHarpejji.number_string + 1 || this.y1 < 0 || this.y2 > this.getCurrentHarpejji.number_frets) {
                    return true;
                }
                return false;
            },
            /**
             * If the size of the Harpejji change, check if the resizer is not out of bound
             */
            fixPosition() {
                let c = this.$store.state.harpejjis[this.currentHarpejji];
                //console.log(this.getCurrentHarpejji.number_string); //Doesn't work every time, but why ?
                while (this.x2 > c.number_string + 1) {
                    this.x2--;
                    if (this.x1 > 0) {
                        this.x1--;
                    }
                }
                while (this.y2 > c.number_frets) {
                    this.y2--;
                    if (this.y1 > 0) {
                        this.y1--;
                    }
                }
                this.$store.dispatch('changeZone', {
                    'x1': this.x1,
                    'x2': this.x2,
                    'y1': this.y1,
                    'y2': this.y2,
                });
            },

            reframeToNote(note, octave, cloned) {
                let x1 = this.x1;
                let y1 = this.y1;
                let difX = this.x2 - this.x1;
                let difY = this.y2 - this.y1;

                let c = this.$store.state.harpejjis[this.currentHarpejji];

                function getCoordinate() {
                    for (let j = 0; j < c.number_frets - difY; j++)
                    {
                        for (let i = 0; i < c.number_string - difX; i++) {
                            if (window.tablature.getNoteNameAt(i, j) === note && window.tablature.getNoteOctaveAt(i, j) === octave) {
                                return {i, j};
                            }
                        }
                    }

                    for (let j = y1; j >= 0; j--)
                    {
                        for (let i = x1; i >= 0; i--) {
                            if (window.tablature.getNoteNameAt(i, j) === note) {
                                return {i, j};
                            }
                        }
                    }

                    for (let j = 0; j < c.number_frets - difY; j++)
                    {
                        for (let i = 0; i < c.number_string - difX; i++) {
                            if (window.tablature.getNoteNameAt(i, j) === note) {
                                return {i, j};
                            }
                        }
                    }
                    return {x1, y1};
                }
                let coordinate = getCoordinate();


                let decX = coordinate.i - this.x1;
                let decY = coordinate.j - this.y1;

                if (decX !== 0 || decY !== 0) {

                    this.x2 = coordinate.i + difX;
                    this.y2 = coordinate.j + difY;
                    this.x1 = coordinate.i;
                    this.y1 = coordinate.j;
                    this.fixPosition();
                    window.selector.moveSelected(decX, decY, cloned, false);
                }
            },

            exitEditZone() {
                this.$root.$emit('editZone');
            },
            updatedPosition() {
                this.x1 = this.$store.state.zone.x1;
                this.y1 = this.$store.state.zone.y1;
                this.x2 = this.$store.state.zone.x2;
                this.y2 = this.$store.state.zone.y2;
            }
        },

        mounted() {
            window.resizer = this;
            this.updatedPosition();
            this.$root.$on('fixFrame', this.fixPosition);
            this.$root.$on('updateResizerPosition', this.updatedPosition);
        },
        computed: {
            // Get some properties and getter from the VueX store
            ...mapState(['frets_spacing', 'string_spacing', 'padding', 'marker_width', 'marker_height', 'text_height', 'number_string', 'number_frets', 'number_string_default', 'number_frets_default', 'currentHarpejji']),
            ...mapGetters(['getCurrentHarpejji']),
            workzone() {
                return document.getElementById('workzone');
            }
        }
    }
</script>

<style scoped>
    .tl, .br {
        cursor: nwse-resize;
    }

    .bl, .tr {
        cursor: nesw-resize;
    }

    .fade-enter-active {
        animation: fade-animation 0.6s;
    }

    @keyframes fade-animation {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>