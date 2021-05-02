<template>
    <g :transform="'translate(' + posX + ', ' + posY + ')'"
       @mouseover="hover=true"
       @mouseleave="hover=false"
       @click.stop="toggleArrow()"
    >
        <rect
                width="2"
                height="15"
                transform="translate(-1, 0)"
                :style="{fill: arrowColor}">
        </rect>
        <polygon points="0 -4, -3 0, 3 0" :style="{fill: arrowColor}"></polygon>
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
                posY: -20,
                isVisible: false,
                hover: false,
            }
        },
        methods: {
            toggleArrow() {
                this.isVisible = !this.isVisible;
            }
        },
        computed: {
            arrowColor() {

                if (this.isVisible) {
                    return "#000000";
                } else {
                    if (this.hover) {
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