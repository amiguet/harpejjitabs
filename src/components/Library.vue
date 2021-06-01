<template>
    <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>Library</md-dialog-title>
        <md-dialog-content>
            <div class="library-container">
                <div v-for="i in librarySize" :key="'scale'+i" class="library-item" @click="select(i)">
                    <img :src="'library/'+i+'.svg'" :alt="'Tablature ' + i">
                </div>
            </div>
        </md-dialog-content>
        <md-dialog-actions>
            <div class="btn-close" @click="showDialog = false">Close</div>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
    import axios from "axios";
    import * as Versionning from '../js/versionning.js'

    export default {
        name: "Library",
        data() {
            return {
                showDialog: false,
                librarySize: 42
            }
        },
        methods: {
            select(i) {
                axios
                    .get('library/' + i + '.htab')
                    .then(response => {
                        Versionning.loadData(response.data, window.tablature);
                    });
                this.showDialog = false;
            }
        },
        mounted() {
            // Listener when the user click to show the menu
            this.$root.$on('displayLibrary', () => {
                this.showDialog = true;
            })
        }
    }
</script>

<style scoped>
    .library-container {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
    }

    .library-item {
        margin: 15px 5px;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        cursor: pointer;
        transition: transform 0.1s;
    }

    .library-item:hover {
        transform: scale(1.05);
    }

    .btn-close {
        padding: 12px;
        color: #448aff;
        font-weight: 500;
        cursor: pointer;
    }


</style>
<style>
    .md-dialog-container {
        max-height: 95% !important;
    }
    @media (max-width: 600px) {
        .md-dialog-fullscreen {
            max-height: 100% !important;
        }
    }
</style>