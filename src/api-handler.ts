import { useImageStore } from "./stores/images";

type CropImageRequestOptions = {
    left: number,
    top: number,
    width: number,
    height: number,
    outputWidth: number,
    outputHeight: number
};

const cropImage = function (dataURL, options): Promise<string> {
    // let url = 
    return new Promise((resolve, reject) => {
        // fetch("https://us-central1-croppytool.cloudfunctions.net/crop", {
        fetch("http://127.0.0.1:5001/croppytool/us-central1/crop", {
            method: "POST",
            body: JSON.stringify({
                dataURL,
                left: options.left,
                top: options.top,
                width: options.width,
                height: options.height,
                outputWidth: options.outputWidth,
                outputHeight: options.outputHeight
            })
        }).then(res => res.text()).then(img => {
            resolve(img);
        });
    });
};

export { cropImage };