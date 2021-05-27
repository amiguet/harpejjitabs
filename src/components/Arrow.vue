<template>
    <g :transform="'translate(' + posX + ', ' + posY + ')'"
       @mouseover2="hover=true"
       @mouseleave2="hover=false"
       @click2.stop="toggleArrow()"
    >
        <rect
                width="2"
                height="15"
                transform="translate(-1, 0)"
                :style="{fill: arrowColor}">
        </rect>
        <rect
                width="2"
                height="7"
                transform="translate(-1, 0)"
                style="fill: transparent"
                @mouseover="hoverUp=true"
                @mouseleave="hoverUp=false"
                @click.stop="toggleArrowUp()">
        </rect>
        <rect
                width="2"
                height="8"
                transform="translate(-1, 7)"
                style="fill: transparent"
                @mouseover="hoverDown=true"
                @mouseleave="hoverDown=false"
                @click.stop="toggleArrowDown()">
        </rect>
        <polygon points="0 -4, -3 0, 3 0" :style="{fill: arrowColorUp}"></polygon>
        <polygon points="0 19, -3 15, 3 15" :style="{fill: arrowColorDown}"></polygon>
    </g>
</template>

<script>
    export default {
        name: "Arrow",
        components: {
        },
        data() {
            return {
                posX: 0,
                posY: -21,
                isVisibleUp: false,
                isVisibleDown: false,
                hover: false,
                hoverUp: false,
                hoverDown: false,
            }
        },
        methods: {
            toggleArrowUp() {
                this.isVisibleUp = !this.isVisibleUp;
            },
            toggleArrowDown() {
                this.isVisibleDown = !this.isVisibleDown;
            },
        },
        computed: {
            arrowColor() {
                if (this.isVisibleUp ||this.isVisibleDown) {
                    return "#000000";
                } else {
                    if (this.hoverUp || this.hoverDown) {
                        return "#AAA";
                    }
                    return "#00000000";
                }
            },
            arrowColorUp() {
                if (this.isVisibleUp) {
                    return "#000000";
                } else {
                    if (this.hoverUp) {
                        return "#AAA";
                    }
                    return "#00000000";
                }
            },
            arrowColorDown() {
                if (this.isVisibleDown) {
                    return "#000000";
                } else {
                    if (this.hoverDown) {
                        return "#AAA";
                    }
                    return "#00000000";
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    g {
        cursor: pointer;
    }
</style>