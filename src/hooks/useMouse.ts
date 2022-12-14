import { reactive } from "vue";

/**
 * Checks if a point is contained in a rectangle
 * 
 * @param p x-coordinate of point being checked
 * @param q y-coordinate of point being checked
 * @param x x-coordinate (left) of quad
 * @param y y-coordinate (top) of quad
 * @param w quad width
 * @param h quad height
 */
const posInQuad = function (p: number, q: number, x: number, y: number, w: number, h: number) {
    return (p > x && p <= x + w &&
        q > y && q <= y + h);
};


const auxMouse = reactive({
    initialMousedownX: 0,
    initialMousedownY: 0,
    initialSelectionX: 0,
    initialSelectionY: 0,
    mousemoveX: 0,
    mousemoveY: 0
});

const mousedownHandler = function (e: MouseEvent) {
    auxMouse.initialMousedownX = transformMouseX(e.pageX);
    auxMouse.initialMousedownY = transformMouseY(e.pageY);

    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    // Track selection position at start of mousedown event
    auxMouse.initialSelectionX = x;
    auxMouse.initialSelectionY = y;

    // Check mouse cursor inside previously drawn selection
    if (posInQuad(auxMouse.initialMousedownX, auxMouse.initialMousedownY, x, y, w, h))
        mouseInsideSelection.value = true;

    if (mouseInsideSelection.value) {
        draggingSelection.value = true;
    } else {
        drawingSelection.value = true;

        selectionStore.x = auxMouse.initialMousedownX;
        selectionStore.y = auxMouse.initialMousedownY;
        selectionStore.w = 0;
        selectionStore.h = 0;
    }

    mouseDoingDragGesture.value = false;
    mouseDown.value = true;
};

const snapRange = 15;
const mousemoveHandler = function (e: MouseEvent) {
    let x = selectionStore.x;
    let y = selectionStore.y;
    let w = selectionStore.w;
    let h = selectionStore.h;

    if (canvasGroup.value !== null) {
        if (drawingSelection.value)
            canvasGroup.value.wrapper.style.cursor = 'none';
        else if (draggingSelection.value)
            canvasGroup.value.wrapper.style.cursor = 'none';
        else if (posInQuad(auxMouse.mousemoveX, auxMouse.mousemoveY, x, y, w, h))
            canvasGroup.value.wrapper.style.cursor = 'grab';
        else
            canvasGroup.value.wrapper.style.cursor = 'crosshair';
    }

    auxMouse.mousemoveX = transformMouseX(e.pageX);
    auxMouse.mousemoveY = transformMouseY(e.pageY);

    let dx = auxMouse.mousemoveX - auxMouse.initialMousedownX;
    let dy = auxMouse.mousemoveY - auxMouse.initialMousedownY;

    // If mouse moved past threshold, consider motion as click-and-drag
    if (dx * dx + dy * dy > 81 && mouseDown.value)
        mouseDoingDragGesture.value = true;

    if (mouseDoingDragGesture.value) {

        // Moving existing rectangle
        if (mouseInsideSelection.value) {
            let newX = auxMouse.initialSelectionX + dx;
            let newY = auxMouse.initialSelectionY + dy;

            //Snap to edge
            if (newX < snapRange)
                newX = 0;
            if (newY < snapRange)
                newY = 0;
            if (canvasGroupBb.value.width - (newX + w) < snapRange)
                newX = canvasGroupBb.value.width - w;
            if (canvasGroupBb.value.height - (newY + h) < snapRange)
                newY = canvasGroupBb.value.height - h;

            selectionStore.x = newX;
            selectionStore.y = newY;

        // Drawing new rectangle
        } else {

            // Adjust if selection drawn backwards
            if (dx < 0) {
                dx = -dx;
                x = auxMouse.initialMousedownX - dx
            }
            if (dy < 0) {
                dy = -dy;
                y = auxMouse.initialMousedownY - dy
            };

            selectionStore.x = x;
            selectionStore.y = y;
            selectionStore.w = dx;
            selectionStore.h = dy;
        }
    }
};

const mouseupHandler = function (e: MouseEvent) {
    if (!mouseDoingDragGesture.value) {
        selectionStore.x = 0;
        selectionStore.y = 0;
        selectionStore.w = 0;
        selectionStore.h = 0;
    }

    mouseDoingDragGesture.value = false;
    mouseDown.value = false;
    mouseInsideSelection.value = false;
    drawingSelection.value = false;
    draggingSelection.value = false;
};
const useMouse = function(options) {

};

export default useMouse;