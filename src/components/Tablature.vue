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

                    <rect v-show="showBorder"
                          :x="decX * string_spacing+0.5"
                          :y="decY * frets_spacing+0.5"
                          :width="frets_size-1" :height="string_size + 30 - 1"
                          style="fill:transparent;stroke:black" id="background2"></rect>

                    <g v-if="showNumbers">
                        <text
                                v-for="(i, pos) in number_frets" :key="'fretsID' + i"
                                :x="decX * string_spacing + 5"
                                :y="(pos + decY) * frets_spacing + frets_spacing / 2 - 2"
                                style="font-size: 10px; font-family: Helvetica, Arial, sans-serif; font-weight: 600;">
                            {{ getCurrentHarpejji.number_frets - i - decY + 1 }}
                        </text>


                        <text
                                v-for="(i, pos) in number_string" :key="'stringsID' + i"
                                :x="(pos + decX) * string_spacing + string_spacing + 2"
                                :y="decY * frets_spacing + string_size"
                                style="font-size: 10px; font-family: Helvetica, Arial, sans-serif; font-weight: 600;">
                            {{ pos + decX + 1}}
                        </text>

                        <text
                                :x="(decX + number_string) * string_spacing + 5"
                                :y="decY * frets_spacing + 15"
                                style="font-size: 10px; font-family: Helvetica, Arial, sans-serif; font-weight: 600">
                            {{ currentHarpejji }}
                        </text>
                    </g>
                    <g v-if="!resetTablature">
                        <g v-for="(j, posY) in getCurrentHarpejji.number_frets" :key="j">
                            <g v-for="(i, posX) in getCurrentHarpejji.number_string" :key="i+';'+j">
                                <Key
                                        v-show="isVisible(posX, posY)"
                                        :pos-x="(posX) * string_spacing + string_spacing"
                                        :pos-y="(posY) * frets_spacing + frets_spacing / 2"
                                        :x="(posX)" :y="(posY)"
                                        ref="keys">
                                </Key>
                            </g>
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
                        v-show="editingZone">
                </Resizer>
                <Selector></Selector>
            </g>
        </svg>
    </div>
</template>

<script>

    import Key from './Key.vue'
    import Resizer from './Resizer.vue'
    import Title from './Title.vue'
    import {mapState, mapGetters} from 'vuex'
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
                allKeys: {},
                resetTablature: false
            }
        },
        methods: {
            /**
             * Calculate the size fo the SVG to be perfect regardless the windows size
             */
            calculateSize() {
                let workzoneC = document.getElementById('workzoneContainer');
                let wWidth = workzoneC.getBoundingClientRect().width / this.scale;
                let wHeight = workzoneC.getBoundingClientRect().height / this.scale;
                let wRatio = wHeight / wWidth;

                let app = document.getElementById('main');
                let maxWidth = app.clientWidth;
                //let maxHeight = Math.min(window.innerHeight - 0, 6500);
                let maxHeight = window.innerHeight;
                let maxRatio = maxHeight / maxWidth;


                if (wRatio < maxRatio) {
                    this.scale = maxWidth / wWidth;
                } else {
                    this.scale = maxHeight / wHeight;
                }


                this.svgHeight = wHeight * this.scale;
                this.svgWidth = wWidth * this.scale;
                this.xOffset = -this.decX * this.string_spacing * this.scale;
                this.yOffset = -this.decY * this.frets_spacing * this.scale;

                this.$root.$emit('isTooSmall', this.svgWidth > window.innerWidth - 70 * 2);

            },
            /**
             * Return if a key is visible from the screen, or out of bounds
             * @param posX position X of the key
             * @param posY position Y of the key
             * @returns {boolean} true if visible, false if not
             */
            isVisible(posX, posY) {
                posX++; // The x need to be 1 more
                return posX > this.x1 && posX < this.x2 && posY >= this.y1 && posY < this.y2 || this.editingZone;
            },
            /**
             * When the user want to go to the resizer mode
             * add certain class to allow animation
             * remove them after the animation is done.
             * Keeping them would cause some troubles, especially if the user resize the windows
             */
            editZone() {
                this.$root.$emit('unselectAll');
                document.getElementById('workzone').classList.add("animate-workzone");
                document.getElementById('tablature').classList.add("animate-workzone");
                this.editingZone = !this.editingZone;
                setTimeout(() => {
                    document.getElementById('workzone').classList.remove("animate-workzone");
                    document.getElementById('tablature').classList.remove("animate-workzone");
                }, 600);
            },
            /**
             * Save the current Tablature into JSON and download the file
             */
            save() {
                if (this.editingZone) return;
                let saveData = {
                    "v": "1.5", //version
                    "x1": this.x1,
                    "y1": this.y1,
                    "x2": this.x2,
                    "y2": this.y2,
                    "t": {
                        "v": this.$refs.title.title,
                        "c": this.$refs.title.color
                    },
                    "s": this.$store.state.currentHarpejji,
                    "k": []
                };
                for (let key of this.$refs.keys) {
                    if (key.isVisible) {
                        saveData.k.push({
                            "v": key.$refs.finger.value,
                            "c": key.$refs.finger.color,
                            "h": key.$refs.finger.hand,
                            "au": key.isArrowVisibleUp() ? 1 : 0,
                            "ad": key.isArrowVisibleDown() ? 1 : 0
                        });
                    } else {
                        saveData.k.push(0);
                    }
                }
                download(JSON.stringify(saveData), 'tablature_' + (this.$store.state.title || 'untitled') + '.htab');
                this.$store.commit('hasBeenSaved');
            },
            /**
             * Load a tablature JSON
             * @param data JSON
             */
            loadData(data) {
                Versionning.loadData(data, this);
            },
            /**
             * Prepare the playChord by adding all the playing key into the playlist
             * @param freq
             */
            setupChord(freq) {
                for (let key of this.$refs.keys) {
                    key.playChord(); //Add all the visible key in the play list
                }
                this.$root.$emit('playChord', freq);
            },

            /**
             * @return [] the first visible notes
             */
            getFirstVisibleKey() {
                return [this.getNoteNameAt(this.x1, this.y1), this.getNoteOctaveAt(this.x1, this.y1)];
            },

            getAllKeys() {
                let keys = [];
                for (let key of this.$refs.keys) {
                    if (key.isVisible) {
                        keys.push(key);
                    }
                }
                return keys;
            },

            getNoteNameAt(x, y) {
                let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                // Constant 1 of the current Harpejji size
                let c1 = this.getCurrentHarpejji.c1;
                return notes[mod(x * 2 + c1 - y, notes.length)];
            },
            getNoteOctaveAt(x, y) {
                // Constant 2 and 3 of the current Harpejji Size
                let c2 = this.getCurrentHarpejji.c2;
                let c2_2 = this.getCurrentHarpejji.c2_2;
                let c3 = this.getCurrentHarpejji.c3;
                return Math.floor((x + c2 - Math.floor((y + c2_2) / 2)) / 6) + c3;
            },
            getKeyAt(x, y) {
                return this.allKeys[x + '_' + y];
            }
        },
        computed: {
            number_frets() {
                let n = this.y2 - this.y1;
                if (this.editingZone) {
                    return this.getCurrentHarpejji.number_frets;
                } else {
                    return n;
                }
            },

            number_string() {
                let n = this.x2 - this.x1 - 1; //Need to do that for vue to watch x1 and x2
                if (this.editingZone) {
                    return this.getCurrentHarpejji.number_string;
                } else {
                    return n;
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
                'showNumbers', 'showBorder', 'currentHarpejji', 'zone.x1']),
            ...mapGetters(['getCurrentHarpejji']),


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
            window.tablature = this;
            this.allKeys = {};
            for (let key of this.$refs.keys) {
                this.allKeys[key.x + '_' + key.y] = key;
            }
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
            },
            currentHarpejji() {
                //this.$root.$emit('fixFrame');
                this.resetTablature = true;

                setTimeout(() => {
                    this.resetTablature = false;
                }, 0);
                setTimeout(() => {
                    this.calculateSize();
                    this.allKeys = {};
                    for (let key of this.$refs.keys) {
                        this.allKeys[key.x + '_' + key.y] = key;
                    }
                }, 100);
            }
        }
    }

    /**
     * Download a file with a certain content
     * @param text Content of the file
     * @param filename File name
     */
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
    .animate-workzone {
        /*transition: transform 500ms;*/
        transition: all 500ms;
    }


    #tablature {
        /*touch-action: none;
        -webkit-touch-callout: none;*/
        touch-action: pinch-zoom;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin: auto;
        display: block;
    }
</style>