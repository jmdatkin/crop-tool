const cropImage = function(dataURL, selection) {
    // fetch('/api/crop', {
    fetch('https://croppy.vercel.app/api/crop', {
        method: 'POST',
        body: JSON.stringify({
            dataURL,
            x: selection.x,
            y: selection.y,
            w: selection.w,
            h: selection.h
        })
    }).then(res => console.log(res));
};

export { cropImage };