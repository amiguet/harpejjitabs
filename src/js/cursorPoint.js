
let pt = null;
console.log("imported");

export function getCursorPos(e) {
    if (pt === null) {
        pt = document.getElementById('tablature').createSVGPoint();
    }
    let workzone = document.getElementById('workzone');
    if (e.touches !== undefined) {
        pt.x = e.touches[0].clientX;
        pt.y = e.touches[0].clientY;
    } else {
        pt.x = e.clientX;
        pt.y = e.clientY;
    }
    return pt.matrixTransform(workzone.getScreenCTM().inverse());
}