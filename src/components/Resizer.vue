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

    </g>
</template>

<script>

    import {mapState, mapGetters} from 'vuex'
    import {getCursorPos} from '../js/cursorPoint'

    export default {
        name: "Resizer",
        data: function () {
            return {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,

                xGrab: 0,
                yGrab: 0,
                widthGrab: 0,
                heightGrab: 0,


                dragged: null,

                saved: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 0
                }
            }
        },
        methods: {
            startDrag(e) {
                this.dragged = e.target;
                window.addEventListener('mousemove', this.onMove, false);
                window.addEventListener('mouseup', this.stopDrag, false);
                window.addEventListener('touchmove', this.onMove, false);
                window.addEventListener('touchend', this.stopDrag, false);

                document.getElementById('app').style.cursor = this.dragged.getAttribute('cursor');
                this.$refs.grabZone.style.cursor = this.dragged.getAttribute('cursor');
            },
            onMove(e) {
                let pos = getCursorPos(e);
                this.savePosition();
                this[this.dragged.getAttribute('x')] = Math.floor(pos.x / this.string_spacing);
                this[this.dragged.getAttribute('y')] = Math.floor((pos.y - this.frets_spacing / 2) / this.frets_spacing);
                if (this.notValidPosition()) {
                    this.restorePosition();
                }
                if (e instanceof MouseEvent)
                    e.preventDefault();
            },
            stopDrag() {
                window.removeEventListener('mousemove', this.onMove, false);
                window.removeEventListener('mouseup', this.stopDrag, false);
                window.removeEventListener('touchmove', this.onMove, false);
                window.removeEventListener('touchend', this.stopDrag, false);
                this.dragged = null;

                this.$store.dispatch('changeZone', {
                    'x1': this.x1,
                    'x2': this.x2,
                    'y1': this.y1,
                    'y2': this.y2,
                });
                document.getElementById('app').style.cursor = "";
                this.$refs.grabZone.style.cursor = "grab";
            },
            startDragRect(e) {
                document.body.style.cursor = "grabbing";
                this.$refs.grabZone.style.cursor = "grabbing";
                let pos = getCursorPos(e);
                this.xGrab = pos.x - this.x1 * this.string_spacing;
                this.yGrab = pos.y - this.y1 * this.frets_spacing;
                this.widthGrab = this.x2 - this.x1;
                this.heightGrab = this.y2 - this.y1;
                window.addEventListener('mousemove', this.onMoveRect, false);
                window.addEventListener('mouseup', this.stopDragRect, false);
                window.addEventListener('touchmove', this.onMoveRect, false);
                window.addEventListener('touchend', this.stopDragRect, false);
            },
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
                if (e instanceof MouseEvent)
                    e.preventDefault();
            },
            stopDragRect() {
                document.body.style.cursor = "";
                this.$refs.grabZone.style.cursor = "grab";
                window.removeEventListener('mousemove', this.onMoveRect, false);
                window.removeEventListener('mouseup', this.stopDragRect, false);
                window.removeEventListener('touchmove', this.onMoveRect, false);
                window.removeEventListener('touchend', this.stopDragRect, false);
                this.$store.dispatch('changeZone', {
                    'x1': this.x1,
                    'x2': this.x2,
                    'y1': this.y1,
                    'y2': this.y2,
                });
            },
            savePosition() {
                this.saved.x1 = this.x1;
                this.saved.y1 = this.y1;
                this.saved.x2 = this.x2;
                this.saved.y2 = this.y2;
            },
            restorePosition() {
                this.x1 = this.saved.x1;
                this.y1 = this.saved.y1;
                this.x2 = this.saved.x2;
                this.y2 = this.saved.y2;
            },
            notValidPosition() {
                if (this.x1 > this.x2 - 2 || this.y1 > this.y2 - 1 || this.x1 < 0 || this.x2 > this.getCurrentHarpejji.number_string + 1 || this.y1 < 0 || this.y2 > this.getCurrentHarpejji.number_frets) {
                    return true;
                }
                return false;
            },
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

            }

        },
        mounted() {
            console.log("yo ?");
            this.x1 = this.$store.state.zone.x1;
            this.y1 = this.$store.state.zone.y1;
            this.x2 = this.$store.state.zone.x2;
            this.y2 = this.$store.state.zone.y2;
            this.$root.$on('fixFrame', this.fixPosition);
        },
        computed: {
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
</style>