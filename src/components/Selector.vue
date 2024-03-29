<template>
    <g>
        <rect id="selector" v-show="isVisible" :x="x" :y="y" :width="width" :height="height"></rect>
        <g v-if="isMoving" :transform="'translate(' + movingX + ', ' + movingY + ')'" opacity="0.5" style="cursor:grabbing">
            <path
                    v-for="key in this.$store.state.selected"
                    :key="'selected' + key.posX + ':' + key.posY"
                    :transform="'translate(' + key.posX + ', ' + key.posY + ')'"
                    :d="key.$refs.finger.path"
                    :fill="key.$refs.finger.color">
            </path>
            <text
                    v-for="key in this.$store.state.selected"
                    :key="'selectedText' + key.posX + ':' + key.posY"
                    :x="key.posX"
                    :y="key.posY + 21"
                    style="fill: white; font-size: 16px;font-family: Helvetica, Arial, sans-serif;"
                    text-anchor="middle"
                    dominant-baseline="middle">
                {{ key.$refs.finger.value }}
            </text>
        </g>
    </g>
</template>

<script>
    import {getCursorPos} from '../js/cursorPoint.js'
    import * as Shortcut from '../js/shortcuts.js'
    import {mapState} from 'vuex'

    export default {
        name: "Selector",
        data() {
            return {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                isMoving: false,
                movingX: 0,
                movingY: 0,
                mouseX: 0,
                mouseY: 0,
                isVisible: true,
            }
        },
        methods: {
            /**
             * When the user begin to drag the mouse on the white surface
             * @param e Event
             */
            onMouseDown(e) {
                this.$root.$emit('unselectAll');

                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);
                document.addEventListener('touchmove', this.onMouseMove);
                document.addEventListener('touchend', this.onMouseUp);
                let pos = getCursorPos(e);
                this.x1 = pos.x;
                this.y1 = pos.y;
                this.x2 = pos.x;
                this.y2 = pos.y;
                this.isVisible = true;
            },
            /**
             * When the user release the drag
             * Select all the key in the selection, summon contextual and remove the listeners
             */
            onMouseUp(e) {
                document.removeEventListener('mousemove', this.onMouseMove);
                document.removeEventListener('mouseup', this.onMouseUp);
                document.removeEventListener('touchmove', this.onMouseMove);
                document.removeEventListener('touchend', this.onMouseUp);

                this.$root.$emit('selectKey', {
                    x1: this.x,
                    y1: this.y,
                    x2: this.x + this.width,
                    y2: this.y + this.height
                });
                this.$root.$emit('summonContextual');
                this.isVisible = false;
                e.preventDefault();
            },
            /**
             * When the user move the selection corner
             */
            onMouseMove(e) {
                let pos = getCursorPos(e);
                this.x2 = pos.x;
                this.y2 = pos.y;
                e.preventDefault();
            },
            /**
             * If the user press backspace when marks are selected, delete them all
             */
            deleteSelected() {
                this.$root.$emit('deleteKeys', true);
                this.$root.$emit('unselectAll');
            },

            /**
             * Clone the arrays of key
             * @param allKeySelected array of key
             * @return [] an clone
             */
            cloneSelected(allKeySelected) {
                let tablature = this.$parent; //Get the tablature component

                // Retrieve all mark that need to move
                let moving = []; // Array of all the moving keys
                for (let key of allKeySelected) {
                    moving.push({
                        x: key.x,
                        y: key.y,
                        value: key.$refs.finger.value,
                        color: key.$refs.finger.color,
                        hand: key.$refs.finger.hand,
                        arrowUp: key.isArrowVisibleUp(),
                        arrowDown: key.isArrowVisibleDown()
                    });
                    //key.isVisible = false;
                    key.toggleVisible(false);
                }
                return moving;
            },
            /**
             * move the selected key to a new position
             * @param decX the x decalage relatif to the start position
             * @param decY the y decalage relatif to the start position
             * @param moving an optional array of cloned keys
             */
            moveSelected(decX, decY, moving = null, wantToSelection = true) {
                let tablature = this.$parent; //Get the tablature component
                if (moving === null) {
                    let allKeySelected = this.$store.state.selected;
                    moving = this.cloneSelected(allKeySelected);
                }

                this.$root.$emit('unselectAll');

                // Copy all the keys to the new position
                for (let mark of moving) {
                    for (let key of tablature.$refs.keys) {
                        if (mark.x + decX === key.x && mark.y + decY === key.y) {
                            key.isVisible = true;
                            key.$refs.finger.value = mark.value;
                            key.$refs.finger.color = mark.color;
                            key.$refs.finger.hand = mark.hand;
                            if (mark.arrowUp)
                                key.showArrowUp();
                            if (mark.arrowDown)
                                key.showArrowDown();

                            if (wantToSelection) {
                                key.$refs.finger.isSelected = true;
                                this.$store.commit('addToSelection', key);
                            }
                        }
                    }
                }
                if (wantToSelection)
                    this.$root.$emit('summonContextual');
            },
            /**
             * When the user start dragging a selected group of marks
             * isMoving = true => create the ghosts marks
             * @param e Event
             */
            startMoving(e) {
                document.body.style.cursor = "grabbing";
                this.isMoving = true;
                let pos = getCursorPos(e);
                this.mouseX = pos.x;
                this.mouseY = pos.y;
                this.movingX = 0;
                this.movingY = 0;
                document.addEventListener('mousemove', this.onMoveSelection, false);
                document.addEventListener('mouseup', this.stopDragSelection, false);
                document.addEventListener('touchmove', this.onMoveSelection, false);
                document.addEventListener('touchend', this.stopDragSelection, false);
                e.preventDefault();
            },
            /**
             * Change the position of the ghost marks
             * @param e Event
             */
            onMoveSelection(e) {
                let pos = getCursorPos(e);
                let difX = pos.x - this.mouseX + 10;
                let difY =  pos.y - this.mouseY + 10;
                this.movingX = this.string_spacing * Math.floor(difX / this.string_spacing);
                this.movingY = this.frets_spacing * Math.floor(difY / this.frets_spacing);
                e.preventDefault();
            },
            /**
             * When the user release the selected marks
             * disable the ghosts marks and move the selected key to the new position
             * @param e Event
             */
            stopDragSelection(e) {
                document.body.style.cursor = "";
                this.isMoving = false;

                let decX = this.movingX / this.string_spacing;
                let decY = this.movingY / this.frets_spacing;
                this.moveSelected(decX, decY);


                document.removeEventListener('mousemove', this.onMoveSelection, false);
                document.removeEventListener('mouseup', this.stopDragSelection, false);
                document.removeEventListener('touchmove', this.onMoveSelection, false);
                document.removeEventListener('touchend', this.stopDragSelection, false);
                e.preventDefault();
            }

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
            ...mapState(['frets_spacing', 'string_spacing']),
        },
        mounted() {
            document.getElementById('background').addEventListener('mousedown', this.onMouseDown, {passive: true});
            document.getElementById('background').addEventListener('touchstart', this.onMouseDown, {passive: true});
            document.getElementById('background2').addEventListener('mousedown', this.onMouseDown, {passive: true});
            document.getElementById('background2').addEventListener('touchstart', this.onMouseDown, {passive: true});
            this.$root.$on('unselectAll', () => {
                this.$store.commit('resetSelection');
                this.$root.$emit('unSummonContextual')
            });
            this.$root.$on('startMoving', this.startMoving);
            Shortcut.on("backspace", this.deleteSelected);
            window.selector = this;
        }
    }
</script>

<style scoped>
    #selector {
        fill: rgba(240, 240, 240, 0.5);
        stroke: #ECEFF1;
    }
</style>