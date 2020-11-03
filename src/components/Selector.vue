<template>
    <g>
        <rect id="selector" v-show="isVisible" :x="x" :y="y" :width="width" :height="height"></rect>
    </g>
</template>

<script>
    export default {
        name: "Selector",
        data() {
            return {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                isVisible: true,
                pt: null
            }
        },
        methods: {
            onMouseDown(e) {
                this.$root.$emit('unselectAll')
                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);
                let pos = this.cursorPoint(e);
                this.x1 = pos.x;
                this.y1 = pos.y;
                this.x2 = pos.x;
                this.y2 = pos.y;
                this.isVisible = true;
            },
            onMouseUp(e) {
                document.removeEventListener('mousemove', this.onMouseMove);
                document.removeEventListener('mouseup', this.onMouseUp);

                this.$root.$emit('selectKey', {x1: this.x, y1: this.y, x2: this.x + this.width, y2: this.y + this.height})
                this.$root.$emit('summonContextual');
                this.isVisible = false;
            },
            onMouseMove(e) {
                let pos = this.cursorPoint(e);
                this.x2 = pos.x;
                this.y2 = pos.y;
            },
            cursorPoint(e) {
                let workzone = document.getElementById('workzone');
                if (e.touches !== undefined) {
                    this.pt.x = e.touches[0].clientX;
                    this.pt.y = e.touches[0].clientY;
                } else {
                    this.pt.x = e.clientX;
                    this.pt.y = e.clientY;
                }
                return this.pt.matrixTransform(workzone.getScreenCTM().inverse());
            },
        },
        computed: {
            x() {
                return Math.min(this.x1, this.x2);
            },
            y() {
                return Math.min(this.y1, this.y2);
            },
            width() {
                return Math.abs(this.x1 - this.x2);
            },
            height() {
                return Math.abs(this.y1 - this.y2);
            },
        },
        mounted() {
            this.pt = document.getElementById('tablature').createSVGPoint();
            document.getElementById('background').addEventListener('mousedown', this.onMouseDown);
            this.$root.$on('unselectAll', () => {
                this.$store.commit('resetSelection');
                this.$root.$emit('unSummonContextual')
            });
        }
    }
</script>

<style scoped>
    #selector {
        fill: rgba(240, 240, 240, 0.5);
        stroke: #ECEFF1;
    }
</style>