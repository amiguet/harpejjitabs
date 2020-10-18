<template>
    <header>
        <div>Harpejji Tabs</div>
        <div class="tools">
            <ul>
                <li>
                    <span role="button" title="Edit" @click="editZone()">Reframe</span>
                </li>
                <li>
                    <!--<span role="button" class="icon download" title="Download SVG" @click="downloadSVG"></span>-->
                    <span role="button" title="Download SVG" @click="downloadSVG">Download SVG</span>
                </li>
                <li>
                    <!--<span role="button" class="icon download" title="Download PNG" @click="downloadPNG"></span>-->
                    <span role="button" title="Download PNG" @click="downloadPNG">Download PNG</span>
                </li>
                <li>
                    <span role="button" title="Save" @click="save()">Save</span>
                </li>
                <li>
                    <span role="button" title="Load" @click="load()">Load</span>
                </li>
            </ul>
        </div>
    </header>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Toolsbar",
        methods: {
            editZone() {
                this.$root.$emit('editZone');
            },
            save() {
                this.$root.$emit('save');
            },
            load() {
                document.getElementById('loadFile').click();
            },
            readFile(e) {
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    let data = JSON.parse(fileReader.result);
                    this.$root.$emit('loadData', data);
                    e.target.value = "";
                };

                fileReader.readAsText(e.target.files[0]);

            },
            downloadSVG() {
                setTimeout(() => { // To avoid having text field in the SVG (because of the transition animation)
                    let title = this.$store.state.title;

                    this.prepareCanvas(() => {
                        saveSvg(document.getElementById('tablature'), 'tablature_' + title + '.svg');
                    });
                }, 200);
            },
            downloadPNG() {
                setTimeout(() => {  // To avoid having text field in the SVG (because of the transition animation)
                    let title = this.$store.state.title;

                    this.prepareCanvas((t, size) => {
                        svgToPng(t, size, (imgData) => {
                            downloadFromLink(imgData, 'tablature_' + title + '.png');
                        });
                    });
                }, 200);
            },


            prepareCanvas(callback) {
                this.$root.$emit('stopEditing');
                let w = document.getElementById('workzone');
                let t = document.getElementById('tablature');
                let tr = "scale(1) translate(" + -this.x1 * this.string_spacing + "px, " + -this.y1 * this.frets_spacing + "px)";
                w.style.transform = tr;

                let size = {
                    width: w.getBoundingClientRect().width,
                    height: w.getBoundingClientRect().height,
                };

                let previousSize = {
                    width: t.getAttribute('width'),
                    height: t.getAttribute('height')
                };

                t.setAttribute("width", size.width);
                t.setAttribute("height", size.height);

                callback(t, size);

                w.style.transform = "";
                t.setAttribute("width", previousSize.width);
                t.setAttribute("height", previousSize.height);
                console.log("yo2");

                // Fix for Safari
                w.setAttribute("transform", w.getAttribute("transform"));
            }
        },
        computed: {
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
            ...mapState(['frets_spacing', 'string_spacing'])
        },
        mounted() {
            document.getElementById('loadFile').addEventListener('change', this.readFile);
        }
    }




    // Create a blob from a svg element
    function svgToUrl(svgEl) {
        svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        let svgData = svgEl.outerHTML;
        let preface = '<?xml version="1.0" standalone="no"?>\r\n';
        let svgBlob = new Blob([preface, svgData], {type: "image/svg+xml"});
        let url = URL.createObjectURL(svgBlob);
        console.log(url);
        return url;
    }

    // Download an svg
    function saveSvg(svgEl, name) {
        let svgUrl = svgToUrl(svgEl);
        downloadFromLink(svgUrl, name);
    }

    // Convert a svg element to a png image
    function svgToPng(svgEl, size, callback) {
        const url = svgToUrl(svgEl);
        svgUrlToPng(url, size, (imgData) => {
            callback(imgData);
            URL.revokeObjectURL(url);
        });
    }

    // Convert from a svg url to a png image
    function svgUrlToPng(svgUrl, size, callback) {
        const svgImage = document.createElement('img');
        // imgPreview.style.position = 'absolute';
        // imgPreview.style.top = '-9999px';
        document.getElementById('hidden').appendChild(svgImage);
        svgImage.onload = function () {
            const canvas = document.createElement('canvas');
            //canvas.width = svgImage.clientWidth;
            //canvas.height = svgImage.clientHeight;
            let pixelRatio = window.devicePixelRatio || 1;
            canvas.width = size.width * pixelRatio;
            canvas.height = size.height * pixelRatio;
            canvas.style.width = size.width + "px";
            canvas.style.height = size.height + "px";
            console.log(size);
            const canvasCtx = canvas.getContext('2d');
            canvasCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            canvasCtx.imageSmoothingEnabled = false;
            document.getElementById('hidden').appendChild(canvas);
            canvasCtx.drawImage(svgImage, 0, 0, size.width * 1, size.height * 1);
            const imgData = canvas.toDataURL('image/png');
            callback(imgData);

            document.getElementById('hidden').removeChild(canvas);
            document.getElementById('hidden').removeChild(svgImage);
        };
        svgImage.src = svgUrl;
    }

    // return another svg element with default scale and translate
    function resetSize(svgEl, nodeIdToReset) {
        let s = svgEl.cloneNode(true);
        let w = s.getElementById(nodeIdToReset);
        w.setAttribute("transform", "");
        return s;
    }

    function downloadFromLink(url, name) {
        let downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.innerHTML = "Download";
        document.getElementById('hidden').appendChild(downloadLink);
        downloadLink.download = name;
        downloadLink.click();
        document.getElementById('hidden').removeChild(downloadLink);
    }

</script>

<style scoped>
    header {
        /*height: 60px;*/
        border-bottom: 1px solid #d9d9d9;
        background-color: #FAFAFA;
        position: relative;
    }

    li {
        display: inline;
        list-style-type: none;
        padding: 16px 10px 0;
    }

    ul {
        padding: 0;
        margin: 16px 0 5px;
    }

    ul li span {
        cursor: pointer;
        padding: 5px 10px;
        border-radius: 10px;
    }

    ul li span:active {
        background-color: #EEEEEE;
    }

    .icon {
        height: 16px;
        width: 16px;
        display: inline-block;
        background-size: contain;
        cursor: pointer;
    }

    .download {
        background-image: url("../assets/icons/download.png");
    }


</style>