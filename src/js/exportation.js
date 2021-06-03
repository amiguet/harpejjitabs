/**
 * Function that download the SVG of the tablature
 * @param title
 */
export function downloadSVG(title) {
    let svg = prepareCanvas();
    saveSvg(svg, 'tablature_' + title + '.svg');
}

/**
 * Function that download the PNG of the tablature
 * @param title
 */
export function downloadPNG(title) {
    let svg = prepareCanvas();
    svgToPng(svg, (imgData) => {
        downloadFromLink(imgData, 'tablature_' + title + '.png');
    });
}

/**
 * Create a blob from a svg element
 * @param svgEl SVG element (cleaned)
 */
function svgToUrl(svgEl) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let svgData = svgEl.outerHTML;
    let preface = '<?xml version="1.0" standalone="no"?>\r\n';
    let svgBlob = new Blob([preface, svgData], {type: "image/svg+xml"});
    return URL.createObjectURL(svgBlob);
}

/**
 * Download an svg
 * @param svgEl SVG element (cleaned)
 * @param name of the file
 */
function saveSvg(svgEl, name) {
    let svgUrl = svgToUrl(svgEl);
    downloadFromLink(svgUrl, name);
}

/**
 * Convert a svg element to a png image
 * @param svgEl SVG element (cleaned)
 * @param callback
 */
function svgToPng(svgEl, callback) {
    let size = {
        width: svgEl.getAttribute('width'),
        height: svgEl.getAttribute('height')
    };
    const url = svgToUrl(svgEl);
    svgUrlToPng(url, size, (imgData) => {
        callback(imgData);
        URL.revokeObjectURL(url);
    });
}

/**
 * Convert from a svg url to a png image
 * @param svgUrl url du SVG
 * @param size of the SVG
 * @param callback
 */
function svgUrlToPng(svgUrl, size, callback) {
    const svgImage = document.createElement('img');
    document.getElementById('hidden').appendChild(svgImage);
    svgImage.onload = function () {
        const canvas = document.createElement('canvas');
        let pixelRatio = (window.devicePixelRatio || 1) * 2;
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

/**
 * Download to the user a file from an url
 * @param url of the file
 * @param name of the file
 */
function downloadFromLink(url, name) {
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.innerHTML = "Download";
    document.getElementById('hidden').appendChild(downloadLink);
    downloadLink.download = name;
    downloadLink.click();
    document.getElementById('hidden').removeChild(downloadLink);
}

/**
 * return a clean SVG ready for exportation
 * @returns {SVGElement}
 */
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

    // delete all the useless tags
    let remainUselessTag = true;
    while (remainUselessTag) {
        remainUselessTag = false;
        for (let g of doc2.getElementsByTagName('*')) {
            if (g.getBoundingClientRect().width === 0 && g.getBoundingClientRect().height === 0) {
                g.remove();
                remainUselessTag = true;
            }
            if (g.style.display === "none") {
                g.remove();
                remainUselessTag = true;
            }
        }
    }
    //Kinda weird but it only work like this
    let newOuterHTMLTemp = (tablature.outerHTML + "")
        .replaceAll(/<!--.*?-->/g, "") // Remove all comments from the svg
        .replaceAll(/ data-v-[a-z0-9]*=""/gm, ""); //Remove all vue data
    doc2.body.innerHTML = newOuterHTMLTemp;

    return doc2.body.children[0];
}