<template>
    <div>
        <md-drawer :md-active.sync="menuVisible" md-persistent="mini" :class="{smaller: isSmaller}">
            <md-list>
                <md-list-item style="height: 40px" class="first-logo">
                    <span class="md-list-item-text" style="height: 40px">
                        <img src="img/logo_Marcodi.webp" alt="Logo Marcodi" class="logo-marcodi">
                    </span>
                </md-list-item>
                <md-list-item @click="toggleMenu" title="Menu" class="first-child">
                    <span class="menu-button">
                        <font-awesome-icon icon="bars"/>
                    </span>
                    <span class="md-list-item-text">Harpejji® Tabs</span>
                </md-list-item>
                <md-list-item @click="editZone" title="Set note range (R)">
                    <font-awesome-icon icon="expand"/>
                    <span class="md-list-item-text">Set note range</span>
                </md-list-item>

                <md-list-item @click="newTablature" title="New">
                    <font-awesome-icon icon="file"/>
                    <span class="md-list-item-text">New</span>
                    <!--<md-menu md-size="small" :md-offset-x="100" :md-offset-y="-96" :md-align-trigger="true" :md-active.sync="showHarpejjiMenu">
                            <font-awesome-icon icon="file"/>
                            <span class="md-list-item-text">New</span>
                        <md-menu-content>
                            <md-menu-item @click="changeHarpejji('U12')">U12</md-menu-item>
                            <md-menu-item @click="changeHarpejji('G16')">G16</md-menu-item>
                            <md-menu-item @click="changeHarpejji('K24')">K24</md-menu-item>
                        </md-menu-content>
                    </md-menu>-->
                </md-list-item>

                <md-list-item @click="showHarpejjiMenu = true" title="Change Harpejji® model">
                    <md-menu md-size="small" :md-offset-x="100" :md-offset-y="-96" :md-align-trigger="true"
                             :md-active.sync="showHarpejjiMenu">
                        <span class="text-icon text-icon-small">{{ currentHarpejji }}</span>
                        <span class="md-list-item-text">Change Harpejji® model</span>
                        <md-menu-content>
                            <md-menu-item @click="changeHarpejji('U12')">U12</md-menu-item>
                            <md-menu-item @click="changeHarpejji('G16')">G16</md-menu-item>
                            <md-menu-item @click="changeHarpejji('K24')">K24</md-menu-item>
                        </md-menu-content>
                    </md-menu>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="downloadPNG" title="Export to PNG">
                    <font-awesome-icon icon="file-image" size="lg"/>
                    <span class="md-list-item-text">Export to PNG</span>
                </md-list-item>

                <md-list-item @click="downloadSVG" title="Export to SVG">
                    <font-awesome-icon icon="file-code" size="lg"/>
                    <span class="md-list-item-text">Export to SVG</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="save" title="Save (Ctrl+S)">
                    <font-awesome-icon icon="file-download" size="lg"/>
                    <span class="md-list-item-text">Save</span>
                </md-list-item>

                <md-list-item @click="load" title="Load (Ctrl+O)">
                    <font-awesome-icon icon="file-upload" size="lg"/>
                    <span class="md-list-item-text">Load</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="playChord" title="Play simultaneously (P)">
                    <font-awesome-icon icon="play" size="lg"/>
                    <span class="md-list-item-text">Play simultaneously</span>
                </md-list-item>

                <md-list-item @click="playChordArpeggiate" title="Play sequentially (S)">
                    <font-awesome-icon icon="music" size="lg"/>
                    <span class="md-list-item-text">
                        <label for="playDelay">Play sequentially ({{ playDelay }}s)</label>
                        <input type="range" min="0.05" max="0.5" step="0.01" v-model="playDelay" style="width: 100%;"
                               id="playDelay"/></span>
                </md-list-item>
                <md-list-item @click="isFreeMode = !isFreeMode" title="Free play mode">
                    <span class="stack" :class="{'danger': isFreeMode}">
                        <font-awesome-icon :icon="['far', 'play-circle']" size="lg" class="far-circle"/>
                        <font-awesome-icon v-if="!isFreeMode" icon="slash" size="lg"/>
                    </span>
                    <span class="md-list-item-text">Free play mode</span>
                </md-list-item>
                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="showNumbers = !showNumbers" title="Show fret/string numbers (F)">
                    <span class="stack">
                        <font-awesome-icon icon="list-ol" size="lg"/>
                        <font-awesome-icon v-if="!showNumbers" icon="slash" size="lg"/>
                    </span>
                    <span class="md-list-item-text">Show fret/string numbers</span>
                </md-list-item>

                <md-list-item @click="showNotes = !showNotes" title="Show note name (N)">
                    <span class="stack">
                        <span class="text-icon">C4</span>
                        <font-awesome-icon v-if="!showNotes" icon="slash" size="lg"/>
                    </span>
                    <span class="md-list-item-text">Show note names</span>
                </md-list-item>

                <md-list-item @click="showBorder = !showBorder" title="Show frame border">
                    <span class="stack">
                        <font-awesome-icon :icon="['far', 'square']" size="lg" class="far-square"/>
                        <font-awesome-icon v-if="!showBorder" icon="slash" size="lg"/>
                    </span>
                    <span class="md-list-item-text">Show frame border</span>
                </md-list-item>

                <md-list-item @click="playNotes = !playNotes" title="Play notes on click (M)">
                    <font-awesome-icon :icon="playNotes ? 'volume-up' : 'volume-mute'" size="lg"/>
                    <span class="md-list-item-text">Play notes on click</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="displayLibrary" title="Scale Library">
                    <font-awesome-icon icon="book" size="lg"/>
                    <span class="md-list-item-text">Scale library</span>
                </md-list-item>
                <md-list-item @click="displayInformations" title="Information">
                    <font-awesome-icon icon="info-circle" size="lg"/>
                    <span class="md-list-item-text">Information</span>
                </md-list-item>
            </md-list>
        </md-drawer>
    </div>
</template>


<script>
    import * as Exportation from '../js/exportation.js'
    import * as Shortcut from '../js/shortcuts.js'
    import {mapState} from 'vuex'


    export default {
        name: "Toolsbar",
        data: function () {
            return {
                menuVisible: false,
                isSmaller: false,
                playDelay: 0.3,
                showHarpejjiMenu: false
            }
        },
        methods: {
            toggleMenu() {
                this.menuVisible = !this.menuVisible;
            },
            /**
             * When the user click Reframe => Resizer mode
             */
            editZone() {
                this.$root.$emit('editZone');
                this.menuVisible = false;
            },
            save() {
                this.$root.$emit('save');
            },
            /**
             * Try to read the file when he try to load a tablature
             * @param e Event
             */
            readFile(e) {
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    try {
                        let data = JSON.parse(fileReader.result);
                        this.$root.$emit('loadData', data);
                        e.target.value = "";
                    } catch (e) {
                        alert("Error parsing the file");
                    }
                };

                fileReader.readAsText(e.target.files[0]);
            },
            load() {
                document.getElementById('loadFile').click();
            },
            downloadSVG() {
                Exportation.downloadSVG(this.$store.state.title || "untitled", this);
            },
            downloadPNG() {
                Exportation.downloadPNG(this.$store.state.title || "untitled", this);
            },
            changeIsTooSmall(isTooSmall) {
                this.isSmaller = isTooSmall
            },
            playChord() {
                this.$root.$emit('setupChord', 0);
            },
            playChordArpeggiate() {
                this.$root.$emit('setupChord', this.playDelay);
            },
            newTablature(e) {
                if (this.$store.state.hasBeenModified) {
                    if (!confirm("Some change has not been saved, are you sure you want to start a new document ?"))
                        return;
                }
                this.$root.$emit('deleteKeys');
                this.showHarpejjiMenu = true;
                this.$store.commit('hasBeenSaved');
            },

            changeHarpejji(h) {
                let firstKeyName = window.tablature.getFirstVisibleKey();
                let cloned = window.selector.cloneSelected(window.tablature.getAllKeys());

                this.$store.commit('changeHarpejji', h);
                setTimeout(() => {
                    window.resizer.reframeToNote(...firstKeyName, cloned);
                }, 100)

            },
            displayInformations() {
                this.$root.$emit('displayInformations');
            },
            displayLibrary() {
                this.$root.$emit('displayLibrary');
            }
        },
        computed: {
            showNumbers: {
                get() {
                    return this.$store.state.showNumbers;
                },
                set(value) {
                    return this.$store.commit('updateShowNumbers', value);
                }
            },
            showNotes: {
                get() {
                    return this.$store.state.showNotes;
                },
                set(value) {
                    return this.$store.commit('updateShowNotes', value);
                }
            },
            showBorder: {
                get() {
                    return this.$store.state.showBorder;
                },
                set(value) {
                    return this.$store.commit('updateShowBorder', value);
                }
            },
            playNotes: {
                get() {
                    return this.$store.state.playNotes;
                },
                set(value) {
                    return this.$store.commit('updatePlayNotes', value);
                }
            },
            isFreeMode: {
                get() {
                    return this.$store.state.isFreeMode;
                },
                set(value) {
                    return this.$store.commit('changeFreeMode', value);
                }
            },
            ...mapState(['currentHarpejji'])
        },
        mounted() {
            this.$root.$on('isTooSmall', this.changeIsTooSmall);
            this.$root.$on('changeHarpejji', this.changeHarpejji);
            document.getElementById('loadFile').addEventListener('change', this.readFile);
            Shortcut.on("R", this.editZone);
            Shortcut.on("P", this.playChord);
            Shortcut.on("S", this.playChordArpeggiate);
            Shortcut.on("M", () => this.playNotes = !this.playNotes);
            Shortcut.on("N", () => this.showNotes = !this.showNotes);
            Shortcut.on("F", () => this.showNumbers = !this.showNumbers);
            Shortcut.on("S", this.save, true);
            Shortcut.on("O", this.load, true);
            Shortcut.on("N", this.newTablature, true);

        }
    }
</script>


<style scoped>
    .md-drawer {
        width: 240px;
        max-width: calc(100vw - 125px);
    }

    .md-list-item-content > *:first-child:not(.md-divider):not(.md-menu) {
        margin-right: 20px;
        width: 24px;

    }


    .md-menu > *:first-child:not(.md-divider):not(.md-menu) {
        margin-right: 20px;
        width: 24px;
    }

    .stack {
        position: relative;
        display: block;
        width: 24px;
        height: 24px;
        margin-right: 0;
    }

    .text-icon {
        font-size: 17px;
    }

    .stack > * {
        position: absolute;
    }

    .md-drawer {
        transform: initial !important;
    }

    .md-drawer.md-persistent-mini.md-active {
        position: absolute !important;
    }

    .smaller:not(.md-active) {
        bottom: initial !important;
    }

    .smaller:not(.md-active) ul li:not(.first-child) {
        display: none;
    }

    .smaller:not(.md-active) ul div:not(.first-child) {
        display: none;
    }

    .smaller:not(.md-active) ul, .smaller:not(.md-active) {
        background-color: unset !important;
        border: none !important;
    }

    .md-divider {
        width: 100%;
    }

    .md-menu {
        display: flex;
        align-items: center;
        min-height: 48px;
        justify-content: space-between;
        width: 100%;
        overflow: hidden;
        height: 48px;
    }

    .far-square {
        margin-left: 3px;
    }

    .far-circle {
        margin-left: 2px;
    }

    .text-icon-small {
        font-size: 12px;
    }

    .danger {
        color: #D32F2F;
    }

    .smaller:not(.md-active) .menu-button {
        background-color: rgba(0,0,0,.1);;
        padding: 3px 5px;
        border: 1px solid rgba(0,0,0,.2);
        border-radius: .25rem;
    }

</style>

<style>
    .md-list-item-container:not(.md-list-item-default):not([disabled]) > .md-list-item-content {
        height: 40px;
        min-height: 40px;
    }

    .md-list-item-container:not([disabled]) > .md-list-item-content {
        /*height: 30px;*/
        min-height: 30px;
    }

    .logo-marcodi {
        display: none;
    }

    .md-active .logo-marcodi {
        width: 187px;
        display: block;
        transition: none !important;
    }

    .md-drawer:not(.md-active) .first-logo {
        display: none;
    }
</style>