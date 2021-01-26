
let pt = null;

/**
 * Return the position of the mouse relative to the SVG transformation
 * Create a SVGPoint, and place it where the mouse position is
 * Call matrixTransform with the inverse transformation of the workzone
 * to get the real position
 * @param e
 * @returns {DOMPoint}
 */
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