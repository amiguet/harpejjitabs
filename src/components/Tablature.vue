<template>
    <div>
        <svg :width="svgWidth" :height="svgHeight" id="tablature">
            <rect width="100%" height="100%" style="fill:white" id="background"/>
            <g :style="{transform: 'translate('+xOffset+'px, '+yOffset+'px) scale('+scale+')'}" id="workzone">
                <g id="workzoneContainer">
                    <!-- frets -->
                    <line
                            v-for="(i, pos) in number_frets" :key="'frets' + i"
                            :x1="decX * string_spacing"
                            :y1="(pos + decY) * frets_spacing + frets_spacing / 2"
                            :x2="decX * string_spacing + frets_size"
                            :y2="(pos + decY) * frets_spacing + frets_spacing / 2"
                            style="fill:black;stroke-width:1px;stroke:black">
                    </line>

                    <!-- strings -->
                    <line
                            v-for="(i, pos) in number_string" :key="'strings' + i"
                            :x1="(pos + decX) * string_spacing + string_spacing"
                            :y1="decY * frets_spacing"
                            :x2="(pos + decX) * string_spacing + string_spacing"
                            :y2="decY * frets_spacing + string_size"
                            style="fill:black;stroke-width:1px;stroke:#CCC">
                    </line>

                    <g v-if="showNumbers">
                        <text
                                v-for="(i, pos) in number_frets" :key="'fretsID' + i"
                                :x="decX * string_spacing + 5"
                                :y="(pos + decY) * frets_spacing + frets_spacing / 2 - 2"
                                style="font-size: 7px">
                            {{ number_frets_default - i - decY + 1 }}
                        </text>


                        <text
                                v-for="(i, pos) in number_string" :key="'stringsID' + i"
                                :x="(pos + decX) * string_spacing + string_spacing + 2"
                                :y="decY * frets_spacing + string_size"
                                style="font-size: 7px">
                            {{ pos + decX + 1}}
                        </text>
                    </g>


                    <!--<g v-for="(j, posY) in number_frets" :key="j+decY">
                        <g v-for="(i, posX) in number_string" :key="i+decX+';'+j+decY">
                            <Key :pos-x="(posX + decX) * string_spacing + string_spacing"
                                 :pos-y="(posY + decY) * frets_spacing + frets_spacing / 2"
                                 :x="(posX + decX)" :y="(posY + decY)"></Key>
                        </g>
                    </g>-->

                    <g v-for="(j, posY) in number_frets_default" :key="j">
                        <g v-for="(i, posX) in number_string_default" :key="i+';'+j">
                            <Key
                                    v-show="isVisible(posX, posY)"
                                    :pos-x="(posX) * string_spacing + string_spacing"
                                    :pos-y="(posY) * frets_spacing + frets_spacing / 2"
                                    :x="(posX)" :y="(posY)"
                                    ref="keys">
                            </Key>
                        </g>
                    </g>
                    <Title
                            v-show="!editingZone"
                            :x="decX * string_spacing"
                            :y="decY * frets_spacing + string_size"
                            ref="title">
                    </Title>
                </g>

                <Resizer
                        v-if="editingZone">
                </Resizer>
                <Selector ></Selector>
            </g>
        </svg>
    </div>
</template>

<script>

    import Key from './Key.vue'
    import Resizer from './Resizer.vue'
    import Title from './Title.vue'
    import {mapState} from 'vuex'
    import * as Versionning from '../js/versionning.js'
    import Selector from "@/components/Selector";


    export default {
        name: "Tablature",
        components: {
            Selector,
            Key,
            Resizer,
            Title
        },
        data: function () {
            return {
                editingZone: false,
                scale: 3,
                svgHeight: 800,
                svgWidth: 800,
                xOffset: 0,
                yOffset: 0,
            }
        },
        methods: {
            calculateSize() {
                let workzoneC = document.getElementById('workzoneContainer');
                let wWidth = workzoneC.getBoundingClientRect().width / this.scale; //todo
                let wHeight = workzoneC.getBoundingClientRect().height / this.scale;
                let wRatio = wHeight / wWidth;

                let app = document.getElementById('main');
                let maxWidth = app.clientWidth;
                let maxHeight = Math.min(window.innerHeight - 0, 6500); // todo
                let maxRatio = maxHeight / maxWidth;


                if (wRatio < maxRatio) {
                    this.scale = maxWidth / wWidth;
                } else {
                    this.scale = maxHeight / wHeight;
                }


                this.svgHeight = wHeight * this.scale;
                this.svgWidth = wWidth * this.scale;
                //this.xOffset = Math.round((maxWidth - wWidth * this.scale - this.decX * this.string_spacing * this.scale) / 2);
                //this.xOffset = Math.round((maxWidth - (wWidth) * this.scale) / 2) - this.decX * this.string_spacing;
                //this.xOffset = Math.round((maxWidth - (wWidth) * this.scale) / 2) - this.decX * this.string_spacing * this.scale;
                this.xOffset = -this.decX * this.string_spacing * this.scale;
                this.yOffset = -this.decY * this.frets_spacing * this.scale;

                this.$root.$emit('isTooSmall', this.svgWidth > window.innerWidth - 70 * 2);


                //if (document.getElementById("main").getBoundingClientRect().w)
            },
            isVisible(posX, posY) {
                posX++;
                return posX > this.x1 && posX < this.x2 && posY >= this.y1 && posY < this.y2 || this.editingZone;
            },
            editZone() {
                document.getElementById('workzone').classList.add("animate-workzone");
                this.editingZone = !this.editingZone;
                setTimeout(() => {
                    document.getElementById('workzone').classList.remove("animate-workzone");
                }, 600);
            },
            save() {
                if (this.editingZone) return;
                let saveData = {
                    "v": "1.1", //version
                    "x1": this.x1,
                    "y1": this.y1,
                    "x2": this.x2,
                    "y2": this.y2,
                    "t": {
                        "v": this.$refs.title.title,
                        "c": this.$refs.title.color
                    },
                    "k": []
                };
                for (let key of this.$refs.keys) {
                    if (key.isVisible) {
                        saveData.k.push({
                            "v": key.$refs.finger.value,
                            "c": key.$refs.finger.color,
                        });
                    } else {
                        saveData.k.push(0);
                    }
                }
                download(JSON.stringify(saveData), 'tablature_' + this.$store.state.title + '.htab');
            },
            loadData(data) {
                Versionning.loadData(data, this);
            },
            setupChord(freq) {
                for (let key of this.$refs.keys) {
                    key.playChord(); //Add all the visible key in the play list
                }
                this.$root.$emit('playChord', freq);
            }
        },
        computed: {
            number_frets() {
                if (this.editingZone) {
                    return this.number_frets_default;
                } else {
                    return this.y2 - this.y1
                }
            },

            number_string() {
                if (this.editingZone) {
                    return this.number_string_default;
                } else {
                    return this.x2 - this.x1 - 1;
                }
            },

            decX() {
                if (this.editingZone) {
                    return 0;
                } else {
                    return this.x1;
                }
            },
            decY() {
                if (this.editingZone) {
                    return 0;
                } else {
                    return this.y1;
                }
            },

            string_size() {
                return this.frets_spacing * (this.number_frets + 0.5);
            },

            frets_size() {
                return this.string_spacing * (this.number_string + 1);
            },

            x1() {
                return this.$store.state.zone.x1;
            },
            y1() {
                return this.$store.state.zone.y1;
            },
            x2() {
                return this.$store.state.zone.x2;
            },
            y2() {
                return this.$store.state.zone.y2;
            },


            ...mapState(['frets_spacing', 'string_spacing', 'padding',
                'marker_width', 'marker_height', 'text_height',
                'number_string_default', 'number_frets_default',
                'showNumbers'])

        },
        mounted() {
            window.addEventListener('resize', this.calculateSize);
            this.calculateSize();
            this.$root.$on('editZone', this.editZone);
            this.$root.$on('save', this.save);
            this.$root.$on('loadData', this.loadData);
            this.$root.$on('needResize', this.calculateSize);
            this.$root.$on('changeShowNumbers', this.changeShowNumbers);
            this.$root.$on('setupChord', this.setupChord);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.calculateSize);
        },
        watch: {
            editingZone() {
                setTimeout(() => this.calculateSize(), 1);
            },
            x1() {
                this.calculateSize();
            },
            y1() {
                this.calculateSize();
            },
            x2() {
                this.calculateSize();
            },
            y2() {
                this.calculateSize();
            }
        }
    }

    function download(text, filename) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.getElementById('hidden').appendChild(element);

        element.click();

        document.getElementById('hidden').removeChild(element);
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

    .animate-workzone {
        transition: transform 500ms;
    }


    #tablature {
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin: auto;
        display: block;
    }


</style>