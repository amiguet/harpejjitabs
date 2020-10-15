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
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x1" y="y1" cursor="nwse-resize"></circle>
            <polygon
                    v-show="true"
                    points="0,0 10,0 10,4, 4,4 4,10, 0,10"
                    fill="green"
                    class="resize tl"></polygon>
        </g>


        <!-- top right -->
        <g :transform="'translate(' + (x2 * string_spacing - 10) + ', ' + (y1 * frets_spacing + frets_spacing / 2) + ')'">
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x2" y="y1" cursor="nesw-resize"></circle>
            <polygon
                    v-show="true"
                    points="0,0 10,0 10,10, 6,10 6,4 0,4"
                    fill="green"
                    class="resize tr"></polygon>
        </g>

        <!-- bottom left -->
        <g :transform="'translate(' + (x1 * string_spacing) + ', ' + (y2 * frets_spacing + frets_spacing / 2 - 10) + ')'">
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x1" y="y2" cursor="nesw-resize"></circle>
            <polygon
                    v-show="true"
                    points="0,0 4,0 4,6 10,6 10,10 0,10"
                    fill="green"
                    class="resize bl"></polygon>
        </g>

        <!-- bottom right -->
        <g :transform="'translate(' + (x2 * string_spacing - 10) + ', ' + (y2 * frets_spacing + frets_spacing / 2 - 10) + ')'">
            <circle r="30"
                    opacity="0"
                    @mousedown.capture.stop="startDrag"
                    @touchstart.capture.stop="startDrag"
                    x="x2" y="y2" cursor="nwse-resize"></circle>
            <polygon
                    v-show="true"
                    points="6,0 10,0 10,10 0,10 0,6 6,6"
                    fill="green"
                    class="resize br"></polygon>
        </g>

    </g>
</template>

<script>

    import {mapState} from 'vuex'

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
                pt: null,

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
                console.log("startDrag");
                this.dragged = e.target;
                window.addEventListener('mousemove', this.onMove, false);
                window.addEventListener('mouseup', this.stopDrag, false);
                window.addEventListener('touchmove', this.onMove, false);
                window.addEventListener('touchend', this.stopDrag, false);

                document.getElementById('app').style.cursor = this.dragged.getAttribute('cursor');
                this.$refs.grabZone.style.cursor = this.dragged.getAttribute('cursor');
            },
            onMove(e) {
                let pos = this.cursorPoint(e);
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
            cursorPoint(e) {
                if (e.touches !== undefined) {
                    this.pt.x = e.touches[0].clientX;
                    this.pt.y = e.touches[0].clientY;
                } else {
                    this.pt.x = e.clientX;
                    this.pt.y = e.clientY;
                }
                return this.pt.matrixTransform(this.workzone.getScreenCTM().inverse());
            },
            startDragRect(e) {
                console.log("startDrag");
                document.body.style.cursor = "grabbing";
                this.$refs.grabZone.style.cursor = "grabbing";
                let pos = this.cursorPoint(e);
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
                let pos = this.cursorPoint(e);
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
                console.log("stopDrag");
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
            startTouch(e) {
                console.log("yo");
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
                if (this.x1 > this.x2 - 2 || this.y1 > this.y2 - 1 || this.x1 < 0 || this.x2 > this.number_string_default + 1 || this.y1 < 0 || this.y2 > this.number_frets_default) {
                    console.log("invalid");
                    return true;
                }
                return false;
            },
            test() {
                console.log("test");
            }
        },
        mounted() {
            this.pt = document.getElementById('tablature').createSVGPoint();
            this.x1 = this.$store.state.zone.x1;
            this.y1 = this.$store.state.zone.y1;
            this.x2 = this.$store.state.zone.x2;
            this.y2 = this.$store.state.zone.y2;
        },
        computed: {
            ...mapState(['frets_spacing', 'string_spacing', 'padding', 'marker_width', 'marker_height', 'text_height', 'number_string', 'number_frets', 'number_string_default', 'number_frets_default']),
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