let cumulativeOffset = function(element: HTMLElement) {
    // console.log(element.offsetLeft);
    var top = 0, left = 0;
    do {
        top += element?.offsetTop  || 0;
        left += element?.offsetLeft || 0;
        element = element?.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};

export { cumulativeOffset };