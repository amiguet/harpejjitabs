<template>
    <header>
        <div>Harpejji Tabs</div>
        <div class="tools">
            <ul>
                <li>
                    <span role="button" class="icon download" title="Download SVG" @click="downloadSVG"></span>
                </li>
                <li>
                    <span role="button" class="icon download" title="Download PNG" @click="downloadPNG"></span>
                </li>
                <li>
                    <span role="button" title="Edit" @click="editZone()">Recadrer</span>
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
                let title = this.$store.state.title;

                let w = document.getElementById('workzone');
                let t = document.getElementById('tablature');
                w.style.transform = "scale(1)";

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
                saveSvg(document.getElementById('tablature'), 'tablature_' + title + '.svg');

                w.style.transform = "";
                t.setAttribute("width", previousSize.width);
                t.setAttribute("height", previousSize.height);
            },
            downloadPNG() {
                let w = document.getElementById('workzone');
                let t = document.getElementById('tablature');
                w.style.transform = "scale(1)";

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


                svgToPng(t, size, (imgData) => {
                    const pngImage = document.createElement('img');
                    document.body.appendChild(pngImage);
                    pngImage.style.width = size.width + "px";
                    pngImage.style.height = size.height + "px";
                    pngImage.src = imgData;


                });

                w.style.transform = "";
                t.setAttribute("width", previousSize.width);
                t.setAttribute("height", previousSize.height);
            }
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
        let svgBlob = new Blob([preface, svgData], {type: "image/svg+xml;charset=utf-8"});
        let url = URL.createObjectURL(svgBlob);
        console.log(url);
        return url;
    }

    // Download an svg
    function saveSvg(svgEl, name) {
        let svgUrl = svgToUrl(svgEl);
        let downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.innerHTML = "Download";
        document.body.appendChild(downloadLink);
        /*downloadLink.download = name;
        downloadLink.click();
        document.body.removeChild(downloadLink);*/
    }

    // Convert a svg element to a png image
    function svgToPng(svgEl, size, callback) {
        const url = svgToUrl(svgEl);
        svgUrlToPng(url, size, (imgData) => {
            callback(imgData);
            //URL.revokeObjectURL(url);
        });
    }

    // Convert from a svg url to a png image
    function svgUrlToPng(svgUrl, size, callback) {
        const svgImage = document.createElement('img');
        // imgPreview.style.position = 'absolute';
        // imgPreview.style.top = '-9999px';
        document.body.appendChild(svgImage);
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
            document.body.appendChild(canvas);
            canvasCtx.drawImage(svgImage, 0, 0, size.width * 1, size.height * 1);
            const imgData = canvas.toDataURL('image/png');
            callback(imgData);

            // document.body.removeChild(imgPreview);
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

</script>

<style scoped>
    header {
        height: 60px;
        border-bottom: 1px solid #d9d9d9;
        background-color: #FAFAFA;
        position: relative;
    }

    li {
        display: inline;
        list-style-type: none;
        margin: 0 10px;
    }

    ul {
        padding: 0;
    }

    ul li span {
        cursor: pointer;
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