export function downloadSVG(title, that) {

    prepareCanvas(() => {
        saveSvg(document.getElementById('tablature'), 'tablature_' + title + '.svg');
    }, that);
}

export function downloadPNG(title, that) {


    prepareCanvas((t, size) => {
        svgToPng(t, size, (imgData) => {
            downloadFromLink(imgData, 'tablature_' + title + '.png');
        });
    }, that);
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

function prepareCanvas(callback, that) {
        that.$root.$emit('stopEditing');
        let w = document.getElementById('workzone');
        let t = document.getElementById('tablature');
        let tr = "scale(1) translate(" + -that.x1 * that.string_spacing + "px, " + -that.y1 * that.frets_spacing + "px)";
        let oldStyle = w.style.transform;
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

        w.style.transform = oldStyle;
        t.setAttribute("width", previousSize.width);
        t.setAttribute("height", previousSize.height);
        console.log("yo2");

        // Fix for Safari
        //w.setAttribute("transform", w.getAttribute("transform"));
    }