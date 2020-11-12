export function downloadSVG(title) {

    /*prepareCanvas(() => {
        saveSvg(document.getElementById('tablature'), 'tablature_' + title + '.svg');
    });*/
    let svg = prepareCanvas();
    saveSvg(svg, 'tablature_' + title + '.svg');
}

export function downloadPNG(title) {


    let svg = prepareCanvas();
    svgToPng(svg, (imgData) => {
        downloadFromLink(imgData, 'tablature_' + title + '.png');
    });
    /*prepareCanvas((t, size) => {
        svgToPng(t, size, (imgData) => {
            downloadFromLink(imgData, 'tablature_' + title + '.png');
        });
    });*/
}

// Create a blob from a svg element
function svgToUrl(svgEl) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let svgData = svgEl.outerHTML;
    let preface = '<?xml version="1.0" standalone="no"?>\r\n';
    let svgBlob = new Blob([preface, svgData], {type: "image/svg+xml"});
    let url = URL.createObjectURL(svgBlob);
    return url;
}

// Download an svg
function saveSvg(svgEl, name) {
    let svgUrl = svgToUrl(svgEl);
    downloadFromLink(svgUrl, name);
}

// Convert a svg element to a png image
function svgToPng(svgEl, callback) {
    let size = {
        width: svgEl.getAttribute('width'),
        height: svgEl.getAttribute('height')
    };
    console.log(size);
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

/*// return another svg element with default scale and translate
function resetSize(svgEl, nodeIdToReset) {
    let s = svgEl.cloneNode(true);
    let w = s.getElementById(nodeIdToReset);
    w.setAttribute("transform", "");
    return s;
}*/

function downloadFromLink(url, name) {
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.innerHTML = "Download";
    document.getElementById('hidden').appendChild(downloadLink);
    downloadLink.download = name;
    downloadLink.click();
    document.getElementById('hidden').removeChild(downloadLink);
}

function prepareCanvas() {
    let svgHTML = document.getElementById('tablature').outerHTML;
    let frm = document.createElement('iframe');
    document.getElementById('hidden').appendChild(frm);
    let doc2 = frm.contentWindow.document;
    doc2.body.innerHTML = svgHTML;
    let tablature = doc2.getElementById('tablature');

    // Remove all foreignObjects (text field specially)
    let foreignObjects = doc2.getElementsByTagName("foreignObject");
    for (let f of foreignObjects) {
        f.remove();
    }

    // Remove the title and resize the tablature if not needed
    let titleContainer = doc2.getElementById('titleContainer');
    let titles = titleContainer.getElementsByTagName('text');
    if (titles !== undefined) {
        let title = titles[0];
        if (title.getAttribute('empty') === 'true') {
            let titleHeight = titleContainer.getBoundingClientRect().height;
            window.titleContainer = titleContainer;
            titleContainer.remove();
            let previousHeight = tablature.getAttribute('height');
            tablature.setAttribute('height', previousHeight - titleHeight);
        }
    }

    let wTransform = doc2.getElementById('workzone').style.transform.match(/-?\d+\.?\d*/g);
    let translateX = +wTransform[0]; //+ to convert it into a number
    let translateY = +wTransform[1];
    let scale = +wTransform[2];


    doc2.getElementById('workzone').style.transform = "translate(" + Math.round(translateX / scale) + "px, " + Math.round(translateY / scale) + "px)";
    let workzoneC = doc2.getElementById('workzoneContainer');
    let wWidth = workzoneC.getBoundingClientRect().width;
    let wHeight = workzoneC.getBoundingClientRect().height;
    tablature.setAttribute('width', wWidth);
    tablature.setAttribute('height', wHeight);


    let remainUselessTag = true;
    while (remainUselessTag) {
        remainUselessTag = false;
        for (let g of doc2.getElementsByTagName('*')) {
            if (g.getBoundingClientRect().width === 0 && g.getBoundingClientRect().height === 0) {
                g.remove();
                remainUselessTag = true;
            }
        }
    }

    tablature.outerHTML = tablature.outerHTML
        .replace(/<!--.*?-->/g, "") // Remove all comments from the svg
        .replace(/ data-v-[a-z0-9]*=""/gm, ""); //Remove all vue data
    //console.log(tablature.innerHTML);

    document.getElementById('hidden').removeChild(frm);
    return tablature;
}

/*function prepareCanvas(callback, that) {
    that.$root.$emit('prepareForExportation'); //TODO
    setTimeout(() => {
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
    }, 1);

    // Fix for Safari
    //w.setAttribute("transform", w.getAttribute("transform"));
}*/