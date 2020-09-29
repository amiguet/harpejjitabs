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
                transform="translate(-5, 10)"
                style="fill:transparent;stroke:black;">
        </rect>
        <Finger :isVisible="isVisible" @deleteFinger="isVisible = false"></Finger>
    </g>
</template>

<script>

    import Finger from './Finger.vue'

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
        data: function() {
            return {
                isVisible: false
            }
        },
        methods: {
            toggleVisible() {
                console.log("yoo");
                this.isVisible = !this.isVisible;
            }
        },
        computed: {
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
            }
        }
    }

    function mod(n, m) {
        return ((n % m) + m) % m;
    }
</script>

<style scoped>

</style>