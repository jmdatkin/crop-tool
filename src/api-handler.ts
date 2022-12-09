import { useImageStore } from "./stores/images";

const cropImage = function (dataURL, selection): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        fetch('/api/crop', {
            // fetch('https://croppy.vercel.app/api/crop', {
            method: 'POST',
            body: JSON.stringify({
                dataURL,
                x: selection.x,
                y: selection.y,
                w: selection.w,
                h: selection.h
            })
        }).then(res => res.text()).then(img => {
            let im = new Image();
            im.src = img;
            im.decode().then(resolve(im));
            // im.decode().then(() => {
            // })
            // imageStore.images.push(im);

        });
    });
};

export { cropImage };