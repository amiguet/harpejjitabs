<template>
    <div>
        <svg width="100%" :height="svgHeight" id="tablature">
            <rect width="100%" height="100%" style="fill:white"/>
            <g :transform="'translate('+xOffset+', 0), scale('+scale+')'" id="workzone">

                <!-- frets -->
                <line
                        v-for="(i, pos) in number_frets" :key="'frets' + i"
                        x1="0"
                        :y1="pos * frets_spacing + frets_spacing / 2"
                        :x2="frets_size"
                        :y2="pos * frets_spacing + frets_spacing / 2"
                        style="fill:black;stroke-width:1px;stroke:black">
                </line>

                <!-- strings -->
                <line
                        v-for="(i, pos) in number_string" :key="'strings' + i"
                        :x1="pos * string_spacing + string_spacing"
                        y1="0"
                        :x2="pos * string_spacing + string_spacing"
                        :y2="string_size"
                        style="fill:black;stroke-width:1px;stroke:#CCC">
                </line>


                <g v-for="(j, posY) in number_frets" :key="j">
                    <g v-for="(i, posX) in number_string" :key="i+';'+j">
                        <Key :pos-x="posX * string_spacing + string_spacing"
                             :pos-y="posY * frets_spacing + frets_spacing / 2"
                             :x="posX" :y="posY"></Key>
                    </g>
                </g>




                <Resizer
                        v-if="editingZone">
                </Resizer>

                <Title></Title>
            </g>
        </svg>
    </div>
</template>

<script>

    import Key from './Key.vue'
    import Resizer from './Resizer.vue'
    import Title from './Title.vue'
    import { mapState } from 'vuex'


    export default {
        name: "Tablature",
        components: {
            Key,
            Resizer,
            Title
        },
        data: function () {
            return {
                editingZone: false,
                scale: 3,
                svgHeight: 800,
                xOffset: 0
            }
        },
        methods: {
            startDrag() {

            },
            calculateSize() {
                let workzone = document.getElementById('workzone');
                let wWidth = workzone.getBoundingClientRect().width / this.scale;
                let wHeight = workzone.getBoundingClientRect().height / this.scale;
                let wRatio = wHeight / wWidth;

                let app = document.getElementById('main');
                let maxWidth = app.clientWidth;
                let maxHeight = Math.min(window.innerHeight - 80, 650);
                let maxRatio = maxHeight / maxWidth;


                if (wRatio < maxRatio) {
                    this.scale = maxWidth / wWidth;
                } else {
                    this.scale = maxHeight / wHeight;
                }


                this.svgHeight = wHeight * this.scale;
                this.xOffset = Math.round((maxWidth - wWidth * this.scale) / 2);



                //let number
            }
        },
        computed: {
            number_frets() {
                if (this.editingZone) {
                    return this.number_frets_default;
                } else {
                    return this.$store.state.zone.y2 - this.$store.state.zone.y1
                }
            },

            number_string() {
                if (this.editingZone) {
                    return this.number_string_default;
                } else {
                    return this.$store.state.zone.x2 - this.$store.state.zone.x1
                }
            },

            string_size() {
                return this.frets_spacing * (this.number_frets + 0.5);
            },

            frets_size() {
                return this.string_spacing * (this.number_string + 1);
            },


            ...mapState(['frets_spacing', 'string_spacing', 'padding', 'marker_width', 'marker_height', 'text_height', 'number_string_default', 'number_frets_default'])

        },
        mounted() {
            window.addEventListener('resize', this.calculateSize);
            this.calculateSize();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.calculateSize);
        }
    }
</script>

<style scoped>
    /*line {
        fill: #000;
        stroke-width: 1px;
        stroke: #000;
    }

    rect {
        fill: #000;
    }

    .string {
        stroke: #CCC;
    }*/

</style>